/**
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

// Modified by Ildar Shaimordanov
// To keep the global namespace clear.

if ( 'undefined' == typeof Encoding ) {

function Encoding()
{
}

}

if ( ! Encoding.md5 ) {

Encoding.md5 = function()
{
}

/**
 * hex output format. 
 *    0 - lowercase; 
 *    1 - uppercase 
 */
Encoding.md5.hexcase = 0;

/**
 * base-64 pad character. 
 *    "=" for strict RFC compliance
 */
Encoding.md5.b64pad = "=";

/**
 * bits per input character. 
 *    8 - ASCII; 
 *    16 - Unicode 
 */
Encoding.md5.charset = 8;

}

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */

if ( ! Encoding.md5.hex ) {

Encoding.md5.hex = function(s){ return Encoding.md5.binl2hex(Encoding.md5.core(Encoding.md5.str2binl(s), s.length * Encoding.md5.charset));}

}

if ( ! Encoding.md5.b64 ) {

Encoding.md5.b64 = function(s) { return Encoding.md5.binl2b64(Encoding.md5.core(Encoding.md5.str2binl(s), s.length * Encoding.md5.charset));}

}

if ( ! Encoding.md5.str ) {

Encoding.md5.str = function(s) { return Encoding.md5.binl2str(Encoding.md5.core(Encoding.md5.str2binl(s), s.length * Encoding.md5.charset));}

}

if ( ! Encoding.md5.hex_hmac ) {

Encoding.md5.hex_hmac = function(key, data) { return Encoding.md5.binl2hex(Encoding.md5.core_hmac(key, data)); }

}

if ( ! Encoding.md5.b64_hmac ) {

Encoding.md5.b64_hmac = function(key, data) { return Encoding.md5.binl2b64(Encoding.md5.core_hmac(key, data)); }

}

if ( ! Encoding.md5.str_hmac ) {

Encoding.md5.str_hmac = function(key, data) { return Encoding.md5.binl2str(Encoding.md5.core_hmac(key, data)); }

}

/*
 * Perform a simple self-test to see if the VM is working
 */

if ( ! Encoding.md5.vm_test ) {

Encoding.md5.vm_test = function() { return Encoding.md5.hex("abc") == "900150983cd24fb0d6963f7d28e17f72"; }

}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */

if ( ! Encoding.md5.core ) {

Encoding.md5.core = function(x, len)
{
	/* append padding */
	x[len >> 5] |= 0x80 << ((len) % 32);
	x[(((len + 64) >>> 9) << 4) + 14] = len;

	var a =  1732584193;
	var b = -271733879;
	var c = -1732584194;
	var d =  271733878;

	for (var i = 0; i < x.length; i += 16) {
		var olda = a;
		var oldb = b;
		var oldc = c;
		var oldd = d;

		a = Encoding.md5.md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
		d = Encoding.md5.md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
		c = Encoding.md5.md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
		b = Encoding.md5.md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
		a = Encoding.md5.md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
		d = Encoding.md5.md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
		c = Encoding.md5.md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
		b = Encoding.md5.md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
		a = Encoding.md5.md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
		d = Encoding.md5.md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
		c = Encoding.md5.md5_ff(c, d, a, b, x[i+10], 17, -42063);
		b = Encoding.md5.md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
		a = Encoding.md5.md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
		d = Encoding.md5.md5_ff(d, a, b, c, x[i+13], 12, -40341101);
		c = Encoding.md5.md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
		b = Encoding.md5.md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

		a = Encoding.md5.md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
		d = Encoding.md5.md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
		c = Encoding.md5.md5_gg(c, d, a, b, x[i+11], 14,  643717713);
		b = Encoding.md5.md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
		a = Encoding.md5.md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
		d = Encoding.md5.md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
		c = Encoding.md5.md5_gg(c, d, a, b, x[i+15], 14, -660478335);
		b = Encoding.md5.md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
		a = Encoding.md5.md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
		d = Encoding.md5.md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
		c = Encoding.md5.md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
		b = Encoding.md5.md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
		a = Encoding.md5.md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
		d = Encoding.md5.md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
		c = Encoding.md5.md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
		b = Encoding.md5.md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

		a = Encoding.md5.md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
		d = Encoding.md5.md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
		c = Encoding.md5.md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
		b = Encoding.md5.md5_hh(b, c, d, a, x[i+14], 23, -35309556);
		a = Encoding.md5.md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
		d = Encoding.md5.md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
		c = Encoding.md5.md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
		b = Encoding.md5.md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
		a = Encoding.md5.md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
		d = Encoding.md5.md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
		c = Encoding.md5.md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
		b = Encoding.md5.md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
		a = Encoding.md5.md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
		d = Encoding.md5.md5_hh(d, a, b, c, x[i+12], 11, -421815835);
		c = Encoding.md5.md5_hh(c, d, a, b, x[i+15], 16,  530742520);
		b = Encoding.md5.md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

		a = Encoding.md5.md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
		d = Encoding.md5.md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
		c = Encoding.md5.md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
		b = Encoding.md5.md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
		a = Encoding.md5.md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
		d = Encoding.md5.md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
		c = Encoding.md5.md5_ii(c, d, a, b, x[i+10], 15, -1051523);
		b = Encoding.md5.md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
		a = Encoding.md5.md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
		d = Encoding.md5.md5_ii(d, a, b, c, x[i+15], 10, -30611744);
		c = Encoding.md5.md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
		b = Encoding.md5.md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
		a = Encoding.md5.md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
		d = Encoding.md5.md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
		c = Encoding.md5.md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
		b = Encoding.md5.md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

		a = Encoding.md5.safe_add(a, olda);
		b = Encoding.md5.safe_add(b, oldb);
		c = Encoding.md5.safe_add(c, oldc);
		d = Encoding.md5.safe_add(d, oldd);
	}
	return Array(a, b, c, d);
}

}

