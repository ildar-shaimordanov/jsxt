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
 * Wrapper over jsmin and Ajax.query to simplify usage from CLI
 *
 * @param	String
 * @param	Integer
 * @param	String
 * @result	String
 *
 * @access	public
 */
jsmin.file = function(filename, level, comment)
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

	return jsmin(input, level, comment);
};

}

