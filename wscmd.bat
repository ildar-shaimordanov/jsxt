@set @wscmd=0 /*!
@set @wscmd=
@echo off


setlocal enabledelayedexpansion


set wscmd.started=1


:wscmd.start


:: Set the name and version
set wscmd.name=Windows Scripting Command
set wscmd.version=0.20.1 Beta


:: Prevent re-parsing of command line arguments
if not defined wscmd.started goto wscmd.2
set wscmd.started=


:: Parse command line arguments and set needful variables
set wscmd.temp=
set wscmd.inline=
set wscmd.inproc=
set wscmd.script=
set wscmd.script.n=
set wscmd.script.p=
set wscmd.script.begin=
set wscmd.script.end=
set wscmd.script.before=
set wscmd.script.after=
set wscmd.engine=javascript
set wscmd.var=
set wscmd.compile=
set wscmd.debug=
set wscmd.quiet=


:: Interactive mode
if "%~1" == "" (
	goto wscmd.2
)


:: Help
if /i "%~1" == "/h" (
	goto wscmd.help
)

if /i "%~1" == "/help" (
	goto wscmd.help
)


:: Configartion file manual
if /i "%~1" == "/man" (
	goto wscmd.man
)


:: Compiling and debugging modes
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


:: Variable definition
:wscmd.var.again
if /i not "%~1" == "/v" goto wscmd.var.end

	set wscmd.var=!wscmd.var!var %2 = %3;
	shift /1
	shift /1
	shift /1

goto wscmd.var.again
:wscmd.var.end

if defined wscmd.var (
	set wscmd.var="!wscmd.var!"
	call :wscmd.unquote wscmd.var
)


:: Explicit usage of interactive mode
if /i "%~1" == "/i" (
	shift /1
	goto wscmd.1
) else if /i "%~1" == "/q" (
	set wscmd.quiet=/q
	shift /1
	goto wscmd.1
)


:: What language will be used
if /i "%~1" == "/js" (
	set wscmd.engine=javascript
	shift /1
) else if /i "%~1" == "/vbs" (
	set wscmd.engine=vbscript
	shift /1
)


:: Code or script file
if /i "%~1" == "/e" goto wscmd.opt.e.1

	rem wscmd ... "filename" ...
	set wscmd.inline=
	set wscmd.inproc=
	set wscmd.script=%~1
	if defined wscmd.script if not exist "!wscmd.script!" (
		echo.File not found "!wscmd.script!".

		endlocal
		exit /b 1
	)
	call :wscmd.engine "!wscmd.script!"
	shift /1

goto wscmd.opt.e.2
:wscmd.opt.e.1

	rem wscmd ... /e ... "string" ...
	set wscmd.inline=1
	set wscmd.inproc=

:wscmd.opt.e.again

	for %%k in ( p n begin end before after ) do (
		if /i "%~2" == "/%%~k" (
			set wscmd.inproc=1
			set wscmd.script.%%~k=%3
			call :wscmd.unquote wscmd.script.%%~k
			shift /1
			shift /1
			goto wscmd.opt.e.again
		)
	)

	rem wscmd ... /e "string" ...
	if not defined wscmd.inproc (
		set wscmd.script=%2
		call :wscmd.unquote wscmd.script
		shift /1
	)

	shift /1

:wscmd.opt.e.2


:wscmd.1


:: Parse program arguments
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


:wscmd.unquote
if !%1! == "" set %1=" "
if defined %1 set %1=!%1:~1,-1!
if defined %1 set %1=!%1:""="!
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
echo.%~n0 [/h ^| /help ^| /man]
echo.%~n0 [/compile ^| /embed] [/v var val] [/i ^| /q]
echo.%~n0 [/compile ^| /embed] [/v var val] [/js ^| /vbs] /e "code"
echo.%~n0 [/compile ^| /embed] [/v var val] [/js ^| /vbs] scriptfile
echo.%~n0 [/debug] [/v var val] [/i ^| /q] [arguments]
echo.%~n0 [/debug] [/v var val] [/js ^| /vbs] /e "code" [arguments]
echo.%~n0 [/debug] [/v var val] [/js ^| /vbs] scriptfile [arguments]
echo.
echo.    /h, /help    - Display this help
echo.    /man         - Display the description of configuration files
echo.    /compile     - Compile but not execute. Just store to a temporary file
echo.    /embed       - The same as above but embed external scripts into a file
echo.    /debug       - Output debugging information and execute
echo.    /v var val   - Assign the value "val" to the variable "var", before
echo.                   execution of the program begins
echo.    /i           - Interactive mode
echo.    /q           - The same as /i but in quiet mode
echo.    /js          - Assume a value as a JavaScript
echo.    /vbs         - Assume a value as a VBScript
echo.    /e "code"    - Assume a value as a code to be executed
echo.    /e /n "code" - Apply the code in a loop per each line of file^(s^)
echo.    /e /p "code" - The same as /e /n but print a line also
echo.
echo.Extra options are available with /e /n or /e /p:
echo.    /d file      - Opens the file using the system default
echo.    /u file      - Opens the file as Unicode
echo.    /a file      - Opens the file as ASCII
echo.
echo.Extra options are used like /n or /p
echo.    /begin       - Assume a code to be executed at the very beginning
echo.    /end         - Assume a code to be executed at the very end
echo.    /before      - Assume a code to be executed before a file
echo.    /after       - Assume a code to be executed after a file

goto wscmd.stop


:wscmd.man
echo.PREAMBLE
echo.
echo.This page shows how to control a content and behavior of the resulting 
echo.script using configuration files. You can do this using by one of three 
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
echo.    of a file). This file will affect on the SCRIPTNAME file only. 
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
echo.var help = usage = function^(^)
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
echo.var clip = function^(^)
echo.{
echo.	return new ActiveXObject^('htmlfile'^).parentWindow.clipboardData.getData^('Text'^);
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

if defined wscmd.var (
	if defined wscmd.debug (
		echo.Variables:
		echo.    !wscmd.var!
	)>&2

echo.^<script language="javascript"^>^<^^^![CDATA[
echo.
echo.!wscmd.var!;
echo.
echo.]]^>^</script^>
)

if defined wscmd.inline (
	if defined wscmd.debug (
		echo.Inline:
		if defined wscmd.script (
			echo.    !wscmd.script!
		) else (
			if defined wscmd.script.begin  echo.    !wscmd.script.begin!
			echo.    for each file {
			if defined wscmd.script.before echo.      !wscmd.script.before!
			echo.      while not EOF {
			if defined wscmd.script.n      echo.        !wscmd.script.n!
			if defined wscmd.script.p      echo.        !wscmd.script.p!
			if defined wscmd.script.p      echo.        print line
			echo.      end while
			if defined wscmd.script.after  echo.      !wscmd.script.after!
			echo.    end for
			if defined wscmd.script.end    echo.    !wscmd.script.end!
		)
	)>&2
rem	if defined wscmd.debug echo.Inline: !wscmd.script!>&2
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
echo.var userFunc = function^(line, currentNumber, filename, lineNumber, fso, stdin, stdout, stderr^)
echo.{
echo.	!wscmd.script.n!;
if defined wscmd.script.p (
echo.	!wscmd.script.p!;
echo.	if ^( line ^^^!== void 0 ^) {
echo.		WScript.StdOut.WriteLine^(line^);
echo.	}
)
echo.};
echo.
echo.var userFuncBegin = function^(lineNumber, fso, stdin, stdout, stderr^)
echo.{
echo.	!wscmd.script.begin!;
echo.};
echo.
echo.var userFuncEnd = function^(lineNumber, fso, stdin, stdout, stderr^)
echo.{
echo.	!wscmd.script.end!;
echo.};
echo.
echo.var userFuncBefore = function^(currentNumber, filename, lineNumber, fso, stdin, stdout, stderr^)
echo.{
echo.	!wscmd.script.before!;
echo.};
echo.
echo.var userFuncAfter = function^(currentNumber, filename, lineNumber, fso, stdin, stdout, stderr^)
echo.{
echo.	!wscmd.script.after!;
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
echo.function Var^(name, value^)
echo.{
echo.	this[name] = value;
echo.};
echo.
echo.]]^>^</script^>
echo.^<script language="vbscript"^>^<^^^![CDATA[
echo.
echo.Function userFunc^(line, currentNumber, filename, lineNumber, fso, stdin, stdout, stderr^)
echo.	!wscmd.script.n!
if defined wscmd.script.p (
echo.	!wscmd.script.p!
echo.	If Not IsEmpty^(line^) Then
echo.		WScript.StdOut.WriteLine line
echo.	End If
)
echo.End Function
echo.
echo.Function userFuncBegin^(lineNumber, fso, stdin, stdout, stderr^)
echo.	!wscmd.script.begin!
echo.End Function
echo.
echo.Function userFuncEnd^(lineNumber, fso, stdin, stdout, stderr^)
echo.	!wscmd.script.end!
echo.End Function
echo.
echo.Function userFuncBefore^(currentNumber, filename, lineNumber, fso, stdin, stdout, stderr^)
echo.	!wscmd.script.before!
echo.End Function
echo.
echo.Function userFuncAfter^(currentNumber, filename, lineNumber, fso, stdin, stdout, stderr^)
echo.	!wscmd.script.after!
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
	var userFuncBegin = this.userFuncBegin;
	var userFuncEnd = this.userFuncEnd;
	var userFuncBefore = this.userFuncBefore;
	var userFuncAfter = this.userFuncAfter;
//@end

	var fso = new ActiveXObject('Scripting.FileSystemObject');

	var format = 0;

	var files = WScript.Arguments;
	if ( files.length == 0 ) {
		// Emulate empty list of arguments
		files = ['-'];
		files.item = function(i) { return this[i]; };
	}

	// The number of all lines of all files
	var lineNumber = 0;

	// the function is called before processing any file. 
	// The total number of input lines is 0. 
	userFuncBegin(
		lineNumber, 
		fso, WScript.StdIn, WScript.StdOut, WScript.StdErr);

	for (var i = 0; i < files.length; i++) {
		var file = files.item(i);

		// Opens the file using the system default
		if ( file == '/D' || file == '/d' ) {
			format = -2;
			continue;
		}

		// Opens the file as Unicode
		if ( file == '/U' || file == '/u' ) {
			format = -1;
			continue;
		}

		// Opens the file as ASCII
		if ( file == '/A' || file == '/a' ) {
			format = 0;
			continue;
		}

		// The number of the current line for the actual file.
		var currentNumber = 0;

		// The function called before opening of the file. 
		// The file name is known, the number of line of the file is 0. 
		userFuncBefore(
			currentNumber, file, lineNumber, 
			fso, WScript.StdIn, WScript.StdOut, WScript.StdErr);

		var stream;
		var isFile;

		var e;
		try {
			if ( file == '-' ) {
				stream = WScript.StdIn;
				file = '<stdin>';
				isFile = false;
			} else {
				stream = fso.OpenTextFile(file, 1, false, format);
				isFile = true;
			}
		} catch (e) {
			WScript.StdErr.WriteLine(e.message + ': ' + file);
			continue;
		}

		// Prevent fail of reading out of STDIN stream
		// The real exception number is 800a005b
		// Object variable or With block variable not set
		try {
			stream.AtEndOfStream;
		} catch (e) {
			WScript.StdErr.WriteLine('Out of stream: ' + file);
			continue;
		}

		while ( ! stream.AtEndOfStream ) {
			currentNumber++;
			lineNumber++;
			var line = stream.ReadLine();
			try {
				// Processing of the file. Available parameters are the 
				// current line, it's number in the file, and the number 
				// of the line in the list of all files. 
				userFunc(
					line, currentNumber, file, lineNumber, 
					fso, WScript.StdIn, WScript.StdOut, WScript.StdErr);
			} catch (e) {
				stream.Close();
				WScript.StdErr.WriteLine(e.message);
				WScript.Quit();
			}
		}

		if ( isFile ) {
			stream.Close();
		}

		// A file processing is completed, and a file is closed already. 
		// The filename and the total number of lines are known. 
		// The currentNumber is the number of lines of the last file. 
		userFuncAfter(
			currentNumber, file, lineNumber, 
			fso, WScript.StdIn, WScript.StdOut, WScript.StdErr);

	}

	// The function will be executed when all files have been processed. 
	// Only lineNumber, the total amount of lines is known. 
	userFuncEnd(
		lineNumber, 
		fso, WScript.StdIn, WScript.StdOut, WScript.StdErr);

	WScript.Quit();
})();

/**
 *
 * Useful functions
 *
 */
var help = usage = (function()
{
	var helpMsg = '\n' 
		+ 'Commands                 Descriptions\n' 
		+ '========                 ============\n' 
		+ 'help(), usage()          Display this help\n' 
		+ 'alert(), echo(), print() Print expressions\n' 
		+ 'quit(), exit()           Quit this shell\n' 
		+ 'eval.history             Display the history\n' 
		+ 'eval.save([format])      Save the history to the file\n' 
		+ 'eval.transform           The stub to transform output additionally\n' 
		+ 'cmd(), shell()           Run new DOS-session\n' 
		+ 'sleep(n)                 Sleep n milliseconds\n' 
		+ 'clip()                   Gets from the clipboard data formatted as text\n' 
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
	var result = arguments[0];
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

var clip = function()
{
	return new ActiveXObject('htmlfile').parentWindow.clipboardData.getData('Text');
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
			var multiline = 0;

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

