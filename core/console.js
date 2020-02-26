//
// console.js
// Imitation of the NodeJS console in the Windows Scripting Host
//
// Copyright (c) 2012, 2013, 2019, 2020 by Ildar Shaimordanov
//

/*

The module adds the useful NodeJS console features to WSH

"console.log(), console.debug(), ..." can be used the same way as used in NodeJS.

Log messages with custom icon depending on the function used.
	console.log(object[, object, ...])
	console.debug(object[, object, ...])
	console.info(object[, object, ...])
	console.warn(object[, object, ...])
	console.error(object[, object, ...])

Test if the expression. If it is false, the info will be logged in the console
	console.assert(expression[, object, ...])

Starts and stops a timer and writes the time elapsed
	console.time(name)
	console.timeEnd(name)

Customizing the console
	console.fn

Checks that the object is a formatting string
	console.fn.isFormat(object)

The simplest formatting function immitating C-like format
	console.fn.format(pattern, objects)

Details for the complex object
	console.fn.inspect(object)

The user-defined printing function
	console.fn.print(msgType, msg)

The deep of nestion for complex structures (default is 5)
	console.fn.deep

The initial value of indentation (4 whitespaces, by default).
A numeric value defines indentaion size, the number of space chars.
	console.fn.space

Numeric values controls the visibility of functions. Defaults to 0.
(0 - do not show function, 1 - show [Function] string, 2 - show a details)
	console.fn.func

The visibility properties from the prototype of the oject. Defaults to 0.
(0 - do not show properties from prototype, 1 - show then)
	console.fn.proto

The string to glue the set of arguments when output them
	console.fn.separator = ' '

The following functions are not implemented:
	console.clear
	console.count
	console.dir
	console.dirxml
	console.group
	console.groupCollapsed
	console.groupEnd
	console.profile
	console.profileEnd
	console.table
	console.trace

*/

