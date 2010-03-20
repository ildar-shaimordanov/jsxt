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


rem
rem Obfuscate a code
rem
set SQUEEZE=/squeeze


rem
rem Download from the site
rem
rem set DOWNLOAD=/download


rem
rem Main loop
rem
if not exist "%INSTALL_PATH%" md "%INSTALL_PATH%"

set INSTALL_CMD=dir /b %INSTALL_LIST%
if defined INSTALL_EXCLUDE set INSTALL_CMD=%INSTALL_CMD% ^^^| findstr /v "%INSTALL_EXCLUDE%"

echo.Installing to '%INSTALL_PATH%'
echo.
for /f %%a in ( '%INSTALL_CMD%' ) do (
	echo Processing '%%a'...
	cscript //NoLogo install_tool.wsf %SQUEEZE% %DOWNLOAD% "%%a" > "%INSTALL_PATH%\%%~nxa"
	echo.
)

