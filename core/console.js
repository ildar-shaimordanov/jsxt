//
// console.js
//
// A debugging console similar to the JavaScript console provided by
// NodeJS and web-browsers.
//
// The module exports the limited set of the methods:
//
// console.log
// console.debug
// console.info
// console.warn
// console.error
// console.assert
// console.time
// console.timeEnd
// console.timeLog
//
// Copyright (c) 2012, 2013, 2019-2022 by Ildar Shaimordanov
//

var console = console || (function() {

	var arraySlice = Array.prototype.slice;

	// The low-level printing function for CScript host
	function printCScript(streamId, msgType, msg) {
		WScript[streamId].WriteLine(msg);
	}

	// The low-level printing function for WScript host
	function printWScript(streamId, msgType, msg) {
		WScript.Echo(msg);
	}

	// The low-level printing function
	var printEngine = WScript.FullName.match(/cscript.exe$/i)
		? printCScript
		: printWScript;

	// The core function
	function printMsg(streamId, msgType, args) {
		args = arraySlice.call(args);
		args.unshift(util.inspect.defaultOptions);

		var result = util.formatWithOptions.apply(null, args);
		printEngine(streamId, msgType, result);
	}


	function log() {
		printMsg('StdOut', 0, arguments);
	}

	function debug() {
		printMsg('StdOut', 1, arguments);
	}

	function info() {
		printMsg('StdOut', 2, arguments);
	}

	function warn() {
		printMsg('StdErr', 3, arguments);
	}

	function error() {
		printMsg('StdErr', 4, arguments);
	}


	// If the expression is falsy, the rest of arguments will be
	// displayed to STDERR
	function assert(expr) {
		if ( expr ) {
			return;
		}

		var args = arraySlice.call(arguments, 1);
		args[0] = 'Assertion failed' + (
			args.length == 0 ? '' : ': ' + args[0]
		);

		warn.apply(null, args);
	}


	// Processing start/stop timers
	var timers = {};

	function timeStart(name) {
		name = name || 'default';

		if ( name in timers ) {
			throw new Error('Label "' + name + '" already in use');
		}

		timers[name] = new Date();
	}

	function timeEnd(name) {
		name = name || 'default';

		if ( ! ( name in timers ) ) {
			throw new Error('Label "' + name + '" not in use');
		}

		var t = new Date() - timers[name];
		delete timers[name];

		log('%s: %dms', name, t);
	}

	function timeLog(name) {
		name = name || 'default';

		if ( ! ( name in timers ) ) {
			throw new Error('Label "' + name + '" not in use');
		}

		var t = new Date() - timers[name];

		var args = arraySlice.call(arguments, 1);
		args = [ '%s: %dms', name, t ].concat(args);

		log.apply(null, args);
	}


	function notImplemented() {
		throw new Error('Function not implemented');
	}


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
		timeLog: timeLog,

		// Not implemented methods
		clear: notImplemented,

		dir: notImplemented,
		dirxml: notImplemented,

		group: notImplemented,
		groupCollapsed: notImplemented,
		groupEnd: notImplemented,

		profile: notImplemented,
		profileEnd: notImplemented,

		table: notImplemented,

		trace: notImplemented
	};

})();

if ( typeof module != "undefined" ) {
	module.exports = console;
}
