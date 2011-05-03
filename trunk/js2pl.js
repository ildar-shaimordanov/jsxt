
while ( ! WScript.StdIn.AtEndOfStream ) {
	line = WScript.StdIn.ReadLine()
		.replace(/\\/g, '\\\\')
		.replace(/\$/g, '\\$');
	WScript.StdOut.WriteLine(line);
}
