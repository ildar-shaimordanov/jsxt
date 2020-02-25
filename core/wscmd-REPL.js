//
// Code processor: REPL
// This script is the part of the wscmd
//
// Copyright (c) 2019, 2020 by Ildar Shaimordanov
//

var REPL = function(modules, vars, begin, beginfile, main, endfile, end, files, inLoop, quiet, dryRun) {
	if ( ! WScript.FullName.match(/cscript/i) ) {
		WScript.Echo('REPL works with cscript only');
		WScript.Quit();
	}

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

	eval(modules);
	eval(vars);

	while ( true ) {

		try {

			(function(e, r, j, result) {
				/*
				A user can modify the codes of these methods so
				to prevent the script malfunctioning we have
				to keep their original codes and restore them later
				*/
				eval = e;
				String.prototype.replace = r;
				Array.prototype.join = j;

				if ( result === void 0 ) {
					return;
				}
				if ( typeof result == 'object' && typeof console != 'undefined' && typeof console.log == 'function' ) {
					console.log(result);
				} else {
					WScript.Echo(result);
				}
			})(
			eval,
			String.prototype.replace,
			Array.prototype.join,
			eval((function(PS1, PS2) {

				if ( quiet ) {
					PS1 = '';
					PS2 = '';
				} else {
					PS1 = 'wscmd/js > ';
					PS2 = 'wscmd/js :: ';
				}

				/*
				The eval.history can be changed by the user as he
				can. We should prevent a concatenation with the one
				of the empty values such as undefined, null, etc.
				*/
				if ( ! eval.history || ! ( eval.history instanceof Array ) ) {
					eval.history = [];
				}

				/*
				The eval.number can be changed by the user as he can.
				We should prevent an incrementing of non-numeric values.
				*/
				if ( ! eval.number || typeof eval.number != 'number' ) {
					eval.number = 0;
				}

				/*
				The line consisting of two colons only switches the
				multiline mode. The first entry of double colons
				means turn on the multiline mode. The next entry
				turns off. In the multiline mode it's possible to
				type a code of few lines without inpterpreting.
				*/
				var multiline = false;

				/*
				Store all input lines.
				*/
				var inputs = [];
				var result = '';

				WScript.StdOut.Write(PS1);

				while ( true ) {

					// One entered line as an array of characters
					var input;

					try {
						eval.number++;
						input = WScript.StdIn.ReadLine();
					} catch (ERROR) {
						input = 'WScript.Quit()';
					}

					if ( input == '::' ) {
						input = '';
						multiline = ! multiline;
					}

					inputs[inputs.length] = input;

					if ( ! multiline ) {
						break;
					}

					WScript.StdOut.Write(PS2);

				} // while ( true )

				result = inputs.join('\n');
				result = result.replace(/^[\x00-\x20]+/, '');
				result = result.replace(/[\x00-\x20]+$/, '');

				if ( result == '' ) {
					return '';
				}

				eval.history[eval.history.length] = result;

				return result;

			})()));

		} catch (ERROR) {

			WScript.Echo(WScript.ScriptName 
				+ ': "<stdin>", line ' + eval.number
				+ ': ' + ERROR.name
				+ ': ' + ERROR.message);

		}

	} // while ( true )
};

REPL.dump = function(modules, vars, begin, beginfile, main, endfile, end, files, inLoop, quiet, dryRun) {
	var s = [];

	if ( modules ) {
		s.push(modules);
	}
	if ( vars ) {
		s.push(vars);
	}

	s.push('::while read');
	s.push('::eval');
	s.push('::print');
	s.push('::loop while');

	WScript.Echo(s.join('\n'));
};
