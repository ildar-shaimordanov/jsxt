//
// inifile
// Command line tool for working with ini-files
//
// Copyright (c) 2012, Ildar Shaimordanov
//

function help()
{
	alert([
		'IniFile Version 0.2 Beta', 
		'Copyright (C) 2012 Ildar Shaimordanov', 
		'', 
		'Usage: ' + WScript.ScriptName + ' OPTIONS filename', 
		'', 
		'    /D       - Opens the file using the system default', 
		'    /U       - Opens the file as Unicode', 
		'    /A       - Opens the file as ASCII', 
		'    /S:value - Specifies the section name', 
		'    /K:value - Specifies the key name', 
		'    /L       - List sections of keys of the specified section', 
	].join('\n'));
};

function alert(value)
{
	WScript.Echo(value);
};

function quit(exitCode)
{
	WScript.Quit(exitCode);
};

function error(value)
{
	WScript.StdErr.WriteLine(value);
	quit(1);
};

var uArgs = WScript.Arguments.Unnamed;
var nArgs = WScript.Arguments.Named;

if ( uArgs.length != 1 || WScript.FullName.match(/wscript\.exe/i) ) {
	help();
	quit(1);
}

///////////////////////////////////////////////////////////////////////////

//[requires[ js/INI.js ]]

///////////////////////////////////////////////////////////////////////////

var filename = uArgs.item(0);
var format = nArgs.Exists('D') ? -2 : nArgs.Exists('U') ? -1 : 0;

var iniObj = (function()
{
	var fso = new ActiveXObject('Scripting.FileSystemObject');
	var e;
	try {
		var f = fso.GetFile(filename);
	} catch (e) {
		error(e.message + ': ' + filename);
	}
	var h = f.OpenAsTextStream(1, format);

	var iniTxt = h.ReadAll();
//	var iniTxt = iniTxt.split(/\r\n|\r|\n/);
	var result = INI.parse(iniTxt);
//	var result = INI.parse(function()
//	{
//		return h.AtEndOfStream ? null : h.ReadLine();
//	});

	h.Close();

	return result;
})();


var list = nArgs.Exists('L');
var section = nArgs.item('S');
var key = nArgs.item('K');

if ( section ) {
	if ( ! iniObj.hasOwnProperty(section) || Object.prototype.toString.call(iniObj[section]) != '[object Object]' ) {
		error('Section not found: ' + section);
	}
	iniObj = iniObj[section];
}

if ( list ) {
	for (var p in iniObj) {
		if ( ! iniObj.hasOwnProperty(p) ) {
			continue;
		}
		alert(p);
	}
	quit();
}


if ( ! key ) {
	error('Empty key was passed');
}

if ( ! iniObj.hasOwnProperty(key) ) {
	error('Key not found: ' + key);
}

var value = [].concat(iniObj[key]).join('\n');

alert(value);

