//
// JavaScript unit
// Add-on for the string and number manipulation
//
// Copyright (c) 2005, 2006, 2007, 2010, 2011 by Ildar N. Shaimordanov aka Rumata
//


if ( ! String.validBrackets ) {

/**
 * String.validBrackets(string)
 * Checks string to be valid brackets. Valid brackets are:
 *	quotes	- '' "" `' ``
 *	single	- <> {} [] () %% || // \\
 *	double	- miltiline comments
 *		  /** / C/C++ like (without whitespace)
 *		  <??> PHP like
 *		  <%%> ASP like
 *		  (**) Pascal like
 *
 * @param	string	Brackets (left and right)
 * @return	boolean	Result of validity of brackets
 * @access	static
 */
String.validBrackets = function(br)
{
	if ( ! br ) {
		return false;
	}
	var quot = "''\"\"`'``";
	var sgl = "<>{}[]()%%||//\\\\";
	var dbl = "/**/<??><%%>(**)";
	return (br.length == 2 && (quot + sgl).indexOf(br) != -1)
		|| (br.length == 4 && dbl.indexOf(br) != -1);
};

}

if ( ! String.prototype.brace || ! String.prototype.bracketize ) {

/**
 * object.bracketize(string)
 * Transform the string object by setting in frame of valid brackets
 *
 * @param	string	Brackets
 * @return	string	Bracketized string
 * @access	public
 */
String.prototype.brace = 
String.prototype.bracketize = function(br)
{
	var string = this;
	if ( ! String.validBrackets(br) ) {
		return string;
	}
	var midPos = br.length / 2;
	return br.substr(0, midPos) + string.toString() + br.substr(midPos);
};

}

if ( ! String.prototype.unbrace || ! String.prototype.unbracketize ) {

/**
 * object.unbracketize(string)
 * Transform the string object removing the leading and trailing brackets
 * If the parameter is not defined the method will try to remove existing valid brackets
 *
 * @param	string	Brackets
 * @return	string	Unbracketized string
 * @access	public
 */
String.prototype.unbrace = 
String.prototype.unbracketize = function(br)
{
	var string = this;
	if ( ! br ) {
		var len = string.length;
		for (var i = 2; i >= 1; i--) {
			br = string.substring(0, i) + string.substring(len - i);
			if ( String.validBrackets(br) ) {
				return string.substring(i, len - i);
			}
		}
	}
	if ( ! String.validBrackets(br) ) {
		return string;
	}
	var midPos = br.length / 2;
	var i = string.indexOf(br.substr(0, midPos));
	var j = string.lastIndexOf(br.substr(midPos));
	if (i == 0 && j == string.length - midPos) {
		string = string.substring(i + midPos, j);
	}
	return string;
};

}

if ( ! Number.prototype.radix ) {

/**
 * object.radix(number, number, string)
 * Transform the number object to string in accordance with a scale of notation
 * If it is necessary the numeric string will aligned to right and filled by '0' character, by default
 *
 * @param	number	Radix of scale of notation (it have to be greater or equal 2 and below or equal 36)
 * @param	number	Width of numeric string
 * @param	string	Padding chacracter (by default, '0')
 * @return	string	Numeric string
 * @access	public
 */
Number.prototype.radix = function(r, n, c)
{
	return this.toString(r).padding(-n, c);
//	return this.toString(r).padding(-Math.abs(n), c);
};

}

if ( ! Number.prototype.bin ) {

/**
 * object.bin(number, string)
 * Transform the number object to string of binary presentation
 *
 * @param	number	Width of numeric string
 * @param	string	Padding chacracter (by default, '0')
 * @return	string	Numeric string
 * @access	public
 */
Number.prototype.bin = function(n, c)
{
	return this.radix(0x02, n, c);
//	return this.radix(0x02, (n) ? n : 16, c);
};

}

