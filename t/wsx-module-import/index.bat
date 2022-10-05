@echo off

:: Loading module and importing its objects with the "/m" option.
::
:: /m:./ansi,p=ansi
:: ./ansi means the module name as it can be specified with require
:: p=ansi imports the module specific and store it to the variable
::
:: so in these examples the option becomes shorthand for the following code:
:: p = require('./ansi').ansi;

:: example 1. with "/e"

(
	echo \e[107m    \e[0m
	echo \e[104m    \e[0m
	echo \e[101m    \e[0m
) | call wsx /vt /e:"p = require('./ansi').ansi; s=STDIN.ReadAll(); print(p(s))"

(
	echo \e[107m    \e[0m
	echo \e[104m    \e[0m
	echo \e[101m    \e[0m
) | call wsx /vt /m:./ansi,p=ansi /e:"s=STDIN.ReadAll(); print(p(s))"

:: example 2. with "/e" and "/n"

(
	echo \e[107m    \e[0m
	echo \e[104m    \e[0m
	echo \e[101m    \e[0m
) | call wsx /vt /n /begin:"p = require('./ansi').ansi" /e:"print(p(LINE))"

(
	echo \e[107m    \e[0m
	echo \e[104m    \e[0m
	echo \e[101m    \e[0m
) | call wsx /vt /m:./ansi,p=ansi /n /e:"print(p(LINE))"

:: example 3. with "/e" and "/p"

(
	echo \e[107m    \e[0m
	echo \e[104m    \e[0m
	echo \e[101m    \e[0m
) | call wsx /vt /p /begin:"p = require('./ansi').ansi" /e:"LINE = p(LINE)"

(
	echo \e[107m    \e[0m
	echo \e[104m    \e[0m
	echo \e[101m    \e[0m
) | call wsx /vt /m:./ansi,p=ansi /p /e:"LINE = p(LINE)"
