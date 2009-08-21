
if ( ! window.XHTMLCSS ) {

window.XHTMLCSS = {};

}

if ( ! XHTMLCSS.getComputedStyle ) {

/**
 * Returns actual style for the element, computed from CSS and inline styles
 *
 * @param {String} prop optional style property to fetch
 * @return {Object} computed style or property value
 * @scope public
 *
 * @author	Ilya Lebedev
 * @see		http://svn.debugger.ru/repos/jslibs/BrowserExtensions/trunk/dom.js
 */
XHTMLCSS.getComputedStyle = function(el, prop)
{
	var y;

	if ( el.currentStyle ) {
		y = el.currentStyle;
	} else if ( window.getComputedStyle ) {
		y = document.defaultView.getComputedStyle(el, null);
	}

	if ( ! y ) {
		return null;
	}

	if ( prop ) {
		y = y[prop];
	}

	return y;
};

}

