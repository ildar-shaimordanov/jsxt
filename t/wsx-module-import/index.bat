@echo off

(
	echo \e[107m    \e[0m
	echo \e[104m    \e[0m
	echo \e[101m    \e[0m
) | call wsx /vt /m:./ansi:ansi:p /e:"s=STDIN.ReadAll(); print(p(s))"

(
	echo \e[107m    \e[0m
	echo \e[104m    \e[0m
	echo \e[101m    \e[0m
) | call wsx /vt /m:./ansi:ansi:p /n /e:"print(p(LINE))"

(
	echo \e[107m    \e[0m
	echo \e[104m    \e[0m
	echo \e[101m    \e[0m
) | call wsx /vt /m:./ansi:ansi:p /p /e:"LINE = p(LINE)"
