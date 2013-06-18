//
// console.js
// Imitation of the Firebug console in the Windows Scripting Host console
//
// Copyright (c) 2012, 2013 by Ildar Shaimordanov
//

/*

The module adds the useful Firebug console features to WSH

You can use "console.log(), console.debug(), ..." the same way you use it 
with Firebug. 

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

Customizing of the console
	console.fn

Checks that the object is a formatting string
	console.fn.isFormat(object)

The simplest formatting function immitating C-like format
	console.fn.format(pattern, objects)

Details for the complex object
	console.fn.inspect(object)

The user-defined printing function
	console.fn.print(msgType, msg)

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

(function()
{

	// Be sure to prevent defining it twice
	if ( this.console && console.fn ) {
		return;
	}


	// The main object
	this.console = {};


	// Details for the complex object
	// If JSON object is defined JSON.stringify will be used
	var _inspect = typeof JSON != 'undefined' && typeof JSON.stringify == 'function' 
		? 
		function(object)
		{
			return object && typeof object == 'object' ? JSON.stringify(object) : object;
		} 
		: 
		function(object)
		{
			return object;
		};

	// This regular expression is used to recongnize a formatting string 
	var reFormat = /%%|%(\d+)?([idfxso])/g;

	// Checks that the object is a formatting string
	var _isFormat = function(object)
	{
		return String(object).match(reFormat);
	};

	var _formatters = {};
	_formatters.i = function(v) { return Number(v).toFixed(0); };
	_formatters.d = 
	_formatters.f = function(v) { return Number(v).toString(10); };
	_formatters.x = function(v) { return Number(v).toString(16); }, 
	_formatters.o = _inspect;
	_formatters.s = function(v) { return String(v); };

	// The formatting function immitating C-like "printf"
	var _format = function(pattern, objects)
	{
		var i = 0;
		return pattern.replace(reFormat, function(format, width, id)
		{
			if ( format == '%%' ) {
				return '%';
			}

			i++;

			var r = _formatters[id](objects[i]);

			return r;
		});
	};

	// The printing function
	var _print = function(msgType, msg)
	{
		WScript.Echo(msg);
	};


	// The core function
	var printMsg = function(msgType, objects)
	{
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


	var log = function()
	{
		printMsg(0, arguments);
	};

	var debug = log;

	var info = function()
	{
		printMsg(64, arguments);
	};

	var warn = function()
	{
		printMsg(48, arguments);
	};

	var error = function()
	{
		printMsg(16, arguments);
	};


	// If the expression is false, the rest of arguments will be logged in 
	// the console
	var assert = function(expr)
	{
		if ( expr ) {
			return;
		}
		error.apply(console, arguments.length < 2 ? ['Assertion error'] : Array.prototype.slice.call(arguments, 1));
	};


	// Processing of timers start/stop
	var timeNames = {};

	var timeStart = function(name)
	{
		if ( ! name ) {
			return;
		}

		timeNames[name] = new Date();
		log(name + ': Timer started');
	};

	var timeEnd = function(name)
	{
		if ( ! name || ! timeNames.hasOwnProperty(name) ) {
			return;
		}

		var t = new Date() - timeNames[name];
		delete timeNames[name];

		log(name + ': ' + t + 'ms');
	};


	// Stub for the non-implemented methods
	var noop = function()
	{
	};


	console = {
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
		clear: noop, 

		dir: noop, 
		dirxml: noop, 

		group: noop, 
		groupCollapsed: noop, 
		groupEnd: noop, 

		profile: noop, 
		profileEnd: noop, 

		table: noop, 

		trace: noop, 

		// Customizing of the console
		fn: {
			isFormat: _isFormat, 
			format: _format, 
			inspect: _inspect, 
			print: _print, 
			separator: ' '
		}
	};

})();

