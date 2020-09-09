//
// Set of useful and convenient definitions
// This script is the part of the wsx
//
// Copyright (c) 2019, 2020 by Ildar Shaimordanov
//

var FSO = new ActiveXObject('Scripting.FileSystemObject');

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
		, 'cmd(), shell()           Run a command or DOS-session'
		, 'sleep(n)                 Sleep n milliseconds'
		, 'clip()                   Read from or write to clipboard'
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

var cmd = shell = function(command) {
	var shell = new ActiveXObject('WScript.Shell');
	shell.Run(command || '%COMSPEC%');
};

var sleep = function(time) {
	return WScript.Sleep(time);
};

var clip = function(text) {
	if ( typeof text == 'undefined' ) {
		return new ActiveXObject('htmlfile').parentWindow.clipboardData.getData('Text');
	}

	// Validate a value is integer in the range 1..100
	// Otherwise, defaults to 20
	var clamp = function(x) {
		x = Number(x);
		if ( isNaN(x) || x < 1 || x > 100 ) {
			x = 20;
		}
		return x;
	};

	var WAIT1 = clamp(clip.WAIT_READY);
	var WAIT2 = clamp(clip.WAIT_LOADED);

	// Borrowed from https://stackoverflow.com/a/16216602/3627676
	var msie = new ActiveXObject('InternetExplorer.Application');
	msie.silent = true;
	msie.Visible = false;
	msie.Navigate('about:blank');

	// Wait until MSIE ready
	while ( msie.ReadyState != 4 ) {
		WScript.Sleep(WAIT1);
	}

	// Wait until document loaded
	while ( msie.document.readyState != 'complete' ) {
		WScript.Sleep(WAIT2);
	}

	msie.document.body.innerHTML = '<textarea id="area" wrap="off" />';
	var area = msie.document.getElementById('area');
	area.value = text;
	area.select();
	area = null;

	// 12 - "Edit" menu, "Copy" command
	//  0 - the default behavior
	msie.ExecWB(12, 0);
	msie.Quit();
	msie = null;
};

var gc = CollectGarbage;

if ( typeof exports != "undefined" ) {
	exports.FSO = FSO;
	exports.STDIN = STDIN;
	exports.STDOUT = STDOUT;
	exports.STDERR = STDERR;

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