@set @wscmd=0 /*
@set @wscmd=
@echo off


setlocal enabledelayedexpansion


:: Load settings from ini-files
:: there are special macros available to be substituted
:: %~d0 - the disk
:: %~p0 - the path
:: %~n0 - the filename
:: %~x0 - the extension
for %%i in ( "%~dpn0.ini" ".\%~n0.ini" ) do (
	if exist "%%~i" (
		for /f "usebackq tokens=1,* delims==" %%k in ( "%%~i" ) do (
			set wscmd.temp=%%~l
			if defined wscmd.temp (
				set wscmd.temp=!wscmd.temp:%%~d0=%~d0!
				set wscmd.temp=!wscmd.temp:%%~p0=%~p0!
				set wscmd.temp=!wscmd.temp:%%~n0=%~n0!
				set wscmd.temp=!wscmd.temp:%%~x0=%~x0!
				set wscmd.ini.%%k=!wscmd.temp!
			)
		)
	)
)


:: Set the name and version
set wscmd.name=Windows Scripting Command Interpreter
set wscmd.version=0.9.17 Beta


:: Set defaults
if not defined wscmd.ini.include set wscmd.ini.include=%~dp0js\*.js %~dp0js\win32\*.js %~dp0vbs\win32\*.vbs
if not defined wscmd.ini.execute set wscmd.ini.execute=.\$$$%~n0.wsf
if not defined wscmd.ini.command set wscmd.ini.command=%WINDIR%\system32\cscript.exe //NoLogo


:: Parse command line arguments and set needful variables
set wscmd.temp=
set wscmd.inline=
set wscmd.script=
set wscmd.engine=.js
set wscmd.compile=
set wscmd.debug=
set wscmd.quiet=


if "%~1" == "" (
	shift /1
	goto wscmd.2
)


if /i "%~1" == "/q" (
	set wscmd.quiet=/q
	shift /1
	goto wscmd.2
)


if /i "%~1" == "/h" (
	goto wscmd.help
)


if /i "%~1" == "/help" (
	goto wscmd.help
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
	set wscmd.engine=.js
	shift /1
) else if /i "%~1" == "/vbs" (
	set wscmd.engine=.vbs
	shift /1
) else (
	set wscmd.engine=.js
)


if /i "%~1" == "/e" (
	if "%~2" == "" (
		echo.No code specified for /e.

		endlocal
		exit /b 1
	)
	set wscmd.inline=%2
	set wscmd.script=
	shift /1
	shift /1
) else (
	set wscmd.inline=
	set wscmd.script=%~1
	rem VBS files only are considered directly, others are JS
	if /i "%~x1" == ".vbs" set wscmd.engine=%~x1
	shift /1
)


:wscmd.1
if "%~1" == "" goto wscmd.2
set wscmd.args=%wscmd.args% %1
shift /1
goto wscmd.1

:wscmd.2


:: Compile and link the source with libraries
call :wscmd.compile > "%wscmd.ini.execute%"


:: Run the final script
if not defined wscmd.compile (
	if defined wscmd.debug echo.Running:>&2
	%wscmd.ini.command% "%wscmd.ini.execute%" %wscmd.quiet% %wscmd.args%
	del "%wscmd.ini.execute%"
)


:wscmd.stop
endlocal
goto :EOF


:wscmd.help
echo.%wscmd.name% Version %wscmd.version%
echo.
echo.Usage:
echo.    %~n0 [/h ^| /help ^| /q]
echo.    %~n0 [/compile ^| /embed ^| /debug] [/js ^| /vbs] [/e "source" ^| filename [arguments]]
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
echo.Copyright ^(C^) 2009, 2010 Ildar Shaimordanov
echo.]]^>^</description^>
echo.^</runtime^>
echo.^<script language="javascript"^>^<^^^![CDATA[
echo.
echo.var help = function^(^)
echo.{
echo.    WScript.Arguments.ShowUsage^(^);
echo.};
echo.
echo.var alert = echo = print = function^(^)
echo.{
echo.    WScript.Echo(Array.prototype.slice.call(arguments));
echo.};
echo.
echo.var quit = exit = function^(^)
echo.{
echo.    WScript.Quit^(arguments[0]^);
echo.};
echo.
echo.]]^>^</script^>

if defined wscmd.debug echo.Libraries:>&2

set wscmd.link=include
if "%wscmd.compile%" == "2" set wscmd.link=embed

for %%l in ( %wscmd.ini.include% ) do (
	if defined wscmd.debug echo.    "%%~l">&2
	call :wscmd.%wscmd.link%%%~xl "%%l"
)

if defined wscmd.script (
	if defined wscmd.debug echo.File: "%wscmd.script%">&2
	call :wscmd.%wscmd.link%%wscmd.engine% %wscmd.script%
) else if defined wscmd.inline (
	if defined wscmd.debug echo.Inline: %wscmd.inline%>&2
	call :wscmd.inline%wscmd.engine%
) else (
	rem Console mode, no inline scripts and no script files
	call :wscmd.%wscmd.link%%wscmd.engine% "%~dpnx0"
)

echo.^</job^>
echo.^</package^>
goto :EOF


:wscmd.include.js
call :wscmd.include "%~1" javascript
goto :EOF


:wscmd.include.vbs
call :wscmd.include "%~1" vbscript
goto :EOF


:wscmd.include
echo.^<script language="%~2" src="%~f1"^>^</script^>
goto :EOF


:wscmd.embed.js
call :wscmd.embed "%~1" javascript
goto :EOF


:wscmd.embed.vbs
call :wscmd.embed "%~1" vbscript
goto :EOF


:wscmd.embed
echo.^<^^^!-- "%~1" --^>
echo.^<script language="%2"^>^<^^^![CDATA[
echo.
type "%~1"
echo.
echo.]]^>^</script^>
goto :EOF


:wscmd.inline.js
call :wscmd.inline javascript ";"
goto :EOF


:wscmd.inline.vbs
call :wscmd.inline vbscript
goto :EOF


:wscmd.inline
set wscmd.inline=!wscmd.inline:~1,-1!
echo.^<script language="%1"^>^<^^^![CDATA[
echo.
echo.!wscmd.inline!%~2
echo.
echo.]]^>^</script^>
goto :EOF


@goto:eof */


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
		var result = eval((function(PS1, PS2)
		{
			if ( WScript.Arguments.Named.Exists('Q') ) {
				PS1 = '';
				PS2 = '';
			}

			var stack = [];
			var quote = false;
			var regex = false;
			var slash = false;
			var expr = false;

			// Store all charactrrs enetred from STDIN.
			// Array is used to prevent usage of String.charAt
			// This makes the code the safer
			// Look for comments maked with NOTE!!!
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

				for (var i = 0; i < input.length; i++) {

					// NOTE!!!
					// Array instead string makes the code the safer.
					// So redeclared or deleted method String.charAt will
					// not bring to crash of the code. 
					var c = input[i];

					// Store the state of [a-z0-9_], or \] or \) to 
					// differ regexes and division in expressions
					// Use the direct comparacy with chacarters instead 
					// of the regex testing to bypass possible problems
					//expr = ( (/[\w\)\]\.]/).test(c) || (/[^:,;\[\(!\&\|=]/).test(c) ) && ! regex && ! quote;
					expr = ( 
							(
								c >= 'a' && c <= 'z' 
								|| 
								c >= 'A' && c <= 'Z' 
								|| 
								c >= '0' && c <= '9' 
								|| 
								c == '_' 
								|| 
								c == ')' 
								|| 
								c == ']' 
								|| 
								c == '.' 
							) 
							|| 
							(
								c != ':' 
								|| 
								c != ',' 
								|| 
								c != ';' 
								|| 
								c != '[' 
								|| 
								c != '(' 
								|| 
								c != '!' 
								|| 
								c != '&' 
								|| 
								c != '|' 
								|| 
								c != '=' 
							) 
						)
						&& 
						! regex 
						&& 
						! quote;

					// SLASH is special character
					if ( slash ) {
						slash = false;
						continue;
					}

					slash = c == '\\';

					// Process literal strings
					if ( c == '\'' || c == '\"' ) {
						if ( regex ) {
							continue;
						}

						if ( slash ) {
							continue;
						}

						if ( quote ) {
							if ( c == stack[stack.length - 1] ) {
								quote = false;
								stack.length--;
							}
						} else {
							quote = true;
							stack[stack.length] = c;
						}

						continue;
					}

					// Process regular expressions
					if ( c == '/' ) {
						if ( quote ) {
							continue;
						}

						if ( slash ) {
							continue;
						}

						if ( regex ) {
							if ( c == stack[stack.length - 1] ) {
								regex = false;
								stack.length--;
							}
						} else {
							if ( expr ) {
								expr = false;
								continue;
							}
							regex = true;
							stack[stack.length] = c;
						}

						continue;
					}

					// Store on the stack opening brackets
					if ( c == '[' || c == '(' || c == '{' ) {
						stack[stack.length] = c;
						continue;
					}

					// Release stack when closing brackets arise
					var o = stack[stack.length - 1];
					if (
						o == '[' && c == ']' 
						|| 
						o == '(' && c == ')' 
						|| 
						o == '{' && c == '}' 
					) {
						stack.length--;
					}

				}; // for (var i = 0; i < input.length; i++)

				for (var i = 0; i < input.length; i++) {
					result[result.length] = input[i];
				}

				if ( stack.length == 0 && ! quote && ! regex ) {
					break;
				}

				WScript.StdOut.Write(PS2);

			}; // while ( true )

			// Use the direct comparacy with chacarters instead 
			// of the regex testing to bypass possible problems
			//if ( ! (/^\s*$/).test(result) ) {
			//	eval.history += ( eval.history ? '\n' : '' ) + result;
			//}
			var is_empty = true;
			var history = '';
			for (var i = 0; i < result.length; i++) {
				var c = result[i];
				is_empty = is_empty && c <= ' ';
				history += result[i];
			}
			if ( is_empty ) {
				return '';
			}
			if ( eval.history ) {
				eval.history += '\n';
			}
			eval.history += history;
			return history;
		})('wscmd > ', 'wscmd :: '));

		if ( result !== undefined ) {
			WScript.Echo(result);
		}

	} catch (e) {

		WScript.Echo(WScript.ScriptName + ': "<stdin>", line ' + eval.number + ': ' + e.name + ': ' + e.message);

	}

}

WScript.Quit();

