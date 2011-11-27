//
// JavaScript unit
// Add-on for WMI (Windows Management Instrumentation)
//
// Copyright (c) 2010, 2011 by Ildar Shaimordanov
//

/*

¬ведение в Windows Management Instrumentation (WMI)
Introduction to WMI (Russian text)
http://www.script-coding.com/WMI.html

Windows Management Instrumentation
http://msdn.microsoft.com/en-us/library/windows/desktop/aa394582%28v=VS.85%29.aspx

Scripting API Objects
http://msdn.microsoft.com/en-us/library/windows/desktop/aa393259%28v=VS.85%29.aspx

SWbemSink object
http://msdn.microsoft.com/en-us/library/windows/desktop/aa393877%28v=vs.85%29.aspx

SWbemObjectSet object
http://msdn.microsoft.com/en-us/library/windows/desktop/aa393762%28v=vs.85%29.aspx

SWbemServices/SWbemServicesEx object
http://msdn.microsoft.com/en-us/library/windows/desktop/aa393854%28v=vs.85%29.aspx
http://msdn.microsoft.com/en-us/library/windows/desktop/aa393855(v=VS.85).aspx

SWbemObject/SWbemObjectEx object
http://msdn.microsoft.com/en-us/library/windows/desktop/aa393741%28v=vs.85%29.aspx
http://msdn.microsoft.com/en-us/library/windows/desktop/aa393742%28v=VS.85%29.aspx

*/
var Wmi = function(options)
{
	return Wmi.create(options);
}

Wmi.setSecurity = function(wbemObject, options)
{
	var sec = wbemObject.Security_;
	if ( options.impersonationLevel ) {
		sec.ImpersonationLevel = options.impersonationLevel;
	}
	if ( options.authenticationLevel ) {
		sec.AuthenticationLevel = options.authenticationLevel;
	}
	if ( options.privileges ) {
		for (var i = 0; i < options.privileges.length; i++) {
			var v = options.privileges[i];
			var p = 'Se' + v.replace(/^\s*!/, '') + 'Privilege';
			var f = ! v.match(/^\s*!/);
			sec.Privileges.AddAsString(p, f);
		}
	}
	return wbemObject;
};

Wmi.getLocator = function(options)
{
	var wbemLocator = new ActiveXObject('WbemScripting.SWbemLocator');
	Wmi.setSecurity(wbemLocator, options);
	return wbemLocator;
};

Wmi.connectServer = function(wbemLocator, options)
{
	options = options || {};

	return wbemLocator.ConnectServer(
		options.computer, 
		options.namespace, 
		options.user, 
		options.password, 
		options.locale, 
		options.authority, 
		options.securityFlag, 
		options.wbemNamedValueSet || null);
};

Wmi.getMoniker = function(options)
{
	options = options || {};

	var security = [];
	if ( options.impersonationLevel ) {
		security.push('impersonationLevel=' + options.impersonationLevel);
	}
	if ( options.authenticationLevel ) {
		security.push('authenticationLevel=' + options.authenticationLevel);
	}
	if ( options.authority && options.computer ) {
		security.push('authority=' + options.authority);
	}
	if ( options.privileges ) {
		security.push('(' + [].concat(options.privileges).join(', ') + ')');
	}

	var moniker = ['WinMgmts:'];
	if ( security.length ) {
		moniker.push('{' + security.join(',') + '}');
	}
	if ( options.locale ) {
		moniker.push('[locale=' + options.locale + ']');
	}
	if ( ( security.length || options.locale ) && options.computer ) {
		moniker.push('!');
	}
	if ( options.computer ) {
		moniker.push('\\\\' + options.computer);
	}
	if ( options.namespace ) {
		moniker.push('\\' + options.namespace);
	}
	if ( options.className ) {
		if ( ( options.computer || options.namespace ) ) {
			moniker.push(':');
		}
		moniker.push(options.className);
	}

	return moniker.join('');
};

Wmi.defaultSinkPrefix = 'SINK_';

Wmi.getSinkPrefix = function()
{
	return 'SINK' + (new Date()).getTime() + '_';
};

Wmi.defaultSinkEventNames = 'completed objectPut objectReady progress'.split(' ');

