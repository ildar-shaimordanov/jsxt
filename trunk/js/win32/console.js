//
// console.js
// Imitation of the Firebug console in Windows Scripting Host
//
// Copyright (c) 2012 by Ildar Shaimordanov
//

/*

The module adds the useful Firebug console features to WSH

You can use "console.log(), console.debug(), ..." the same way you used it 
with Firebug. 

The following functions are not implemented:
	console.clear, 
	console.dir, console.dirxml, 
	console.group, console.groupEnd, 
	console.profile, console.profileEnd, 
	console.trace, 
	console.timeStamp

Log messages with custom icon depending on the function used.
	console.log(object[, object, ...])
	console.debug(object[, object, ...])
	console.info(object[, object, ...])
	console.warn(object[, object, ...])
	console.error(object[, object, ...])

Test if the expression is true. If so, the info is logged in the console
	console.assert(expression[, object, ...])

Starts and stops a timer and writes the time elapsed
	console.time(name)
	console.timeEnd(name)

Customizing of the console
	console.$

Checks that the object is a formatting string
	console.$.isFormat(object)

The simplest formatting function immitating java-like format
	console.$.format(pattern, objects)

Details for the complex object
	console.$.inspect(object)

The user-defined printing function
	console.$.print(msgType, msg)

The string to glue the set of arguments when output them
	console.$.separator = ' '

*/

(function()
{

	// Be sure to prevent defining it twice
	if ( this.console && console.$ ) {
		return;
	}


	// The main object
	this.console = {};


	// This regular expression is used to recongnize a formatting 
	// string and prints in the java-like format "{n}"
	var reFormat = /\{(\d+)\}/g;

	// Checks that the object is a formatting string
	var isFormat = function(object)
	{
		return typeof object == 'string' && object.match(reFormat);
	};

	// The simplest formatting function immitating java-like format
	var format = function(pattern, objects)
	{
		return pattern.replace(reFormat, function($0, $1)
		{
			return objects[$1];
		});
	};

	// Details for the complex object
	var inspect = function(object)
	{
		return object;
	};

	// The printing function
	var print = function(msgType, msg)
	{
		WScript.Echo(msg);
	};


	// The core function
	var printMsg = function(msgType, objects)
	{
		// Get the actual configuration of the console
		var $ = console.$;
		var sep = $.separator || ' ';

		var result;

		if ( $.isFormat(objects[0]) ) {
			result = $.format(objects[0], Array.prototype.slice.call(objects, 1));
		} else {
			result = [];
			for (var i = 0; i < objects.length; i++) {
				result.push($.inspect(objects[i]));
			}
			result = result.join(sep);
		}

		$.print(msgType, result);
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


	// If the expression is true, the rest of arguments will be logged in 
	// the console
	var assert = function(expr)
	{
		if ( ! expr ) {
			return;
		}
		log.apply(null, Array.prototype.slice.call(arguments, 1));
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

		trace: noop, 

		timeStamp: noop, 

		// Customizing of the console
		$: {
			isFormat: isFormat, 
			format: format, 
			inspect: inspect, 
			print: print, 
			separator: ' '
		}
	};

})();

