//
// jsCode
// Command line tool to beautify/minify js codes
//
// Copyright (c) 2011, Ildar Shaimordanov
//

///////////////////////////////////////////////////////////////////////////

//[requires[ js/Ajax.js ]]
//[requires[ js/eval.js ]]

///////////////////////////////////////////////////////////////////////////

var jsCode = {
	name: 'jsCode', 
	version: '0.1.0 Beta', 

	fromFile: function()
	{
		var path;
		path = WScript.Arguments.Unnamed.item(0);
		if ( ! (/^\w+:\/\//).test(path) ) {
			path = (new ActiveXObject('Scripting.FileSystemObject')).GetAbsolutePathName(path);
		}
		return Ajax.queryFile(path);
	}, 
	fromConsole: function()
	{
		var lines = [];
		while ( ! WScript.StdIn.atEndOfStream ) {
			lines.push(WScript.StdIn.ReadLine());
		}
		return lines.join('\n');
	}, 

	parse: function(text, minify, beautify)
	{
		var result = ''

		if ( minify ) {
			return eval.minify(text, {
				level: WScript.Arguments.Named.item('L') || 0
			});
		}

		if ( beautify ) {
			return eval.beautify(text, {
				indent_size: WScript.Arguments.Named.item('S') || 4, 
				indent_level: WScript.Arguments.Named.item('L') || 0, 
				indent_char: (WScript.Arguments.Named.item('C') || '').replace(
					/\\([fnrstv])|\\([0-9]+|0[0-7]+)|\\(x[0-9A-Fa-f]+)/g, 
					function($0, $1, $2, $3)
					{
						return $1 
							? eval('"\\' + $1 + '"') 
							: String.fromCharCode(parseInt($2 || ('0' + $3)));
					})
			});
		}
	}, 

	help: function()
	{
		var msg = this.name + '/' + this.version + '\n'
			+ 'Copyright (C) 2011, Ildar Shaimordanov\n' 
			+ '\n' 
			+ 'Usage: ' + WScript.ScriptName + ' URL OPTIONS\n' 
			+ '\n' 
			+ 'Options are:\n' 
			+ '\n'
			+ '/M, /MINIFY   - minify a javascript code\n' 
			+ '  /L:n  - the level of obfuscation (0, 1, or 2)\n' 
			+ '\n' 
			+ '/B, /BEAUTIFY - beautify a javascript code\n' 
			+ '  /S:n  - indentation size (default == 4)\n' 
			+ '  /L:n  - initial indentation level (detault == 0\n' 
			+ '  /C:c  - character to indent with (default == SPACE)\n' 
			+ '          They are available too:\n' 
			+ '          \\[fnrstv], \\nnn, \\0nnn, \\xnn' 
			;
		this.alert(msg);
	}, 
	alert: function()
	{
		if ( arguments.length == 0 ) {
			return;
		}

		WScript.Echo([].slice.call(arguments));
	}, 
	quit: function(exitCode)
	{
		WScript.Quit(exitCode);
	}
};

var minify = WScript.Arguments.Named.Exists('M') || WScript.Arguments.Named.Exists('MINIFY');
var beautify = WScript.Arguments.Named.Exists('B') || WScript.Arguments.Named.Exists('BEAUTIFY');

if ( 
	minify == beautify 
	|| 
	WScript.Arguments.Unnamed.length > 1 
) {
	jsCode.help();
	jsCode.quit();
}

var text =  WScript.Arguments.Unnamed.length != 0 
	? jsCode.fromFile() 
	: jsCode.fromConsole();

var result = jsCode.parse(text, minify, beautify);

jsCode.alert(result);

