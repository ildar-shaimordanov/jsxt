//
// Bencode.js
// Decode and Encode data in Bittorrent format                          |
//
// Copyright (c) 2010, 2012 by Ildar Shaimordanov
//


/*

Here is brief description of Bencoding. 
See the following links to learn more details:

http://en.wikipedia.org/wiki/Bencode
http://wiki.theory.org/BitTorrentSpecification#Bencoding


Bencoded string supports strings, integers, lists and dictionaries 
using specific encoding rules. In JavaScript a list is an Array, and 
a dictionary is an Object. 

Strings
Bencoded strings are encoded as follows: 
<string length encoded in base ten ASCII>:<string data>, or key:value
Ex.: 6:string represents the string "string"

Integers
Bencoded integers are encoded as follows: 
i<integer encoded in base ten ASCII>e
Ex.: i3e represents the integer "3"

Lists
Bencoded lists are encoded as follows:
l<bencoded values>e
Ex.: l6:stringi3ee represents the list of two values ["string", 3]

Dictionaries
Bencoded dictionaries are encoded as follows:
d<bencoded string><bencoded element>e 
Ex.: d3:str6:string3:inti3ee represents { "str": "string", "int": 3 }


Bencode.stringify(value)
Takes an object and converts it to a bencoded string. 

Bencode.parse(value)
Takes a string and converts it to an object. 

Bencode.torrentInfo(value, key)
Considers an input object as a torrent and returns parts specified by the key 
value. If the input value is a string it will be previously converted to the 
object. There are several special keys to gather definite values:
-- 'name' - the name of the torrent
-- 'announce-list' - a list of announces
-- 'file-names' - a list of filenames in the torrent
-- 'file-sizes' - a list of file sizes in the torrent
-- 'pieces' - an untrusted field because of differences of used encodings

*/

var Bencode = Bencode || {};

(function()
{

var stringify = function(value)
{
	var constructor = Object.prototype.toString.call(value);

	if ( constructor == '[object Number]' ) {
		return 'i' + parseInt(value) + 'e';
	}
	if ( constructor == '[object String]' ) {
		return value.length + ':' + value.toString();
	}
	if ( constructor == '[object Date]' ) {
		return 'i' + Math.floor(value.getTime() / 1000) + 'e';
	}

	if ( constructor == '[object Array]' ) {
		var result = [];
		for (var i = 0; i < value.length; i++) {
			result.push(stringify(value[i]));
		}
		return 'l' + result.join('') + 'e';
	}

	var result = [];
	for (var p in value) {
		if ( ! value.hasOwnProperty(p) ) {
			continue;
		}
		result.push(stringify(String(p)) + stringify(value[p]));
	}
	return 'd' + result.join('') + 'e';
};


var i = 0;
var text;

var parser = function()
{
	var c = text.charAt(i);

	var err;

	switch (c) {
	case 'i':
		err = 'integer';

		var matches = text.slice(i).match(/^i(-?\d+)e/);
		if ( ! matches ) {
			break;
		}

		i += matches.lastIndex;
		return Number(matches[1]);

	case 'l':
		err = 'list';

		i++;

		var result = [];
		while ( i < text.length && text.charAt(i) != 'e' ) {
			result.push(parser());
		}

		if ( text.charAt(i) != 'e' ) {
			break;
		}

		i++;
		return result;

	case 'd':
		err = 'dictionary';

		i++;

		var result = {};
		while ( i < text.length && text.charAt(i) != 'e' ) {
			var k = parser();
			var v = parser();
			result[k] = v;
		}

		if ( text.charAt(i) != 'e' ) {
			break;
		}

		i++;
		return result;

	default:
		err = 'string';

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
	throw new RangeError('Bencode.parse: Illegal ' + err + ' at ' + i + ' (0x' + i.toString(16).toUpperCase() + ')');
};


var torrentInfo = function(value, key)
{
	switch ( key ) {
	case 'name': 
	case 'piece length': 
	case 'pieces': 
		return value.info[key];
	case 'announce-list': 
		var input = value['announce-list'];
		var result = [];
		for (var i = 0; i < input.length; i++) {
			result.push.apply(result, input[i]);
		}
		return result;
	case 'file-names':
		var input = value.info.files;
		if ( ! input ) {
			// torrent contains the single file
			return [value.info.name];
		}
		var result = [];
		for (var i = 0; i < input.length; i++) {
			result.push(input[i].path.join('\\'));
		}
		return result;
	case 'file-sizes': 
		var input = value.info.files;
		if ( ! input ) {
			// torrent contains the single file
			return [value.info.length];
		}
		var result = [];
		for (var i = 0; i < input.length; i++) {
			result.push(input[i].length);
		}
		return result;
	default:
		return value[key];
	}
};


Bencode.stringify = stringify;

Bencode.parse = function(value)
{
	i = 0;
	text = (value || '').toString();
	return parser();
};

Bencode.torrentInfo = function(value, key)
{
	if ( Object.prototype.toString.call(value) == '[object String]' ) {
		value = Bencode.parse(value);
	}

	if ( ! value || ! value.info ) {
		return;
	}

	return torrentInfo(value, key);
};

})();

