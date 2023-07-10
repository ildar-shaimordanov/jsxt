//
// Set of useful and convenient definitions
// This script is the part of the wsx
//
// Copyright (c) 2019, 2020 by Ildar Shaimordanov
//

var FSO = new ActiveXObject('Scripting.FileSystemObject');

var SHELL = new ActiveXObject('WScript.Shell');

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
		, 'exec()                   Run a command in a child shell'
		, '                         (callback handles StdIn/StdOut/StdErr)'
		, 'sleep(n)                 Sleep n milliseconds'
		, 'clip()                   Read from or write to clipboard'
		, 'enableVT()               Enable VT globally, for all outputs'
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

var exec = function(command, cb) {
	var shell = new ActiveXObject('WScript.Shell');
	var proc = shell.Exec(command);

	if ( cb === true ) {
		cb = function(proc) {
			WScript.Sleep(50);
		}
	}

	if ( typeof cb == 'number' && cb > 0 ) {
		var timeout = cb;
		cb = function(proc) {
			WScript.Sleep(timeout);
		};
	}

	if ( typeof cb != 'function' ) {
		return proc;
	}

	while ( proc.Status == 0 ) {
		cb(proc);
	}
};

var sleep = function(time) {
	return WScript.Sleep(time);
};

var clip = function(text) {
	return text === undefined ? clip.paste() : clip.copy(text);
}

clip.copyUsingMsie = function(text) {
	// Borrowed from https://stackoverflow.com/a/16216602/3627676
	var msie = new ActiveXObject('InternetExplorer.Application');
	msie.Silent = true;
	msie.Visible = false;
	msie.Navigate('about:blank');

	// Wait until MSIE ready
	while ( msie.ReadyState != 4 ) {
		WScript.Sleep(50);
	}

	// Wait until document loaded
	while ( msie.document.readyState != 'complete' ) {
		WScript.Sleep(50);
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

clip.copyUsingFile = function(text) {
	var fso = new ActiveXObject('Scripting.FileSystemObject');
	var shell = new ActiveXObject('WScript.Shell');
	var env = shell.Environment('PROCESS');

	// theoretically can be changed, but anyway we keep it here
	var tmpdir = env.Item('TEMP');
	//var tmpdir = '.'; // for testing

	// computed every time
	var tmpfile = tmpdir + '/.clip.' + new Date().getTime();
	var cmdline = 'cmd /c clip < "' + tmpfile + '"';

	// open a file for writing
	// create, if it doesn't exist
	// use the system default
	var f = fso.OpenTextFile(tmpfile, 2, true, -2);
	f.Write(text);
	f.Close();

	var proc = shell.Exec(cmdline);
	while ( proc.Status == 0 ) {
		WScript.Sleep(50);
	}

	fso.DeleteFile(tmpfile, true);
};

clip.copy = clip.copyUsingFile;

clip.paste = function() {
	return new ActiveXObject('htmlfile')
	.parentWindow
	.clipboardData
	.getData('Text');
};

var enableVT = (function() {
	var colorsEnabled = false;

	return function() {
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

		if ( typeof util.enableColors == 'function' ) {
			util.enableColors(true);
		}

		if ( typeof util.inspect == 'function'
		&& util.inspect.defaultOptions != null ) {
			util.inspect.defaultOptions.colors = true;
		}
	};
})();

if ( typeof exports != "undefined" ) {
	exports.FSO = FSO;
	exports.SHELL = SHELL;
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
	exports.exec = exec;

	exports.sleep = sleep;
	exports.clip = clip;
	exports.enableVT = enableVT;
}
