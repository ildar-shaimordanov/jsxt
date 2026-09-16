//
// JScript wrapper for WMI (Windows Management Instrumentation)
//
// Copyright (c) 2010, 2011, 2022, 2026 by Ildar Shaimordanov
//

/*

Introduction to WMI (Russian text)
http://www.script-coding.com/WMI.html

Windows Management Instrumentation
https://docs.microsoft.com/en-us/windows/win32/wmisdk/wmi-start-page

Scripting API Objects
https://docs.microsoft.com/en-us/windows/win32/wmisdk/scripting-api-objects

SWbemSink object
https://docs.microsoft.com/en-us/windows/win32/wmisdk/swbemsink

SWbemObjectSet object
https://docs.microsoft.com/en-us/windows/win32/wmisdk/swbemobjectset

SWbemServices/SWbemServicesEx object
https://docs.microsoft.com/en-us/windows/win32/wmisdk/swbemservices
https://docs.microsoft.com/en-us/windows/win32/wmisdk/swbemservicesex

SWbemObject/SWbemObjectEx object
https://docs.microsoft.com/en-us/windows/win32/wmisdk/swbemobject
https://docs.microsoft.com/en-us/windows/win32/wmisdk/swbemobjectex

WMI moniker
https://docs.microsoft.com/en-us/previous-versions/tn-archive/ee156574(v=technet.10)

*/

function Wmi(options) {
	return Wmi.create(options);
};

// ========================================================================

