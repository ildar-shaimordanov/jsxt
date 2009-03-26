//
// JScript and JavaScript unit
//
// Copyright (c) 2004, 2005, 2008, 2009 by Ildar Shaimordanov
//
// DESCRIPTION
//
// This unit implements the universal objects wich applies
// a debugging and a messaging of JScript and JavaScript scripts.
// It had been tested under
//    WSH 5.6
//    MS Internet Explorer 5.x, 6.x, 7
//    Opera 7.23
//    Mozilla 1.6+
//    Mozilla Firefox 0.9+
//    Mozilla Firefox 2.0.0.15
//    Mozilla Firefox 3.0.7
//
// HISTORY
//
// 2009/03/26
// Core is the main object to keep the global namespace clear. 
// Core.browser keeps information about the actual browser. 
// Core.dump() is helper function to output complex structures as human-readable. 
// Core.clone() is helper function to make a real copy of complex structures. 
//
// ASSERT function was removed but some sugar was added for pretty output of objects. 
// They are declared for Boolean, Number, String, Array, and Object. 
// object.alert()
// object.write()
// object.writeln()
// object.echo() and object.print() are synonims of the lsst one. 
//
// Error.toString() was leaved as is. Now Error.format() is used.
//
// 2005/03
// boolean JSCRIPT_CORE
// The 'JSEngine' is the boolean variable.
// The 'true' value means execution under the Windows Scripting Host.
// The 'false' value means execution under any web browser.
//
// void ASSERT(mixed object [ , boolean assertMode ] )
// The 'ASSERT' (or 'Core.ASSERT') routine is the useful and universal function
// for the 'object' variable dump or any message output.
// 1. When this function is called under WSH it displays
//    to the standard output (within the CSCRIPT.EXE command line version) or
//    to the alert window (within the WSCRIPT.EXE windowed version).
// 2. When this function is called under any web browser
//    the 'assertMode' parameter is available and can be one of the next values
//       'writeln' or empty value dumps by the 'document.writeln()' method;
//       'write' value dumps by the 'document.write()' method;
//       'alert' dumps by the 'window.alert()' method;
//       'status' value dumps to the 'window.status' line of web browsers.
//

if ( ! Core ) {

var Core = {};

}

(function()
{
	if ( ! Core.browser ) {
		Core.browser = {};
	}

	var e;
	try {

		Core.browser.isOpera   = navigator.userAgent.match(/Opera/);
		Core.browser.isChrome  = navigator.userAgent.match(/Chrome/);
		Core.browser.isFirefox = navigator.userAgent.match(/Firefox/);
		Core.browser.isMSIE    = navigator.userAgent.match(/MSIE/);

	} catch(e) {

		Core.browser.isJScript = true;

	}
})();

/*
if ( Core.browser.isJScript ) {

Function.prototype.alert = 
Function.prototype.write = 

Function.prototype.echo = 
Function.prototype.print = 
Function.prototype.writeln = function()
{
	var result = this.apply(arguments.callee, arguments);
	WScript.Echo(result);
	return result;
}

} else {

Function.prototype.alert = function()
{
	var result = this.apply(arguments.callee, arguments);
	alert(result);
	return result;
}

Function.prototype.write = function()
{
	var result = this.apply(arguments.callee, arguments);
	document.write(result);
	return result;
}

Function.prototype.echo = 
Function.prototype.print = 
Function.prototype.writeln = function()
{
	var result = this.apply(arguments.callee, arguments);
	document.writeln(result);
	return result;
}

}

Boolean.prototype.alert = 
Number.prototype.alert = 
String.prototype.alert = 
Array.prototype.alert = 
Object.prototype.alert = function()
{
	return (function()
	{
		return arguments[0];
	}).alert(this);
}

Boolean.prototype.write = 
Number.prototype.write = 
String.prototype.write = 
Array.prototype.write = 
Object.prototype.write = function()
{
	return (function()
	{
		return arguments[0];
	}).write(this);
}


Boolean.prototype.echo = 
Boolean.prototype.print = 
Boolean.prototype.writeln = 

Number.prototype.echo = 
Number.prototype.print = 
Number.prototype.writeln = 

String.prototype.echo = 
String.prototype.print = 
String.prototype.writeln = 

Array.prototype.echo = 
Array.prototype.print = 
Array.prototype.writeln = 

Object.prototype.echo = 
Object.prototype.print = 
Object.prototype.writeln = function()
{
	return (function()
	{
		return arguments[0];
	}).writeln(this);
}
*/

