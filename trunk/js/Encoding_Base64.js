/**
 *
 *  Base64 encode / decode
 *  Utf8 encode / decode
 *  http://www.webtoolkit.info/
 *
 **/

// Modified by Ildar Shaimordanov
// To keep the global namespace clear.

if ( 'undefined' == typeof Encoding ) {

function Encoding()
{
}

}

if ( ! Encoding.utf8 ) {

Encoding.utf8 = function()
{
}

}

if ( ! Encoding.utf8.encode ) {

Encoding.utf8.encode = function(string)
{
	string = string.replace(/\r\n/g,"\n");
	var utftext = "";

	for (var n = 0; n < string.length; n++) {

		var c = string.charCodeAt(n);

		if (c < 128) {
			utftext += String.fromCharCode(c);
		}
		else if((c > 127) && (c < 2048)) {
			utftext += String.fromCharCode((c >> 6) | 192);
			utftext += String.fromCharCode((c & 63) | 128);
		}
		else {
			utftext += String.fromCharCode((c >> 12) | 224);
			utftext += String.fromCharCode(((c >> 6) & 63) | 128);
			utftext += String.fromCharCode((c & 63) | 128);
		}

	}

	return utftext;
}

}

if ( ! Encoding.utf8.decode ) {

Encoding.utf8.decode = function(utftext)
{
	var string = "";
	var i = 0;
	var c = c1 = c2 = 0;

	while ( i < utftext.length ) {

		c = utftext.charCodeAt(i);

		if (c < 128) {
			string += String.fromCharCode(c);
			i++;
		}
		else if((c > 191) && (c < 224)) {
			c2 = utftext.charCodeAt(i+1);
			string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
			i += 2;
		}
		else {
			c2 = utftext.charCodeAt(i+1);
			c3 = utftext.charCodeAt(i+2);
			string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
			i += 3;
		}

	}

	return string;
}

}

if ( ! Encoding.Base64 ) {

Encoding.Base64 = function()
{
}

}

if ( ! Encoding.Base64.keyStr ) {

Encoding.Base64.keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

}

if ( ! Encoding.Base64.encode ) {

Encoding.Base64.encode = function(input)
{
	var output = "";
	var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	var i = 0;

	input = Encoding.utf8.encode(input);

	while (i < input.length) {

		chr1 = input.charCodeAt(i++);
		chr2 = input.charCodeAt(i++);
		chr3 = input.charCodeAt(i++);

		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;

		if (isNaN(chr2)) {
			enc3 = enc4 = 64;
		} else if (isNaN(chr3)) {
			enc4 = 64;
		}

		output = output 
			+ Encoding.Base64.keyStr.charAt(enc1) 
			+ Encoding.Base64.keyStr.charAt(enc2) 
			+ Encoding.Base64.keyStr.charAt(enc3) 
			+ Encoding.Base64.keyStr.charAt(enc4);

	}

	return output;
}

}

if ( ! Encoding.Base64.decode ) {

Encoding.Base64.decode = function(input)
{
	var output = "";
	var chr1, chr2, chr3;
	var enc1, enc2, enc3, enc4;
	var i = 0;

	input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

	while (i < input.length) {

		enc1 = Encoding.Base64.keyStr.indexOf(input.charAt(i++));
		enc2 = Encoding.Base64.keyStr.indexOf(input.charAt(i++));
		enc3 = Encoding.Base64.keyStr.indexOf(input.charAt(i++));
		enc4 = Encoding.Base64.keyStr.indexOf(input.charAt(i++));

		chr1 = (enc1 << 2) | (enc2 >> 4);
		chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
		chr3 = ((enc3 & 3) << 6) | enc4;

		output = output + String.fromCharCode(chr1);

		if (enc3 != 64) {
			output = output + String.fromCharCode(chr2);
		}
		if (enc4 != 64) {
			output = output + String.fromCharCode(chr3);
		}

	}

	output = Encoding.utf8.decode(output);

	return output;

}

}
