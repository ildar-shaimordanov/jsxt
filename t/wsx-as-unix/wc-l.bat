@echo off

call wsx /n /endfile:"echo(FLN, FILE)" /end:"echo(LN)" lorem-ipsum.txt
::call wsx /n /endfile:vbs:"echo FLN, FILE" /end:vbs:"echo LN" lorem-ipsum.txt
::call wsx /use:vbs /n /endfile:"echo FLN, FILE" /end:"echo LN" lorem-ipsum.txt