if ( Core.browser.isJScript ) {

Boolean.prototype.alert = 
Number.prototype.alert = 
String.prototype.alert = 
Array.prototype.alert = 
Object.prototype.alert = 

Boolean.prototype.write = 
Number.prototype.write = 
String.prototype.write = 
Array.prototype.write = 
Object.prototype.write = 

Boolean.prototype.echo = 
Boolean.prototype.print = 
Boolean.prototype.writeln = 

Number.prototype.echo = 
Number.prototype.print = 
Number.prototype.writeln = 

String.prototype.echo = 
String.prototype.print = 
String.prototype.writeln = 

Array.prototype.echo = 
Array.prototype.print = 
Array.prototype.writeln = 

Object.prototype.echo = 
Object.prototype.print = 
Object.prototype.writeln = function()
{
	WScript.Echo(this);
	return this;
}

} else {

Boolean.prototype.alert = 
Number.prototype.alert = 
String.prototype.alert = 
Array.prototype.alert = 
Object.prototype.alert = function()
{
	alert(this);
	return this;
}

Boolean.prototype.write = 
Number.prototype.write = 
String.prototype.write = 
Array.prototype.write = 
Object.prototype.write = function()
{
	document.write(this);
	return this;
}


Boolean.prototype.echo = 
Boolean.prototype.print = 
Boolean.prototype.writeln = 

Number.prototype.echo = 
Number.prototype.print = 
Number.prototype.writeln = 

String.prototype.echo = 
String.prototype.print = 
String.prototype.writeln = 

Array.prototype.echo = 
Array.prototype.print = 
Array.prototype.writeln = 

Object.prototype.echo = 
Object.prototype.print = 
Object.prototype.writeln = function()
{
	document.writeln(this);
	return this;
}

}

/*
if ( ! Core.ASSERT ) {

var ASSERT = 
Core.ASSERT = ( Core.JSEngine ) ?

// WSH JScript
function(object)
{
	return WScript.Echo(object);
}

:

// Browser JavaScript
function(object, assertMode)
{
	var assertMode = assertMode || Core.assertMode || "writeln";
	switch (String(assertMode).toLowerCase()) {
	case "writeln":
		return document.writeln(object);
	case "write":
		return document.write(object);
	case "alert":
		return alert(object);
	case "status":
		window.status = object;
		return undefined;
	}
}

}
*/

if ( ! Core.dump ) {

/**
 * Core.dump(object)
 *
 * @Description
 * Creates a dump of any object
 *
 * @param	Mixed
 * @param	Integer
 * @param	String
 * @return	String
 * @access	Static
 */
Core.dump = function(object, nest, padding)
{
	if ( ! nest || nest < 0 ) {
		nest = Number.MAX_VALUE;
	}

	if ( ! padding ) {
		padding = "";
	}

	var pred;
	var post;

	switch ( typeof object ) {
	case "object":
		if ( object === null ) {
			return object;
		}
		if ( ! nest ) {
			return "*** TOO MANY NESTIONS ***\n";
		}
		if ( object.constructor == Array ) {
			pred = "Array(" + object.length + ") [\n";
			post = "]";
		} else {
			pred = "Object {\n";
			post = "}";
		}
		post = padding + post;
		padding += "    ";
		var s = "";
		for (var value in object) {
			s += padding + value + ": " + Core.dump(object[value], nest - 1, padding) + "\n";
		}
		return pred + s + post;
	case "string":
		return "\"" + object
			.replace(/\&/g, "&amp;")
			.replace(/\"/g, "\\&quot;")
			.replace(/\r/g, "\\r")
			.replace(/\n/g, "\\n")
			.replace(/\t/g, "\\t")
			.replace(/\</g, "&lt;")
			.replace(/\>/g, "&gt;")
			+ "\"";
	case "function":
		return "[Native code]";
	default:
		return object;
	}
}

}

if ( ! Core.clone ) {

/**
 * Core.clone(object)
 *
 * @Description
 * Creating a copy of an array or an object with fully replicated properties. 
 * Each property of an object will be copied recursively
 *
 * @param	mixed
 * @result	mixed
 *
 * @author	Ildar Shaimordanov aka Rumata (the common idea of 'clonning')
 */
Core.clone = function(object)
{
	if ( object === undefined ) {
		object = this;
	}
	if ( typeof(object) != "object" ) {
		return object;
	}
	var newObject = new object.constructor();
	for (var objectItem in object) {
		newObject[objectItem] = Core.clone(object[objectItem]);
	}
	return newObject;
}

}

if ( ! Error.prototype.format ) {

/**
 * object.toString()
 *
 * @Description
 * Transforms an object to a string value.
 *
 * @param	void
 * @return	String
 * @access	public
 */
Error.prototype.format = function()
//Error.prototype.toString = function()
{
	var frmt = function(name, value) {
		return name + "\t:\t" + value + "\n";
	}

	var name = frmt("name", this.name);
	var message = this.message;

	if ( Core.browser.isJScript || Core.browser.isMSIE ) {
		return name
			+ frmt("message", message)
			+ frmt("line", (this.number >> 0x10) & 0x1FFF)
			+ frmt("code", this.number & 0xFFFF);
	}

	if ( Core.browser.isOpera ) {
		var lmsg = message.match(/Statement on line (\d+)\: ([^\n]+)/);
		var message = lmsg[2];
		var lineNumber = lmsg[1];
		var fileName = message.match(/file\:\/\/localhost\/([^\n]+)/)[1];
		return name
			+ frmt("message", message)
			+ frmt("line", lineNumber)
			+ frmt("file", fileName);
	}

	if ( Core.browser.isFirefox ) {
		return name
			+ frmt("message", message)
			+ frmt("line", this.lineNumber)
			+ frmt("file", this.fileName.match(/file\:\/\/\/(.+)/)[1]);
	}

	var s = "";
	for (var p in this) {
		s += frmt(p, this[p]);
	}

	return s;
}

}