// for supporting module system provided by require()
// https://github.com/ildar-shaimordanov/jsxt/blob/master/core/require.js
if ( typeof module != "undefined" ) {
	module.exports = Wmi;
}

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
		security.push('(' + [].concat(options.privileges).join(',') + ')');
	}

	var moniker = [ 'winmgmts:' ];
	if ( security.length ) {
		moniker.push('{' + security.join(',') + '}');
	}

	if ( options.locale ) {
		moniker.push('[locale=' + options.locale + ']');
	}

	if ( ( security.length || options.locale )
	&& ( options.computer || options.namespace || options.className ) ) {
		moniker.push('!');
	}

	if ( options.computer ) {
		moniker.push('\\\\' + options.computer);
	}

	if ( options.namespace ) {
		var namespace = options.namespace
			.replace(/^[\/]+/, '')
			.replace(/[/]/g, '\\')
			;
		if ( options.computer ) {
			namespace = '\\' + namespace;
		}
		moniker.push(namespace);
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

/*

A complete guide for Wmi.prepareQuery and whereClause


SIMPLE STRING AS "value"

If the whereClause is a string, it is treated as a single value for
an exact comparison against the "Name" property and is automatically
escaped for security reasons.

Correct usage
  var q = Wmi.prepareQuery('Win32_Process', "notepad.exe");
  // SELECT * FROM Win32_Process WHERE Name = 'notepad.exe'

Attempted attack
  var q = Wmi.prepareQuery('Win32_Process', "calc.exe' OR '1'='1");
  // SELECT * FROM Win32_Process WHERE Name = 'calc.exe\' OR \'1\'=\'1'


SIMPLE OBJECT AS { name1: value1, ... }

In this case, all properties are combined with AND, keys are validated,
and values are escaped.

  var q = Wmi.prepareQuery('Win32_Process', {
      ExecutionState: "Running",
      Priority: 8
  });
  // SELECT * FROM Win32_Process WHERE (ExecutionState = 'Running' AND Priority = 8)


CHECKING FOR UNDEFINED VALUES (IS NULL / IS NOT NULL)

There is no way to perform a direct comparison like "= NULL" in WQL.
There are four ways to express comparisons that resolve to
"IS NULL" or "IS NOT NULL":
- { name: null }              -> name IS NULL
- { name: { eq: null } }      -> name IS NULL
- { name: { ne: null } }      -> name IS NOT NULL
- { name: { notnull: true } } -> name IS NOT NULL

  var q = Wmi.prepareQuery('Win32_Process', {
      CommandLine: null,
      ExecutablePath: { ne: null },
      Description: { notnull: true }
  });
  // SELECT * FROM Win32_Process WHERE (CommandLine IS NULL AND ExecutablePath IS NOT NULL AND Description IS NOT NULL)


EMULATING THE "IN" OPERATOR

WQL does not natively support the IN operator. Our builder handles arrays
of values and produces a safe, isolated group of OR'ed conditions.

  var q = Wmi.prepareQuery('Win32_Process', {
      ProcessId: [1024, 2048, 4096]
  });
  // SELECT * FROM Win32_Process WHERE ((ProcessId = 1024 OR ProcessId = 2048 OR ProcessId = 4096))


COMPLEX (NESTED) CONDITIONS

- Extended conditions using the Wmi.bool operator mapping.
- Supported keys: 'eq', 'ne', 'gt', 'ge', 'lt', 'le', 'like', 'isa'.

  var q = Wmi.prepareQuery('Win32_Process', {
      Caption: { like: "win%" },
      KernelModeTime: { ge: 50000 }
  });
  // SELECT * FROM Win32_Process WHERE (Caption LIKE 'win%' AND KernelModeTime >= 50000)


ADVANCED LOGIC WITH Wmi.and / Wmi.or

- Allows building complex logical structures of any nesting depth.
- Perfectly suited for system WMI events (WITHIN queries) where a class is
  checked using the "ISA" operator along with "TargetInstance.*" properties.

  var q = Wmi.prepareQuery(
      '__InstanceCreationEvent',
      Wmi.and(
          { 'TargetInstance': { isa: 'Win32_Process' } },
          Wmi.or(
              { 'TargetInstance.Name': 'cmd.exe' },
              { 'TargetInstance.Name': 'powershell.exe' }
          )
      ),
      '*',
      '2'
  );
  // SELECT * FROM __InstanceCreationEvent WITHIN 2 WHERE ((TargetInstance ISA 'Win32_Process') AND ((TargetInstance.Name = 'cmd.exe') OR (TargetInstance.Name = 'powershell.exe')))

*/

Wmi.prepareQuery = function(className, whereClause, selectors, withinClause) {
	Wmi.validateClassName(className);

	selectors = [].concat(selectors || '*');
	for (var i = 0; i < selectors.length; i++) {
		if ( selectors[i] == '*' ) {
			continue;
		}
		Wmi.validateFieldName(selectors[i]);
	}

	var query = 'SELECT ' + selectors.join(',') + ' FROM ' + className;

	if ( withinClause ) {
		Wmi.validateWithinClause(withinClause);
		query += ' WITHIN ' + withinClause;
	}

	if ( typeof whereClause == 'object' && whereClause !== null ) {
		whereClause = Wmi.buildWhere(whereClause);
	} else if ( typeof whereClause == 'string' && whereClause ) {
		whereClause = "Name = '" + Wmi.escape(whereClause) + "'";
	}
	if ( whereClause ) {
		query += ' WHERE ' + whereClause;
	}

	return query;
};

Wmi.validateClassName = function(value) {
	if ( ! /^[A-Za-z_][A-Za-z0-9_]*$/.test(value) ) {
		throw new Error('Invalid class name: ' + value);
	}
};

Wmi.validateFieldName = function(value) {
	if ( ! /^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)*$/.test(value) ) {
		throw new Error('Invalid field name: ' + value);
	}
};

Wmi.validateWithinClause = function(value) {
	if ( ! /^\d+(\.\d+)?$/.test(value) ) {
		throw new Error('Invalid WITHIN clause: ' + value);
	}
};

Wmi.bool = {
	'eq': '=',
	'ne': '<>',
	'gt': '>',
	'ge': '>=',
	'lt': '<',
	'le': '<=',
	'like': 'LIKE',
	'isa': 'ISA'
};

