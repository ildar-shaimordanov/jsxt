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

echo:
echo::: Load modules "foo"; "foo/bar" is called automatically
call wsx /lib:mylib /m:foo /e:1

echo:
echo::: Load "foo/bar" then call "foo"
call wsx /lib:mylib /m:"foo/bar" /m:foo /e:1

echo:
echo::: Load "foo" and then try load "foo/bar"
call wsx /lib:mylib /m:foo /m:"foo/bar" /e:1
