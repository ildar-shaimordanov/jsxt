@echo off

call wsx /p /e:"LINE = LN + ':' + LINE" lorem-ipsum.txt
::call wsx /let:delim=":" /p /e:vbs:"LINE = LN & delim & LINE" lorem-ipsum.txt
