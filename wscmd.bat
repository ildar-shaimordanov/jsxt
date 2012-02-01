@set @wscmd=0 /*!
@set @wscmd=
@echo off


setlocal enabledelayedexpansion


set wscmd.started=1


:wscmd.start


:: Set the name and version
set wscmd.name=Windows Scripting Command
set wscmd.version=0.16.6 Beta


:: Prevent re-parsing of command line arguments
if not defined wscmd.started goto wscmd.2
set wscmd.started=


:: Parse command line arguments and set needful variables
set wscmd.temp=
set wscmd.inline=
set wscmd.inproc=
set wscmd.script=
set wscmd.engine=javascript
set wscmd.compile=
set wscmd.debug=
set wscmd.quiet=


if "%~1" == "" (
	shift /1
	goto wscmd.2
)


if /i "%~1" == "/h" (
	goto wscmd.help
)


if /i "%~1" == "/help" (
	goto wscmd.help
)


if /i "%~1" == "/help-ini" (
	goto wscmd.help.ini
)


:wscmd.quiet
if /i "%~1" == "/q" (
	set wscmd.quiet=/q
	if /i "%~2" == "/debug" (
		set wscmd.debug=1
		shift /1
	)
	shift /1
	goto wscmd.2
)


if /i "%~1" == "/compile" (
	set wscmd.compile=1
	shift /1
) else if /i "%~1" == "/embed" (
	set wscmd.compile=2
	shift /1
) else if /i "%~1" == "/debug" (
	set wscmd.debug=1
	shift /1
)


if /i "%~1" == "/js" (
	set wscmd.temp=1
	set wscmd.engine=javascript
	shift /1
) else if /i "%~1" == "/vbs" (
	set wscmd.temp=1
	set wscmd.engine=vbscript
	shift /1
)


if /i "%~1" == "/e" (
	set wscmd.inline=1
	if /i "%~2" == "/p" (
		set wscmd.inproc=1
		set wscmd.script=%3
		shift /1
	) else (
		set wscmd.inproc=
		set wscmd.script=%2
	)
	if defined wscmd.script set wscmd.script=!wscmd.script:~1,-1!
	if defined wscmd.script set wscmd.script=!wscmd.script:""="!
	shift /1
	shift /1
) else (
	set wscmd.inline=
	set wscmd.inproc=
	set wscmd.script=%~1
	if defined wscmd.script if not exist "!wscmd.script!" (
		echo.File not found "!wscmd.script!".

		endlocal
		exit /b 1
	)
	if not defined wscmd.temp (
		rem VBS files only are considered directly, others are JS
		call :wscmd.engine "!wscmd.script!"
	)
	shift /1
)


:wscmd.1


if "%~1" == "" goto wscmd.2
set wscmd.args=%wscmd.args% %1
shift /1
goto wscmd.1


:wscmd.2


if defined wscmd.debug call :wscmd.version>&2


:: Load settings from ini-files
:: there are special macros available to be substituted
:: %~d0 - the disk
:: %~p0 - the path
:: %~n0 - the filename
:: %~x0 - the extension
set wscmd.noimport=
set wscmd.ini.include=
set wscmd.ini.execute=
set wscmd.ini.command=
set wscmd.inifiles=".\%~n0.ini" "%~dpn0.ini"
if not defined wscmd.inline set wscmd.inifiles="!wscmd.script!.ini" ".\%~n0.ini" "%~dpn0.ini"
for %%i in ( !wscmd.inifiles! ) do (
	if not "%%~ni" == "" if exist "%%~i" (
		if defined wscmd.debug echo.Configuring from "%%~i">&2
		for /f "usebackq tokens=1,* delims==" %%k in ( "%%~i" ) do (
			call set wscmd.temp=%%~l
			if defined wscmd.temp (
				if /i "%%k" == "import" (
					if /i "!wscmd.temp!" == "no" (
						set wscmd.noimport=1
					) else (
						set wscmd.ini.include=!wscmd.ini.include! "!wscmd.temp!"
					)
				) else (
					set wscmd.ini.%%k=!wscmd.temp!
				)
			)
		)
		goto wscmd.3
	)
)


:wscmd.3


:: Set defaults
if not defined wscmd.ini.include set wscmd.ini.include=%~dp0js\*.js %~dp0js\win32\*.js %~dp0vbs\win32\*.vbs
if not defined wscmd.ini.execute set wscmd.ini.execute=.\$$$%~n0.wsf
if not defined wscmd.ini.command set wscmd.ini.command=%WINDIR%\system32\cscript.exe //NoLogo
if not defined wscmd.ini.xml-encoding set wscmd.ini.xml-encoding=utf-8
if not defined wscmd.ini.enable-error set wscmd.ini.enable-error=false
if not defined wscmd.ini.enable-debug set wscmd.ini.enable-debug=false
if defined wscmd.noimport set wscmd.ini.include=


:: Compile and link the source with libraries
call :wscmd.compile > "%wscmd.ini.execute%"


:: Compile the script and run it if it is needed
if defined wscmd.compile goto wscmd.stop

if defined wscmd.debug echo.Running:>&2
%wscmd.ini.command% "%wscmd.ini.execute%" %wscmd.args%

:: Reread the ini-file and reload the script
if errorlevel 65535 goto wscmd.start

del "%wscmd.ini.execute%"


:wscmd.stop
endlocal
goto :EOF


:wscmd.engine
set wscmd.engine=javascript
if /i "%~x1" == ".vbs" set wscmd.engine=vbscript
goto :EOF


:wscmd.version
echo.%wscmd.name% Version %wscmd.version%
goto :EOF


:wscmd.help
call :wscmd.version
echo.
echo.Usage:
echo.    %~n0 [/h ^| /help ^| /help-ini ^| /q [/debug]]
echo.    %~n0 [/compile ^| /embed ^| /debug] [/js ^| /vbs] /e [/p] "string" [arguments]
echo.    %~n0 [/compile ^| /embed ^| /debug] [/js ^| /vbs] filename [arguments]
echo.
echo.Valid options are:
echo.    /h, /help  - Display this help
echo.    /help-ini  - Display the description of configurational files
echo.    /q         - Quiet mode, affects when run interactively or through pipes
echo.    /compile   - Compile but not execute. Just store a temporary file
echo.    /embed     - The same as above but embed external scripts into a file
echo.    /debug     - Output debugging information and execute
echo.    /js        - Assume a value as a JavaScript source
echo.    /vbs       - Assume a value as a VBScript code
echo.    /e         - Assume a value as a string to be executed
echo.    /p         - Assume to process each line of file^(s^)
echo.
echo.Extra options are used with /e /p:
echo.    /d         - Opens the file using the system default
echo.    /u         - Opens the file as Unicode
echo.    /a         - Opens the file as ASCII

goto wscmd.stop


:wscmd.help.ini
echo.PREAMBLE
echo.
echo.This page shows how to control a content and behavior of the resulting 
echo.script using configurational files. You can do this using by one of three 
echo.ways. All options described below are common for all of them. 
echo.
echo.1.  Create the "%~n0.ini" file in the same directory where "%~nx0" is 
echo.    located. This file is common and it will be used in all other cases. 
echo.    That means that it will affect on all scripts always if other ways 
echo.    are not used. 
echo.
echo.2.  Create the "%~n0.ini" file in the current directory where some script 
echo.    will be launched. This file will affect on all files launched from the 
echo.    current directory only. 
echo.
echo.3.  Create the "SCRIPT.ini" file (where SCRIPT is a name and an extension 
echo.    of a file). This file will afect on the SCRIPTNAME file only. 
echo.
echo.SYNTAX
echo.
echo.There are three documented options available in ini-files. The syntax for 
echo.all options is common and looks like below:
echo.
echo.    name=value
echo.
echo.You are able to use them in any order but it is recommended to grouup them 
echo.and use as described below:
echo.
echo.import
echo.    This option specifies a path to librarian files that will be linked to 
echo.    the resulting script. Placeholders "*" or "?" are available to specify 
echo.    a group of files. Environment variables are enabled. In addition, you 
echo.    can use the following modifiers to refer to librarian files relatively 
echo.    the location of "%~nx0". Other modifiers are available but useless. 
echo.
echo.    %%~d0 - means a drive letter
echo.    %%~p0 - means a path only
echo.
echo.    There is special value "import=no" that suppresses inclusion of files. 
echo.    Just write out it directly in a custom configurational file to suppress 
echo.    inclusion of any librarian file. 
echo.
echo.execute
echo.    This option defines a name of the resulting file. If it is not specially 
echo.    specified, the default value will be used. 
echo.
echo.command
echo.    This option specifies a binary executable file that will be invoked to 
echo.    launch a script. 
echo.
echo.xml-encoding
echo.    A string that describes the character set encoding used by the resulting 
echo.    XML document. The string may include any of the character sets supported 
echo.    by Microsoft Internet Explorer. The default value is utf-8. 
echo.
echo.enable-error
echo.    A Boolean value. False is the default value. Set to true to allow error 
echo.    messages for syntax or run-time errors in the resulting.wsf file. 
echo.
echo.enable-debug
echo.    A Boolean value. False is the default value. Set to true to enable 
echo.    debugging. If debugging is not enabled, you will be unable to launch 
echo.    the script debugger for a Windows Script file.
echo.
echo.EXAMPLE
echo.
echo.The following example orders to add all js-files and vbs-files relatively 
echo.the directory where "%~nx0" was run. The name of the executed script 
echo.will be created in the current directory with the specified filename. 
echo.The launcher is "CSCRIPT.EXE" with the suppressed banner. 
echo.
echo.    import=%%~dp0\js\*.js
echo.    import=%%~dp0\vbs\*.vbs
echo.    execute=.\$$$%%~n0.wsf
echo.    command=%%windir%%\system32\cscript.exe //nologo

goto wscmd.stop


:wscmd.compile
echo.^<?xml version="1.0" encoding="%wscmd.ini.xml-encoding%" ?^>
echo.
echo.^<package^>
echo.^<job id="wscmd"^>
echo.^<?job error="%wscmd.ini.enable-error%" debug="%wscmd.ini.enable-debug%" ?^>
echo.
echo.^<runtime^>
echo.^<description^>^<^^^![CDATA[Created by %wscmd.name% Version %wscmd.version%
echo.Copyright ^(C^) 2009-2012 Ildar Shaimordanov
echo.]]^>^</description^>
echo.^</runtime^>
echo.^<script language="javascript"^>^<^^^![CDATA[
echo.
echo.var help = function^(^)
echo.{
echo.	WScript.Arguments.ShowUsage^(^);
echo.};
echo.
echo.var alert = echo = print = function^(^)
echo.{
echo.	WScript.Echo(Array.prototype.slice.call(arguments));
echo.};
echo.
echo.var quit = exit = function^(^)
echo.{
echo.	WScript.Quit^(arguments[0]^);
echo.};
echo.
echo.var cmd = shell = function^(^)
echo.{
echo.	var shell = WScript.CreateObject^('WSCript.Shell'^);
echo.	shell.run^('cmd'^);
echo.};
echo.
echo.var sleep = function^(time^)
echo.{
echo.	return WScript.Sleep^(time^);
echo.};
echo.
echo.]]^>^</script^>

if defined wscmd.debug echo.Libraries:>&2

set wscmd.link=include
if "%wscmd.compile%" == "2" set wscmd.link=embed

setlocal
for %%l in ( !wscmd.ini.include! ) do (
	if defined wscmd.debug echo.    "%%~l">&2
	call :wscmd.engine "%%~l"
	call :wscmd.%wscmd.link% "%%~l"
)
endlocal

if defined wscmd.inline (
	if defined wscmd.debug echo.Inline: !wscmd.script!>&2
	if defined wscmd.inproc (
		call :wscmd.inproc
	) else (
		call :wscmd.inline
	)
) else if defined wscmd.script (
	if defined wscmd.debug echo.File: "!wscmd.script!">&2
	call :wscmd.%wscmd.link% "!wscmd.script!"
) else (
	rem Console mode, no inline scripts and no script files
	call :wscmd.%wscmd.link% "%~dpnx0"
)

echo.^</job^>
echo.^</package^>
goto :EOF


:wscmd.include
echo.^<script language="%wscmd.engine%" src="%~f1"^>^</script^>
goto :EOF


:wscmd.embed
echo.^<^^^!-- "%~1" --^>
echo.^<script language="%wscmd.engine%"^>^<^^^![CDATA[
echo.
type "%~1"
echo.
echo.]]^>^</script^>
goto :EOF


:wscmd.inline
echo.^<script language="%wscmd.engine%"^>^<^^^![CDATA[
echo.
echo.!wscmd.script!%~2
echo.
echo.]]^>^</script^>
goto :EOF


:wscmd.inproc
call :wscmd.inproc.%wscmd.engine%
setlocal
set wscmd.engine=javascript
call :wscmd.%wscmd.link% "%~dpnx0"
endlocal
goto :EOF


:wscmd.inproc.javascript
echo.^<script language="javascript"^>^<^^^![CDATA[
echo.
echo.//@cc_on
echo.//@set @user_inproc_mode = 2
echo.
echo.var userFunc = function^(line, lineNumber, filename, fso, stdin, stdout, stderr^)
echo.{
echo.	!wscmd.script!;
echo.	return line;
echo.};
echo.
echo.]]^>^</script^>
goto :EOF


:wscmd.inproc.vbscript
echo.^<script language="javascript"^>^<^^^![CDATA[
echo.
echo.//@cc_on
echo.//@set @user_inproc_mode = 1
echo.
echo.]]^>^</script^>
echo.^<script language="vbscript"^>^<^^^![CDATA[
echo.
echo.Function userFunc^(line, lineNumber, filename, fso, stdin, stdout, stderr^)
echo.	!wscmd.script!
echo.	userFunc = line
echo.End Function
echo.
echo.]]^>^</script^>
goto :EOF


@goto:eof */


