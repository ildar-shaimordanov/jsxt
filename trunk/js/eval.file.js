//
// JScript add-on
//
// @require	Ajax.js
//
// @copyright	Copyright (c) 2009 by Ildar Shaimordanov
//

if ( ! eval.file ) {

/**
 * Wrapper over eval and Ajax.query to simplify usage from CLI.
 * Shortly, this is equvalent of 'include' or 'export' within other languages.
 *
 * @param	String
 * @result	String
 *
 * @access	public
 */
eval.file = function(filename)
{
	if ( ! /\w+:\/\//.test(filename) ) {
		filename = 'file:///' + filename;
	}

	var input = Ajax.query(filename, {
		async: false,
		nocache: true,
		onreadystate: function(xmlhttp)
		{
			if ( xmlhttp.readyState != 4 ) {
				return;
			}

			return xmlhttp.responseText;
		}
	});

	return eval(input);
};

}