Wmi.and = function() {
	return {
		logical: 'AND',
		rules: Array.prototype.slice.call(arguments)
	};
};

Wmi.or = function() {
	return {
		logical: 'OR',
		rules: Array.prototype.slice.call(arguments)
	};
};

Wmi.escape = function(value) {
	if ( typeof value != 'string' ) {
		return value;
	}
	return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
};

Wmi.buildValue = function(value) {
	if ( typeof value == 'number' || typeof value == 'boolean' ) {
		return value.toString();
	}
	return "'" + Wmi.escape(value) + "'";
};

Wmi.buildWhere = function(expr) {
	if ( ! expr ) {
		return '';
	}

	// 1. parse logical AND/OR
	if ( expr.logical ) {
		var parts = [];
		for (var i = 0; i < expr.rules.length; i++) {
			var part = Wmi.buildWhere(expr.rules[i]);
			if ( part ) {
				parts.push(part);
			}
		}
		if ( parts.length == 0 ) {
			return '';
		}
		return '(' + parts.join(' ' + expr.logical + ' ') + ')';
	}

	var clauses = [];
	for (var key in expr) {
		if ( ! expr.hasOwnProperty(key) ) {
			continue;
		}

		Wmi.validateFieldName(key);
		var val = expr[key];

		// 2.1. direct null
		// { name: null } -> name IS NULL
		if ( val === null ) {
			clauses.push(key + ' IS NULL');
			continue;
		}

		// 2.2. regular equality
		// { name: value } -> name='value'
		if ( typeof val != 'object' ) {
			clauses.push(key + ' = ' + Wmi.buildValue(val));
			continue;
		}

		// 2.3. array handling (In-operator emulation)
		// { name: [1, 2] } -> (name = 1 OR name = 2)
		if ( val instanceof Array ) {
			var arr = [];
			for (var j = 0; j < val.length; j++) {
				arr.push(key + ' = ' + Wmi.buildValue(val[j]));
			}
			if ( arr.length > 0 ) {
				clauses.push('(' + arr.join(' OR ') + ')');
			}
			continue;
		}

		// 3. complicated cases
		// { like: value } -> name LIKE 'value'
		// { ne: null } -> name IS NOT NULL

		// 4. regular conditions
		// name: { ne: value } -> name <> 'value'
		for (var opKey in val) {
			if ( ! val.hasOwnProperty(opKey) ) {
				continue;
			}

			var opLower = opKey.toLowerCase();
			var opVal = val[opKey];

			// 3.1: { notnull: true } -> name IS NOT NULL
			if ( opLower == 'notnull' && opVal == true ) {
				clauses.push(key + ' IS NOT NULL');
				continue;
			}

			// 3.2: { ne: null } -> name IS NOT NULL
			if ( opLower == 'ne' && opVal == null ) {
				clauses.push(key + ' IS NOT NULL');
				continue;
			}

			// 3.3: { eq: null } -> name IS NULL
			if ( opLower == 'eq' && opVal == null ) {
				clauses.push(key + ' IS NULL');
				continue;
			}

			// 4. regular coditions
			var opWql = Wmi.bool[opLower];
			if ( ! opWql ) {
				throw new Error('Unknown operator: ' + opKey);
			}
			clauses.push(key + ' ' + opWql + ' ' + Wmi.buildValue(opVal));
		}
	}

	return clauses.length == 0 ? '' : '(' + clauses.join(' AND ') + ')';
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
	} else if ( options.user || options.useLocator ) {
		wbemLocator = Wmi.getLocator(options);
		wbemObject = Wmi.connectServer(wbemLocator, options);
	} else {
		if ( typeof options == 'string' ) {
			moniker = options;
		} else if ( typeof options.moniker == 'string' ) {
			moniker = options || options.moniker;
		} else {
			moniker = Wmi.getMoniker(options);
		}
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
