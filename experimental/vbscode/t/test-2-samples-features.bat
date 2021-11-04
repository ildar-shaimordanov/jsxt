@echo off

echo:Plan 1: The original VBS minifies and beautifies the original sample.
echo:Expected: No errors.

cscript //nologo test-minify.wsf ..\lib\vbscode.vbs <samples\features.vbs >features.1.example.vbs
cscript //nologo test-beautify.wsf <features.1.example.vbs >features.2.example.vbs

echo:Plan 2: The original VBS beautifies the minified sample.
echo:Expected: No errors.

cscript //nologo test-beautify.wsf <samples\features.min.example.vbs >features.3.example.vbs

echo:Plan 3: Compare samples using "busybox diff -d -U0".
echo:Expected: No differences found.

::busybox diff -d -U0 samples\features.vbs features.2.example.vbs
busybox diff -d -U0 features.3.example.vbs features.2.example.vbs
echo:Exit Code = %ERRORLEVEL%
