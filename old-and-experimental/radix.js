//
// radix
// Converts numbers between different numerical systems
//
// Copyright (c) 2012, Ildar Shaimordanov
//

var cArgs = WScript.Arguments;
var nArgs = WScript.Arguments.Named;
var uArgs = WScript.Arguments.Unnamed;

if ( cArgs.length == 0 || nArgs.Exists('H') || nArgs.Exists('HELP') ) {
	WScript.Echo([
		WScript.ScriptName + ' numbers [/I:radix] [/O:radix]', 
		'', 
		'/I   Input radix', 
		'/O   Output radix', 
		'', 
		'Converts numbers between different numerical systems.', 
		'A radix can be one of 2 to 36. The default value is 10.'
	].join('\n'));
	WScript.Quit();
}

function parseRadix(value)
{
	value = nArgs.item(value) || 10;
	if ( isNaN(value) || value < 2 || value > 36 ) {
		throw new Error('Illegal radix: "' + value + '".');
	}
	return value;
};

var iBase = parseRadix('I');
var oBase = parseRadix('O');

var values = uArgs;
if ( values.length == 0 ) {
	values = [];
	while ( ! WScript.StdIn.AtEndOfStream ) {
		values.push(WScript.StdIn.ReadLine());
	}
	values.item = function(i)
	{
		return this[i];
	};
}

for (var r, i = 0; i < values.length; i++) {
	r = values.item(i);
	r = parseInt(r, iBase);
	r = Number(r).toString(oBase);
	WScript.StdOut.WriteLine(r);
}

