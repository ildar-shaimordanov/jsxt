//
// Code processor: REPL
// This script is the part of the wscmd
//
// Copyright (c) 2019, 2020 by Ildar Shaimordanov
//

var REPL = function(modules, vars, begin, beginfile, main, endfile, end, files, inLoop, quiet, dryRun) {
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

	if ( typeof console != 'undefined' && console.fn && typeof console.fn.inspect == 'function' ) {
		eval.inspect = console.fn.inspect;
	}

	while ( true ) {

		try {

			(function(e, r, result) {
				/*
				A user can modify the codes of these methods so
				to prevent the script malfunctioning we have
				to keep their original codes and restore them later
				*/
				eval = e;
				String.prototype.replace = r;

				if ( result === void 0 ) {
					return;
				}
				if ( typeof eval.inspect == 'function' && typeof result == 'object' ) {
					result = eval.inspect(result);
				}
				WScript.Echo(result);
			})(
			eval,
			String.prototype.replace,
			eval((function(PS1, PS2) {

				if ( quiet ) {
					PS1 = '';
					PS2 = '';
				} else {
					PS1 = 'wscmd > ';
					PS2 = 'wscmd :: ';
				}

				/*
				The eval.history can be changed by the user as he
				can. We should prevent a concatenation with the one
				of the empty values such as undefined, null, etc.
				*/
				if ( ! eval.history || typeof eval.history != 'string' ) {
					eval.history = '';
				}

				/*
				The eval.number can be changed by the user as he
				can. We should prevent an incrementing of
				non-numeric values.
				*/
				if ( ! eval.number || typeof eval.number != 'number' ) {
					eval.number = 0;
				}

				/*
				The line consisting of two colons only switch the
				multiline mode. The first entry of double colons
				means turn on the multiline mode. The next entry
				turns off. In the multiline mode it's possible to
				type a code of few lines without inpterpreting.
				*/
				var multiline = false;

				/*
				Store all characters entered from STDIN. Array is
				used to prevent usage of String.charAt that can be
				overridden. This makes the code safer.
				*/
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

					// Add the new line character in the multiline mode
					if ( result ) {
						result += '\n';
					}

					result += input;

					if ( ! multiline ) {
						break;
					}

					WScript.StdOut.Write(PS2);

				} // while ( true )

				result = result.replace(/^[\x00-\x20]+/, '');
				result = result.replace(/[\x00-\x20]+$/, '');

				if ( result == '' ) {
					return '';
				}

				if ( eval.history ) {
					eval.history += '\n';
				}

				eval.history += result;

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