if ( ! Number.prototype.oct ) {

/**
 * object.oct(number, string)
 * Transform the number object to string of octal presentation
 *
 * @param	number	Width of numeric string
 * @param	string	Padding chacracter (by default, '0')
 * @return	string	Numeric string
 * @access	public
 */
Number.prototype.oct = function(n, c)
{
	return this.radix(0x08, n, c);
//	return this.radix(0x08, (n) ? n : 6, c);
};

}

if ( ! Number.prototype.dec ) {

/**
 * object.dec(number, string)
 * Transform the number object to string of decimal presentation
 *
 * @param	number	Width of numeric string
 * @param	string	Padding chacracter (by default, '0')
 * @return	string	Numeric string
 * @access	public
 */
Number.prototype.dec = function(n, c)
{
	return this.radix(0x0A, n, c);
};

}

if ( ! Number.prototype.hexl ) {

/**
 * object.hexl(number, string)
 * Transform the number object to string of hexadecimal presentation in lower-case of major characters (0-9 and a-f)
 *
 * @param	number	Width of numeric string
 * @param	string	Padding chacracter (by default, '0')
 * @return	string	Numeric string
 * @access	public
 */
Number.prototype.hexl = function(n, c)
{
	return this.radix(0x10, n, c);
//	return this.radix(0x10, (n) ? n : 4, c);
};

}

if ( ! Number.prototype.hex ) {

/**
 * object.hex(number, string)
 * Transform the number object to string of hexadecimal presentation in upper-case of major characters (0-9 and A-F)
 *
 * @param	number	Width of numeric string
 * @param	string	Padding chacracter (by default, '0')
 * @return	string	Numeric string
 * @access	public
 */
Number.prototype.hex = function(n, c)
{
	return this.hexl(n, c).toUpperCase();
};

}

if ( ! Number.prototype.human ) {

/**
 * object.human([digits[, true]])
 * Transform the number object to string in human-readable format (e.h., 1k, 234M, 5G)
 *
 * @example
 * var n = 1001;
 *
 * // will output 1.001K
 * var h = n.human(3);
 *
 * // will output 1001.000
 * var H = n.human(3, true);
 *
 * @param	integer	Optional. Number of digits after the decimal point. Must be in the range 0-20, inclusive. 
 * @param	boolean	Optional. If true then use powers of 1024 not 1000
 * @return	string	Human-readable string
 * @access	public
 */
Number.prototype.human = function(digits, binary)
{
	var n = this.valueOf();
	var s = '';
	var divs = arguments.callee.add(binary);
	for (var i = divs.length - 1; i >= 0; i--) {
		if ( n >= divs[i].d ) {
			n = n / divs[i].d;
			s = divs[i].s;
			break;
		}
	}
	return n.toFixed(digits) + s;
};

/**
 * Subsidiary method. 
 * Stores suffixes and divisors to use in Number.prototype.human. 
 *
 * @param	boolean
 * @param	string
 * @param	divisor
 * @return	array
 * @access	static
 */
Number.prototype.human.add = function(binary, suffix, divisor)
{
	var name = binary ? 'div2' : 'div10';
	var divs = Number.prototype.human[name] = Number.prototype.human[name] || [];

	if ( arguments.length < 3 ) {
		return divs;
	}

	divs.push({s: suffix, d: divisor});
	divs.sort(function(a, b)
	{
		return a.d - b.d;
	});

	return divs;
};

// Binary prefixes
Number.prototype.human.add(true,  'K', 1 << 10);
Number.prototype.human.add(true,  'M', 1 << 20);
Number.prototype.human.add(true,  'G', 1 << 30);
Number.prototype.human.add(true,  'T', 1 << 40);

// Decimal prefixes
Number.prototype.human.add(false, 'K', 1e3);
Number.prototype.human.add(false, 'M', 1e6);
Number.prototype.human.add(false, 'G', 1e9);
Number.prototype.human.add(false, 'T', 1e12);

}

