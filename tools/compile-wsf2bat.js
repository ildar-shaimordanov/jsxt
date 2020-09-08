//
// wsf2bat compiler
// This script is the part of the wsx
//
// Copyright (c) 2020 by Ildar Shaimordanov
//

/*
This script is invented to create the standalone batch file from the
".wsf" file with the deck of included JScript/VBScript codes. It adds
the special chimera prolog enabling the resulting script to be invoked
both by the Command Interpreter and WScript Engine. All included codes
implementing the tool's functionality are read and embedded into the
final script. This file is standalone and portable version of the
original one that is convenient for distribution.
*/

var fso = new ActiveXObject('Scripting.FileSystemObject');

function readFile(file) {
	var stream = ! file || file.toLowerCase() == 'con'
		? WScript.StdIn
		: fso.OpenTextFile(file);

	var text = [];
	while ( ! stream.AtEndOfStream ) {
		text.push(stream.ReadLine());
	}
	if ( file && file.toLowerCase() != 'con' ) {
		stream.Close();
	}
	return text.join('\n');
}

var chimeraProlog = [
	'<!--'
,	'@echo off'
,	'cscript //nologo "%~f0?.wsf" %*'
,	'goto :EOF'
,	': -->'
].join('\n');

var scriptFile = readFile()
.replace(/^<\?xml(\s*)(.*\?>)/, function($0, $1, $2) {
	return '<?xml :\n:' + ( $1 || ' ' ) + $2 + chimeraProlog;
})
.replace(/<script\s*(.*?)\s*src="([^"]+)"\s*(.*?)\s*>\s*<\/script>/g, function($0, $1, $2, $3) {
	return '<!-- ' + $0 + ' -->\n<script' + ( $1 && ' ' + $1 ) + ( $3 && ' ' + $3 ) + '><![CDATA[\n' + readFile($2) + '\n]]></script>';
});

WScript.Echo(scriptFile);
