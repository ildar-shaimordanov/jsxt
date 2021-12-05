@echo off

call wsx /let:limit=5 /p /e:"FLN > limit && last()" lorem-ipsum.txt
::call wsx /use:vbs /let:limit=5 /begin:"limit = cint(limit)" /p /e:"if FLN > limit then last" lorem-ipsum.txt