(function()
{
//@cc_on
//@if ( ! @user_inproc_mode )
	return;
//@end

//@if ( @user_inproc_mode == 2 )
	var userFunc = this.userFunc;
	var userFuncBefore = this.userFuncBefore;
	var userFuncAfter = this.userFuncAfter;
//@end

	var fso = new ActiveXObject('Scripting.FileSystemObject');

	var format = 0;

	var args = WScript.Arguments;
	if ( args.length == 0 ) {
		// Emulate empty list of arguments
		args = ['-'];
		args.item = function(i) { return this[i]; };
	}
	for (var i = 0; i < args.length; i++) {
		var arg = args.item(i);

		// Opens the file using the system default
		if ( arg == '/D' || arg == '/d' ) {
			format = -2;
			continue;
		}

		// Opens the file as Unicode
		if ( arg == '/U' || arg == '/u' ) {
			format = -1;
			continue;
		}

		// Opens the file as ASCII
		if ( arg == '/A' || arg == '/a' ) {
			format = 0;
			continue;
		}

		var stream;
		var isFile;

		var e;
		try {
			if ( arg == '-' ) {
				stream = WScript.StdIn;
				arg = '<stdin>';
				isFile = false;
			} else {
				stream = fso.OpenTextFile(arg, 1, false, format);
				isFile = true;
			}
		} catch (e) {
			WScript.StdErr.WriteLine(e.message + ': ' + arg);
			continue;
		}

		// Prevent fail of reading out of STDIN stream
		// The real exception number is 800a005b
		// Object variable or With block variable not set
		try {
			stream.AtEndOfStream;
		} catch (e) {
			WScript.StdErr.WriteLine('Out of stream: ' + arg);
			continue;
		}

		var lineNumber = 0;
		while ( ! stream.AtEndOfStream ) {
			lineNumber++;
			var line = stream.ReadLine();
			try {
				line = userFunc(
					line, lineNumber, arg, 
					fso, WScript.StdIn, WScript.StdOut, WScript.StdErr);
			} catch (e) {
				stream.Close();
				WScript.StdErr.WriteLine(e.message);
				WScript.Quit();
			}
			if ( line !== void 0 ) {
				WScript.StdOut.WriteLine(line);
			}
		}

		if ( isFile ) {
			stream.Close();
		}
	}

	WScript.Quit();
})();

