/*!
 * doc2html and more
 *
 * Copyright (c) 2004-2020 Ildar Shaimordanov
 */

function alert(msg)
{
	WScript.Echo(msg);
};

function quit(code)
{
	WScript.Quit(code);
};

if ( WScript.Arguments.length < 1 || WScript.Arguments.Named.Exists('H') ) {
	WScript.Arguments.ShowUsage();
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
	'fb2':	11,
	'pdf':	17,
	'xps':	18};

var lineEndings = {
	'crlf':	0, 
	'cr':	1, 
	'lf':	2, 
	'lfcr':	3};

var xslName = WScript.ScriptFullName.replace(/[^\\]+$/, '') + 'doc2fb.xsl';
var xslFile;

var fileFormat = 'html';
var fileEncoding = 0;
var fileLineEnding = -1;
var word;

var e;
try {

	// Creating of 'Send To' context menu
	if ( WScript.Arguments.Named.Exists('help') && WScript.Arguments.Named.item('help').toLowerCase() == 'sendto' ) {

		var wshShell = new ActiveXObject('WScript.Shell');

		var sendTo = wshShell.SpecialFolders('SendTo');
		var folder = sendTo + '\\doc2xxx';

		warn('Creating of the folder "' + folder + '"');
		try {
			fso.CreateFolder(folder);
		} catch (e) {
			warn('The folder already exists');
		}

		Object.forIn(formats, function(value, key)
		{
			warn('Creating of the shortcut for "' + key + '" format');

			var lnk;
			lnk = wshShell.CreateShortcut(folder + '\\doc2' + key + '.lnk');
			lnk.TargetPath = WScript.ScriptFullName;
			lnk.Arguments = '/f:' + key;
			lnk.Description = 'Convert .DOC to .' + key.toUpperCase();
			lnk.Save();
		}, true);

		warn('Done');
		quit();

	}

	warn('Validate formatting parameters');
	var arg;

	// /F:format
	if ( WScript.Arguments.Named.Exists('F') ) {
		arg = WScript.Arguments.Named.item('F');
		fileFormat = (arg || '').toLowerCase();
		if ( isNaN(formats[fileFormat]) ) {
			throw new Error('Unknown output format: "' + arg + '"');
		}
	}

	// /F:TXT /E:Encoding
	if ( fileFormat == 'txt' && WScript.Arguments.Named.Exists('E') ) {
		arg = WScript.Arguments.Named.item('E');
		fileEncoding = Number(arg);
		if ( isNaN(fileEncoding) || fileEncoding <= 0 ) {
			throw new Error('Illegal encoding value: "' + arg + '"');
		}
	}

	// /F:TXT /L:lineending
	if ( fileFormat == 'txt' && WScript.Arguments.Named.Exists('L') ) {
		arg = WScript.Arguments.Named.item('L');
		fileLineEnding = Number(lineEndings[(arg || '').toLowerCase()]);
		if ( isNaN(fileLineEnding) ) {
			throw new Error('Illegal line ending: "' + arg + '"');
		}
	}

	// /F:FB2 /XSL:filename
	if ( fileFormat == 'fb2' ) {
		if ( WScript.Arguments.Named.Exists('XSL') ) {
			xslName = WScript.Arguments.Named.item('XSL');
		}

		var fso = new ActiveXObject("Scripting.FileSystemObject");
		try {
			var xslFile = fso.GetFile(xslName);
		} catch (e) {
			fileFormat = 'xml';
			alert(xslName + ' not found.');
		}
	}

	// Process file list
	warn('Processing arguments');
	var filelist = Enumerator.map(WScript.Arguments.Unnamed, function(i, fc)
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

	word.DisplayAlerts = 0;
	word.Options.WarnBeforeSavingPrintingSendingMarkup = false;

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
		var doc = word.Documents.Open(docfile);

		if ( fileFormat == 'fb2' ) {
//?			doc.XMLSaveDataOnly = false;
			doc.XMLUseXSLTWhenSaving = true;
			doc.XMLSaveThroughXSLT = '' + xslFile;
//?			doc.XMLHideNamespaces = true;
			doc.XMLShowAdvancedErrors = true;
			doc.XMLSchemaReferences.HideValidationErrors = false;
//?			doc.XMLSchemaReferences.AutomaticValidation = true;
			doc.XMLSchemaReferences.IgnoreMixedContent = false;
//?			doc.XMLSchemaReferences.AllowSaveAsXMLWithoutValidation = true;
			doc.XMLSchemaReferences.ShowPlaceholderText = false;
		}

		warn('Save as "' + newfile + '"');
		doc.SaveAs2(
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
			fileLineEnding > -1, 
			// AllowSubstitutions
			false, 
			// LineEnding
			fileLineEnding,
			// AddBiDiMarks
			true,
			// CompatibilityMode
			0);

		warn('Close this document');
		doc.Close();
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

