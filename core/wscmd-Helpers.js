//
// Set of useful and convenient definitions
// This script is the part of the wscmd
//
// Copyright (c) 2019, 2020 by Ildar Shaimordanov
//

var STDIN = WScript.StdIn;
var STDOUT = WScript.StdOut;
var STDERR = WScript.StdErr;

var usage = help = (function() {
	var helpMsg = [
		  'Commands                 Descriptions'
		, '========                 ============'
		, 'usage(), help()          Display this help'
		, 'echo(), print(), alert() Print expressions'
		, 'quit(), exit()           Quit this shell'
		, 'cmd(), shell()           Run a DOS-session'
		, 'sleep(n)                 Sleep n milliseconds'
		, 'clip()                   Get from the clipboard data formatted as text'
		, 'gc()                     Run the JScript garbage collector'
	].join('\n');

	return function() {
		WScript.Echo(helpMsg);
	};
})();

var echo = print = alert = (function() {
	var slice = Array.prototype.slice;

	return function() {
		WScript.Echo(slice.call(arguments));
	};
})();

var quit = exit = function(exitCode) {
	WScript.Quit(exitCode);
};

var cmd = shell = function() {
	var shell = new ActiveXObject('WSCript.Shell');
	shell.Run('%COMSPEC%');
};

var sleep = function(time) {
	return WScript.Sleep(time);
};

var clip = function() {
	return new ActiveXObject('htmlfile').parentWindow.clipboardData.getData('Text');
};

var gc = CollectGarbage;

if ( typeof exports != "undefined" ) {
	exports.stdin = stdin;
	exports.stdout = stdout;
	exports.stderr = stderr;

	exports.usage = usage;
	exports.help = help;

	exports.echo = echo;
	exports.alert = alert;
	exports.print = print;

	exports.quit = quit;
	exports.exit = exit;

	exports.cmd = cmd;
	exports.shell = shell;

	exports.sleep = sleep;
	exports.clip = clip;
	exports.gc = gc;
}
