@echo off

(
	echo \e[107m    \e[0m
	echo \e[104m    \e[0m
	echo \e[101m    \e[0m
) | wsx /vt /m:./ansi=p:ansi /e:"s=STDIN.ReadAll(); print(p(s))"
