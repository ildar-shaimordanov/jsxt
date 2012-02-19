//
// JavaScript unit
// Add-on for working with ini-files
//
// Copyright (c) 2012 by Ildar Shaimordanov
//

/*

This file creates a global INI object with two methods and parse 
stringify. These methods provide the same functionality as the methods of 
the same names of the well-known JSON object. The main difference is in 
the text presentation of objects. While JSON produces an object a text 
presentation looks like a regular Javascript object the INI object makes a 
structired text presentation looks like an assignment statement. 


INI.stringify(value, levelDelimiter)
This method produces the text presentation of the provided object. 

value
any Javascript value like arrays or objects. 

levelDelimiter
an optional character that defines a delimiter that used to join sections 
of all levels. 


The example below shows simple usage: 

var iniObj = {
	section1: {
		key1: 'value1', 
		key2: 'value2'
	}, 
	section2: {
		key3: 'value3', 
		key4: 'value4'
	}
}
var iniTxt = INI.stringify(iniObj);


The resulting string variable will contain the following value:


[section1]

key1=value1
key2=value2


[section2]

key3=value3
key4=value4


The following example will process all nested subsections into the 
readable plain text. Will be noticed that the array referred as key4 will 
produce two lines with the same names but different values. 


var iniObj = {
	section1: {
		key1: 'value1', 
		key2: 'value2', 
		section2: {
			key3: 'value3', 
			key4: [
				'value41', 
				'value42'
			]
		}
	}, 
	section3: {
		key5: 'value5', 
		key6: 'value6'
	}
}
var iniTxt = INI.stringify(iniObj);


And the resulting text will be the following. We can see that section1 and 
section2 are joined by the '/' character as the default delimiter. 


[section1]

key1=value1
key2=value2


[section1/section2]

key3=value3
key4=value41
key4=value42


[section3]

key5=value5
key6=value6


INI.parse(text, levelDelimiter, deepen)
The method is used to convert the text value to the valid Javascript 
object. It can produce two leveled structure where the first level is 
sections and the second level is keys. This is default behavior of the 
method. Another way is to produce the more somplex structure with nested 
nodes. As the result the object will look like a tree. 

text
A string, an array of strings or a function producing strings. 
A string value is parsed and divided by newline characters. Thie method 
will look for a newline delimiters, select a line and parse line by line. 

An array is array of separated items that consider as a separate strings. 
The method walks over each item of an array until the end of an array and 
create a section or a key. 

An function should return a string that will be converted to a secrion or 
a key. To stop processing a function shiuld return the 'null' value. This 
can be useful when reading from a file. 

levelDelimiter
an optional character that defines a delimiter that is used to split a 
section on to separate subsections. It is the same argument as in the 
INI.stringify method but has inverse meaning. 

deepen
A boolean value. If it is set to 'true' then the nested structure will be 
produced. By default, it does not affect on the result. 


Below examples show usage of the method will a string, an array and a 
function as the first argument. In all examples the same structure and 
strings are considered. 


// The input string will be parsed. 
var iniObj = INI.parse(iniTxt);


// The input is array of strings. 
var iniArr = iniTxt.split('\n');
var iniObj = INI.parse(iniArr);


Usage of a function as a producing function. It reads a file line by line 
and pass strings to the method. When it mets the end of file it passes the 
'null' value indicating the end of data. 


// In ths function the file is opened in the read-only mode. 
// Data are read from the file line by line and parsed. 
// Then the function fills in the object and closes the file. 
var iniObj;
function readIniFile(filename)
{
	var fso = new ActiveXObject('Scripting.FileSystemObject');
	var f = fso.GetFile(filename);
	var h = f.OpenAsTextStream(1);

	iniObj = INI.parse(function()
	{
		return h.AtEndOfStream ? null : h.ReadLine();
	});

	h.Close();
};


Depending on the deepen argument the different structures will be produced. 
Let's consider the file with the following content:


[section1]

key1=value1
key2=value2


[section1/section2]

key3=value3
key4=value41
key4=value42


[section3]

key5=value5
key6=value6


// All sections are considered without nestion
var iniObj = INI.parse(iniTxt);
var k = iniObj['section1/section2']['key4']; // ['value41', 'value42']

// All sections are considered as nested one into another
var iniObj = INI.parse(iniTxt, '/', true);
var k = iniObj['section1']['section2']['key4']; // ['value41', 'value42']

*/

var INI = INI || {};