Wmi.setSinkEvents = function(sinkPrefix, events)
{
	var global = (function()
	{
		return this;
	})();

	if ( typeof events == 'function' ) {
		events = { 'objectReady': events };
	}

	var names = Wmi.defaultSinkEventNames;
	for (var i = 0; i < names.length; i++) {
		// n - nameOfEvent
		// p - NameOfEvent
		var n = names[i].replace(/^./, function($0) { return $0.toLowerCase(); });
		var p = names[i].replace(/^./, function($0) { return $0.toUpperCase(); });
		if ( typeof events[n] == 'function' ) {
			global[sinkPrefix + 'On' + p] = events[n];
		}
	}
};

Wmi.getSink = function(sinkPrefix, events)
{
	Wmi.setSinkEvents(sinkPrefix, events);
	return WScript.CreateObject('WbemScripting.SWbemSink', sinkPrefix);
};

Wmi.getNamedValueSet = function(namedValueSet)
{
	// nothing has been passed
	if ( ! namedValueSet ) {
		return null;
	}
	// wbemNamedValueSet
	if ( namedValueSet instanceof ActiveXObject ) {
		return options;
	}
	// { name: value[, ...] }
	var wbemNamedValueSet = WScript.CreateObject('WbemScripting.SWbemNamedValueSet');
	for (var p in namedValueSet) {
		if ( ! namedValueSet.hasOwnProperty(p) ) {
			continue;
		}
		wbemNamedValueSet.Add(p, namedValueSet[p]);
	}
	return wbemNamedValueSet;
};

Wmi.prepareQuery = function(className, whereClause, selectors, withinClause)
{
	var query = 'SELECT ' + [].concat(selectors || '*').join(',') + ' FROM ' + className;
	if ( withinClause ) {
		query += ' WITHIN ' + withinClause;
	}
	if ( whereClause ) {
		whereClause = [].concat(whereClause).join(') AND (');
		query += ' WHERE (' + whereClause + ')';
	}
	return query;
};

Wmi.create = function(options)
{
	options = options || {};

	var moniker;
	var wbemObject = null;
	var wbemLocator = null;

	if ( options instanceof ActiveXObject ) {
		wbemObject = options;
	} else if ( options instanceof Wmi ) {
		wbemObject = options.wbemObject;
	} else if ( typeof options == 'string' || options.moniker ) {
		moniker = options || options.moniker;
		wbemObject = GetObject(moniker);
	} else if ( options.user || options.useLocator ) {
		wbemLocator = Wmi.getLocator(options);
		wbemObject = Wmi.connectServer(wbemLocator, options);
	} else {
		moniker = Wmi.getMoniker(options);
		wbemObject = GetObject(moniker);
	}

	var wmi;

	if ( !! wbemObject.Path_ ) {
		wmi = new Wmi.Object(wbemObject, wbemLocator);
	} else if ( typeof wbemObject.Item == 'unknown' ) {
		wmi = new Wmi.ObjectSet(wbemObject, wbemLocator);
	} else if ( typeof wbemObject.InstancesOf == 'unknown' ) {
		wmi = new Wmi.Namespace(wbemObject, wbemLocator);
		if ( options.extendSubclasses ) {
			wmi.extendSubclasses();
		}
	} else {
		wmi = new Wmi.Common(wbemObject, wbemLocator);
	}

	return wmi;
};

Wmi.inherit = function(base, proto)
{
	base = base || function() {};
	proto = proto || {};

	var constructor = proto.hasOwnProperty('constructor') 
		? proto.constructor 
		: function() { base.apply(this, arguments); };

	var F = function() {};
	F.prototype = base.prototype;

	constructor.prototype = (function(dst, src)
	{
		for (var prop in src) {
			if ( ! src.hasOwnProperty(prop) ) {
				continue;
			}
			dst[prop] = src[prop];
		}
		// Processing of the non-enumerable methods
		var props = ['toString', 'valueOf'];
		for (var i = 0; i < props.length; i++) {
			var prop = props[i];
			if ( ! src.hasOwnProperty(prop) ) {
				continue;
			}
			dst[prop] = src[prop];
		}
		return dst;
	})(new F(), proto);

	constructor.superclass = base.prototype;
	constructor.prototype.constructor = constructor;
	return constructor;
};

