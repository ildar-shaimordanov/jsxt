//
// JScript add-on
//
// @require	win32/FileSystem.js
// 		Core.js
//
// @copyright	Copyright (c) 2009 by Ildar Shaimordanov
//

if ( Core.browser.isMSIE || Core.browser.isJScript ) {

if ( ! eval.file ) {

/**
 * Wrapper over eval and FileSystem.readFile to simplify usage from CLI.
 * Shortly, this is equvalent of 'include' or 'export' within other languages.
 *
 * @param	String
 * @result	String
 *
 * @access	public
 */
eval.file = function(filename)
{
	var input = FileSystem.readFile(filename);
	return eval(input);
};

}

}

