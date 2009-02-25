
//*****************************************************************************
// Do not remove this notice.
//
// Copyright 2001 by Mike Hall.
// See http://www.brainjar.com for terms of use.
//
//*****************************************************************************

/**
 * Do not remove this notice too. :-)
 *
 * Copyright 2009 by Ildar Shaimordanov.
 *
 * Following my own habit of the namespace usage I have wrapped all functions
 * into the simply callable class. Also, in order to use this class as well as
 * in both JavaScript and JScript (WSH) I added a callback to output 
 * debugging information (step-by-step parsing visualization).
 */

/**
 * Obfuscator class for obfuscating of JavaScript and JScript codes
 *
 * @param	debugfunc	Callback outputing step-by-step information
 */
function Obfuscator(debugfunc)
{

	var self = this;

	/**
	 * Temporary storage of literal strings
	 *
	 * @var		Array
	 * @access	private
	 */
	var literalStrings;

	function replaceLiteralStrings(s)
	{
		var i, j, c, t, lines, escaped, quoteChar, inQuote, literal;

		literalStrings = new Array();
		t = "";

		// Split script into individual lines.

		lines = s.split("\n");
		for (i = 0; i < lines.length; i++) {
			j = 0;
			inQuote = false;
			while (j <= lines[i].length) {
				c = lines[i].charAt(j);
				if (!inQuote) {
					// If not already in a string, look for the start of one.
					if (c == '"' || c == "'") {
						inQuote = true;
						escaped = false;
						quoteChar = c;
						literal = c;
					} else {
						t += c;
					}
				} else {
					// Already in a string, look for end and copy characters.
					if (c == quoteChar && !escaped) {
						inQuote = false;
						literal += quoteChar;
						t += "__" + literalStrings.length + "__";
						literalStrings[literalStrings.length] = literal;
					} else if (c == "\\" && !escaped) {
						escaped = true;
					} else {
						escaped = false;
					}
					literal += c;
				}
				j++;
			}
			t += "\n";
		}
		return t;
	}

	function removeComments(s)
	{
		var lines, i, t;

		// Remove '//' comments from each line.
		lines = s.split("\n");
		t = "";
		for (i = 0; i < lines.length; i++) {
			t += lines[i].replace(/([^\x2f]*)\x2f\x2f.*$/, "$1");
		}

		// Replace newline characters with spaces.
		t = t.replace(/(.*)\n(.*)/g, "$1 $2");

		// Remove '/* ... */' comments.
		lines = t.split("*/");
		t = "";
		for (i = 0; i < lines.length; i++) {
			t += lines[i].replace(/(.*)\x2f\x2a(.*)$/g, "$1 ");
		}

		return t;
	}

	function compressWhiteSpace(s)
	{
		return s
			// Condense white space.
			.replace(/\s+/g, " ")
			.replace(/^\s(.*)/, "$1")
			.replace(/(.*)\s$/, "$1")
			// Remove uneccessary white space around operators, braces and parentices.
			.replace(/\s([\x21\x25\x26\x28\x29\x2a\x2b\x2c\x2d\x2f\x3a\x3b\x3c\x3d\x3e\x3f\x5b\x5d\x5c\x7b\x7c\x7d\x7e])/g, "$1")
			.replace(/([\x21\x25\x26\x28\x29\x2a\x2b\x2c\x2d\x2f\x3a\x3b\x3c\x3d\x3e\x3f\x5b\x5d\x5c\x7b\x7c\x7d\x7e])\s/g, "$1");
	}

	function fixFunctionAssignment(s)
	{
		return s;
	}

	function restoreLiteralStrings(s)
	{
		for (var i = 0; i < literalStrings.length; i++) {
			s = s.replace(new RegExp("__" + i + "__"), literalStrings[i]);
		}
		return s;
	}

	function combineLiteralStrings(s)
	{
		return s.replace(/"\+"/g, "").replace(/'\+'/g, "");
	}

	/**
	 * Parses an input string and obfuscates assuming as JavaScript/JScript code.
	 * Uses callbacks defined in the constructor.
	 *
	 * @param	String	input
	 * @result	String
	 * @access	public
	 */
	self.parse = function(input)
	{
		if ( input.length <= 0 ) {
			return input;
		}

		var output;

		// Get input script code, process it and display output.

		if ( debugfunc ) {
			debugfunc("Working...");
		}

		output = input;

		if ( debugfunc ) {
			debugfunc("Replacing literal strings...");
		}
		output = replaceLiteralStrings(output);

		if ( debugfunc ) {
			debugfunc("Removing comments...");
		}
		output = removeComments(output);

		if ( debugfunc ) {
			debugfunc("Compressing white space...");
		}
		output = compressWhiteSpace(output);

		if ( debugfunc ) {
			debugfunc("Fixing function assignments...");
		}
		output = fixFunctionAssignment(output);

		if ( debugfunc ) {
			debugfunc("Restoring literal strings...");
		}
		output = restoreLiteralStrings(output);

		if ( debugfunc ) {
			debugfunc("Combining literal strings...");
		}
		output = combineLiteralStrings(output);

		if ( debugfunc ) {
			debugfunc("Done.");
		}

		return output;
	}

}