/*
 * These functions implement the four basic operations the algorithm uses.
 */

 if ( ! Encoding.md5.md5_cmn ) {

Encoding.md5.md5_cmn = function(q, a, b, x, s, t)
{
	return Encoding.md5.safe_add(Encoding.md5.bit_rol(Encoding.md5.safe_add(Encoding.md5.safe_add(a, q), Encoding.md5.safe_add(x, t)), s),b);
}

}

if ( ! Encoding.md5.md5_ff ) {

Encoding.md5.md5_ff = function(a, b, c, d, x, s, t)
{
	return Encoding.md5.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}

}

if ( ! Encoding.md5.md5_gg ) {

Encoding.md5.md5_gg = function(a, b, c, d, x, s, t)
{
	return Encoding.md5.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}

}

if ( ! Encoding.md5.md5_hh ) {

Encoding.md5.md5_hh = function(a, b, c, d, x, s, t)
{
	return Encoding.md5.md5_cmn(b ^ c ^ d, a, b, x, s, t);
}

}

if ( ! Encoding.md5.md5_ii ) {

Encoding.md5.md5_ii = function(a, b, c, d, x, s, t)
{
	return Encoding.md5.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

}

/*
 * Calculate the HMAC-MD5, of a key and some data
 */

if ( ! Encoding.md5.core_hmac ) {

Encoding.md5.core_hmac = function(key, data)
{
	var bkey = Encoding.md5.str2binl(key);
	if  (bkey.length > 16) bkey = Encoding.md5.core(bkey, key.length * Encoding.md5.charset);

	var ipad = Array(16), opad = Array(16);
	for (var i = 0; i < 16; i++) {
		ipad[i] = bkey[i] ^ 0x36363636;
		opad[i] = bkey[i] ^ 0x5C5C5C5C;
	}

	var hash = Encoding.md5.core(ipad.concat(Encoding.md5.str2binl(data)), 512 + data.length * Encoding.md5.charset);
	return Encoding.md5.core(opad.concat(hash), 512 + 128);
}

}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */

if ( ! Encoding.md5.safe_add ) {

Encoding.md5.safe_add = function(x, y)
{
	var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	return (msw << 16) | (lsw & 0xFFFF);
}

}

/*
 * Bitwise rotate a 32-bit number to the left.
 */

if ( ! Encoding.md5.bit_rol ) {

Encoding.md5.bit_rol = function(num, cnt)
{
	return (num << cnt) | (num >>> (32 - cnt));
}

}

/*
 * Convert a string to an array of little-endian words
 * If Encoding.md5.charset is ASCII, characters >255 have their hi-byte silently ignored.
 */

if ( ! Encoding.md5.str2binl ) {

Encoding.md5.str2binl = function(str)
{
	var bin = Array();
	var mask = (1 << Encoding.md5.charset) - 1;
	for (var i = 0; i < str.length * Encoding.md5.charset; i += Encoding.md5.charset)
		bin[i>>5] |= (str.charCodeAt(i / Encoding.md5.charset) & mask) << (i%32);
	return bin;
}

}

/*
 * Convert an array of little-endian words to a string
 */

if ( ! Encoding.md5.binl2str ) {

Encoding.md5.binl2str = function(bin)
{
	var str = "";
	var mask = (1 << Encoding.md5.charset) - 1;
	for (var i = 0; i < bin.length * 32; i += Encoding.md5.charset)
		str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
	return str;
}

}

/*
 * Convert an array of little-endian words to a hex string.
 */

if ( ! Encoding.md5.binl2hex ) {

Encoding.md5.binl2hex = function(binarray)
{
	var hex_tab = Encoding.md5.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
	var str = "";
	for (var i = 0; i < binarray.length * 4; i++) {
		str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) 
			+ hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
	}
	return str;
}

}

/*
 * Convert an array of little-endian words to a base-64 string
 */

