@echo off

call wsx /let:limit=5 /n /beginfile:"L=[]" /endfile:"echo(L.join('\n'))" /e:"L.push(LINE); L.length > limit && L.shift()" lorem-ipsum.txt