var console = console || (function() {

	var entities = {
		'&': '&amp;', 
		'"': '&quot;', 
		'<': '&lt;', 
		'>': '&gt;'
	};

	var escaped = /[\x00-\x1F\"\\]/g;
	var special = {
		'"': '\\"', 
		'\r': '\\r', 
		'\n': '\\n', 
		'\t': '\\t', 
		'\b': '\\b', 
		'\f': '\\f', 
		'\\': '\\\\'
	};

	var space;
	var indent = '';

	var deep;

	var proto;
	var func;

	function _quote(value) {
		var result = value.replace(escaped, function($0) {
			return special[$0] || $0;
		});
		return '"' + result + '"';
	};

	// The inner method for printing objects
	function _inspect(object) {
		switch (typeof object) {
		case 'string':
			return _quote(object);

		case 'boolean':
		case 'number':
		case 'undefined':
		case 'null':
			return String(object);

		case 'function':
			if ( func == 1 ) {
				return '[Function]';
			}
			if ( func > 1 ) {
				return object.toString();
			}
			return '';

		case 'object':
			if ( object === null ) {
				return String(object);
			}

			// Assume win32 COM objects
			if ( ! object.constructor ) {
				return '[Object]';
			}

			var t = Object.prototype.toString.call(object);

			// Assume the RegExp object
			if ( t == '[object RegExp]' ) {
				return String(object);
			}

			// Assume the Date object
			if ( t == '[object Date]' ) {
				return object.toUTCString();
			}

			// Stop the deeper nestings
			if ( ! deep ) {
				return '[...]';
			}

			var saveDeep = deep;
			deep--;

			var saveIndent = indent;
			indent += space;

			var result = [];
			for (var k in object) {
				if ( ! object.hasOwnProperty(k) && ! proto ) {
					continue;
				}

				var v;

				if ( object[k] === object ) {
					v = '[Recursive]';
				} else {
					v = _inspect(object[k]);
					if ( v === '' ) {
						// Sure that any property will return non-empty string
						// Only functions can return an empty string when func == 0
						continue;
					}
				}

				result.push(k + ': ' + v);
			}

			var pred;
			var post;

			if ( t == '[object Array]' ) {
				pred = 'Array(' + object.length + ') [';
				post = ']';
			} else {
				pred = 'Object {';
				post = '}';
			}

			result = result.length == 0 
				? '\n' + saveIndent 
				: '\n' + indent + result.join('\n' + indent) + '\n' + saveIndent;

			indent = saveIndent;
			deep = saveDeep;

			return pred + result + post;

		default:
			return '[Unknown]';
		}
	};

	// The main method for printing objects
	var inspect = function(object) {
		var fn = console.fn;

		space = fn.space;
		deep = Number(fn.deep) > 0 ? fn.deep : 5;
		proto = fn.proto || 0;
		func = fn.func || 0;

		var t = Object.prototype.toString.call(space);
		if ( t == '[object Number]' && space >= 0 ) {
			space = new Array(space + 1).join(' ');
		} else if ( t != '[object String]' ) {
			space = '    ';
		}

		var result = _inspect(object);

		return result;
	};

	// This regular expression is used to recongnize a formatting string 
	var reFormat = /%%|%(\d+)?([idfxso])/g;

	// Checks that the object is a formatting string
	var isFormat = function(object) {
		return String(object).match(reFormat);
	};

	var formatters = {};
	formatters.i = function(v) { return Number(v).toFixed(0); };
	formatters.d = 
	formatters.f = function(v) { return Number(v).toString(10); };
	formatters.x = function(v) { return Number(v).toString(16); }, 
	formatters.o = inspect;
	formatters.s = function(v) { return String(v); };

	// The formatting function immitating C-like "printf"
	var format = function(pattern, objects) {
		var i = 0;
		return pattern.replace(reFormat, function(format, width, id) {
			if ( format == '%%' ) {
				return '%';
			}

			i++;

			var r = formatters[id](objects[i]);

			return r;
		});
	};

	// The printing function
	var print = function(msgType, msg) {
		WScript.Echo(msg);
	};


	// The core function
	var printMsg = function(msgType, objects) {
		// Get the actual configuration of the console
		var fn = console.fn;
		var sep = fn.separator || ' ';

		var result;

		if ( fn.isFormat(objects[0]) ) {
			//result = fn.format(objects[0], Array.prototype.slice.call(objects, 1));
			result = fn.format(objects[0], objects);
		} else {
			result = [];
			for (var i = 0; i < objects.length; i++) {
				result.push(fn.inspect(objects[i]));
			}
			result = result.join(sep);
		}

		fn.print(msgType, result);
	};


	var log = function() {
		printMsg(0, arguments);
	};

	var debug = log;

	var info = function() {
		printMsg(64, arguments);
	};

	var warn = function() {
		printMsg(48, arguments);
	};

	var error = function() {
		printMsg(16, arguments);
	};


	// If the expression is false, the rest of arguments will be logged in 
	// the console
	var assert = function(expr) {
		if ( expr ) {
			return;
		}
		error.apply(console, arguments.length < 2 ? ['Assertion error'] : Array.prototype.slice.call(arguments, 1));
	};


	// Processing of timers start/stop
	var timeNames = {};

	var timeStart = function(name) {
		if ( ! name ) {
			return;
		}

		timeNames[name] = new Date();
		log(name + ': Timer started');
	};

	var timeEnd = function(name) {
		if ( ! name || ! timeNames.hasOwnProperty(name) ) {
			return;
		}

		var t = new Date() - timeNames[name];
		delete timeNames[name];

		log(name + ': ' + t + 'ms');
	};


	return {
		// Implemented methods
		log: log, 
		debug: debug, 
		info: info, 
		warn: warn, 
		error: error, 

		assert: assert, 

		time: timeStart, 
		timeEnd: timeEnd, 

		// Not implemented methods
		clear: function() {}, 

		dir: function() {}, 
		dirxml: function() {}, 

		group: function() {}, 
		groupCollapsed: function() {}, 
		groupEnd: function() {}, 

		profile: function() {}, 
		profileEnd: function() {}, 

		table: function() {}, 

		trace: function() {}, 

		// Customizing the console
		fn: {
			isFormat: isFormat, 
			format: format, 
			inspect: inspect, 
			print: print, 
			space: 4,
			deep: 5,
			proto: 0,
			func: 0,
			separator: ' '
		}
	};

})();

if ( typeof exports != "undefined" ) {
	exports.console = console;
}