Wmi.Common = Wmi.inherit(null, {
	constructor: function(wbemObject, wbemLocator)
	{
		this.wbemObject = wbemObject;
		this.wbemLocator = wbemLocator;
	}, 
	notImplemented: function()
	{
		throw new Error('Not implemented method');
	}, 
	callMethod: function(wrapMethod, wrapAsyncMethod, useForEach, options)
	{
		var wbemNamedValueSet = Wmi.getNamedValueSet(options.namedValueSet);

		if ( ! options.async ) {
			var wbemResult = wrapMethod(this.wbemObject, wbemNamedValueSet);

			if ( options.objectReady ) {
				if ( useForEach ) {
					this.forEach(wbemResult, options.objectReady);
				} else {
					options.objectReady(wbemResult);
				}
			}
			return wbemResult && Wmi.create(wbemResult);
		}

		var sinkPrefix = options.sinkPrefix || Wmi.getSinkPrefix();
		var wbemSink = options.wbemSink || Wmi.getSink(sinkPrefix, options);

		var wbemAsyncContext = Wmi.getNamedValueSet(options.asyncContext || {});
		wbemAsyncContext.Add('asyncCompleted', false);

		wrapAsyncMethod(this.wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext);

		if ( options.wait ) {
			while ( ! wbemAsyncContext.Item('asyncCompleted').Value ) {
				options.wait();
			}
		}
	}, 
	forEach: function(collection, func)
	{
		var t = typeof collection;
		if ( t == 'string' ) {
			// Convert name-of-property to NameOfProperty_
			var prop = collection
				.replace(/(?:^|-)([a-z])/g, function($0, $1)
				{
					return $1.toUpperCase();
				})
				.replace(/[^_]$/, function($0)
				{
					return $0 + '_';
				})
				;
			collection = this.wbemObject[prop];
		} else if ( t == 'function' ) {
			collection = collection(this.wbemObject);
		} else {
			collection = collection || this.wbemObject;
		}
		for (var e = new Enumerator(collection) ; ! e.atEnd(); e.moveNext()) {
			var i = e.item();
			func(i, this.wbemObject);
		}
	}, 
	valueOf: function()
	{
		return this.wbemObject;
	}
});

