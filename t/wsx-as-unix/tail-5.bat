@echo off

call wsx /let:limit=5 /n /begin:"L=[]" /end:"echo(L.join('\n'))" /e:"L.push(LINE); L.length > limit && L.shift()" lorem-ipsum.txt
