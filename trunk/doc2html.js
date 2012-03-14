//
// doc2html and more
//
// Copyright (c) 2004, 2009, 2010, 2012 Ildar Shaimordanov
//

///////////////////////////////////////////////////////////////////////////

//[requires[ js/win32/FileSystem.js ]]
//[requires[ js/String.js ]]
//[requires[ js/Array.js ]]
//[requires[ js/Object.js ]]
//[requires[ js/win32/Enumerator.js ]]

///////////////////////////////////////////////////////////////////////////

function alert(msg)
{
	WScript.Echo(msg);
};

function quit(code)
{
	WScript.Quit(code);
};

function help()
{
	var msg = [
'doc2html and more', 
'Copyright (C) 2004, 2009, 2010, 2012 Ildar Shaimordanov', 
'', 
'This tool allows to convert any DOC or DOCX file to several different ', 
'formats such as plain text TXT (both DOS, Win, etc), or reach text RTF, or ', 
'hyper-text HTML (default), MHT (web archive), XML, or PDF, or XPS. ', 
'', 
'There are options:', 
'', 
'/H', 
'    Outputs this help page.', 
'', 
'/F:format', 
'    Specifies output format as TXT, RTF, HTML, MHT, XML, PDF or XPS. ', 
'', 
'/E:encoding', 
'    A numeric value of the encoding to be used when saving as a plain text ', 
'    file. This option is significant with /F:TXT only. Refer to your ', 
'    system locales to learn which encodings ar available there. ', 
'', 
'    The Russian or Ukrainian users can refer to the list below: ', 
'    866   - DOS', 
'    28595 - ISO', 
'    20866 - KOI8-R', 
'    21866 - KOI8-U', 
'    10007 - Mac', 
'    1251  - Win', 
'', 
'/L:lineending', 
'    The option specifies characters to be used as line ending. There are ', 
'    four available values - CRLF, CR, LF, or LFCR. The default value is ', 
'    CRLF. This option is significant with /F:TXT only. ', 
'', 
'/V', 
'    Turn on verbosity.', 
'', 
'/FG', 
'    Specify this if you want to launch WINWORD in foreground.', 
].join('\n');
	alert(msg);
};

if ( WScript.Arguments.length < 1 || WScript.Arguments.Named.Exists('H') ) {
	help();
	quit();
}

var verbose = false;

function warn(text)
{
	if ( ! arguments.callee.verbose ) {
		return;
	}
	var now = new Date();
	var date = "%04d/%02d/%02d %02d:%02d:%02d.%03d ".sprintf(
			now.getFullYear(),
			now.getMonth(),
			now.getDay(),
			now.getHours(),
			now.getMinutes(),
			now.getSeconds(),
			now.getMilliseconds());

	alert(date + text);
};

// Verbosely ?
warn.verbose = WScript.FullName.match(/cscript\.exe$/i) && WScript.Arguments.Named.Exists('V');

var formats = {
	'txt':	2,
	'dos':	4,
	'rtf':	6,
	'html':	8,
	'mht':	9,
	'xml':	11,
	'pdf':	17,
	'xps':	18};

var lineEndings = {
	'crlf':	0, 
	'cr':	1, 
	'lf':	2, 
	'lfcr':	3};

var fileFormat = 'html';
var fileEncoding = 0;
var fileLineEnding = 0;
var word;

var e;
try {

	// Creating of 'Send To' context menu
	if ( WScript.Arguments.Named.Exists('help') && WScript.Arguments.Named.item('help').toLowerCase() == 'sendto' ) {

		var sendTo = wshShell.SpecialFolders('SendTo');
		var folder = sendTo + '\\doc2xxx';

		warn('Creating of the folder "' + folder + '"');
		try {
			fso.CreateFolder(folder);
		} catch (e) {
			warn('The folder already exists');
		}

		formats.forItems(function(value, key)
		{
			warn('Creating of the shortcut for "' + key + '" format');

			var lnk;
			lnk = wshShell.CreateShortcut(folder + '\\doc2' + key + '.lnk');
			lnk.TargetPath = 'wscript';
			lnk.Arguments = WScript.ScriptFullName + ' /f:' + key;
			lnk.Description = 'Convert .DOC to .' + key.toUpperCase();
			lnk.Save();
		}, true);

		warn('Done');
		quit();

	}

	warn('Validate formatting parameters');
	var arg;

	if ( WScript.Arguments.Named.Exists('F') ) {
		arg = WScript.Arguments.Named.item('F');
		fileFormat = (arg || '').toLowerCase();
		if ( isNaN(formats[fileFormat]) ) {
			throw new Error('Unknown output format: "' + arg + '"');
		}
	}

	if ( fileFormat == 'txt' && WScript.Arguments.Named.Exists('E') ) {
		arg = WScript.Arguments.Named.item('E');
		fileEncoding = Number(arg);
		if ( isNaN(fileEncoding) || fileEncoding <= 0 ) {
			throw new Error('Illegal encoding value: "' + arg + '"');
		}
	}

	if ( fileFormat == 'txt' && WScript.Arguments.Named.Exists('L') ) {
		arg = WScript.Arguments.Named.item('L');
		fileLineEnding = Number(lineEndings[(arg || '').toLowerCase()]);
		if ( isNaN(fileLineEnding) ) {
			throw new Error('Illegal line ending: "' + arg + '"');
		}
	}

	// Process file list
	warn('Processing arguments');
	var filelist = Enumerator.toArray(WScript.Arguments.Unnamed, function(i, fc)
	{
		return FileSystem.glob(i);
	}).flatten();

	if ( filelist.length < 1 ) {
		throw new Error('Empty file list');
	}

	warn('Files to be processed:\n\t' + filelist.join('\n\t'));

	// Launch the WINWORD application and start a file converting loop
	warn('WINWORD is starting');
	var word = new ActiveXObject("Word.Application");

	if ( WScript.Arguments.Named.Exists('fg') ) {
		warn('Activating and displaying of the WINWORD in foreground');
		word.Visible = true;
		word.Activate();
	}

	filelist.forEach(function(filename)
	{
		var docfile = String(filename);
		var newfile = docfile.replace(/\.[^\.]+$/, '.' + fileFormat);

		warn('Open "' + docfile + '"');
		word.Documents.Open(docfile);

		warn('Save as "' + newfile + '"');
		word.activeDocument.SaveAs(
			// FileName
			newfile, 
			// FileFormat
			formats[fileFormat], 
			// LockComments
			false, 
			// Password
			'', 
			// AddToRecentFiles
			false, 
			// Write Password
			'', 
			// ReadOnlyRecommended
			false, 
			// EmbedTrueTypeFonts
			false, 
			// SaveNativePictureFormat
			false, 
			// SaveFormsData
			false, 
			// SaveAsAOCELetter
			false, 
			// Encoding
			fileEncoding, 
			// InsertLineBreaks
			true, 
			// AllowSubstitutions
			false, 
			// LineEnding
			fileLineEnding);

		warn('Close this document');
		word.ActiveDocument.Close();
	});

} catch (e) {

	alert('Error encountered: ' 
//		+ '[' 
//		+ (e.number >> 0x10) 
//		+ ':' 
//		+ (e.number & 0xFFFF) 
//		+ '] - ' 
		+ e.description);

} finally {

	if ( word ) {
		warn('WINWORD is closing');
		word.Quit();
		WScript.Sleep(500);
		warn('Done');
	}

}

