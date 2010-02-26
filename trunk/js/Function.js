//
// JavaScript unit
// Add-on for the function's manipulation
//
// Copyright (c) 2010 by Ildar Shaimordanov
// Copyright (c) 2010 by Albert Bazaleev aka JSMan
//
// http://forum.script-coding.info/viewtopic.php?pid=33393
//

if ( ! Function.prototype.getResource ) {

/**
 * getResource method allow to keep data as multiple strings
 * within function as multi-line comments
 *
 * @example
 * // This will return the first resource
 * var x = Function.prototype.getResource.getResource(0);
 * 
 * // This will return the second resource
 * var y = Function.prototype.getResource.getResource(1);
 *
 * @param	Number	A number of a resource
 * @return	String
 * @access	public
 */
Function.prototype.getResource = function(index)
{
/*This is example of resource #1*/
/*This is example of resource #2*/
	var matches = this.toString().match(/\/\*(?:[\r\n]|.)*?\*\//mg);
	if ( ! matches || index >= matches.length || index < 0 ) {
		return null;
	}

	return matches[index].slice(2, -2);
};

}