Wmi.Namespace = Wmi.inherit(Wmi.Common, {
	associatorsOf: function(objectPath, options)
	{
		options = options || {};

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet)
			{
				return wbemObject.AssociatorsOf(
					objectPath, 
					options.assocClass || null, 
					options.resultClass || null, 
					options.resultRole || null, 
					options.role || null, 
					!! options.classesOnly, 
					!! options.schemaOnly, 
					options.requiredAssocQualifier || null, 
					options.requiredQualifier || null, 
					options.flags || 16, 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext)
			{
				wbemObject.AssociatorsOfAsync(
					wbemSink, 
					objectPath, 
					options.assocClass || null, 
					options.resultClass || null, 
					options.resultRole || null, 
					options.role || null, 
					!! options.classesOnly, 
					!! options.schemaOnly, 
					options.requiredAssocQualifier || null, 
					options.requiredQualifier || null, 
					options.flags || 0, 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			true, 
			options);
	}, 
	deleteClass: function(objectPath, options)
	{
		options = options || {};

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet)
			{
				wbemObject.Delete(
					objectPath, 
					options.flags || 0, 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext)
			{
				wbemObject.DeleteAsync(
					wbemSink, 
					objectPath, 
					options.flags || 0, 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			false, 
			options);
	}, 
	execMethod: function(objectPath, methodName, options)
	{
		options = options || {};

		var wbemInParams = this.getInParams(objectPath, methodName, options.inParams);

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet)
			{
				return wbemObject.ExecMethod(
					objectPath, 
					methodName, 
					wbemInParams, 
					options.flags || 0, 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext)
			{
				wbemObject.ExecMethodAsync(
					wbemSink, 
					objectPath, 
					methodName, 
					wbemInParams, 
					options.flags || 0, 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			false, 
			options);
	}, 
	execNotificationQuery: function(query, options)
	{
		options = options || {};

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet)
			{
				var wbemEventSource = wbemObject.ExecNotificationQuery(
					query, 
					options.queryLanguage || 'WQL', 
					options.flags || (16 + 32), 
					wbemNamedValueSet);
				return wbemEventSource.NextEvent();
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext)
			{
				wbemObject.ExecNotificationQueryAsync(
					wbemSink, 
					query, 
					options.queryLanguage || 'WQL', 
					options.flags || 0, 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			false, 
			options);
	}, 
	execQuery: function(query, options)
	{
		options = options || {};

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet)
			{
				return wbemObject.ExecQuery(
					query, 
					options.queryLanguage || 'WQL', 
					options.flags || 16, 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext)
			{
				return wbemObject.ExecQueryAsync(
					wbemSink, 
					query, 
					options.queryLanguage || 'WQL', 
					options.flags || 0, 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			true, 
			options);
	}, 
	getClass: function(objectPath, options)
	{
		options = options || {};

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet)
			{
				return wbemObject.Get(
					objectPath, 
					options.flags || 0, 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext)
			{
				wbemObject.GetAsync(
					wbemSink, 
					objectPath, 
					options.flags || 0, 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			false, 
			options);
	}, 
	instancesOf: function(className, options)
	{
		options = options || {};

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet)
			{
				return wbemObject.InstancesOf(
					className, 
					options.flags || 16, 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext)
			{
				wbemObject.InstancesOfAsync(
					wbemSink, 
					className, 
					options.flags || 0, 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			true, 
			options);
	}, 
	putClass: function(wbemInObject, options)
	{
		options = options || {};

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet)
			{
				return wbemObject.Put(
					wbemInObject, 
					options.flags || 16, 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext)
			{
				wbemObject.PutAsync(
					wbemSink, 
					wbemInObject, 
					options.flags || 0, 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			true, 
			options);
	}, 
	referencesTo: function(objectPath, options)
	{
		options = options || {};

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet)
			{
				return wbemObject.ReferencesTo(
					objectPath, 
					options.resultClass || null, 
					options.role || null, 
					!! options.classesOnly, 
					!! options.schemaOnly, 
					options.requiredQualifier || null, 
					options.flags || 16, 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext)
			{
				wbemObject.ReferencesToAsync(
					wbemSink, 
					objectPath, 
					options.resultClass || null, 
					options.role || null, 
					!! options.classesOnly, 
					!! options.schemaOnly, 
					options.requiredQualifier || null, 
					options.flags || 0, 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			true, 
			options);
	}, 
	subclassesOf: function(superClass, options)
	{
		options = options || {};

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet)
			{
				return wbemObject.SubclassesOf(
					superClass || '', 
					options.flags || 16, 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext)
			{
				wbemObject.SubclassesOfAsync(
					wbemSink, 
					superClass || '', 
					options.flags || 0, 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			true, 
			options);
	}, 
	getInParams: function(objectPath, methodName, options)
	{
		var wmi = this.getClass(objectPath);
		return wmi.getInParams(methodName, options);
	}, 
	extendSubclasses: function()
	{
		var that = this;
		this.subclassesOf('', {
			objectReady: function(p)
			{
				var className = p.Path_.Class;
				if ( that[className] ) {
					return;
				}

				that[className] = function(whereClause, selectors, options)
				{
					var query = Wmi.prepareQuery(className, whereClause, selectors);
					return that.execQuery(query, options);
				};
			}
		});
	}
});

Wmi.ObjectSet = Wmi.inherit(Wmi.Common, {
});

Wmi.Object = Wmi.inherit(Wmi.Common, {
	associatorsOf: function(options)
	{
		options = options || {};

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet)
			{
				return wbemObject.Associators_(
					options.assocClass || null, 
					options.resultClass || null, 
					options.resultRole || null, 
					options.role || null, 
					!! options.classesOnly, 
					!! options.schemaOnly, 
					options.requiredAssocQualifier || null, 
					options.requiredQualifier || null, 
					options.flags || 16, 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext)
			{
				wbemObject.AssociatorsAsync_(
					wbemSink, 
					options.assocClass || null, 
					options.resultClass || null, 
					options.resultRole || null, 
					options.role || null, 
					!! options.classesOnly, 
					!! options.schemaOnly, 
					options.requiredAssocQualifier || null, 
					options.requiredQualifier || null, 
					options.flags || 0, 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			true, 
			options);
	}, 
	clone: function(options)
	{
		return this.wbemObject.Clone_();
	}, 
	compareTo: function(object, options)
	{
		if ( object instanceof Wmi.Common ) {
			object = object.wbemObject;
		}
		return this.wbemObject.CompareTo_(object, options && options.flags || 0);
	}, 
	deleteClass: function(options)
	{
		options = options || {};

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet)
			{
				wbemObject.Delete_(
					options.flags || 0, 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext)
			{
				wbemObject.DeleteAsync_(
					wbemSink, 
					options.flags || 0, 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			false, 
			options);
	}, 
	execMethod: function(methodName, options)
	{
		options = options || {};

		var wbemInParams = this.getInParams(methodName, options.inParams);

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet)
			{
				return wbemObject.ExecMethod_(
					methodName, 
					wbemInParams, 
					options.flags || 0, 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext)
			{
				wbemObject.ExecMethodAsync_(
					wbemSink, 
					methodName, 
					wbemInParams, 
					options.flags || 0, 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			false, 
			options);
	}, 
	getText: function(textFormat, options)
	{
		options = options || {};

		return this.wbemObject.GetText_(
			textFormat, 
			options.flags || 0, 
			Wmi.getNamedValueSet(options.namedValueSet));
	}, 
	getObjectText: function(options)
	{
		return this.wbemObject.GetObjectText_(options && options.flags || 0);
	}, 
	instancesOf: function(options)
	{
		options = options || {};

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet)
			{
				return wbemObject.Instances_(
					options.flags || 16, 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext)
			{
				wbemObject.InstancesAsync_(
					wbemSink, 
					options.flags || 0, 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			true, 
			options);
	}, 
	putClass: function(options)
	{
		options = options || {};

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet)
			{
				return wbemObject.Put_(
					options.flags || 16, 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext)
			{
				wbemObject.PutAsync_(
					wbemSink, 
					options.flags || 0, 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			false, 
			options);
	}, 
	referencesTo: function(options)
	{
		options = options || {};

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet)
			{
				return wbemObject.References_(
					options.resultClass || null, 
					options.role || null, 
					!! options.classesOnly, 
					!! options.schemaOnly, 
					options.requiredQualifier || null, 
					options.flags || 16, 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext)
			{
				wbemObject.ReferencesAsync_(
					wbemSink, 
					options.resultClass || null, 
					options.role || null, 
					!! options.classesOnly, 
					!! options.schemaOnly, 
					options.requiredQualifier || null, 
					options.flags || 0, 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			true, 
			options);
	}, 
	refresh: function(options)
	{
		options = options || {};

		this.wbemObject.Refresh_(
			options.flags || 0, 
			Wmi.getNamedValueSet(options.namedValueSet));
	}, 
	spawnDerivedClass: function(options)
	{
		return this.wbemObject.SpawnDerivedClass_(options && options.flags || 0);
	}, 
	spawnInstance: function(options)
	{
		return this.wbemObject.SpawnInstance_(options && options.flags || 0);
	}, 
	subclassesOf: function(superClass, options)
	{
		options = options || {};

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet)
			{
				return wbemObject.Subclasses_(
					options.flags || 1, 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext)
			{
				wbemObject.SubclassesAsync_(
					wbemSink, 
					options.flags || 0, 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			true, 
			options);
	}, 
	getInParams: function(methodName, inParams)
	{
		// nothing has been passed
		if ( ! inParams ) {
			return null;
		}
		// wbemInParams
		if ( inParams instanceof ActiveXObject ) {
			return inParams;
		}
		// {  name: value[, ...] }
		var wbemInParams = this.wbemObject.Methods_(methodName).InParameters;
		// this method does not have parameters
		if ( ! wbemInParams ) {
			return null;
		}
		wbemInParams = wbemInParams.SpawnInstance_();
		for (var p in inParams) {
			if ( ! inParams.hasOwnProperty(p) ) {
				continue;
			}
			wbemInParams.Properties_.Item(p) = inParams[p];
		}
		return wbemInParams;
	}
});
