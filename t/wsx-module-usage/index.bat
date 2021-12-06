@echo off

echo:
echo::: Call "foo"; "foo/bar" is called automatically
call wsx /lib:mylib /e:"require('foo')"

echo:
echo::: Call "foo/bar" then call "foo"
call wsx /lib:mylib /e:"require('foo/bar'); require('foo')"

echo:
echo::: Call "foo" and then try call "foo/bar"
call wsx /lib:mylib /e:"require('foo'); require('foo/bar')"
