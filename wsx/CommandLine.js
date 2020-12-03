//
// Command Line processor
// This script is the part of the wsx
//
// Copyright (c) 2019, 2020 by Ildar Shaimordanov
//

(function(Program) {

	var argv = [];

	// Walk through all named and unnamed arguments because
	// we have to handle each of them even if they duplicate
	for (var i = 0; i < WScript.Arguments.length; i++) {

		var arg = WScript.Arguments.Item(i);

		var m;

		m = arg.match(/^\/h(?:elp)?$/i);
		if ( m ) {
			Program.showHelp();
			WScript.Quit();
		}

		m = arg.match(/^\/version$/i);
		if ( m ) {
			Program.showVersion();
			WScript.Quit();
		}

		m = arg.match(/^\/check$/i);
		if ( m ) {
			Program.check = true;
			continue;
		}

		m = arg.match(/^\/q(?:uiet)?$/i);
		if ( m ) {
			Program.quiet = true;
			continue;
		}

		m = arg.match(/^\/use:(js|vbs)$/i);
		if ( m ) {
			Program.engine = m[1];
			continue;
		}

		m = arg.match(/^\/m(?::(js|vbs))?:(.+)$/i);
		if ( m ) {
			Program.addModule(m[1], m[2]);
			continue;
		}

		m = arg.match(/^\/(let|set|get|re)(?::(js|vbs))?:(\w+)=(.*)$/i);
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
			Program.setInLoop(m[1]);
			continue;
		}

		/*
		This looks like ugly, but it works and reliable enough to
		stop looping over the rest of the CLI options. From this
		point we allow end users to specify their own options even,
		if their names intersect with names of our options.
		*/
		break;

	}

	for ( ; i < WScript.Arguments.length; i++) {
		var arg = WScript.Arguments.Item(i);
		argv.push(arg);
	}

	Program.detectScriptFile(argv);

	Program.run(argv);

})(Program);
