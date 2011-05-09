
var jsxt = jsxt || {};

jsxt.tools = {
	name: WScript.ScriptName.replace(/\..+?$/, ''), 
	copyright: 'Copyright (C) 2010, 2011, Ildar Shaimordanov', 

	fso: new ActiveXObject('Scripting.FileSystemObject'), 

	embed: {}, 

	readFromFile: function(path)
	{
		if ( ! (/^\w+:\/\//).test(path) ) {
			path = this.fso.GetAbsolutePathName(path);
		}
		return Ajax.queryFile(path);
	}, 

	writeToFile: function(path, text)
	{
		var e;
		try {
			var h;
			h = this.fso.OpenTextFile(path, 2, true);
			h.Write(text);
			h.Close();
		} catch (e) {
			this.quit(1, 'Cannot write to the file "' + path + '".');
		}
	}, 

	readFromConsole: function()
	{
		var lines;

		var e;
		try {
			lines = WScript.StdIn.ReadAll();
		} catch (e) {
			lines = '';
		}

		return lines;
	}, 

	writeToConsole: function(text)
	{
		WScript.StdOut.Write(text);
	}, 

	alert: function()
	{
		WScript.Echo([].slice.call(arguments));
	}, 

	help: function()
	{
		this.alert([].join.call(arguments, '\n'));
	}, 

	quit: function(exitCode, text)
	{
		if ( text ) {
			this.alert(text);
		}
		WScript.Quit(exitCode);
	}
};
