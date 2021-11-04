@echo off

echo:Plan 1: The original VBS minifies itself and minifies the minified version.
echo:Expected: No errors.

::PLAN-1	..\lib\vbscode.vbs	..\lib\vbscode.vbs	1-org-to-min.vbs
::PLAN-1	..\lib\vbscode.vbs	1-org-to-min.vbs	1-min-to-min.vbs

for /f "tokens=2,3,4" %%a in ( 'findstr "^::PLAN-1" "%~f0"' ) do (
	cscript //nologo test-minify.wsf "%%~a" < "%%~b" > "%%~c"
)

echo:Plan 2: The minified VBS minifies the original and minified versions.
echo:Expected: No errors.

::PLAN-2	1-org-to-min.vbs	..\lib\vbscode.vbs	2-org-to-min.vbs
::PLAN-2	1-org-to-min.vbs	2-org-to-min.vbs	2-min-to-min.vbs

for /f "tokens=2,3,4" %%a in ( 'findstr "^::PLAN-2" "%~f0"' ) do (
	cscript //nologo test-minify.wsf "%%~a" < "%%~b" > "%%~c"
)

echo:Plan 3: Compare each pair of the minified files.
echo:Expected: FC: no differences encountered.

::PLAN-3	1-org-to-min.vbs	1-min-to-min.vbs
::PLAN-3	2-org-to-min.vbs	2-min-to-min.vbs
::PLAN-3	1-org-to-min.vbs	2-org-to-min.vbs
::PLAN-3	1-min-to-min.vbs	2-min-to-min.vbs

for /f "tokens=2,3" %%a in ( 'findstr "^::PLAN-3" "%~f0"' ) do (
	fc "%%~a" "%%~b"
)
