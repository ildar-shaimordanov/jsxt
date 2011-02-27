//
// JScript and JavaScript unit
//
// Copyright (c) 2004, 2005, 2008, 2009, 2010, 2011 by Ildar Shaimordanov
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
// 2011/02/27
// all the following methods are removed
// object.alert()
// object.write()
// object.writeln()
// object.echo() 
// object.print() 
//
// 2010/03/07
// Error.format() method has been migrated to the separate module Error.js
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
// object.echo() and object.print() are synonims of the last one. 
//
// Error.toString() was leaved as is with no changes. Now Error.format() is used.
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

