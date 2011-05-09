//
// jsCode
// Command line tool to beautify/minify js codes
//
// Copyright (c) 2011, Ildar Shaimordanov
//

///////////////////////////////////////////////////////////////////////////

//[requires[ js/Ajax.js ]]
//[requires[ js/eval.js ]]
//[requires[ tools/jsxt.tools.js ]]
//[requires[ tools/jsxt.tools.jsCode.js ]]

///////////////////////////////////////////////////////////////////////////

if ( ! WScript.FullName.match(/cscript/i) || WScript.Arguments.Named.Exists('H') ) {
	jsxt.tools.help(
		WScript.ScriptName.replace(/\..+?$/, ''), 
		'Copyright (C) 2010, 2011 Ildar Shaimordanov', 
		'', 
		'MINIFY   - minify a javascript code', 
		'M        - alias for /MINIFY', 
		'L:n      - the level of obfuscation (0, 1, or 2)', 
		'', 
		'BEAUTIFY - beautify a javascript code', 
		'B        - alias for /BEAUTIFY', 
		'S:n      - indentation size (default == 4)', 
		'L:n      - initial indentation level (detault == 0', 
		'C:c      - character to indent with (default == SPACE)', 
		'           They are available too:', 
		'           \\[fnrstv], \\nnn, \\0nnn, \\xnn');
	jsxt.tools.quit();
}

var text =  WScript.Arguments.Unnamed.length != 0 
	? jsxt.tools.readFromFile(WScript.Arguments.Unnamed.item(0)) 
	: jsxt.tools.readFromConsole();

var result = jsxt.tools.jsCode(text, {
	minify: WScript.Arguments.Named.Exists('M') || WScript.Arguments.Named.Exists('MINIFY'), 
	level: WScript.Arguments.Named.item('L'), 

	beautify: WScript.Arguments.Named.Exists('B') || WScript.Arguments.Named.Exists('BEAUTIFY'), 
	indent_size: WScript.Arguments.Named.item('S'), 
	indent_level: WScript.Arguments.Named.item('L'), 
	indent_char: WScript.Arguments.Named.item('C')
});

jsxt.tools.alert(result);

jsxt.tools.quit();
