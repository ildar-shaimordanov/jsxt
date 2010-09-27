//
// JavaScript unit
// DOM extensions
//
// Copyright (c) 2010 by Ildar Shaimordanov
//

if ( ! window.XHTMLDOM ) {

window.XHTMLDOM = {};

}

if ( ! window.XHTMLDOM.$ ) {

window.XHTMLDOM.$ = function(element)
{
	return typeof element != 'string' 
		? element 
		: document.getElementById(element);
};

}

if ( ! window.XHTMLDOM.Element ) {

window.XHTMLDOM.Element = {};

}

XHTMLDOM.Element.classExists = function(element, className)
{
	element = XHTMLDOM.$(element);
	return XHTMLDOM.Element.classExists.RE(className).test(element.className);
};

XHTMLDOM.Element.classExists.RE = function(className)
{
	return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)', 'g');
};

XHTMLDOM.Element.addClass = function(element, className)
{
	element = XHTMLDOM.$(element);
	if ( ! XHTMLDOM.Element.classExists(element, className) ) {
		element.className = [element.className, className].join(' ');
	}
	return element;
};

XHTMLDOM.Element.removeClass = function(element, className)
{
	element = XHTMLDOM.$(element);
	className = element.className.split(XHTMLDOM.Element.classExists.RE(className)).join(' ');
	if ( className != element.className ) {
		element.className = className;
	}
	return element;
};

/**
 * @description
 * Toggles visibility of HTML-elements
 *
 * @example
 * \x3Chead\x3E
 * \x3Cscript type="text/javascript"\x3E
 * 
 * window.onload = function()
 * {
 * 	XHTMLDOM.$('header').onclick = function()
 * 	{
 * 		XHTMLDOM.Element.toggle('content');
 * 	};
 * };
 * 
 * \x3C/script\x3E
 * \x3C/head\x3E
 * 
 * \x3Cbody\x3E
 * \x3Cdiv id="container"\x3E
 * \x3Ch1 id="header"\x3ELorem ipsum\x3C/h1\x3E
 * \x3Cdiv id="content"\x3E
 * Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod 
 * tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim 
 * veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
 * commodo consequat. Duis aute irure dolor in reprehenderit in voluptate 
 * velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat 
 * cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id 
 * est laborum. 
 * \x3C/div\x3E
 * \x3C/div\x3E
 * \x3C/body\x3E
 * 
 */
XHTMLDOM.Element.toggle = function(element, className)
{
	if ( className === undefined ) {
		className = 'xhtmldom_element_toggle_to_hidden';

		if ( ! arguments.callee.anon ) {
			arguments.callee.anon = true;

			var style = document.createElement('style');
			style.type = 'text/css';
			document.getElementsByTagName('head')[0].appendChild(style);

			var style = document.styleSheets[document.styleSheets.length - 1];

			if ( style.insertRule ) {
				style.insertRule('.' + className + '{ display: none; }', style.cssRules.length);
			} else {
				style.addRule('.' + className, 'display: none');
			}
		}
	}

	element = XHTMLDOM.$(element);
	if ( XHTMLDOM.Element.classExists(element, className) ) {
		XHTMLDOM.Element.removeClass(element, className);
	} else {
		XHTMLDOM.Element.addClass(element, className);
	};
	return element;
};

