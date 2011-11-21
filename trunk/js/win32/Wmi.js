//
// JavaScript unit
// Add-on for WMI (Windows Management Instrumentation)
//
// Copyright (c) 2010, 2011 by Ildar Shaimordanov
//

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
		security.push('(' + options.privileges.join(', ') + ')');
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
		moniker.push(':' + options.className);
	}

	return moniker.join('');
};

Wmi.getSinkPrefix = function()
{
	return 'SINK' + (new Date()).getTime() + '_';
};

Wmi.setSinkEvents = function(sinkPrefix, events)
{
	var global = (function()
	{
		return this;
	})();

	if ( typeof events == 'function' ) {
		events = { 'objectReady': events };
	}

	var names = arguments.callee.eventNames;
	for (var i = 0; i < names.length; i++) {
		// n - nameOfEvent
		// p - NameOfEvent
		var n = names[i].replace(/^./, function($0) { return $0.toLowerCase(); });
		var p = names[i].replace(/^./, function($0) { return $0.toUpperCase(); });
		if ( typeof events[n] != 'function' && typeof events[p] != 'function' ) {
			continue;
		}
		global[sinkPrefix + 'On' + p] = events[n] || events[p];
	}
};

Wmi.setSinkEvents.eventNames = 'completed objectPut objectReady progress'.split(' ');

Wmi.getSink = function(sinkPrefix, events)
{
	Wmi.setSinkEvents(sinkPrefix, events);
	return WScript.CreateObject('WbemScripting.SWbemSink', sinkPrefix);
};

Wmi.prepareQuery = function(className, whereClause)
{
	var query = 'SELECT * FROM ' + className;
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
	} else {
		wmi = new Wmi.Services(wbemObject, wbemLocator);
		if ( options.extendSubclasses ) {
			wmi.extendSubclasses();
		}
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
	forEach: function(collection, func)
	{
		var t = typeof collection;
		if ( t == 'function' ) {
			collection = collection(this.wbemObject);
		} else if ( t == 'string' ) {
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
		} else {
			collection = collection || this.wbemObject;
		}
		for (var e = new Enumerator(collection) ; ! e.atEnd(); e.moveNext()) {
			var i = e.item();
			func(i, this.wbemObject);
		}
	}
});

Wmi.Services = Wmi.inherit(Wmi.Common, {
	associatorsOf: function(objectPath, options)
	{
		this.notImplemented();
	}, 
	deleteClass: function(objectPath, options)
	{
		this.notImplemented();
	}, 
	execMethod: function(objectPath, methodName, options)
	{
		this.notImplemented();
	}, 
	execNotificationQuery: function(query, options)
	{
		options = options || {};

		if ( ! options.async ) {
			var eventNotifier = this.wbemObject.ExecNotificationQuery(query, 
				options.queryLaguage || 'WQL', 
				options.flags || (16 + 32), 
				options.wbemNamedValueSet || null);
			var event = eventNotifier.NextEvent();
			if ( typeof options.objectReady == 'function' ) {
				options.objectReady(event);
			}
			return;
		}

		var sinkPrefix = options.sinkPrefix || Wmi.getSinkPrefix();
		var sink = options.sink || Wmi.getSink(sinkPrefix, options);

		return this.wbemObject.ExecNotificationQueryAsync(sink, query, 
			options.queryLaguage || 'WQL', 
			options.flags || 0, 
			options.wbemNamedValueSet || null, 
			options.wbemAsyncContext || null);
	}, 
	execQuery: function(query, options)
	{
		options = options || {};

		if ( ! options.async ) {
			var wbemObject = this.wbemObject.ExecQuery(query, 
				options.queryLaguage || 'WQL', 
				options.flags || 16, 
				options.wbemNamedValueSet || null);
			return new Wmi.create(wbemObject);
		}

		var sinkPrefix = options.sinkPrefix || Wmi.getSinkPrefix();
		var sink = options.sink || Wmi.getSink(sinkPrefix, options);

		return this.wbemObject.ExecQueryAsync(sink, query, 
			options.queryLaguage || 'WQL', 
			options.flags || 0, 
			options.wbemNamedValueSet || null, 
			options.wbemAsyncContext || null);
	}, 
	getClass: function(objectPath, options)
	{
		options = options || {};

		if ( ! options.async ) {
			var wbemObject = this.wbemObject.Get(objectPath, 
				options.flags || 0, 
				options.wbemNamedValueSet || null);
			return new Wmi.create(wbemObject);
		}

		var sinkPrefix = options.sinkPrefix || Wmi.getSinkPrefix();
		var sink = options.sink || Wmi.getSink(sinkPrefix, options);

		return this.service.Get(sink, objectPath, 
			options.flags || 0, 
			options.wbemNamedValueSet || null, 
			options.wbemAsyncContext || null);
	}, 
	instancesOf: function(className, options)
	{
		this.notImplemented();
	}, 
	referencesTo: function(query, options)
	{
		this.notImplemented();
	}, 
	subclassesOf: function(superClass, options)
	{
		options = options || {};

		if ( ! options.async ) {
			var wbemObject = this.wbemObject.SubclassesOf(superClass, 
				options.flags || 0, 
				options.wbemNamedValueSet || null);
			return new Wmi.create(wbemObject);
		}

		var sinkPrefix = options.sinkPrefix || Wmi.getSinkPrefix();
		var sink = options.sink || Wmi.getSink(sinkPrefix, options);

		return this.service.SubclassesOf(sink, superClass, 
			options.flags || 0, 
			options.wbemNamedValueSet || null, 
			options.wbemAsyncContext || null);
	}, 
	extendSubclasses: function()
	{
		var that = this;
		this.forEach(
//			this.subclassesOf().wbemObject, 
			function(wbemObject)
			{
				return wbemObject.SubclassesOf();
			}, 
			function(p)
			{
				var className = p.Path_.Class;
				if ( that[className] ) {
					return;
				}

				that[className] = function(whereClause, options)
				{
					var query = Wmi.prepareQuery(className, whereClause);
					return that.execQuery(query, options);
				};
			}
		);
	}
});

Wmi.ObjectSet = Wmi.inherit(Wmi.Common, {
});

Wmi.Object = Wmi.inherit(Wmi.Common, {
});
