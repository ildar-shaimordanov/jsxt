//
// JavaScript unit
// Encoding library
//
// Copyright (c) 2009 by Ildar Shaimordanov
//


if ( ! String.prototype.utf8 ) {

/**
 * Encodes an ISO-8859-1 string to UTF-8
 *
 * @param	void
 * @return	String
 * @access	public
 * @see		http://en.wikipedia.org/wiki/UTF-8
 */
String.prototype.utf8 = function()
{
	return this
		.replace(/[^\x00-\x7f]/g, function($0)
		{
			var n = $0.charCodeAt(0);
			if ( n <= 0x7ff ) {
				return String.fromCharCode(
					0xC0 + (n >> 6), 
					0x80 + (n & 0x3F));
			} else if ( n <= 0xffff ) {
				return String.fromCharCode(
					0xE0 + (n >> 12), 
					0x80 + ((n >> 6) & 0x3F), 
					0x80 + (n & 0x3F));
			} else {
				return String.fromCharCode(
					0xF0 + (n >> 18), 
					0xE0 + ((n >> 12) & 0x3F), 
					0x80 + ((n >> 6) & 0x3F), 
					0x80 + (n & 0x3F));
			}
		});
}

}

if ( ! String.prototype.unutf8 || ! String.prototype.unicodize ) {

/**
 * Converts a string with ISO-8859-1 characters encoded with UTF-8 to single-byte ISO-8859-1
 *
 * @param	void
 * @return	String
 * @access	public
 * @see		http://en.wikipedia.org/wiki/UTF-8
 */
String.prototype.unutf8 = 
String.prototype.unicodize = 
function()
{
	return this
		.replace(/[\xc0-\xdf][\x80-\xbf]/g, function($0)
		{
			var n 
				= (($0.charCodeAt(0) & 0x1F) << 6) 
				+  ($0.charCodeAt(1) & 0x3F);
			return String.fromCharCode(n);
		})
		.replace(/[\xc0-\xcf][\x80-\xbf][\x80-\xbf]/g, function($0)
		{
			var n 
				= (($0.charCodeAt(0) & 0x0F) << 12) 
				+ (($0.charCodeAt(1) & 0x3F) << 6) 
				+  ($0.charCodeAt(2) & 0x3F);
			return String.fromCharCode(n);
		})
		.replace(/[\xf0-\xf7][\x90-\xbf][\x80-\xbf][\x80-\xbf]/g, function($0)
		{
			var n 
				= (($0.charCodeAt(0) & 0x07) << 18)
				+ (($0.charCodeAt(1) & 0x3F) << 12)
				+ (($0.charCodeAt(2) & 0x3F) << 6)
				+  ($0.charCodeAt(3) & 0x3F);
			return String.fromCharCode(n);
		});
}

}

if ( ! String.prototype.base64string ) {

String.prototype.base64string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

}

if ( ! String.prototype.base64 ) {

/**
 * Converts a string with ISO-8859-1 characters encoded with UTF-8 to single-byte ISO-8859-1
 *
 * @param	void
 * @return	String
 * @access	public
 */
String.prototype.base64 = function()
{
	return this
		.utf8()
		.replace(/..?.?/g, function($0)
		{
			var a = $0.charCodeAt(0);
			var b = $0.charCodeAt(1);
			var c = $0.charCodeAt(2);

			var i = a >> 2;
			var j = ((a & 0x03) << 4) + (b >> 4);
			var k = (((b & 0x0F) << 2) + (c >> 6)) || 64;
			var l = (c & 0x3F) || 64;

			return String.prototype.base64string.charAt(i) 
				+ String.prototype.base64string.charAt(j) 
				+ String.prototype.base64string.charAt(k) 
				+ String.prototype.base64string.charAt(l);
		});
}

}

if ( ! String.prototype.unbase64 ) {

/**
 * Decodes data encoded with MIME base64
 *
 * @param	void
 * @return	String
 * @access	public
 */
String.prototype.unbase64 = function()
{
	return this
		.replace(/..../g, function($0)
		{
			var i = String.prototype.base64string.indexOf($0.charAt(0));
			var j = String.prototype.base64string.indexOf($0.charAt(1));
			var k = String.prototype.base64string.indexOf($0.charAt(2));
			var l = String.prototype.base64string.indexOf($0.charAt(3));

			k %= 64;
			l %= 64;

			var a = (i << 2) + (j >> 4);
			var b = ((j & 0x0F) << 4) + ((k >> 2) & 0x0F);
			var c = ((k & 0x03) << 6) + l;

			return String.fromCharCode(a)
				+ ( b ? String.fromCharCode(b) : '' )
				+ ( c ? String.fromCharCode(c) : '' );
		})
		.unutf8();
}

}

