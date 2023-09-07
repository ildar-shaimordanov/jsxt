//
// Set of useful and convenient definitions
// This script is the part of the wsx
//
// Copyright (c) 2019, 2020-2023 by Ildar Shaimordanov
//

// Common purpose objects

var FSO = new ActiveXObject('Scripting.FileSystemObject');

var SHELL = new ActiveXObject('WScript.Shell');

var STDIN = WScript.StdIn;
var STDOUT = WScript.StdOut;
var STDERR = WScript.StdErr;

// Execution controlling

function exit(exitCode) {
	WScript.Quit(exitCode || 0);
}

function sleep(timeout) {
	WScript.Sleep(timeout);
}

function cmd(command) {
	var shell = new ActiveXObject('WScript.Shell');
	shell.Run(command || '%COMSPEC%');
}

function exec(command, cb) {
	if ( typeof cb == 'number' && cb > 0 ) {
		var timeout = cb;
		cb = function(proc) {
			WScript.Sleep(timeout);
		}
	}

	var shell = new ActiveXObject('WScript.Shell');
	var proc = shell.Exec(command);

	if ( typeof cb != 'function' ) {
		return proc;
	}

	while ( proc.Status == 0 ) {
		cb(proc);
	}
}

var enableVT = (function() {
	var colorsEnabled = false;

	return function enableVT() {
		if ( colorsEnabled ) {
			return;
		}

		colorsEnabled = true;

		// The trick is borrowed from this thread:
		// https://www.dostips.com/forum/viewtopic.php?p=63393#p63393

		var shell = new ActiveXObject('WScript.Shell');
		var proc = shell.Exec('powershell -nop -ep bypass -c exit');

		while ( proc.Status == 0 ) {
			WScript.Sleep(50);
		}

		// Ugly but reliable from user perspective, because we
		// are sure that nothing fails and user's settings are
		// not overwritten.

		if ( typeof util == 'undefined' ) {
			return;
		}

		if ( util === null ) {
			return;
		}

		if ( typeof util.inspect != 'function' ) {
			return;
		}

		if ( typeof util.inspect.enableColors == 'function' ) {
			util.inspect.enableColors(true);
		}

		if ( util.inspect.defaultOptions != null ) {
			util.inspect.defaultOptions.colors = true;
		}
	};
})();

// Displaying: common usage

var printTo = (function() {
	function printCScript(id, msg) {
		WScript[id].WriteLine(msg);
	}

	function printWScript(id, msg) {
		WScript.Echo(msg);
	}

	return /cscript\.exe$/i.test(WScript.FullName)
		? printCScript
		: printWScript;
})();

function print() {
	printTo('StdOut', Array.prototype.slice.call(arguments));
}

function warn() {
	printTo('StdErr', Array.prototype.slice.call(arguments));
}

function sprintf(format) {
	var args = arguments;
	var i = 0;
	return format.replace(/%[%s]/g, function($0) {
		return $0 == '%%' ? '%' : '' + args[++i];
	});
}

// Clipboard processing

var clip = function(text) {
	return text === undefined ? clip.paste() : clip.copy(text);
}

clip.paste = function() {
	return new ActiveXObject('htmlfile')
	.parentWindow
	.clipboardData
	.getData('Text');
};

clip.copy = function(text, opts) {
	var useMsie = opts && opts.useMsie
	|| clip.copyOptions && clip.copyOptions.useMsie;

	clip[useMsie ? 'copyUsingMsie' : 'copyUsingFile'](text, opts);
};

clip.copyOptions = {
	msieSilent: true,
	msieVisible: false,
	msieReadyTimeout: 50,
	msieLoadedTimeout: 50,

	fileTempDir: '',
	fileOpenMode: -2,
	fileExecTimeout: 50,
	fileDontDelete: false,

	useMsie: false
};

clip.copyUsingMsie = function(text, opts) {
	opts = opts || clip.copyOptions || {};

	// Borrowed from https://stackoverflow.com/a/16216602/3627676
	var msie = new ActiveXObject('InternetExplorer.Application');
	msie.Silent = 'msieSilent' in opts ? opts.msieSilent : true;
	msie.Visible = !! opts.msieVisible;
	msie.Navigate('about:blank');

	// Wait until MSIE ready
	while ( msie.ReadyState != 4 ) {
		WScript.Sleep(opts.msieReadyTimeout || 50);
	}

	// Wait until document loaded
	while ( msie.document.readyState != 'complete' ) {
		WScript.Sleep(opts.msieLoadedTimeout || 50);
	}

	msie.document.body.innerHTML = '<textarea id="area" wrap="off" />';
	var area = msie.document.getElementById('area');
	area.value = text;
	area.select();
	area = null;

	msie.document.execCommand('copy');

	msie.Quit();
	msie = null;
};

clip.copyUsingFile = function(text, opts) {
	opts = opts || clip.copyOptions || {};

	var fso = new ActiveXObject('Scripting.FileSystemObject');
	var shell = new ActiveXObject('WScript.Shell');
	var env = shell.Environment('PROCESS');

	// computed every time
	var tmpdir = opts.fileTempDir || env.Item('TEMP');
	var tmpfile = tmpdir + '/.clip.' + new Date().getTime();
	var cmdline = 'cmd /c clip < "' + tmpfile + '"';

	// open a temp file for writing (2)
	// create, if it doesn't exist (true)
	// use the system default mode (-2)
	var m = 'fileOpenMode' in opts ? opts.fileOpenMode : -2;
	var f = fso.OpenTextFile(tmpfile, 2, true, m);
	f.Write(text);
	f.Close();

	// read the temp file using clip, the external utility
	var proc = shell.Exec(cmdline);
	while ( proc.Status == 0 ) {
		WScript.Sleep(opts.fileExecTimeout || 50);
	}

	opts.fileDontDelete || fso.DeleteFile(tmpfile, true);
};

if ( typeof exports != "undefined" ) {
	exports.FSO = FSO;
	exports.SHELL = SHELL;
	exports.STDIN = STDIN;
	exports.STDOUT = STDOUT;
	exports.STDERR = STDERR;

	exports.exit = exit;
	exports.sleep = sleep;
	exports.cmd = cmd;
	exports.exec = exec;
	exports.enableVT = enableVT;

	exports.printTo = printTo;
	exports.print = print;
	exports.warn = warn;
	exports.sprintf = sprintf;

	exports.clip = clip;
}
