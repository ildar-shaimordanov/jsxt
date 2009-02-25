//
// JScript and JavaScript unit
// This unit implements the universal objects wich applies
// a debugging and a messaging of JScript and JavaScript scripts.
// It had been tested under
//    WSH 5.6
//    MS Internet Explorer 5.x and 6.0
//    Opera 7.23
//    Mozilla 1.6+
//    Mozilla Firefox 0.9+
//
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
// Copyright (c) 2004, 2005, 2008 by Ildar N. Shaimordanov aka Rumata
//

if ( ! Core ) {

var Core = {};

try {

	if ( window ) {
		Core.JSEngine = false;
	}

	Core.JSClient = 
		(navigator.userAgent.match(/Opera/)) ? "Opera" : 
		(navigator.userAgent.match(/Firefox/)) ? "MZ" : 
		(navigator.userAgent.match(/MSIE/)) ? "MSIE" : "other";

	Core.assertMode = "writeln";

} catch (e) {

	Core.JSEngine = true;
	Core.JSClient = "WSH";
	Core.assertMode = "";

}

}

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
Error.prototype.toString = function()
{
	var frmt = function(name, value) {
		return name + "\t:\t" + value + "\n";
	}

	var name = frmt("name", this.name);
	var message = this.message;

	switch ( Core.JSClient ) {
	case "WSH":
	case "MSIE":
		return name
			+ frmt("message", message)
			+ frmt("line", (this.number >> 0x10) & 0x1FFF)
			+ frmt("code", this.number & 0xFFFF);
	case "MZ":
	case "other":
		return name
			+ frmt("message", message)
			+ frmt("line", this.lineNumber)
			+ frmt("file", this.fileName.match(/file\:\/\/\/(.+)/)[1]);
	case "Opera":
		var lmsg = message.match(/Statement on line (\d+)\: ([^\n]+)/);
		var message = lmsg[2];
		var lineNumber = lmsg[1];
		var fileName = message.match(/file\:\/\/localhost\/([^\n]+)/)[1];
		return name
			+ frmt("message", message)
			+ frmt("line", lineNumber)
			+ frmt("file", fileName);
	}

	var s = "";
	for (var p in this) {
		s += frmt(p, this[p]);
	}
	return s;
}

