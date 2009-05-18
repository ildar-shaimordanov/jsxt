//
// JScript add-on
//
// @require	Ajax.js
// @require	jsbeautify.js
//
// @copyright	Copyright (c) 2009 by Ildar Shaimordanov
//



if ( ! jsbeautify.file ) {

/**
 * Wrapper over jsbeautify and Ajax.queryFile to simplify usage from CLI
 *
 * @param	String
 * @param	Object
 * @param	Object	Ajax options
 * @result	String
 *
 * @access	public
 */
jsbeautify.file = function(filename, options, ajaxOptions)
{
	var input = Ajax.queryFile(filename, ajaxOptions);

	return jsbeautify(input, options);
};

}

