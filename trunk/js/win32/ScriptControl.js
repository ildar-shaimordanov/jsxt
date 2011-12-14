
//
// FileSystem.js
// Extension for FileSystemObject
//
// Copyright (c) 2009 by Ildar Shaimordanov
//

/**
 * The ScriptControl class provides an OOP interface over 
 * the standard COM object MSScriptControl.ScriptControl. 
 * It duplicates functionality of some methods of the original 
 * COM object but gives benefits in usage. 
 *
 * @param	string	Optional, a language of a executed script. 
 * 			The default value is 'VBScript'
 * @param	object	Optional, an object available for the script. 
 * @return	object
 */
function ScriptControl(language, options)
{
	this.sc = new ActiveXObject('MSScriptControl.ScriptControl');
	this.sc.Language = language || ScriptControl.defaultLanguage || 'VBScript';
	this.addObject(options);
};

/**
 * The default language that will be used
 */
ScriptControl.defaultLanguage = 'VBScript';

/**
 * The collection of items that will be available for the script internally. 
 */
ScriptControl.WScript = {
	Name: WScript.Name,
	FullName: WScript.FullName, 
	Version: WScript.Version,
	BuildVersion: WScript.BuildVersion,
	ScriptName: WScript.ScriptName, 
	ScriptFullName: WScript.ScriptFullName, 
	Interactive: WScript.Interactive,

	Arguments: WScript.Arguments, 

	StdIn: WScript.StdIn, 
	StdOut: WScript.StdOut, 
	StdErr: WScript.StdErr, 

	CreateObject: function(progId, pref)
	{
		return WScript.CreateObject(progId, pref);
	},
	GetObject: function(moniker)
	{
		return WScript.GetObject(moniker);
	}, 

	ConnectObject: function(moniker)
	{
		return WScript.ConnectObject(moniker);
	}, 
	DisconnectObject: function(object)
	{
		return WScript.DisconnectObject(object);
	}, 

	Echo: function()
	{
		if ( arguments.length == 0 ) {
			WScript.Echo();
			return;
		}
		var msg = arguments[0];
		for (var i = 1; i < arguments.length; i++) {
			msg += ' ' + arguments[i];
		}
		WScript.Echo(msg);
	}
};

(function(ScriptControl_prototype)
{

	/**
	 * Makes an object available for the script programs
	 *
	 * @param	string	A name of an object
	 * @param	mixed	an object
	 * @param	boolean	A boolean flag defining how to add an object 
	 * @return	void
	 */
	ScriptControl_prototype.addObject = function(options, addMembers)
	{
		addMembers = addMembers || false;

		var sc = this.sc;

		if ( typeof options == 'string' ) {
			sc.addObject(options, arguments[1], arguments[2]);
			return;
		}

		for (var p in options) {
			if ( ! options.hasOwnProperty(p) ) {
				continue;
			}
			sc.AddObject(p, options[p], addMembers);
		}
	};

	/**
	 * Makes the WScript object available for the script programs
	 *
	 * @param	void
	 * @return	void
	 */
	ScriptControl_prototype.addWScript = function()
	{
		this.sc.AddObject('WScript', ScriptControl.WScript);
	};

	/**
	 * Reinitializes the scripting engine
	 *
	 * @param	void
	 * @return	void
	 */
	ScriptControl_prototype.reset = function()
	{
		this.sc.reset();
	};

	/**
	 * Executes a subroutine.
	 * The last argument is function that will be launched to 
	 * catch an exception and handle it. 
	 *
	 * @param	string	A name of a subroutine
	 * @param	array	A list of arguments for a subroutine
	 * @param	function	An error handler
	 * @return	void
	 */
	ScriptControl_prototype.run = function(name, args, catcher)
	{
		var sc = this.sc;
		if ( typeof catcher != 'function' ) {
			return sc.Run(name, args);
		}

		var e;
		try {
			return sc.Run(name, args);
		} catch (e) {
			catcher(sc.Error);
		}
	};

	var methods = {
		'AddCode': 'addCode', 
		'Eval': 'eval', 
		'ExecuteStatement': 'exec'
	};

	/**
	 * here are created three methods that are
	 * -- Adds a subroutine to the ScriptControl
	 * -- Evaluates an expression
	 * -- Executes a single statement
	 *
	 * The last argument is function that will be launched to 
	 * catch an exception and handle it. 
	 *
	 * @param	string	A subroutine, expression or statement
	 * @param	function	An error handler
	 * @return	void
	 */
	for (var p in methods) {
		if ( ! methods.hasOwnProperty(p) ) {
			continue;
		}

		var m = methods[p];

		ScriptControl_prototype[m] = (function(p)
		{
			return function(code, catcher)
			{
				var sc = this.sc;
				if ( typeof catcher != 'function' ) {
					return sc[p](code);
				}

				var e;
				try {
					return sc[p](code);
				} catch (e) {
					catcher(sc.Error);
				}
			};
		})(p);
	}

})(ScriptControl.prototype);

