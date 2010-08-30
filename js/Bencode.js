//
// Bencode.js
// Decode and Encode data in Bittorrent format                          |
// http://en.wikipedia.org/wiki/Bencode
//
// Copyright (c) 2010 by Ildar Shaimordanov
//

Number.prototype.toBencode = function()
{
	return 'i' + parseInt(this) + 'e';
};

String.prototype.toBencode = function()
{
	return this.length + ':' + this.toString();
};

Date.prototype.toBencode = function()
{
	return 'i' + Math.floor(this.valueOf() / 1000) + 'e';
};

Array.prototype.toBencode = function()
{
	var result = [];
	for (var i = 0; i < this.length; i++) {
		result.push(this[i].toBencode());
	}
	return 'l' + result.join('') + 'e';
};

Object.prototype.toBencode = function()
{
	var result = [];
	for (var p in this) {
		if ( ! this.hasOwnProperty(p) ) {
			continue;
		}
		result.push(String(p).toBencode() + this[p].toBencode());
	}
	return 'd' + result.join('') + 'e';
};

function Bencode()
{
};

Bencode.stringify = function(value)
{
	return (value || '').toBencode();
};

(function()
{

var i = 0;
var text;

function parser()
{
	var c = text.charAt(i);

	switch (c) {
	case 'i':
		var matches = text.slice(i).match(/^i(-?\d+)e/);
		if ( ! matches ) {
			break;
		}

		i += matches.lastIndex;
		return Number(matches[1]);

	case 'l':
		i++;

		var result = [];
		while ( i < text.length && text.charAt(i) != 'e' ) {
			result.push(arguments.callee());
		}

		if ( text.charAt(i) != 'e' ) {
			break;
		}

		i++;
		return result;

	case 'd':
		i++;

		var result = {};
		while ( i < text.length && text.charAt(i) != 'e' ) {
			var k = arguments.callee();
			var v = arguments.callee();
			result[k] = v;
		}

		if ( text.charAt(i) != 'e' ) {
			break;
		}

		i++;
		return result;

	default:
		var matches = text.slice(i).match(/^(\d+):/);
		if ( ! matches ) {
			break;
		}

		var len = Number(matches[1]);
		var a = i + matches.lastIndex;
		var b = a + len;

		var result = text.slice(a, b);
		if ( result.length != len ) {
			break;
		}

		i = b;
		return result;
	}

	// Here is abnormal end
	var errs = {
		i: 'integer', 
		l: 'list', 
		d: 'dictionary'
	};

	throw new RangeError('Bencode.parse: Illegal ' + (errs[c] || 'string') + ' at ' + i + ' (0x' + i.toString(16).toUpperCase() + ')');
};

Bencode.parse = function(value)
{
	i = 0;
	text = (value || '').toString();
	return parser();
};

})();

