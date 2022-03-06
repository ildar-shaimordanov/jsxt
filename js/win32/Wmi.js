//
// JScript wrapper for WMI (Windows Management Instrumentation)
//
// Copyright (c) 2010, 2011, 2022 by Ildar Shaimordanov
//

/*

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
var Wmi = function(options) {
	return Wmi.create(options);
};

// ========================================================================

Wmi.setSecurity = function(wbemObject, options) {
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

Wmi.getLocator = function(options) {
	var wbemLocator = new ActiveXObject('WbemScripting.SWbemLocator');
	Wmi.setSecurity(wbemLocator, options);
	return wbemLocator;
};

Wmi.connectServer = function(wbemLocator, options) {
	options = options || {};

	wbemLocator = wbemLocator || Wmi.getLocator(options);

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

Wmi.getMoniker = function(options) {
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

Wmi.getSinkPrefix = function() {
	return 'SINK' + (new Date()).getTime() + '_';
};

Wmi.getSink = (function() {
	var defaultSinkEventNames = 'onCompleted onObjectPut onObjectReady onProgress'.split(' ');

	var setSinkEvents = function(sinkPrefix, events) {
		var global = (function() { return this; })();

		if ( typeof events == 'function' ) {
			events = { 'onObjectReady': events };
		}

		var names = defaultSinkEventNames;
		for (var i = 0; i < names.length; i++) {
			var n = names[i];
			if ( typeof events[n] == 'function' ) {
				global[sinkPrefix + n] = events[n];
			}
		}
/*
		for (var i = 0; i < names.length; i++) {
			// n - nameOfEvent
			// p - NameOfEvent
			var n = names[i].replace(/^./, function($0) { return $0.toLowerCase(); });
			var p = names[i].replace(/^./, function($0) { return $0.toUpperCase(); });
			if ( typeof events[n] == 'function' ) {
				global[sinkPrefix + 'On' + p] = events[n];
			}
		}
*/
	};

	return function(sinkPrefix, events) {
		setSinkEvents(sinkPrefix, events);
		return WScript.CreateObject('WbemScripting.SWbemSink', sinkPrefix);
	};
})();