if ( ! String.prototype.trim ) {

/**
 * object.trim()
 * Transform the string object removing leading and trailing whitespaces
 *
 * @return	string
 * @access	public
 */
String.prototype.trim = function()
{
	return this.replace(/(^\s*)|(\s*$)/g, "");
};

}

if ( ! String.prototype.trimLeft ) {

/**
 * object.trimLeft()
 * Transform the string object removing leading whitespaces
 *
 * @return	string
 * @access	public
 */
String.prototype.trimLeft = function()
{
	return this.replace(/(^\s*)/, "");
};

}

if ( ! String.prototype.trimRight ) {

/**
 * object.trimRight()
 * Transform the string object removing trailing whitespaces
 *
 * @return	string
 * @access	public
 */
String.prototype.trimRight = function()
{
	return this.replace(/(\s*$)/g, "");
};

}

if ( ! String.prototype.dup ) {

/**
 * object.dup()
 * Transform the string object duplicating the string
 *
 * @return	string
 * @access	public
 */
String.prototype.dup = function()
{
	var val = this.valueOf();
	return val + val;
};

}

if ( ! String.prototype.x || ! String.prototype.repeat ) {

/**
 * object.x(number)
 * object.repeat(number)
 * Transform the string object multiplying the string
 *
 * @param	number	Amount of repeating
 * @return	string
 * @access	public
 * @see		http://svn.debugger.ru/repos/jslibs/BrowserExtensions/trunk/ext/string.js
 */
String.prototype.x = 
String.prototype.repeat = function(n)
{
	if ( ! n || n <= 0 || this.length == 0 ) {
		return "";
	}

	return Array(n + 1).join(this.valueOf());
/*
	var r = [this];
	var l;

	n--;
	while ( n ) {
		l = r.length;

		if ( n <= l ) {
			r = r.concat(r.slice(-n));
			break;
		}

		n -= l;
		r = r.concat(r);
	}

	return r.join("");
*/
/*
	if ( ! n || n <= 0 ) {
		return "";
	}
	if ( n == 1 ) {
		return this.origin = this.valueOf();
	}
	var val = this.repeat(parseInt(n / 2));
	return ((n % 2) ? this.origin : "") + val + val;
*/
};

}

if ( ! String.prototype.padding ) {

/**
 * object.padding(number, string)
 * Transform the string object to string of the actual width filling by the padding character (by default ' ')
 * Negative value of width means left padding, and positive value means right one
 *
 * @param	number	Width of string
 * @param	string	Padding chacracter (by default, ' ')
 * @return	string
 * @access	public
 */
String.prototype.padding = function(n, c)
{
	var val = this.valueOf();
	if ( ! n ) {
		return val;
	}
	if ( ! c ) {
		c = " ";
	}
	var pad = String(c).charAt(0).repeat(Math.abs(n) - this.length);
	return (n < 0) ? pad + val : val + pad;
//	return (n < 0) ? val + pad : pad + val;
};

}

if ( ! String.prototype.padLeft ) {

/**
 * object.padLeft(number, string)
 * Wrapper for object.padding
 * Transform the string object to string of the actual width adding the leading padding character (by default ' ')
 *
 * @param	number	Width of string
 * @param	string	Padding chacracter
 * @return	string
 * @access	public
 */
String.prototype.padLeft = function(n, c)
{
	return this.padding(-Math.abs(n), c);
};

}

if ( ! String.prototype.alignRight ) {

/**
 * object.alignRight(number, string)
 * Wrapper for object.padding
 * Synonym for object.padLeft
 *
 * @param	number	Width of string
 * @param	string	Padding chacracter
 * @return	string
 * @access	public
 */
String.prototype.alignRight = String.prototype.padLeft;

}

