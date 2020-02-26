//
// Command Line processor
// This script is the part of the wscmd
//
// Copyright (c) 2019, 2020 by Ildar Shaimordanov
//

(function(Program, Runner, REPL) {

	var argv = [];

	function ShowVersion() {
		var me = WScript.ScriptName.replace(/(\.[^.]+\?)?\.[^.]+$/, '');
		var name = typeof NAME == 'string' ? NAME : me;
		var version = typeof VERSION == 'string' ? VERSION : '0.0.1';
		WScript.Echo(name + ' (' + me + '): Version ' + version
			+ '; ' + WScript.Name
			+ ': Version ' + WScript.Version
			+ ', Build ' + WScript.BuildVersion);
	}

	// Walk through all named and unnamed arguments because
	// we have to handle each of them even if they duplicate
	for (var i = 0; i < WScript.Arguments.length; i++) {

		var arg = WScript.Arguments.Item(i);

		var m;

		m = arg.match(/^\/h(?:elp)?$/i);
		if ( m ) {
			WScript.Arguments.ShowUsage();
			WScript.Quit();
		}

		m = arg.match(/^\/version$/i);
		if ( m ) {
			ShowVersion();
			WScript.Quit();
		}

		m = arg.match(/^\/dry-run$/i);
		if ( m ) {
			Program.dryRun = true;
			continue;
		}

		m = arg.match(/^\/q(?:uiet)?$/i);
		if ( m ) {
			Program.setQuiet();
			continue;
		}

		m = arg.match(/^\/use:(js|vbs)$/i);
		if ( m ) {
			Program.setEngine(m[1]);
			continue;
		}

		m = arg.match(/^\/m(?::(js|vbs))?:(.+)$/i);
		if ( m ) {
			Program.addModule(m[1], m[2]);
			continue;
		}

		m = arg.match(/^\/(let|set|get)(?::(js|vbs))?:(\w+)=(.*)$/i);
		if ( m ) {
			Program.addVar(m[2], m[3], m[4], m[1]);
			continue;
		}

		m = arg.match(/^\/(?:e|((?:begin|end)(?:file)?))(?::(js|vbs))?(?::(.*))?$/i);
		if ( m ) {
			Program.addCode(m[2], m[3], m[1]);
			continue;
		}

		m = arg.match(/^\/([np])$/i);
		if ( m ) {
			Program.setMode(m[1]);
			continue;
		}

		argv.push(arg);

	}

	Program.detectScriptFile(argv);

	Runner(Program, argv);

})(Program, Runner, REPL);
