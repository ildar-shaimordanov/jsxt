//
// JavaScript unit
// Add-on for the function's manipulation
//
// Copyright (c) 2010 by Ildar Shaimordanov
// Copyright (c) 2010 by Albert Bazaleev aka JSMan
//
// http://forum.script-coding.info/viewtopic.php?pid=33393
//

// PARTIAL WORKAROUND for Function.prototype.bind
if ( ! Function.prototype.bind ) {

/**
 * Function.prototype.bind(context [, arg1 [, arg2 [...] ] ]);
 *
 * @description
 * Creates a new function that, when called, itself calls this function in 
 * the context of the provided this value, with a given sequence of 
 * arguments preceding any provided when the new function was called. 
 *
 * The bind function creates a new function (a bound function) that calls 
 * the function that is its this value (the bound function's target 
 * function) with a specified this parameter, which cannot be overridden. 
 * bind also accepts leading default arguments to provide to the target 
 * function when the bound function is called.  A bound function may also be 
 * constructed using the new operator: doing so acts as though the target 
 * function had instead been constructed.  The provided this value is 
 * ignored, while prepended arguments are provided to the emulated function. 
 *
 * @param	context	The value to be passed as the this parameter to the 
 * 			target function when the bound function is called. 
 * 			The value is ignored if the bound function is 
 * 			constructed using the new operator.
 * @param	argi	Arguments to prepend to arguments provided to the 
 * 			bound function when invoking the target function.
 * @return	Function
 * @access	public
 *
 * @see		https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
 */
Function.prototype.bind = function(context /*, arg1, arg2... */)
{
	'use strict';
	if ( typeof this !== 'function' ) {
		throw new TypeError();
	}
	var 
	_arguments = Array.prototype.slice.call(arguments, 1),
	_this = this,
	_concat = Array.prototype.concat,
	_function = function()
	{
		return _this.apply(
			this instanceof _dummy ? this : context,
			_concat.apply(_arguments, arguments));
	},
	_dummy = function()
	{
	};
	_dummy.prototype = _this.prototype;
	_function.prototype = new _dummy();
	return _function;
};

}

if ( ! Function.prototype.getOneResource ) {

/**
 * getOneResource method allow to keep data as multiple strings
 * within function as multi-line comments. 
 * This is the simpler than Function.prototype.getResource 
 * but it does not support indexes and caching. 
 *
 * @example
 *
 * @param	void
 * @return	String
 * @access	public
 */
Function.prototype.getOneResource = function()
{
	return this
		.toString()
		.match(/\/\*\[\[((?:[\r\n]|.)*?)\]\]\*\//m)[1]
		;
};

}

if ( ! Function.prototype.getResource ) {

/**
 * getResource method allow to keep data as multiple strings
 * within function as multi-line comments
 *
 * @example
 * // This code will show all builtin resources 
 * // of Function.prototype.getResource
 * var fn = Function.prototype.getResource;
 * 
 * // This will return the first resource
 * var x = fn.getResource(0);
 * 
 * // This will return the second resource
 * var y = fn.getResource(1);
 *
 * // This will return the named resource
 * var z = fn.getResource('DEMO RESOURCE');
 *
 * @param	Number	A number of a resource
 * @return	String
 * @access	public
 */
Function.prototype.getResource = function(index)
{
/*[[
This is unnamed resource #0
]]*/
/*[DEMO RESOURCE[
This is single named resource
]]*/
/*
This is simple comment, not resource
*/
/*[[This is another unnamed resource #1]]*/
/*[DEMO RESOURCE[
The named resource is continued here
]]*/
	var f = this.toString();

	if ( ! arguments.callee.list[f] ) {
		arguments.callee.list[f] = {};

		var m, k, v;
		var i = 0;
		while ( ( m = arguments.callee.RE.exec(f) ) ) {
			k = m[1];
			v = m[2];

			if ( k == '' ) {
				k = i;
				i++;
			}

			arguments.callee.list[f][k] = (arguments.callee.list[f][k] || '') + v;
		}
	}

	return index === undefined 
		? arguments.callee.list[f] 
		: (arguments.callee.list[f][index] || '');
};

Function.prototype.getResource.RE = /\/\*\[(\w|\w[^\[\]]*\w)?\[((?:[\r\n]|.)*?)\]\]\*\//mg;
Function.prototype.getResource.list = {};

}

