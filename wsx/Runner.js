//
// Code processor: Runner
// This script is the part of the wsx
//
// Copyright (c) 2019, 2020 by Ildar Shaimordanov
//

var Runner = function(Program, argv) {
	if ( Program.check ) {
		Runner.showPseudoCode(Program);
		return;
	}

	var modules = Program.modules.join(';\n');
	var vars = Program.vars.join(';\n');
	var script = Program.script.join(';\n');
	var begin = Program.begin.join(';\n');
	var beginfile = Program.beginfile.join(';\n');
	var main = Program.main.join(';\n');
	var endfile = Program.endfile.join(';\n');
	var end = Program.end.join(';\n');

	/*
	The following variables are declared without the keyword "var". So
	they become global and available for all codes in JScript and VBScript.
	*/

	// Helper to simplify VBS importing
	USE = CreateImporter();

	// Keep a last exception
	ERROR = null;

	// Reference to CLI arguments
	ARGV = argv;

	/*
	Load provided modules
	Set user-defined variables
	*/
	eval(modules);
	eval(vars);

	if ( Program.script.length ) {
		/*
		Load and run the external script and do nothing more.
		*/
		eval(script);
		return;
	}

	if ( Program.main.length == 0 && ! Program.inLoop ) {
		/*
		Run REPL
		*/
		REPL.quiet = Program.quiet;
		REPL();
		return;
	}

	if ( ! Program.inLoop ) {
		/*
		Load the main script and do nothing more.
		*/
		eval(main);
		return;
	}

	// The currently open stream
	STREAM = null;

	// The current filename, file format and file number
	FILE = '';
	FILEFMT = 0;

	// The current line read from the stream
	LINE = '';

	// The line number in the current file
	FLN = 0;

	// The total line number
	LN = 0;

	// Emulate the "continue" operator
	next = function() {
		throw new EvalError('next');
	};

	// Emulate the "break" operator
	last = function() {
		throw new EvalError('last');
	};

	/*
	Execute the code before starting to process any file.
	This is good place to initialize.
	*/
	eval(begin);

	if ( ! ARGV.length ) {
		ARGV.push('con');
	}

	while ( ARGV.length ) {
		FILE = ARGV.shift();

		var m = FILE.match(/^\/f:(ascii|unicode|default)$/i);

		if ( m ) {
			var fileFormats = { ascii: 0, unicode: -1, 'default': -2 };
			FILEFMT = fileFormats[ m[1] ];
			continue;
		}

		FLN = 0;

		/*
		Execute the code before starting to process the file.
		We can do here something while the file is not opened.
		*/
		eval(beginfile);

		try {
			STREAM = FILE.toLowerCase() == 'con'
				? STDIN
				: FSO.OpenTextFile(FILE, 1, false, FILEFMT);
		} catch (ERROR) {
			WScript.Echo(ERROR.message + ': ' + FILE);
			continue;
		}

		/*
		Prevent failure of reading out of STDIN stream
		The real exception number is 800a005b (-2146828197)
		"Object variable or With block variable not set"
		*/
		//// NEED MORE INVESTIGATION
		//try {
		//	stream.AtEndOfStream;
		//} catch (ERROR) {
		//	WScript.StdErr.WriteLine('Out of stream: ' + file);
		//	continue;
		//}

		while ( ! STREAM.AtEndOfStream ) {
			FLN++;
			LN++;

			LINE = STREAM.ReadLine();

			/*
			Execute the main code per each input line.
			*/
			try {
				eval(main);
			} catch (ERROR) {
				if ( ERROR instanceof EvalError && ERROR.message == 'next' ) {
					continue;
				}
				if ( ERROR instanceof EvalError && ERROR.message == 'last' ) {
					break;
				}
				throw ERROR;
			}

			if ( Program.inLoop == 2 ) {
				WScript.Echo(LINE);
			}
		}

		if ( STREAM != STDIN ) {
			STREAM.Close();
		}

		/*
		Execute the code when the file is already closed. We can do
		some finalization (i.e.: print the number of lines in the file).
		*/
		eval(endfile);
	}

	/*
	Execute the code when everything is completed.
	We can finalize the processing (i.e.: print the total number of lines).
	*/
	eval(end);
};

Runner.showPseudoCode = function(Program) {
	var s = [];

	s.push.apply(s, Program.modules);
	s.push.apply(s, Program.vars);

	if ( Program.script.length ) {
		// wsx scriptfile
		s.push.apply(s, Program.script);
	} else if ( Program.main.length == 0 && Program.inLoop == false ) {
		// wsx [/q[uiet]]
		s.push.apply(s, [
			'::while read',
			'::eval',
			'::print',
			'::loop while'
		]);
	} else if ( ! Program.inLoop ) {
		// wsx /e:"..."
		s.push.apply(s, Program.main);
	} else {
		// wsx /n
		// wsx /p
		s.push.apply(s, Program.begin);

		if ( Program.inLoop ) {
			s.push('::foreach FILE do');
			s.push.apply(s, Program.beginfile);
			s.push('::while read LINE do');
		}

		s.push.apply(s, Program.main);

		if ( Program.inLoop == 2 ) {
			s.push('::print LINE');
		}

		if ( Program.inLoop ) {
			s.push('::loop while');
			s.push.apply(s, Program.endfile);
			s.push('::loop foreach');
		}

		s.push.apply(s, Program.end);
	}

	WScript.Echo(s.join('\n'));
};
