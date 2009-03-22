
if ( ! window.XHTMLDOM ) {

	/**
	 * The basic object implementing usage of cross-browser compatibility and DOM extensions
	 *
	 * @access	public
	 */
	window.XHTMLDOM = {};

	/**
	 * Property for the general purpose
	 *
	 * @access	public
	 */
	window.XHTMLDOM.timestamp = (new Date()).getTime();

}

if ( ! window.XHTMLDOM.cssRules ) {

/**
 * Implements a CSSRule interface for cross-browser compatibility
 *
 * @param	Integer	index
 * @return	CSSRule
 * @access	static
 */
window.XHTMLDOM.cssRules = function(index)
{
	return document.styleSheets[index].cssRules || document.styleSheets[index].rules;
}

}

if ( ! window.XHTMLDOM.cssStyle ) {

/**
 * Implements a CSSValue interface for cross-browser compatibility
 *
 * @param	HTMLElement	tag
 * @param	String	property
 * @param	Number|String	value
 * @return	CSSValue
 * @access	static
 */
window.XHTMLDOM.cssStyle = function(tag, property, value)
{
	// Convert tag-property-name => tagPropertyName
	property = property.toLowerCase().replace(/-([a-z])/g, function($0, $1)
	{
		return $1.toUpperCase();
	});

	// Modify the inline style and return the new value
	if ( value !== undefined && value !== null && ( value.constructor == Number || value.constructor == String ) ) {
		tag.style[property] = value;
		return tag.style[property];
	}

	// Try inline style
	if ( tag[window.XHTMLDOM.timestamp] && tag[window.XHTMLDOM.timestamp][property] ) {
		return tag.style[property];
	}

	// Create hash of style properties
	if ( ! tag[window.XHTMLDOM.timestamp] ) {
		tag[window.XHTMLDOM.timestamp] = {};
	}

	if ( tag[window.XHTMLDOM.timestamp][property] ) {
		re = tag[window.XHTMLDOM.timestamp][property];
	} else {
		// The rest of method tries to find this style property within all stylesheets
		var st;
		var si;
		var sc;

		// Prepare searching regexp
		st = tag.tagName;
		if ( tag.id ) {
			si = '#' + tag.id;
		}
		if ( tag.className ) {
			sc = '\\.(?:' + tag.className.replace(/^\s+/g, '').replace(/\s+$/g, '').replace(/\s+/g, '|') + ')';
		}

		var sel = '';
		sel += st + '$';
		if ( si ) {
			sel += '|';
			sel += '(?:' + st + ')?';
			if ( sc ) {
				sel += '(?:' + sc + ')?';
			}
			sel += si + '$';
		}
		if ( sc ) {
			sel += '|';
			sel += '(?:' + st + ')?';
			if ( si ) {
				sel += '(?:' + si + ')?';
			}
			sel += sc + '$';
		}

		// Resulting regexp:
		// / (tag)? #id (\.class)? | (tag)? \.class (#id)? | tag /gix
		var re = new RegExp(sel, 'gi');
		tag[window.XHTMLDOM.timestamp][property] = re;
	}

	for (var i = document.styleSheets.length - 1; i >= 0; i--) {
		var rules = XHTMLDOM.cssRules(i);
		for (var j = rules.length - 1; j >= 0; j--) {
			if ( rules[j].selectorText.match(re) && rules[j].style[property] ) {
				return rules[j].style[property];
			}
		}
	}

	return '';
}

}

if ( ! window.XHTMLDOM.cssStyleToggle ) {

/**
 * Implements a cross-browser toggler of a CSSValue interface
 *
 * @param	HTMLElement	tag
 * @param	String	property
 * @param	Array	values
 * @return	CSSValue
 * @access	static
 */
window.XHTMLDOM.cssStyleToggle = function(tag, property, values)
{
	var prop = window.XHTMLDOM.cssStyle(tag, property);
	var n = 0;

	if ( prop ) {
		for (var i = 0; i < values.length; i++) {
			if ( prop == values[i] ) {
				n = i;
				break;
			}
		}
		n = (n + 1) % values.length;
	}

	return window.XHTMLDOM.cssStyle(tag, property, values[n]);
}

}

