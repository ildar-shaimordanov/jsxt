@set @wscmd=0 /*!
@set @wscmd=
@echo off


setlocal enabledelayedexpansion


set wscmd.started=


:wscmd.start


:: Set the name and version
set wscmd.name=Windows Scripting Command Interpreter
set wscmd.version=0.15.0 Beta


:: Prevent re-parsing of command line arguments
set wscmd.started>nul 2>&1 && goto wscmd.2
set wscmd.started=1


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
set wscmd.ini.include=
set wscmd.ini.execute=
set wscmd.ini.command=
set wscmd.inifiles=".\%~n0.ini" "%~dpn0.ini"
if not defined wscmd.inline (
	set wscmd.inifiles="!wscmd.script!.ini" ".\%~n0.ini" "%~dpn0.ini"
)
for %%i in ( %wscmd.inifiles% ) do (
	if not "%%~ni" == "" if exist "%%~i" (
		if defined wscmd.debug echo.Configuring from "%%~i">&2
		for /f "usebackq tokens=1,* delims==" %%k in ( "%%~i" ) do (
			call set wscmd.temp=%%~l
			if defined wscmd.temp (
				if /i "%%k" == "import" (
					set wscmd.ini.include=!wscmd.ini.include! "!wscmd.temp!"
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
echo.    %~n0 [/h ^| /help ^| /q [/debug]]
echo.    %~n0 [/compile ^| /embed ^| /debug] [/js ^| /vbs] /e [/p] "string" [arguments]
echo.    %~n0 [/compile ^| /embed ^| /debug] [/js ^| /vbs] filename [arguments]
echo.
echo.Valid options are:
echo.    /h, /help  - Display this help
echo.    /q         - Quiet mode, affects when run interactively or through pipes
echo.    /compile   - Compile but not execute. Just store a temporary file on a disk
echo.    /embed     - Embed external scripts into the resulting file
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


:wscmd.compile
echo.^<?xml version="1.0" encoding="utf-8" ?^>
echo.
echo.^<package^>
echo.^<job id="wscmd"^>
echo.^<?job error="true" debug="false" ?^>
echo.
echo.^<runtime^>
echo.^<description^>^<^^^![CDATA[%wscmd.name% Version %wscmd.version%
echo.Copyright ^(C^) 2009, 2010, 2011 Ildar Shaimordanov
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
		call :wscmd.inproc.%wscmd.engine%
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


:wscmd.inproc.javascript
echo.^<script language="javascript"^>^<^^^![CDATA[
echo.
echo.var userFunc = function^(line, lineNumber, filename, fso, stdin, stdout, stderr^)
echo.{
echo.	!wscmd.script!;
echo.	userFunc = arguments.callee;
echo.	return line;
echo.};
echo.
echo.]]^>^</script^>
call :wscmd.inproc
goto :EOF


:wscmd.inproc.vbscript
echo.^<script language="vbscript"^>^<^^^![CDATA[
echo.
echo.Function userFunc^(line, lineNumber, filename, fso, stdin, stdout, stderr^)
echo.	!wscmd.script!
echo.	userFunc = line
echo.End Function
echo.
echo.]]^>^</script^>
call :wscmd.inproc
goto :EOF


:wscmd.inproc
echo.^<script language="javascript"^>^<^^^![CDATA[
echo.
echo.^(function^(^)
echo.{
echo.	var fso = new ActiveXObject^('Scripting.FileSystemObject'^);
echo.
echo.	var format = 0;
echo.	var lineNumber = 0;
echo.
echo.	var args = WScript.Arguments;
echo.	if ^( args.length == 0 ^) {
echo.		// Emulate empty list of arguments
echo.		args = ['-'];
echo.		args.item = function^(i^) { return this[i]; };
echo.	}
echo.	for ^(var i = 0; i ^< args.length; i++^) {
echo.		var arg = args.item^(i^);
echo.
echo.		if ^( arg == '/D' ^|^| arg == '/d' ^) {
echo.			format = -2;
echo.			continue;
echo.		}
echo.
echo.		if ^( arg == '/U' ^|^| arg == '/u' ^) {
echo.			format = -1;
echo.			continue;
echo.		}
echo.
echo.		if ^( arg == '/A' ^|^| arg == '/a' ^) {
echo.			format = 0;
echo.			continue;
echo.		}
echo.
echo.		var e;
echo.		try {
echo.			var stream = arg == '-' ? WScript.StdIn : fso.OpenTextFile^(arg, 1, false, format^);
echo.		} catch ^(e^) {
echo.			WScript.StdErr.Writeline^(e.message + ': ' + arg^);
echo.			continue;
echo.		}
echo.
echo.		while ^( ^^^! stream.AtEndOfStream ^) {
echo.			lineNumber++;
echo.			var line = stream.readline^(^);
echo.			try {
echo.				line = userFunc^(
echo.					line, lineNumber, arg, 
echo.					fso, WScript.StdIn, WScript.StdOut, WScript.StdErr^);
echo.			} catch ^(e^) {
echo.				stream.Close^(^);
echo.				WScript.StdErr.WriteLine^(e.message^);
echo.				WScript.Quit^(^);
echo.			}
echo.			if ^( line ^^^!== void 0 ^) {
echo.				WScript.StdOut.WriteLine^(line^);
echo.			}
echo.		}
echo.
echo.		stream.Close^(^);
echo.	}
echo.}^)^(^);
echo.
echo.]]^>^</script^>
goto :EOF


@goto:eof */

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

