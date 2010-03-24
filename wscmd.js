@set @x=0 /*
@echo off


setlocal


:: Load settings from ini-files
for %%i in ( "%~dpn0.ini.bat" ".\%~n0.ini.bat" ) do (
	if exist "%%~i" call "%%~i"
)


:: Set defaults
if not defined wscmd.include set wscmd.include=%~dp0js\*.js %~dp0js\win32\*.js
if not defined wscmd.execute set wscmd.execute=%~dp0$$$%~n0.wsf
if not defined wscmd.command set wscmd.command=cscript //NoLogo //H:CScript


:: Parse command line arguments
if "%~1" == "" (
rem	%wscmd.command% //E:javascript "%~dpnx0" %*

rem	endlocal
rem	goto :EOF

	set wscmd.script=%~f0
	set wscmd.engine=.js
	shift
	goto parse_1
) 


if /i "%~1" == "/h" (
	set wscmd.inline="help()"
	set wscmd.engine=.js
	shift
	goto parse_1
)


if /i "%~1" == "/compile" (
	set wscmd.compile=1
	shift
)

if /i "%~1" == "/js" (
	set wscmd.engine=.js
	shift
) else if /i "%~1" == "/vbs" (
	set wscmd.engine=.vbs
	shift
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
	shift
	shift
) else (
	set wscmd.script=%1
	shift
)

:parse_1
if "%~1" == "" goto parse_2
set wscmd.args=%wscmd.args% %1
shift
goto parse_1

:parse_2


:: Compile and link the source with libraries
call :wscmd.compile > "%wscmd.execute%"


:: Run the final script
if not defined wscmd.compile (
	%wscmd.command% "%wscmd.execute%" %wscmd.args%
	del "%wscmd.execute%"
)


endlocal
goto :EOF


:wscmd.compile
call :wscmd.head
for %%l in ( %wscmd.include% ) do (
	call :wscmd.include%%~xl "%%l"
)
if defined wscmd.script (
	call :wscmd.include%wscmd.engine% %wscmd.script%
) else (
	call :wscmd.inline%wscmd.engine% %wscmd.inline%
)
call :wscmd.tail
goto :EOF


:wscmd.head
echo.^<?xml version="1.0" encoding="utf-8" ?^>
echo.
echo.^<package^>
echo.^<job id="wscmd"^>
echo.^<?job error="true" debug="false" ?^>
echo.
echo.^<runtime^>
echo.^<description^>^<![CDATA[Windows Scripting Command Interpreter Version 0.9.0 Beta
echo.Copyright ^(C^) 2009, 2010 Ildar Shaimordanov
echo.]]^>^</description^>
echo.^<named
echo.    name="JS"
echo.    helpstring="Assume a value as a JavaScript source."
echo.    type="simple"
echo.    required="false"
echo./^>
echo.^<named
echo.    name="VBS"
echo.    helpstring="Assume a value as a VBScript source."
echo.    type="simple"
echo.    required="false"
echo./^>
echo.^<named
echo.    name="E"
echo.    helpstring="Assume a value as a string to be executed."
echo.    type="simple"
echo.    required="false"
echo./^>
echo.^<unnamed
echo.    name="source"
echo.    helpstring="A filename or a string to be executed."
echo.    type="string"
echo.    required="false"
echo./^>
echo.^<named
echo.    name="H"
echo.    helpstring="Display this help."
echo.    type="simple"
echo.    required="false"
echo./^>
echo.^</runtime^>
echo.^<script language="javascript"^>^<![CDATA[
echo.
echo.var alert = echo = print = function^(^)
echo.{
echo.    WScript.Echo(Array.prototype.slice.call^(arguments^).join^(' '^)^);
echo.};
echo.
echo.var quit = exit = function^(^)
echo.{
echo.    WScript.Quit^(arguments[0]^);
echo.};
echo.
echo.var help = function^(^)
echo.{
echo.    WScript.Arguments.ShowUsage^(^);
echo.};
echo.
echo.]]^>^</script^>
goto :EOF


:wscmd.include.js
echo.^<script language="javascript" src="%~f1"^>^</script^>
goto :EOF


:wscmd.include.vbs
echo.^<script language="vbscript" src="%~f1"^>^</script^>
goto :EOF


:wscmd.inline.js
echo.^<script language="javascript"^>^<![CDATA[
echo.
echo.eval^(%1^);
echo.
echo.]]^>^</script^>
goto :EOF


:wscmd.inline.vbs
echo.^<script language="vbscript"^>^<![CDATA[
echo.
echo.Eval %1
echo.
echo.]]^>^</script^>
goto :EOF


:wscmd.tail
echo.^</job^>
echo.^</package^>
goto :EOF


@goto:eof */


/**
 *
 * Useful functions
 *
 */
var alert = echo = print = function()
{
	WScript.Echo(Array.linearize(arguments).join(' '));
};

var quit = exit = function()
{
	WScript.Quit(arguments[0]);
};

var help = function()
{
	WScript.Arguments.ShowUsage();
};

/**
 *
 * Enabled in the CLI mode ONLY
 *
 */
if ( ! WScript.FullName.match(/cscript/i) || WScript.Arguments.Named.Exists('H') ) {
	help();
	exit();
}

/**
 *
 * Interactive mode
 *
 */
while ( true ) {

	var result;

	var e;
	try {

		result = eval((function(PS1, PS2)
		{
			var stack = [];
			var quote = false;
			var regex = false;
			var slash = false;
			var expr = false;

			var result = '';

			var input;
			var i;
			var c;

			WScript.StdOut.Write(PS1);

			while ( true ) {

				input = (function()
				{
					var e;
					try {
						return WScript.StdIn.ReadLine();
					} catch (e) {
						return 'quit()';
					}
				})();

				i = 0;
				while ( i < input.length ) {

					c = input.charAt(i);
					i++;

					// Store [a-z0-9_], \] or \) state to differ 
					// regexes and division in expressions
					expr = ( (/[\w\)\]\.]/).test(c) || (/[^:,;\[\(!\&\|=]/).test(c) ) && ! regex && ! quote;

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

				} // while ( i < input.length )

				result += input;

				if ( stack.length == 0 && ! quote && ! regex ) {
					break;
				}

				WScript.StdOut.Write(PS2);

			}; // while ( true )

			return result;
		})('wscmd > ', 'wscmd :: '));

		if ( result !== undefined ) {
			WScript.Echo(result);
		}

	} catch (e) {

		WScript.Echo('name\t:\t' + e.name);
		WScript.Echo('message\t:\t' + e.message);
		WScript.Echo('line\t:\t' + ((e.number >> 0x10) & 0x1FFF));
		WScript.Echo('code\t:\t' + (e.number & 0xFFFF));

	}

}

WScript.Quit();

