//
// Code processor: REPL
// This script is the part of the wsx
//
// Copyright (c) 2019, 2020 by Ildar Shaimordanov
//

var REPL = function() {
	if ( ! WScript.FullName.match(/cscript.exe$/i) ) {
		WScript.Echo('REPL works with cscript only');
		WScript.Quit();
	}

	while ( true ) {

		try {

			(function(storage, result) {
				/*
				A user can modify the codes of these methods so
				to prevent the script malfunctioning we have
				to keep their original codes and restore them later
				*/
				eval = storage.eval;
				REPL = storage.REPL;

				if ( result === void 0 ) {
					return;
				}

				if ( typeof result != 'string'
				&& console && typeof console == 'object'
				&& typeof console.log == 'function' ) {
					console.log(result);
				} else {
					WScript.StdOut.WriteLine('' + result);
				}
			})({
				eval: eval,
				REPL: REPL
			},
			eval((function(PS1, PS2) {

				if ( REPL.quiet ) {
					PS1 = '';
					PS2 = '';
				} else {
					var me = WScript.ScriptName;
					PS1 = me + ' js > ';
					PS2 = me + ' js :: ';
				}

				/*
				The REPL.history can be changed by the user as he
				can. We should prevent a concatenation with the one
				of the empty values such as undefined, null, etc.
				*/
				if ( ! REPL.history || ! ( REPL.history instanceof [].constructor ) ) {
					REPL.history = [];
				}

				/*
				The REPL.number can be changed by the user as he can.
				We should prevent an incrementing of non-numeric values.
				*/
				if ( ! REPL.number || typeof REPL.number != 'number' ) {
					REPL.number = 0;
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
				Storages for:
				-- one input line
				-- one or more input lines as array
				   (more than one are entered in multiline mode)
				-- the resulting string of all entered lines
				   (leading and trailing whitespaces are trimmed)
				*/
				var input = [];
				var inputs = [];
				var result = '';

				WScript.StdOut.Write(PS1);

				while ( true ) {

					try {
						REPL.number++;
						input = [];
						while ( ! WScript.StdIn.AtEndOfLine ) {
							input[input.length] = WScript.StdIn.Read(1);
						}
						WScript.StdIn.ReadLine();
					} catch (ERROR) {
						input = [ 'WScript.Quit()' ];
					}

					if ( input.length == 2 && input[0] + input[1] == '::' ) {
						input = [];
						multiline = ! multiline;
					}

					if ( inputs.length ) {
						inputs[inputs.length] = '\n';
					}
					for (var i = 0; i < input.length; i++) {
						inputs[inputs.length] = input[i];
					}

					if ( ! multiline ) {
						break;
					}

					WScript.StdOut.Write(PS2);

				} // while ( true )

				// Trim left
				var k = 0;
				while ( inputs[k] <= ' ' ) {
					k++;
				}
				// Trim right
				var m = inputs.length - 1;
				while ( inputs[m] <= ' ' ) {
					m--;
				}

				var result = '';
				for (var i = k; i <= m; i++) {
					result += inputs[i];
				}

				if ( result == '' ) {
					return '';
				}

				REPL.history[REPL.history.length] = result;

				return result;

			})()));

		} catch (ERROR) {

			WScript.StdErr.WriteLine(WScript.ScriptName
				+ ': "<stdin>", line ' + REPL.number
				+ ': ' + ERROR.name
				+ ': ' + ERROR.message);

		}

	} // while ( true )
};
