//
// JScript add-on
//
// @require	jsbeautify.js
// 		win32/FileSystem.js
// 		Core.js
//
// @copyright	Copyright (c) 2009 by Ildar Shaimordanov
//

if ( Core.browser.isMSIE || Core.browser.isJScript ) {

if ( ! jsbeautify.file ) {

/**
 * Wrapper over jsbeautify and FileSystem.readFile to simplify usage from CLI
 *
 * @param	String
 * @param	Object
 * @result	String
 *
 * @access	public
 */
jsbeautify.file = function(filename, options)
{
	var input = FileSystem.readFile(filename);
	return jsbeautify(input, options);
};

}

}

