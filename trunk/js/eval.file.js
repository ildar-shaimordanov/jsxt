//
// JScript add-on
//
// @require	Ajax.js
//
// @copyright	Copyright (c) 2009 by Ildar Shaimordanov
//

if ( ! eval.file ) {

/**
 * Wrapper over eval and Ajax.queryFile to simplify usage from CLI.
 * Shortly, this is equvalent of 'include' or 'export' within other languages.
 *
 * @param	String	Filename
 * @param	Object	Ajax options
 * @result	String
 *
 * @access	public
 */
eval.file = function(filename, ajaxOptions)
{
	var input = Ajax.queryFile(filename, ajaxOptions);

	return eval(input);
};

}

