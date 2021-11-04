@echo off

echo:Plan 1: The original VBS minifies and beautifies the original sample.
echo:Expected: No errors.

cscript //nologo test-minify.wsf "..\lib\vbscode.vbs" <"samples\pyenv.vbs" >"pyenv.1.example.vbs"
cscript //nologo test-beautify.wsf <"pyenv.1.example.vbs" >"pyenv.2.example.vbs"

echo:Plan 2: The original VBS beautifies the minified sample.
echo:Expected: No errors.

cscript //nologo test-beautify.wsf <"samples\pyenv.min.example.vbs" >"pyenv.3.example.vbs"

echo:Plan 3: Compare samples using "busybox diff -d -U0".
echo:Expected: No differences found.

::busybox diff -d -U0 samples\pyenv.vbs pyenv.2.example.vbs
busybox diff -d -U0 pyenv.3.example.vbs pyenv.2.example.vbs
echo:Exit Code = %ERRORLEVEL%
