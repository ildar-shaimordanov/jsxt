
//[requires[ js/Function.js ]]
//[requires[ js/Array.js ]]
//[requires[ js/Ajax.js ]]
//[requires[ js/eval.js ]]
//[requires[ js/win32/FileSystem.js ]]
//[requires[ js/win32/Enumerator.js ]]
//[requires[ tools/jsxt.tools.js ]]
//[requires[ tools/jsxt.tools.jsCode.js ]]
//[requires[ tools/jsxt.tools.js2xml.js ]]
//[requires[ tools/jsxt.tools.js2js.js ]]
//[requires[ tools/jsxt.tools.vbs2js.js ]]
//[requires[ tools/jsxt.tools.js2bat.js ]]

(function()
{
	if ( WScript.Arguments.Unnamed.length == 0 || WScript.Arguments.Named.Exists('H') || WScript.Arguments.Named.Exists('HELP') ) {
		jsxt.tools.help(arguments.callee.getOneResource());
		jsxt.tools.quit();
	}
/*![[JSXT Tools Installer
Copyright (C) 2009, 2010, 2011, Ildar Shaimordanov

Usage: jsxt FILES [/D:targetPath] [/O]

/D - defines the target path where processed files will be stored
/O - use this option to overwrite an original file

The following options affect on js-in-bat launch only:

/W   - force usage of WSCRIPT as a scripting host', 
/WOW - force usage in SysWOW64 environment',

This is not mandatory action. You can use all these tools "as is". 
You do not need run this untility. Download archive and place it's 
content to the appropriate directory.

This utility allows you to install JSXT tools to the comfortable 
location. It makes two things:
-- embeds specified JS scripts into the tool; 
-- squeezes embeded scripts to reduce the size of resulting files. 

Reasonable question arises: 
"Why I should make install if it works fine without this?"

This was made to provide easy way to make each tool independent of 
many files. Once downlanded and installed into the single file the 
tool can be used without emergency of lost some parts of tool.
]]*/
})();

/*

Default options

*/
var iniOptions = {
	// fils to be included to processing
	includePatterns: [
		'*.pl', 
		'*.perl', 
		'*.pm', 
		'*.php', 

		'*.js', 
		'*.vbs', 
		'*.wsf', 
		'*.hta', 
		'*.bat'], 

	// files to be excluded from processing
	excludePatterns: [
		'Sandbox.js', 
		'jsxt-install.*', 
		'$$$*', 
		'jsxt.js.ini'], 

	// target directory
	targetPath: WScript.Arguments.Named.item('D') || '',

	useWScript: WScript.Arguments.Named.Exists('W'), 
	useSysWOW64: WScript.Arguments.Named.Exists('WOW'), 

	// overwrite an original file
	overwrite: WScript.Arguments.Named.Exists('O'), 

 	// minify options
	minify: true, 
	level: 2, 

	0: 0
};

var includePatterns = FileSystem.wildcard2regexp(iniOptions.includePatterns);
var excludePatterns = FileSystem.wildcard2regexp(iniOptions.excludePatterns);

var processFiles = Enumerator.map(WScript.Arguments.Unnamed, function(v)
{
	return v;
})
// expand filename patterns
.map(function(v)
{
	var e;
	try {
		return FileSystem.glob(v);
	} catch (e) {
		jsxt.tools.alert(e.description);
	}
})
// non-empty values only
.filter(function(v)
{
	return v;
})
// flatten a possible multi-dimentional array
.flatten()
// stringify values
.map(function(v)
{
	return String(v);
})
// remove duplicates
.unique()
// take in account the patterns includePatterns and excludePatterns
.filter(function(v)
{
	return v.match(includePatterns) && ! v.match(excludePatterns);
})
;

if ( processFiles.length == 0 ) {
	jsxt.tools.alert('Nothing to install. Exit');
	jsxt.tools.quit();
}

var fso = new ActiveXObject('Scripting.FileSystemObject');

processFiles.forEach(function(iname)
{
	iniOptions.vbsFile = !! iname.match(/\.vbs$/i);
	iniOptions.jsFile  = !! iname.match(/\.js$/i);
	iniOptions.escaped = !! iname.match(/\.(pl|perl|pm|php)$/i);
	iniOptions.wsfFile = !! iname.match(/\.wsf$/i);
	iniOptions.batFile = !! iname.match(/\.bat$/i);

	jsxt.tools.alert('Processing "' + iname + '"...');

	var text = jsxt.tools.readFromFile(iname);

	var oname = iname;
	if ( iniOptions.targetPath ) {
		oname = oname.replace(/.+\\/, iniOptions.targetPath + '\\');
	}

	if ( iniOptions.vbsFile ) {

		jsxt.tools.alert('vbs-2-bat converting...');
		text = jsxt.tools.vbs2js(text, iniOptions);
		text = jsxt.tools.js2bat(text, {
			useWScript: WScript.Arguments.Named.Exists('W'), 
			useSysWOW64: true
		});
		oname = oname.replace(/\.vbs$/i, '.bat');

	} else if ( iniOptions.jsFile ) {

		jsxt.tools.alert('js-2-bat converting...');
		text = jsxt.tools.js2js(text, iniOptions);
		text = jsxt.tools.js2bat(text, iniOptions);
		oname = oname.replace(/\.js$/i, '.bat');

	} else if ( iniOptions.batFile ) {

		text = jsxt.tools.js2js(text, iniOptions);

	} else {

		text = jsxt.tools.js2xml(text, iniOptions);

	}

	if ( iname != fso.GetAbsolutePathName(oname) || iniOptions.overwrite ) {
		jsxt.tools.writeToFile(oname, text);
	} else {
		jsxt.tools.alert('Cannot write to the same file. Use /O option.');
	}
});

jsxt.tools.quit();