/*!
*/

/**
 *
 * Useful functions
 *
 */
var help = (function()
{
	var helpMsg = '\n' 
		+ 'Commands                 Descriptions\n' 
		+ '========                 ============\n' 
		+ 'help()                   Display this help\n' 
		+ 'alert(), echo(), print() Print expressions\n' 
		+ 'quit(), exit()           Quit this shell\n' 
		+ 'eval.history             Display the history\n' 
		+ 'eval.save([format])      Save the history to the file\n' 
		+ 'eval.transform           The stub to transform output additionally\n' 
		+ 'cmd(), shell()           Run new DOS-session\n' 
		+ 'sleep(n)                 Sleep n milliseconds\n' 
		+ 'reload()                 Stop this session and run new\n' 
		+ 'gc()                     Run the garbage collector\n' 
		;
	return function()
	{
		WScript.Echo(helpMsg);
	};
})();

var alert = echo = print = function()
{
	var result = '';

	if ( arguments.length == 0 ) {
		return result;
	}

	result = arguments[0];
	for (var i = 1; i < arguments.length; i++) {
		result += ',' + arguments[i];
	}
	WScript.Echo(result);
};

var quit = exit = function()
{
	WScript.Quit(arguments[0]);
};

var cmd = shell = function()
{
	var shell = WScript.CreateObject('WSCript.Shell');
	shell.run('cmd');
};

