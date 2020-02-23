//
// Code processor: Runner
// This script is the part of the wscmd
//
// Copyright (c) 2019, 2020 by Ildar Shaimordanov
//

var Runner = function(modules, vars, begin, beginfile, main, endfile, end, files, inLoop, quiet, dryRun) {
	/*
	The following variables are declared without the keyword "var". So
	they become global and available for all codes in JScript and VBScript.
	*/

	// Helper to simplify VBS importing
	USE = CreateImporter();

	// Keep a last exception
	ERROR = null;

	// Useful variables
	FSO = new ActiveXObject('Scripting.FileSystemObject');

	STDIN = WScript.StdIn;
	STDOUT = WScript.StdOut;
	STDERR = WScript.StdErr;

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
	Load provided modules
	Set user-defined variables
	*/
	eval(modules);
	eval(vars);

	if ( ! inLoop ) {
		/*
		Initialize
		Run the script
		Finalize
		*/
		eval(begin);
		eval(main);
		eval(end);

		return;
	}

	/*
	Execute the code before starting to process any file.
	This is good place to initialize.
	*/
	eval(begin);

	if ( ! files.length ) {
		files.push(STDIN);
	}

	while ( files.length ) {
		FILE = files.shift();

		if ( typeof FILE == 'object' && ! ( FILE instanceof ActiveXObject ) ) {
			FILEFMT = FILE.format;
			continue;
		}

		FLN = 0;

		/*
		Execute the code before starting to process the file.
		We can do here something while the file is not opened.
		*/
		eval(beginfile);

		try {
			if ( FILE instanceof ActiveXObject ) {
				STREAM = FILE;
				FILE = '<stdin>';
			} else {
				STREAM = FSO.OpenTextFile(FILE, 1, false, FILEFMT);
			}
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

			if ( inLoop == 2 ) {
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

Runner.dump = function(modules, vars, begin, beginfile, main, endfile, end, files, inLoop, quiet, dryRun) {
	var s = [];

	if ( modules ) {
		s.push(modules);
	}
	if ( vars ) {
		s.push(vars);
	}

	if ( inLoop ) {
		if ( begin ) {
			s.push(begin);
		}
		s.push('::foreach FILE do');
		if ( beginfile ) {
			s.push(beginfile);
		}
		s.push('::while read LINE do');
	}

	if ( main ) {
		s.push(main);
	}

	if ( inLoop == 2 ) {
		s.push('::print LINE');
	}

	if ( inLoop ) {
		s.push('::loop while');
		if ( endfile ) {
			s.push(endfile);
		}
		s.push('::loop foreach');
		if ( end ) {
			s.push(end);
		}
	}

	WScript.Echo(s.join('\n'));
};
