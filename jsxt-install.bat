@set @x=0 /*
@set @x=
@call wscmd /js "%~dpnx0" %*
@goto :eof */

///////////////////////////////////////////////////////////////////////////

var install = {
	include: [
		'*.js', 
		'*.wsf', 
		'*.hta', 
		'*.bat'], 
	exclude: [
		'install_tool*.*', 
		'Sandbox.js', 
		'jsxt-install.*', 
		WScript.ScriptFullName], 
	path: 'C:\\PROGS\\TOOLS', 
	squeeze: true
};


(function()
{
//	return;
	if ( WScript.Arguments.Named.Exists('H') || WScript.Arguments.Named.Exists('HELP') ) {
		print(arguments.callee.getOneResource());
		exit();
	}
/*[[
Installer of JSXT tools
Copyright (C) 2009, 2010, 2011, Ildar Shaimordanov

This is not mandatory action. You can use all these tools "as is". 
You do not need run this untility. Download archive and place it's 
content to the appropriate directory.

This utility allows you to install JSXT tools to the comfortable 
location. It makes two things:
-- embeds JS scripts from the "js" directory into the tool; 
-- squeezes embeded scripts to reduce the size of resulting files. 

Reasonable question arises: 
"Why I should make install if it works fine without this?"

This was made to provide easy way to make each tool independent of 
many files. Once downlanded and installed into the single file the 
tool can be used without emergency of lost some parts of tool.
]]*/
})();

function expandFileList(list, skipWarn)
{
	return list
		.map(function(v)
		{
			var glob;
			var e;
			try {
				glob = FileSystem.glob(v);
			} catch (e) {
				if ( skipWarn ) {
					return null;
				}
				print(e.description);
			}
			return glob;
		})
		.filter(function(v)
		{
			return v;
		})
		.flatten()
		.map(function(v)
		{
			return String(v);
		});
};

var exc = [].union(expandFileList(install.exclude, true));

var inc = WScript.Arguments.Unnamed.length == 0 
	? install.include 
	: Enumerator.toArray(WScript.Arguments.Unnamed, function(v)
	{
		return v;
	});

inc = [].union(
	expandFileList(inc)
	.filter(function(v)
	{
		return exc.indexOf(v) == -1;
	}));

if ( inc.length == 0 ) {
	print('Nothing to install. Exit.');
	exit();
}

var JSFILE = /\.js$/i;
var WSFILE = /\.wsf$/i;
var JS2BAT = [
	'@set @x=0 /*!', 
	'@set @x=', 
	'@cscript //nologo //e:javascript "%~dpnx0" %*', 
	'@goto :eof */', 
	'', 
	''].join('\n');

inc.forEach(function(inpfile)
{
	print('Processing "%s"...'.sprintf(inpfile));

	var scriptOuter = 
		inpfile.match(JSFILE) 
		? '\n\n//%s\n%s\n\n' 
		: inpfile.match(WSFILE) 
		? '\x3Cscript language="javascript"\x3E\x3C![CDATA[\n\n//%s\n%s\n\n]]\x3E\x3C/script\x3E'
		: '\x3Cscript language="javascript"\x3E\n\n//%s\n%s\n\n\x3C/script\x3E';

	var content = FileSystem.readFile(inpfile);

	content = content.replace(/\x3Cscript.*?src="(js\/.+\.js)".*?\/script\x3E|\s*\/\/\[requires\[\s*(js\/.+\.js)\s*\]\]/ig, function($0, $1, $2)
	{
		var f = $1 || $2;
		var s;

//		s = FileSystem.readFile(f);
		var e;
		try {
			s = FileSystem.readFile(f);
		} catch (e) {
			print('The exception has arisen when reading the file "%s": %s'.sprintf(f, e.message));
			exit();
		}
		if ( install.squeeze ) {
			s = eval.minify(s, {
				level: 3, 
				comment: ''
			});
		}

		return scriptOuter.sprintf(f, s);
	});

	var outfile = inpfile.replace(/.+\\/, install.path + '\\');

	if ( inpfile.match(JSFILE) ) {
		print('js-2-bat converting...');

		content = JS2BAT + content;
		outfile = outfile.replace(JSFILE, '.bat');
	}

	FileSystem.writeFile(outfile, content, true);
});

exit();