if ( ! String.prototype.padRight ) {

/**
 * object.padRight(number, string)
 * Wrapper for object.padding
 * Transform the string object to string of the actual width adding the trailing padding character (by default ' ')
 *
 * @param	number	Width of string
 * @param	string	Padding chacracter
 * @return	string
 * @access	public
 */
String.prototype.padRight = function(n, c)
{
	return this.padding(Math.abs(n), c);
};

}

if ( ! String.prototype.alignLeft ) {

/**
 * object.alignLeft(number, string)
 * Wrapper for object.padding
 * Synonym for object.padRight
 *
 * @param	number	Width of string
 * @param	string	Padding chacracter
 * @return	string
 * @access	public
 */
String.prototype.alignLeft = String.prototype.padRight;

}

if ( ! String.prototype.sprintf ) {

/**
 * sprintf(format, argument_list)
 *
 * The string function like one in C/C++, PHP, Perl
 * Each conversion specification is defined as below:
 *
 * %[index][alignment][padding][width][precision]type
 *
 * index	An optional index specifier that changes the order of the 
 *		arguments in the list to be displayed.
 * alignment	An optional alignment specifier that says if the result should be 
 *		left-justified or right-justified. The default is 
 *		right-justified; a "-" character here will make it left-justified.
 * padding	An optional padding specifier that says what character will be 
 *		used for padding the results to the right string size. This may 
 *		be a space character or a "0" (zero character). The default is to 
 *		pad with spaces. An alternate padding character can be specified 
 *		by prefixing it with a single quote ('). See the examples below.
 * width	An optional number, a width specifier that says how many 
 *		characters (minimum) this conversion should result in.
 * precision	An optional precision specifier that says how many decimal digits 
 *		should be displayed for floating-point numbers. This option has 
 *		no effect for other types than float.
 * type		A type specifier that says what type the argument data should be 
 *		treated as. Possible types:
 *
 * % - a literal percent character. No argument is required.  
 * b - the argument is treated as an integer, and presented as a binary number.
 * c - the argument is treated as an integer, and presented as the character 
 *	with that ASCII value.
 * d - the argument is treated as an integer, and presented as a decimal number.
 * u - the same as "d".
 * f - the argument is treated as a float, and presented as a floating-point.
 * o - the argument is treated as an integer, and presented as an octal number.
 * s - the argument is treated as and presented as a string.
 * x - the argument is treated as an integer and presented as a hexadecimal 
 *	 number (with lowercase letters).
 * X - the argument is treated as an integer and presented as a hexadecimal 
 *	 number (with uppercase letters).
 * h - the argument is treated as an integer and presented in human-readable format 
 *	 using powers of 1024.
 * H - the argument is treated as an integer and presented in human-readable format 
 *	 using powers of 1000.
 */
String.prototype.sprintf = function()
{
	var args = arguments;
	var index = 0;

	var x;
	var ins;
	var fn;

	/*
	 * The callback function accepts the following properties
	 *	x.index contains the substring position found at the origin string
	 *	x[0] contains the found substring
	 *	x[1] contains the index specifier (as \d+\$ or \d+#)
	 *	x[2] contains the alignment specifier ("+" or "-" or empty)
	 *	x[3] contains the padding specifier (space char, "0" or defined as '.)
	 *	x[4] contains the width specifier (as \d*)
	 *	x[5] contains the floating-point precision specifier (as \.\d*)
	 *	x[6] contains the type specifier (as [bcdfosuxX])
	 */
	return this.replace(String.prototype.sprintf.re, function()
	{
		if ( arguments[0] == "%%" ) {
			return "%";
		}

		x = [];
		for (var i = 0; i < arguments.length; i++) {
			x[i] = arguments[i] || '';
		}
		x[3] = x[3].slice(-1) || ' ';

		ins = (x[1]) 
			? args[x[1] - 1] 
			: args[index];
		index++;

		return String.prototype.sprintf[x[6]](ins, x);
	});
};

String.prototype.sprintf.re = /%%|%(?:(\d+)[\$#])?([+-])?('.|0| )?(\d*)(?:\.(\d+))?([bcdfosuxXhH])/g;

String.prototype.sprintf.b = function(ins, x)
{
	return Number(ins).bin(x[2] + x[4], x[3]);
};
String.prototype.sprintf.c = function(ins, x)
{
	return String.fromCharCode(ins).padding(x[2] + x[4], x[3]);
};
String.prototype.sprintf.d = 
String.prototype.sprintf.u = function(ins, x)
{
	return Number(ins).dec(x[2] + x[4], x[3]);
};
String.prototype.sprintf.f = function(ins, x)
{
	var ins = Number(ins);
	var fn = String.prototype.padding;
	if (x[5]) {
		ins = ins.toFixed(x[5]);
	} else if (x[4]) {
		ins = ins.toExponential(x[4]);
	} else {
		ins = ins.toExponential();
	}
	// Invert sign because this is not number but string
	x[2] = x[2] == "-" ? "+" : "-";
	return fn.call(ins, x[2] + x[4], x[3]);
};
String.prototype.sprintf.o = function(ins, x)
{
	return Number(ins).oct(x[2] + x[4], x[3]);
};
String.prototype.sprintf.s = function(ins, x)
{
	return String(ins).padding(x[2] + x[4], x[3]);
};
String.prototype.sprintf.x = function(ins, x)
{
	return Number(ins).hexl(x[2] + x[4], x[3]);
};
String.prototype.sprintf.X = function(ins, x)
{
	return Number(ins).hex(x[2] + x[4], x[3]);
};
String.prototype.sprintf.h = function(ins, x)
{
	var ins = String.prototype.replace.call(ins, /,/g, '');
	// Invert sign because this is not number but string
	x[2] = x[2] == "-" ? "+" : "-";
	return Number(ins).human(x[5], true).padding(x[2] + x[4], x[3]);
};
String.prototype.sprintf.H = function(ins, x)
{
	var ins = String.prototype.replace.call(ins, /,/g, '');
	// Invert sign because this is not number but string
	x[2] = x[2] == "-" ? "+" : "-";
	return Number(ins).human(x[5], false).padding(x[2] + x[4], x[3]);
};

/**
 * compile()
 *
 * This string function compiles the formatting string to the internal function 
 * to acelerate an execution a formatting within loops. 
 *
 * @example
 * // Standard usage of the sprintf method
 * var s = '';
 * for (var p in obj) {
 *     s += '%s = %s'.sprintf(p, obj[p]);
 * }
 *
 * // The more speed usage of the sprintf method
 * var sprintf = '%s = %s'.compile();
 * var s = '';
 * for (var p in obj) {
 *     s += sprintf(p, obj[p]);
 * }
 *
 * @see		String.prototype.sprintf()
 */
String.prototype.compile = function()
{
	var args = arguments;
	var index = 0;

	var x;
	var ins;
	var fn;

	/*
	 * The callback function accepts the following properties
	 *	x.index contains the substring position found at the origin string
	 *	x[0] contains the found substring
	 *	x[1] contains the index specifier (as \d+\$ or \d+#)
	 *	x[2] contains the alignment specifier ("+" or "-" or empty)
	 *	x[3] contains the padding specifier (space char, "0" or defined as '.)
	 *	x[4] contains the width specifier (as \d*)
	 *	x[5] contains the floating-point precision specifier (as \.\d*)
	 *	x[6] contains the type specifier (as [bcdfosuxX])
	 */
	var result = this.replace(/(\\|")/g, '\\$1').replace(String.prototype.sprintf.re, function()
	{
		if ( arguments[0] == "%%" ) {
			return "%";
		}

		x = [];
		for (var i = 0; i < arguments.length; i++) {
			x[i] = arguments[i] || '';
		}
		x[3] = x[3].slice(-1) || ' ';

		ins = x[1] ? x[1] - 1 : index;
		index++;

		return '", String.prototype.sprintf.' + x[6] + '(arguments[' + ins + '], ["' + x.join('", "') + '"]), "';
	});

	return Function('', 'return ["' + result + '"].join("")');
};

}

if ( ! String.prototype.splitLimit ) {

/**
 * Corrects the result of the standard method like described below:
 *
 * @example
 * <code>
 * var str = "a b c d e f";
 * var arr = str.split(" ", 3);
 *
 * // standard method
 * // required ["a", "b", "c d e f"]
 * // recieved ["a", "b", "c"]
 *
 * // modified method
 * // required ["a", "b", "c d e f"]
 * </code>
 *
 * @param	Mixed
 * @param	Integer
 * @return	Array
 * @access	public
 * @see		http://forum.dklab.ru/viewtopic.php?p=74826
 * 		http://msdn.microsoft.com/library/default.asp?url=/library/en-us/jscript7/html/jsmthsplit.asp
 * 		http://wdh.suncloud.ru/js09.htm#hsplit
 */
String.prototype.splitLimit = function(delim, limit)
{
	if ( ! limit && Number(limit) <= 0 ) {
		return this.split(delim, limit);
	}

	var isRegExp = delim && delim.constructor == RegExp;
	var res;
	var ref;

	if ( isRegExp ) {
		res = delim.source;
		ref = "";
		if ( delim.ignoreCase ) {
			ref += "i";
		}
		if ( delim.multiline ) {
			ref += "m";
		}
//		if (delim.global) {
//			ref += "g";
//		}
	} else {
		res = delim;
		ref = "";
	}

	var x = this.match(new RegExp("^((?:.*?" + res + "){" + (limit - 1) + "})(.*)", ref));
	if ( x ) {
		var result = x[1].__split__(delim, limit);
		var n = result.length;
		if ( ! isRegExp && n ) {
			n--;
		}
		result[n] = x[2];
		return result;
	}
	return this.valueOf();
};

}


if ( ! String.prototype.parseUrl ) {

/**
 * Considers the string object as URL and returns it's parts separately
 *
 * @param	void
 * @return	Object
 * @access	public
 */
String.prototype.parseUrl = function()
{
	var matches = this.match(arguments.callee.re);

	if ( ! matches ) {
		return null;
	}

	var result = {
		'scheme': matches[1] || '',
		'subscheme': matches[2] || '',
		'user': matches[3] || '',
		'pass': matches[4] || '',
		'host': matches[5],
		'port': matches[6] || '',
		'path': matches[7] || '',
		'query': matches[8] || '',
		'fragment': matches[9] || ''};

	return result;
};

String.prototype.parseUrl.re = /^(?:([a-z]+):(?:([a-z]*):)?\/\/)?(?:([^:@]*)(?::([^:@]*))?@)?((?:[a-z0-9_-]+\.)+[a-z]{2,}|localhost|(?:(?:[01]?\d\d?|2[0-4]\d|25[0-5])\.){3}(?:(?:[01]?\d\d?|2[0-4]\d|25[0-5])))(?::(\d+))?(?:([^:\?\#]+))?(?:\?([^\#]+))?(?:\#([^\s]+))?$/i;

}

if ( ! String.prototype.camelize ) {

String.prototype.camelize = function()
{
	return this.replace(/([^-]+)|(?:-(.)([^-]+))/mg, function($0, $1, $2, $3)
	{
		return ($2 || '').toUpperCase() + ($3 || $1).toLowerCase();
	});
};

}

if ( ! String.prototype.uncamelize ) {

String.prototype.uncamelize = function(capitalize)
{
	return this
		.replace(/[A-Z]/g, function($0)
		{
			return '-' + $0.toLowerCase();
		})
		.replace(capitalize ? /^[a-z]/ : /^[A-Z]/, function($0)
		{
			return $0.toUpperCase();
		});
};

}

