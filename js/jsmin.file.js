//
// JScript add-on
//
// @require	jsmin.js
// @require	Ajax.js
//
// @copyright	Copyright (c) 2009 by Ildar Shaimordanov
//

if ( ! jsmin.file ) {

/**
 * Wrapper over jsmin and Ajax.queryFile to simplify usage from CLI
 *
 * @param	String
 * @param	Integer
 * @param	String
 * @param	Object	Ajax options
 * @result	String
 *
 * @access	public
 */
jsmin.file = function(filename, level, comment, ajaxOptions)
{
	var input = Ajax.queryFile(filename, ajaxOptions);

	return jsmin(input, level, comment);
};

}

