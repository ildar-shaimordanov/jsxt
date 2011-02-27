//
// Bencode.js
// Decode and Encode data in Bittorrent format                          |
// http://en.wikipedia.org/wiki/Bencode
//
// Copyright (c) 2010 by Ildar Shaimordanov
//

function Bencode()
{
};

Bencode.stringify = function(value)
{
	var constructor = Object.prototype.toString.call(value);

	if ( constructor == '[object Number]' ) {
		return 'i' + parseInt(value) + 'e';
	}
	if ( constructor == '[object String]' ) {
		return value.length + ':' + value.toString();
	}
	if ( constructor == '[object Date]' ) {
		return 'i' + Math.floor(this.valueOf() / 1000) + 'e';
	}

	if ( constructor == '[object Array]' ) {
		var result = [];
		for (var i = 0; i < value.length; i++) {
			result.push(arguments.callee(value[i]));
		}
		return 'l' + result.join('') + 'e';
	}

	var result = [];
	for (var p in value) {
		if ( ! value.hasOwnProperty(p) ) {
			continue;
		}
		result.push(arguments.callee(String(p)) + arguments.callee(value[p]));
	}
	return 'd' + result.join('') + 'e';
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

var toString = function()
{
	var result = [];

	// name
	result.push('Torrent name:\n\t' + this.info.name);

	// announces
	result.push('');
	result.push('Announce:\n\t' + (this.announce || ''));

	var announceList = [];
	for (var i = 0; i < this['announce-list'].length; i++) {
		announceList.push.apply(announceList, this['announce-list'][i]);
	}
	announceList.sort();
	result.push('Announce list:\n\t' + announceList.join('\n\t'));

	// information about creation
	result.push('');
	result.push('Creation date\t' + new Date(Number(this['creation date'])));
	result.push('Created by\t' + this['created by']);
	result.push('Encoding\t' + this.encoding);

	// comment
	result.push('');
	result.push('Comment:\n' + this.comment);

	// files
	if ( this.info.files ) {
		var spaces = (new Array(12 + 1)).join(' ');
		var item = {
			size: '', 
			name: '', 
			toString: function()
			{
				return (spaces + this.size).slice(-12) + '\t' + this.name;
			}
		};
		var files = [];
		for (var i = 0; i < this.info.files.length; i++) {
			var file = this.info.files[i];
			item.size = file.length;
			item.name = file.path.join('\\');
			var j = i - 1;
			while ( j >= 0 && files[j].name > item.name ) {
				j--;
			}
			files.splice(j + 1, 0, item);
		}
		result.push('');
		result.push('Files:\n' + files.join('\n'));
	}

	return result.join('\n');
};

Bencode.parse = function(value)
{
	i = 0;
	text = (value || '').toString();
	var result = parser();
	result.toString = toString;
	return result;
};

})();

