//
// JavaScript unit
// Cookie extensions
//
// Copyright (c) 2010 by Ildar Shaimordanov
//

var Cookie = {

	/**
	 * Returns the value of the existing cookie or 'null' othewise
	 *
	 * @param	String
	 * @return	String
	 * @access	public
	 */
	get: function(name)
	{
		var list = document.cookie.split(';');
		for (var i = 0; i < list.length; i++) {
			var c = list[i].replace(/^\s+/, '').split('=');
			if ( c[0] == name ) {
				return c[1];
			}
		}
		return null;
	},

	/**
	 * Sets a new cookie specified by name with value and additional options
	 * There are available options:
	 * -- expires
	 * -- domain
	 * -- path
	 * -- secure
	 *
	 * @param	String
	 * @return	Boolean
	 * @access	public
	 */
	set: function(name, value, options)
	{
		document.cookie = [
			name + '=' + escape(value), 
			options.expires ? '; expires=' + options.expires.toGMTString() : '', 
			options.path    ? '; path=' + options.path : '', 
			options.domain  ? '; domain=' + options.domain : '', 
			options.secure  ? '; secure' : ''
		].join('; ');
	},

	/**
	 * Removes an existing cookie. The options are available too: 
	 * -- expires
	 * -- domain
	 * -- path
	 * -- secure
	 *
	 * @param	String
	 * @return	Boolean
	 * @access	public
	 */
	unset: function(name, options)
	{
		if ( document.cookie.get(name) ) {
			options.expires = new Date(1970, 0, 1);
			document.cookie.set(name, '', options);
		}
	}

};

