//
// js2bat
// Command line tool to embed js codes to batch scripts
//
// Copyright (c) 2010, 2011, Ildar Shaimordanov
//

//[requires[ js/Ajax.js ]]
//[requires[ js/eval.js ]]
//[requires[ tools/jsxt.tools.js ]]
//[requires[ tools/jsxt.tools.jsCode.js ]]
//[requires[ tools/jsxt.tools.js2bat.js ]]

///////////////////////////////////////////////////////////////////////////

// Display the minimal usage screen
if ( ! WScript.FullName.match(/cscript/i) || WScript.Arguments.Named.Exists('H') ) {
	jsxt.tools.help(
		WScript.ScriptName.replace(/\..+?$/, ''), 
		'Copyright (C) 2010, 2011 Ildar Shaimordanov', 
		'', 
		'H        - this help', 
		'W        - force usage of WSCRIPT as a scripting host', 
		'A:string - additional arguments for s scripting host');
	jsxt.tools.quit();
}

var options = {
	// Define the script host to be launched (WSCRIPT or CSCRIPT)
	host: WScript.Arguments.Named.Exists('W') 
		? 'wscript'
		: 'cscript', 

	// Additional arguments for the script host
	args: WScript.Arguments.Named('A') 
		? WScript.Arguments.Named.item('A') 
		: '//nologo'
};

if ( WScript.Arguments.Unnamed.length == 0 ) {
	var lines = jsxt.tools.readFromConsole();
	lines = jsxt.tools.js2bat(lines, options);
	jsxt.tools.writeToConsole(lines);
	jsxt.tools.quit();
}

for (var i = 0; i < WScript.Arguments.Unnamed.length; i++) {
	var i_name = WScript.Arguments.Unnamed.item(i);
	var lines = jsxt.tools.readFromFile(i_name);

	lines = jsxt.tools.js2bat(lines, options);

	var o_name = i_name.replace(/\.js/, '.bat');
	jsxt.tools.writeToFile(o_name, lines);
}

jsxt.tools.quit();
