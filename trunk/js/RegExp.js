//
// JavaScript unit
// Add-on for the RegExp manipulation
//
// Copyright (c) 2011 by Ildar Shaimordanov aka Rumata
//

/*

// RegExp#forEach and RegExp#map are wrappers over the loop like below
// while ( r = re.exec(str) ) {
// ...
// }

// RegExp#match is wrapper over String#match method for the following code
// var matches = string.match(regexp);
// var m;
// if ( matches ) {
//     m = matches[1];
// }


// Example 1.
// This exampel will print an each found item
var regexp = /\d+/g;
var string = '123 abc 456 def 789 xyz';

regexp.forEach(string, function(r)
{
	alert(r);
});


// Example 2.
// The following example will create an array with all found items
var regexp = /\d+/g;
var string = '123 abc 456 def 789 xyz';

var array = regexp.map(string, function(r)
{
	return r;
});

alert(array);


// Example 3.
// This example shows usage of RegExp#match method 
var re = /\d+/g;
var s = '123 abc 456 def 789 xyz';

var m2 = re.match(s, 1);
alert(m2);

*/

RegExp.prototype.forEach = function(string, fun, thisp)
{
	if ( typeof fun != "function" ) {
		throw new TypeError();
	}

	var r;
	while ( r = this.exec(string) ) {
		fun.call(thisp, r, this);
	}
};

RegExp.prototype.map = function(string, fun, thisp)
{
	fun = fun || function(r, re)
	{
		return r;
	};

	var result = [];

	var r;
	while ( r = this.exec(string) ) {
		result.push(fun.call(thisp, r, this));
	}

	return result;
};

RegExp.prototype.match = function(string, index)
{
	var m = String(string).match(this);
	if ( m && arguments.length > 1 ) {
		return m[index];
	}
	return m;
};

