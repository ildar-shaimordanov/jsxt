//
// JavaScript unit
// Add-on for the function's manipulation
//
// Copyright (c) 2010 by Ildar Shaimordanov
// Copyright (c) 2010 by Albert Bazaleev aka JSMan
//
// http://forum.script-coding.info/viewtopic.php?pid=33393
//

if ( ! Function.prototype.getOneResource ) {

/**
 * getOneResource method allow to keep data as multiple strings
 * within function as multi-line comments. 
 * This is the simpler than Function.prototype.getResources 
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

if ( ! Function.prototype.getResources ) {

/**
 * getResources method allow to keep data as multiple strings
 * within function as multi-line comments
 *
 * @example
 * // This code will show all builtin resources 
 * // of Function.prototype.getResources
 * var fn = Function.prototype.getResources;
 * 
 * // This will return the first resource
 * var x = fn.getResources(0);
 * 
 * // This will return the second resource
 * var y = fn.getResources(1);
 *
 * // This will return the named resource
 * var z = fn.getResources('DEMO RESOURCE');
 *
 * @param	Number	A number of a resource
 * @return	String
 * @access	public
 */
Function.prototype.getResources = function(index)
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

Function.prototype.getResources.RE = /\/\*\[(\w|\w[^\[\]]*\w)?\[((?:[\r\n]|.)*?)\]\]\*\//mg;
Function.prototype.getResources.list = {};

}

