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
 * Wrapper over jsbeautify and Ajax.query to simplify usage from CLI
 *
 * @param	String
 * @param	Object
 * @result	String
 *
 * @access	public
 */
jsbeautify.file = function(filename, options)
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

	return jsbeautify(input, options);
};

}

