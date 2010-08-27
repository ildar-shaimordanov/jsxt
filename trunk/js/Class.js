//
// JScript and JavaScript unit
// This module provides methods for the classical OOP
//
// Copyright (c) 2004, 2005, 2008, 2009, 2010 by Ildar Shaimordanov
//

var Class = {};

/**
 * Adds new properties and methods from the provided object
 *
 * @param	Mixed
 * @param	Mixed
 * @return	Mixed
 * @access	static
 */
Class.addMethods = function(child, parent)
{
	if ( ! child ) {
		throw new ReferenceError();
	}

	var obj = {};
	for (var p in parent) {
		if ( typeof obj[p] != 'undefined' ) {
			continue;
		}
		if ( obj[p] == parent[p] ) {
			continue;
		}
		child[p] = parent[p];
	}

	return child;
};

/**
 * The child object or class Inherits the constructor of the parent object
 *
 * @param	Mixed
 * @param	Mixed
 * @return	Mixed
 * @access	static
 */
Class.inherit = function(child, parent)
{
	child = child || new Function();

	var F = new Function();
	F.prototype = parent.prototype;

	child.prototype = new F();
	child.prototype.constructor = child;
	child.superclass = parent.prototype;

	return child;
};

/**
 * Inherit totally the constructor and properties of the providing object
 *
 * @param	Mixed
 * @param	Mixed
 * @return	Mixed
 * @access	static
 */
Class.extend = function(child, parent)
{
	return Class.addMethods(
		Class.inherit(child, parent), 
		parent);
};

