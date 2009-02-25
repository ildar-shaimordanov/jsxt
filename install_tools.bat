@echo off


rem
rem Target path
rem
set INSTALL_PATH=C:\PROGS\TOOLS


rem
rem Files to be installed
rem
set INSTALL_LIST=*.js *.wsf *.hta *.bat


rem
rem Files to be excluded from installation
rem
set INSTALL_EXCLUDE=%~nx0 install_tool.wsf Sandbox.js


if "%~1" == "__GET_LIST_NOW__" goto :get_list_now

if not exist "%INSTALL_PATH%" md "%INSTALL_PATH%"

for /f %%a in ( 'call %0 __GET_LIST_NOW__' ) do (
	echo Processing '%%a'...
	cscript //NoLogo install_tool.wsf %%a "%INSTALL_PATH%"
	echo.
)

goto :EOF


:get_list_now
if     defined INSTALL_EXCLUDE dir /b %INSTALL_LIST% | findstr /v "%INSTALL_EXCLUDE%"
if not defined INSTALL_EXCLUDE dir /b %INSTALL_LIST%
goto :EOF

