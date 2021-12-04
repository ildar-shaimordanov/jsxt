@echo off

call wsx /let:limit=5 /p /e:"LN > limit && quit()" lorem-ipsum.txt
::call wsx /use:vbs /let:limit=10 /p /e:"if LN > limit then quit : end if" lorem-ipsum.txt