Wmi.getNamedValueSet = function(namedValueSet) {
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

Wmi.prepareQuery = function(className, whereClause, selectors, withinClause) {
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

Wmi.forEach = function(collection, func, before) {
	var e = new Enumerator(collection);
	if ( before ) {
		before(e.item());
	}
	for ( ; ! e.atEnd(); e.moveNext()) {
		var i = e.item();
		func(i);
	}
};

Wmi.map = function(collection, func, before) {
	var result = [];
	var e = new Enumerator(collection);
	if ( before ) {
		before(e.item());
	}
	for ( ; ! e.atEnd(); e.moveNext()) {
		var i = e.item();
		result.push(func(i));
	}
	return result;
};

Wmi.defaultFlags = function(options, n) {
	var f = Number((options || {}).flags);
	return f == 0 ? 0 : f || n;
};

Wmi.extendMethods = false;

Wmi.extendSubclasses = false;

Wmi.create = function(options) {
	options = options || {};

	var moniker;
	var wbemObject = null;
	var wbemLocator = null;

	if ( options instanceof ActiveXObject ) {
		wbemObject = options;
	} else if ( options instanceof Wmi.Common ) {
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
		if ( options.extendMethods || Wmi.extendMethods ) {
			wmi.extendMethods();
		}
	} else if ( typeof wbemObject.Item == 'unknown' ) {
		wmi = new Wmi.ObjectSet(wbemObject, wbemLocator);
	} else if ( typeof wbemObject.InstancesOf == 'unknown' ) {
		wmi = new Wmi.Namespace(wbemObject, wbemLocator);
		if ( options.extendSubclasses || Wmi.extendSubclasses ) {
			wmi.extendSubclasses();
		}
	} else {
		wmi = new Wmi.Common(wbemObject, wbemLocator);
	}

	return wmi;
};

// ========================================================================

Wmi.inherit = function(base, proto) {
	base = base || function() {};
	proto = proto || {};

	var constructor = proto.hasOwnProperty('constructor') 
		? proto.constructor 
		: function() { base.apply(this, arguments); };

	var F = function() {};
	F.prototype = base.prototype;

	constructor.prototype = (function(dst, src) {
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

// ========================================================================

Wmi.Common = Wmi.inherit(null, {
	constructor: function(wbemObject, wbemLocator) {
		this.wbemObject = wbemObject;
		this.wbemLocator = wbemLocator || null;
	}, 
	callMethod: function(wrapMethod, wrapMethodAsync, useForEach, options) {
		var wbemNamedValueSet = Wmi.getNamedValueSet(options.namedValueSet);
		var wbemObject = this.valueOf();

		if ( ! options.async ) {
			var wbemResult = wrapMethod(wbemObject, wbemNamedValueSet);

			if ( options.onObjectReady ) {
				if ( useForEach ) {
					Wmi.forEach(wbemResult, options.onObjectReady);
				} else {
					options.onObjectReady(wbemResult);
				}
			}

			return wbemResult && Wmi.create(wbemResult);
		}

		var sinkPrefix = options.sinkPrefix || Wmi.getSinkPrefix();
		var wbemSink = options.sink || Wmi.getSink(sinkPrefix, options);

		var wbemAsyncContext = Wmi.getNamedValueSet(options.asyncContext || {});
		wbemAsyncContext.Add('asyncCompleted', false);

		wrapMethodAsync(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext);

		if ( options.wait ) {
			while ( ! wbemAsyncContext.Item('asyncCompleted').Value ) {
				options.wait();
			}
		}
	}, 
	getCollection: function(collection) {
		var wbemObject = this.valueOf();

		var t = typeof collection;
		if ( t == 'string' ) {
			// Convert name-of-property to NameOfProperty_
			var prop = collection
				.replace(/(?:^|-)([a-z])/g, function($0, $1) {
					return $1.toUpperCase();
				})
				.replace(/[^_]$/, function($0) {
					return $0 + '_';
				})
				;
			collection = wbemObject[prop];
		} else if ( t == 'function' ) {
			collection = collection(wbemObject);
		} else {
			collection = collection || wbemObject;
		}

		return collection;
	}, 
	forEach: function(collection, func, before) {
		var c = this.getCollection(collection);
		Wmi.forEach(c, func, before);
	}, 
	map: function(collection, func, before) {
		var c = this.getCollection(collection);
		return Wmi.map(c, func, before);
	}, 
	notImplemented: function() {
		throw new Error('Not implemented method');
	}, 
	valueOf: function() {
		return this.wbemObject;
	}
});

// ========================================================================

Wmi.Namespace = Wmi.inherit(Wmi.Common, {
	associatorsOf: function(objectPath, options) {
		options = options || {};

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet) {
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
					Wmi.defaultFlags(options, 16), 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext) {
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
					Wmi.defaultFlags(options, 0), 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			true, 
			options);
	}, 
	deleteClass: function(objectPath, options) {
		options = options || {};

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet) {
				wbemObject.Delete(
					objectPath, 
					Wmi.defaultFlags(options, 0), 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext) {
				wbemObject.DeleteAsync(
					wbemSink, 
					objectPath, 
					Wmi.defaultFlags(options, 0), 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			false, 
			options);
	}, 
	execMethod: function(objectPath, methodName, inParams, options) {
		options = options || {};

		var wbemInParams = this.getInParams(objectPath, methodName, inParams);

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet) {
				return wbemObject.ExecMethod(
					objectPath, 
					methodName, 
					wbemInParams, 
					Wmi.defaultFlags(options, 0), 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext) {
				wbemObject.ExecMethodAsync(
					wbemSink, 
					objectPath, 
					methodName, 
					wbemInParams, 
					Wmi.defaultFlags(options, 0), 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			false, 
			options);
	}, 
	execNotificationQuery: function(query, options) {
		options = options || {};

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet) {
				var wbemEventSource = wbemObject.ExecNotificationQuery(
					query, 
					options.queryLanguage || 'WQL', 
					Wmi.defaultFlags(options, (16 + 32)), 
					wbemNamedValueSet);
				return wbemEventSource.NextEvent();
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext) {
				wbemObject.ExecNotificationQueryAsync(
					wbemSink, 
					query, 
					options.queryLanguage || 'WQL', 
					Wmi.defaultFlags(options, 0), 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			false, 
			options);
	}, 
	execQuery: function(query, options) {
		options = options || {};

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet) {
				return wbemObject.ExecQuery(
					query, 
					options.queryLanguage || 'WQL', 
					Wmi.defaultFlags(options, 16), 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext) {
				return wbemObject.ExecQueryAsync(
					wbemSink, 
					query, 
					options.queryLanguage || 'WQL', 
					Wmi.defaultFlags(options, 0), 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			true, 
			options);
	}, 
	getClass: function(objectPath, options) {
		options = options || {};

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet) {
				return wbemObject.Get(
					objectPath, 
					Wmi.defaultFlags(options, 0), 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext) {
				wbemObject.GetAsync(
					wbemSink, 
					objectPath, 
					Wmi.defaultFlags(options, 0), 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			false, 
			options);
	}, 
	instancesOf: function(className, options) {
		options = options || {};

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet) {
				return wbemObject.InstancesOf(
					className, 
					Wmi.defaultFlags(options, 16), 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext) {
				wbemObject.InstancesOfAsync(
					wbemSink, 
					className, 
					Wmi.defaultFlags(options, 0), 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			true, 
			options);
	}, 
	putClass: function(wbemInObject, options) {
		options = options || {};

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet) {
				return wbemObject.Put(
					wbemInObject, 
					Wmi.defaultFlags(options, 16), 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext) {
				wbemObject.PutAsync(
					wbemSink, 
					wbemInObject, 
					Wmi.defaultFlags(options, 0), 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			true, 
			options);
	}, 
	referencesTo: function(objectPath, options) {
		options = options || {};

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet) {
				return wbemObject.ReferencesTo(
					objectPath, 
					options.resultClass || null, 
					options.role || null, 
					!! options.classesOnly, 
					!! options.schemaOnly, 
					options.requiredQualifier || null, 
					Wmi.defaultFlags(options, 16), 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext) {
				wbemObject.ReferencesToAsync(
					wbemSink, 
					objectPath, 
					options.resultClass || null, 
					options.role || null, 
					!! options.classesOnly, 
					!! options.schemaOnly, 
					options.requiredQualifier || null, 
					Wmi.defaultFlags(options, 0), 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			true, 
			options);
	}, 
	subclassesOf: function(superClass, options) {
		options = options || {};

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet) {
				return wbemObject.SubclassesOf(
					superClass || '', 
					Wmi.defaultFlags(options, 16), 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext) {
				wbemObject.SubclassesOfAsync(
					wbemSink, 
					superClass || '', 
					Wmi.defaultFlags(options, 0), 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			true, 
			options);
	}, 
	extendSubclasses: function() {
		var that = this;
		this.subclassesOf('', {
			onObjectReady: function(p) {
				var className = p.Path_.Class;
				if ( that[className] ) {
					return;
				}

				that[className] = function(whereClause, selectors, options) {
					var query = Wmi.prepareQuery(className, whereClause, selectors);
					return that.execQuery(query, options);
				};
			}
		});
	}, 
	getInParams: function(objectPath, methodName, inParams) {
		var wmi = this.getClass(objectPath);
		return wmi.getInParams(methodName, inParams);
	}, 
	getPropertyNames: function(objectPath) {
		var wmi = this.getClass(objectPath);
		return wmi.getPropertyNames();
	}
});

// ========================================================================

Wmi.ObjectSet = Wmi.inherit(Wmi.Common, {
});

// ========================================================================

Wmi.Object = Wmi.inherit(Wmi.Common, {
	associatorsOf: function(options) {
		options = options || {};

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet) {
				return wbemObject.Associators_(
					options.assocClass || null, 
					options.resultClass || null, 
					options.resultRole || null, 
					options.role || null, 
					!! options.classesOnly, 
					!! options.schemaOnly, 
					options.requiredAssocQualifier || null, 
					options.requiredQualifier || null, 
					Wmi.defaultFlags(options, 16), 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext) {
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
					Wmi.defaultFlags(options, 0), 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			true, 
			options);
	}, 
	clone: function(options) {
		var wbemObject = this.valueOf().Clone_();
		return Wmi.create(wbemObject);
	}, 
	compareTo: function(object, options) {
		if ( object instanceof Wmi.Common ) {
			object = object.valueOf();
		}
		return this.valueOf().CompareTo_(object, Wmi.defaultFlags(options, 0));
	}, 
	deleteClass: function(options) {
		options = options || {};

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet) {
				wbemObject.Delete_(
					Wmi.defaultFlags(options, 0), 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext) {
				wbemObject.DeleteAsync_(
					wbemSink, 
					Wmi.defaultFlags(options, 0), 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			false, 
			options);
	}, 
	execMethod: function(methodName, inParams, options) {
		options = options || {};

		var wbemInParams = this.getInParams(methodName, inParams);

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet) {
				return wbemObject.ExecMethod_(
					methodName, 
					wbemInParams, 
					Wmi.defaultFlags(options, 0), 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext) {
				wbemObject.ExecMethodAsync_(
					wbemSink, 
					methodName, 
					wbemInParams, 
					Wmi.defaultFlags(options, 0), 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			false, 
			options);
	}, 
	getText: function(textFormat, options) {
		options = options || {};

		return this.valueOf().GetText_(
			textFormat, 
			Wmi.defaultFlags(options, 0), 
			Wmi.getNamedValueSet(options.namedValueSet));
	}, 
	getObjectText: function(options) {
		return this.valueOf().GetObjectText_(Wmi.defaultFlags(options, 0));
	}, 
	instancesOf: function(options) {
		options = options || {};

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet) {
				return wbemObject.Instances_(
					Wmi.defaultFlags(options, 16), 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext) {
				wbemObject.InstancesAsync_(
					wbemSink, 
					Wmi.defaultFlags(options, 0), 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			true, 
			options);
	}, 
	putClass: function(options) {
		options = options || {};

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet) {
				return wbemObject.Put_(
					Wmi.defaultFlags(options, 16), 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext) {
				wbemObject.PutAsync_(
					wbemSink, 
					Wmi.defaultFlags(options, 0), 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			false, 
			options);
	}, 
	referencesTo: function(options) {
		options = options || {};

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet) {
				return wbemObject.References_(
					options.resultClass || null, 
					options.role || null, 
					!! options.classesOnly, 
					!! options.schemaOnly, 
					options.requiredQualifier || null, 
					Wmi.defaultFlags(options, 16), 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext) {
				wbemObject.ReferencesAsync_(
					wbemSink, 
					options.resultClass || null, 
					options.role || null, 
					!! options.classesOnly, 
					!! options.schemaOnly, 
					options.requiredQualifier || null, 
					Wmi.defaultFlags(options, 0), 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			true, 
			options);
	}, 
	refresh: function(options) {
		options = options || {};

		this.valueOf().Refresh_(
			Wmi.defaultFlags(options, 0), 
			Wmi.getNamedValueSet(options.namedValueSet));
	}, 
	spawnDerivedClass: function(options) {
		var wbemObject = this.valueOf().SpawnDerivedClass_(Wmi.defaultFlags(options, 0));
		return Wmi.create(wbemObject);
	}, 
	spawnInstance: function(inParams, options) {
		var wbemObject = this.valueOf().SpawnInstance_(Wmi.defaultFlags(options, 0));
		for (var p in inParams) {
			if ( ! inParams.hasOwnProperty(p) ) {
				continue;
			}
			wbemObject[p] = inParams[p];
		}
		return Wmi.create(wbemObject);
	}, 
	subclassesOf: function(superClass, options) {
		options = options || {};

		return this.callMethod(
			function(wbemObject, wbemNamedValueSet) {
				return wbemObject.Subclasses_(
					Wmi.defaultFlags(options, 1), 
					wbemNamedValueSet);
			}, 
			function(wbemObject, wbemSink, wbemNamedValueSet, wbemAsyncContext) {
				wbemObject.SubclassesAsync_(
					wbemSink, 
					Wmi.defaultFlags(options, 0), 
					wbemNamedValueSet, 
					wbemAsyncContext);
			}, 
			true, 
			options);
	}, 
	extendMethods: function() {
		var that = this;
		this.forEach(
			'methods', 
			function(method) {
				var methodName = method.Name;
				if ( that[methodName] ) {
					return;
				}

				that[methodName] = function(inParams, options) {
					return that.execMethod(methodName, inParams, options);
				};

				that[methodName].paramNames = method.InParameters 
					? Wmi.create(method.InParameters).getPropertyNames() 
//					? that.map(method.InParameters.Properties_, function(p) { return p.Name; }) 
					: [];
			}
		);
	}, 
	getInParams: function(methodName, inParams) {
		var wbemInParams = this.valueOf().Methods_(methodName).InParameters;
		// this method does not support input parameters
		if ( ! wbemInParams ) {
			return null;
		}
		// nothing has been passed
		if ( ! inParams ) {
			return null;
		}
		// wbemInParams
		if ( inParams instanceof ActiveXObject ) {
			return inParams;
		}
		// {  name: value[, ...] }
		wbemInParams = wbemInParams.SpawnInstance_();
		for (var p in inParams) {
			if ( ! inParams.hasOwnProperty(p) ) {
				continue;
			}
			wbemInParams.Properties_.Item(p) = inParams[p];
		}
		return wbemInParams;
	}, 
	getPropertyNames: function() {
		return this.map('properties', function(p) { return p.Name; });
	}
});

// ========================================================================

// EOF