(function()
{

// Checks that the provided delimiter is correct and returns the first 
// character of the passed string (the other characters are not mandatory 
// and cutted). If the first character of the string is opening or closing 
// square brackets it throws the exception "Illegal delimiter: %s". 
var validateDelimiter = function(delimiter)
{
	delimiter = String(delimiter || '/').charAt(0);
	if ( delimiter == '[' || delimiter == ']' || delimiter <= ' ' ) {
		throw new Error('Illegal delimiter: "' + delimiter + '"');
	}
	return delimiter;
};

INI.stringify = function(value, levelDelimiter)
{
	levelDelimiter = validateDelimiter(levelDelimiter);

	// Recursively walks through each nodes and all subnodes within it 
	// and creates appropriate sections combining the names from names 
	// of all subnodes using the passed delimiter. 
	var walk = function(result, value, upperLevel)
	{
		var section = [];

		for (var p in value) {
			if ( ! value.hasOwnProperty(p) ) {
				continue;
			}

			var v = value[p];

			var t = Object.prototype.toString.call(v);
			if ( t == '[object Object]' ) {
				section.push('\n\n[' + upperLevel + p + ']\n');
				walk(section, v, upperLevel + p + levelDelimiter);
				continue;
			}

			v = [].concat(v);
			for (var i = 0; i < v.length; i++) {
				result.push(p + '=' + v[i]);
			}
		}

		result.push.apply(result, section);
	};

	var result = [];

	walk(result, value, '');

	return result.join('\n');
};

INI.parse = function(text, levelDelimiter, deepen)
{
	levelDelimiter = validateDelimiter(levelDelimiter);

	var result = {};

	// The setPtr function is needed to set the pointer to the current 
	// node where keys will be added further. Depending on the deepen 
	// argument the appropriate implementation will be used. 
	var ptr = result;
	var setPtr = (function()
	{
		// This routine does not parse the section name and 
		// consider it as is. So the resulting structure will be 
		// simple object of two levels - the first level is 
		// section and the second one is keys. 
		if ( ! deepen ) {
			return function(section)
			{
				if ( ! result.hasOwnProperty(section) ) {
					result[section] = {};
				}
				ptr = result[section];
			}
		}

		// This routine parse the section name and split by the 
		// passed delimiter. So each part of the name is a 
		// separate sunsection. Finally this leads to the more 
		// complex structure with nested nodes like a tree. 
		return function(section)
		{
			var t = section.split(levelDelimiter);
			ptr = result;
			for (var i = 0; i < t.length; i++) {
				var u = t[i];
				if ( ! u ) {
					continue;
				}
				if ( ! ptr.hasOwnProperty(u) ) {
					ptr[u] = {};
				}
				ptr = ptr[u];
			}
		}
	})();

	var nextLine = (function()
	{
		// A function passed as the first argument is called as is 
		// should return a string or the null value when data are 
		// completed. 
		if ( typeof text == 'function' ) {
			return text;
		}

		// Walk over each item of an array passed to the method. 
		// This internally created function returns each string 
		// until items ended and returns the null value when the 
		// end of data is achieved. 
		if ( Object.prototype.toString.call(text) == '[object Array]' ) {
			var n = text.length;
			var i = 0;
			return function()
			{
				return n-- ? text[i++] : null;
			};
		}

		// Consider the first argument as a string variable 
		// containing many strings separated by any combination of 
		// the end of line symbols. 
		var re = /[^\r\n]+/g;
		return function()
		{
			var r = re.exec(text);
			return r && r[0];
		}

	})();

	// This regular expression parses the input string and extracts the 
	// name of the section
	var reSec = /^\s*\[([^\[\]]+)\]\s*$/;

	// This regular expression parses the input string and extracts the 
	// name and the value of the parameter
	var reKey = /^\s*([^;#\s][^=]*?)\s*=([^\r\n]*?)$/;

	var line, m, k, v;

	while ( ( line = nextLine() ) != null ) {
		// Consider the line as a section that is a name within 
		// square brackets. Depending on the deepen argument it 
		// will be created simple two-leveled structure with the 
		// first level for sections and the second one for keys. 
		m = line.match(reSec);
		if ( m ) {
			setPtr(m[1]);
			continue;
		}

		// Consider the line as a pair of key and value and store 
		// them under the last section. If the same key has been 
		// inserted already then this key will be mutated to an 
		// array to keep all keys with the same name. 
		m = line.match(reKey);
		if ( m ) {
			k = m[1];
			v = m[2];
			if ( ! ptr.hasOwnProperty(k) ) {
				ptr[k] = v;
			} else {
				if ( typeof ptr[k] == 'string' ) {
					ptr[k] = [ptr[k]];
				}
				ptr[k].push(v);
			}
			continue;
		}
	}

	return result;
};

})();

