//
// JScript add-on
//
// @require	win32/FileSystem.js
// 		Core.js
// 		eval.js
//
// @copyright	Copyright (c) 2009 by Ildar Shaimordanov
//

if ( Core.browser.isMSIE || Core.browser.isJScript ) {

if ( ! eval.fromFile ) {

/**
 * Wrapper over eval and FileSystem.readFile to simplify usage from CLI.
 * Shortly, this is equvalent of 'include' or 'export' within other languages.
 *
 * @param	String
 * @result	String
 *
 * @access	public
 */
eval.fromFile = function(filename)
{
	var input = FileSystem.readFile(filename);

	return eval(input);
};

}

}

if ( Core.browser.isMSIE || Core.browser.isJScript ) {

if ( ! eval.beautify.fromFile ) {

/**
 * Wrapper over jsbeautify and FileSystem.readFile to simplify usage from CLI
 *
 * @param	String
 * @param	Object
 * @result	String
 *
 * @access	public
 */
eval.beautify.fromFile = function(filename, options)
{
	var input = FileSystem.readFile(filename);

	return eval.beautify(input, options);
};

}

}

if ( Core.browser.isMSIE || Core.browser.isJScript ) {

if ( ! eval.minify.fromFile ) {

/**
 * Wrapper over jsmin and FileSystem.readFile to simplify usage from CLI
 *
 * @param	String
 * @param	Object
 * @param	String
 * @result	String
 *
 * @access	public
 */
eval.minify.fromFile = function(filename, options)
{
	var input = FileSystem.readFile(filename);

	return eval.minify(input, options);
};

}

}

