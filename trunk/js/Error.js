//
// JavaScript unit
// Add-on for the function's manipulation
//
// Copyright (c) 2004, 2005, 2008, 2009 by Ildar Shaimordanov
//

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
	};

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
};

}