var sleep = function(time)
{
	return WScript.Sleep(time);
};

var reload = function()
{
	WScript.Quit(65535);
};

var gc = CollectGarbage;

/**
 *
 * Enabled in the CLI mode ONLY
 *
 */
if ( ! WScript.FullName.match(/cscript/i) ) {
	help();
	exit();
}

/**
 *
 * The line number
 *
 */
eval.number = 0;

/**
 *
 * The history of commands
 *
 */
eval.history = '';

eval.save = function(format)
{
	var fso = new ActiveXObject('Scripting.FileSystemObject');

	var f = fso.OpenTextFile('.\\wscmd.history', 8, true, format);
	f.Write(eval.history);
	f.Close();
};

while ( true ) {

	var e;
	try {

		// String contains result of eval'd string
		(function(result)
		{
			if ( result === void 0 ) {
				return;
			}
			if ( typeof eval.transform == 'function' ) {
				result = eval.transform(result);
			}
			WScript.Echo(result);
		})
		(eval((function(PS1, PS2)
		{

			var env = WScript.CreateObject('WScript.Shell').Environment('PROCESS');
			if ( env('wscmd.quiet') ) {
				PS1 = '';
				PS2 = '';
			}

			/*
			Validate that a user started multiple lines ending 
			with the backslash character '\\'. 

			The number of tailing backslashes affects on the 
			behavior of the input. 

			When a user ends a line with the single backslash 
			it will be considered as continuing on next lines 
			until a user enters an empty line. 

			When a user enters a line only with two 
			backslashes then it will be considered as 
			multilinear entering as well. 
			The main difference with the first case is a 
			possibility to enter any number of empty lines. 
			*/
			var multiline = 0

			/*
			Store all characters entered from STDIN. 

			Array is used to prevent usage of String.charAt that can be 
			overriden. This makes the code the safer. 
			*/
			var result = [];

			WScript.StdOut.Write(PS1);

			while ( true ) {

				// One entered line as an array of characters
				var input = (function()
				{
					var e;
					try {
						eval.number++;
						return (function()
						{
							var result = [];
							while ( ! WScript.StdIn.AtEndOfLine ) {
								result[result.length] = WScript.StdIn.Read(1);
							}
							WScript.StdIn.ReadLine();
							return result;
						})();
					} catch (e) {
						return ['q', 'u', 'i', 't', '(', ')'];
					}
				})();

				if ( input.length == 0 && multiline != 2 ) {
					break;
				}

				if ( input.length == 2 && input[0] + input[1] == '\\\\' ) {
					input.length -= 2;
					multiline = multiline == 2 ? 0 : 2;
				} else if ( input[input.length - 1] == '\\' ) {
					input.length--;
					if ( ! multiline ) {
						multiline = 1;
					}
				}

				// Add the new line character in the multiline mode
				if ( result.length ) {
					result[result.length] = '\n';
				}

				for (var i = 0; i < input.length; i++) {
					result[result.length] = input[i];
				}

				if ( ! multiline ) {
					break;
				}

				WScript.StdOut.Write(PS2);

			} // while ( true )

			// Trim left
			var k = 0;
			while ( result[k] <= ' ' ) {
				k++;
			}
			// Trim right
			var m = result.length - 1;
			while ( result[m] <= ' ' ) {
				m--;
			}

			var history = '';
			for (var i = k; i <= m; i++) {
				history += result[i];
			}
			if ( history == '' ) {
				return '';
			}

			if ( eval.history ) {
				eval.history += '\n';
			}
			eval.history += history;
			return history;

		})('wscmd > ', 'wscmd :: ')));

	} catch (e) {

		WScript.Echo(WScript.ScriptName + ': "<stdin>", line ' + eval.number + ': ' + e.name + ': ' + e.message);

	}

}

WScript.Quit();

