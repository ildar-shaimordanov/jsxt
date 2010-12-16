
//
// JavaScript unit
// Add-on for manipulation with html entities
//
// Copyright (c) 2010 by Ildar Shaimordanov
//

/*

Working but monstruous code

These functions duplicate features of the same functions from PHP

htmlentities

http://phpjs.org/functions/htmlentities:425
http://phpjs.org/functions/get_html_translation_table:416

html_entity_decode

http://phpjs.org/functions/html_entity_decode:424
http://phpjs.org/functions/get_html_translation_table:416

The functions below have been found surfing internet (look for the links in the corresponding comments). 
There are no self-coded translation tables. They do not duplicate features of the same functions in PHP. 
In my opinion this is not necessary. This is JavaScript, not PHP, and each language has it's own way. 

I do not know why but all browsers do not convert quotes to their entities and leave them as is. 
I just added the manual replacement of 'single' and "double" quotes in the Entity.encode function. 
Convert of entities to characters works fine without additional codes. 

Comparing functionality of these functions with the same in PHP we can find that they work as if ENT_QUOTES is passed. 

*/

var Entity = {

	/**
	 * Converts all applicable characters to HTML entities
	 *
	 * @example
	 * var string = '& sign is called as <ampersand>';
	 * // result == '&amp; sign is called as &lt;ampersand&gt;'
	 * var result = Entity.encode(string);
	 *
	 * @param	String
	 * @return	String
	 * @access	static
	 * @link	http://javascript.ru/php/htmlentities
	 */
	encode: function(value)
	{
		var div = document.createElement('div');
		var text = document.createTextNode(value);
		div.appendChild(text);
		return div.innerHTML.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
	}, 

	/**
	 * Converts all HTML entities to their applicable characters
	 *
	 * @example
	 * var string = '&amp; sign is called as &lt;ampersand&gt;';
	 * // result == '& sign is called as <ampersand>'
	 * var result = Entity.decode(string);
	 *
	 * @param	String
	 * @return	String
	 * @access	static
	 * @link	http://stackoverflow.com/questions/3302353/javascript-equivalent-of-html-entity-decode-that-doesnt-rely-on-innerhtml
	 */
	decode: function(value)
	{
		var textarea = document.createElement('textarea');
		textarea.innerHTML = value;
		return textarea.value;
	}

};

