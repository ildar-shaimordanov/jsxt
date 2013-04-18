//
// JavaScript unit
// Add-on for the function's manipulation
//
// Copyright (c) 2004, 2005, 2008, 2009, 2013 by Ildar Shaimordanov
//

/**
 * Error.format(error)
 *
 * @Description
 * Transforms an object to a string value.
 *
 * @param	Error
 * @return	String
 * @access	static
 */
(function()
{
	var engine = {};

	var e;
	try {
		engine.isOpera   = navigator.userAgent.match(/Opera/);
		engine.isChrome  = navigator.userAgent.match(/Chrome/);
		engine.isFirefox = navigator.userAgent.match(/Firefox/);
		engine.isMSIE    = navigator.userAgent.match(/MSIE/);
	} catch(e) {
		engine.isJScript = true;
	}

	var indent = function(name, value) {
		return name + "\t: " + value + "\n";
	};

	Error.format = function(error)
	{
		var name = indent("name", error.name);
		var message = error.message;

		if ( engine.isJScript || engine.isMSIE ) {
			return name
				+ indent("message", message)
				+ indent("line", (error.number >> 0x10) & 0x1FFF)
				+ indent("code", error.number & 0xFFFF);
		}

		if ( engine.isOpera ) {
			var lmsg = message.match(/Statement on line (\d+)\: ([^\n]+)/);
			var message = lmsg[2];
			var lineNumber = lmsg[1];
			var fileName = message.match(/file\:\/\/localhost\/([^\n]+)/)[1];
			return name
				+ indent("message", message)
				+ indent("line", lineNumber)
				+ indent("file", fileName);
		}

		if ( engine.isFirefox ) {
			return name
				+ indent("message", message)
				+ indent("line", error.lineNumber)
				+ indent("file", error.fileName.match(/file\:\/\/\/(.+)/)[1]);
		}

		var s = "";
		for (var p in error) {
			s += indent(p, error[p]);
		}

		return s;
	};

})();