if ( ! Encoding.md5.binl2b64 ) {

Encoding.md5.binl2b64 = function(binarray)
{
	var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var str = "";
	for (var i = 0; i < binarray.length * 4; i += 3) {
		var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16)
			| (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
			|  ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
		for (var j = 0; j < 4; j++) {
			if(i * 8 + j * 6 > binarray.length * 32) str += Encoding.md5.b64pad;
			else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
		}
	}
	return str;
}

}

/*
var h = {
	'0': 'cfcd208495d565ef66e7dff9f98764da',
	'000': 'c6f057b86584942e415435ffb1fa93d4',
	'007': '9e94b15ed312fa42232fd87a55db0d39',
	'1': 'c4ca4238a0b923820dcc509a6f75849b',
	'111': '698d51a19d8a121ce581499d7b701668',
	'123': '202cb962ac59075b964b07152d234b70',
	'123456': 'e10adc3949ba59abbe56e057f20f883e',
	'123123': '4297f44b13955235245b2497399d7a93',
	'12345': '827ccb0eea8a706c4c34a16891f84e7b',
	'qwe': '76d80224611fc919a5d54f0ff9fba446',
	'qweqwe': 'efe6398127928f1b2e9ef3207fb82663',
	'asd': '7815696ecbf1c96e6894b779456d330e',
	'asdasd': 'a8f5f167f44f4964e6c998dee827110c',
	'asdf': '912ec803b2ce49e4a541068d495ab570',
	'zxc': '5fa72358f0b4fb4f2c5d7de8c9a41846',
	'zxczxc': 'ecb97ffafc1798cd2f67fcbc37226761',
	'zxcvb': 'eb89f40da6a539dd1b1776e522459763',
	'zxcvbn': 'b427ebd39c845eb5417b7f7aaf1f9724',
	'zxcv': 'fd2cc6c54239c40495a0d3a93b6380eb',
	'admin': '21232f297a57a5a743894a0e4a801fc3',
	'administrator': '200ceb26807d6bf99fd6f4f0d1ca54d4',
	'Admin': 'e3afed0047b08059d0fada10f400c1e5',
	'Administrator': '7b7bc2512ee1fedcd76bdc68926d4f7b',
	'gfhjkm': 'd9d1b168eac8f197e0576b56cfc23ece',
	'flvby': '3a28525729392f0746380a44b200bb21',
	'flvbybcnhfnjh': '8b7d272b7b9177fcac0d38aa06f4ab99',
	'gfhjkm': 'd9d1b168eac8f197e0576b56cfc23ece',
	'ghbdtn': '2a3dfa66c2d8e8c67b77f2a25886e3cf',
	'qwerty': 'd8578edf8458ce06fbc5bb76a58c5ca4',
	'test': '098f6bcd4621d373cade4e832627b4f6',
	'pass': '1a1dc91c907325c69271ddf0c944bc72',
	'vfif': 'f86eb133aea0114a01595cac67dbcb17',
	'lbvf': '40f1b6d9156fb4c5c93c60b79667c0b7',
	'ybrbnf': '79f0c81692f7d073c7d5f713b78124eb',
	'dfcz': 'd9d53ccc12ebe52f20aca9077a992b09',
	'gfif': 'cb7347eb95885a2f1ef3036057bfe2b5',
	'google': 'c822c1b63853ed273b89687ac505f9fa',
	'ueukm': 'fee2125a43bcb6e04814160d4ea0dccd',
	'vjcrdf': '4ada42a5a7ca1ffff1632a6f812f0599',
	'Vjcrdf': '77af9af7ebfba6070e0b29d34d4d5327',
	',fhfrelf': '464f677bc2a846d08cb5c64bc63c1dee',
	'frekf': '94b1c676abcd33c1af912cdc0bd84958',
	'zyltrc': 'f2e1189d0d738b2d692a76685b949e5a',
	'gbljhfcs': '1b281e2f8ae07815a00de53192d618aa',
	'ehjls': '10cab130d6d53689e0c7f60c094431f6',
	',kzlm': '985a1978be91d7abfb7065bb15c91a61',
	',kby': 'ff7087f014ceb8d7a48b5f9dff09e876',
	'rfr ltkf': '2e4dc7d9e7e84a08507443fc046adf30',
	'lehfr': 'b35217036f336fe4c686b52685c2d2c6',
	'lehf': '4233c3889e28db97475d062682e91f53',
	'cbcntvf': '21881c7e863d8db5770ed0904b15e624',
	';jgf': 'd3f47852e1445cba95855825b789ce02',
	'gfhjkmxbr': '987cadce9ef28e63f7cdba0b66eb1371',
	'gfhjkmxbr': '987cadce9ef28e63f7cdba0b66eb1371'
};

for (var p in h) {
	if ( h[p] != Encoding.md5.hex(p) ) {
		throw new Error('md5(' + p + ') != ' + h[p]);
	}
}
*/

