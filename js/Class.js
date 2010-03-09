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

/**
 * Creating a copy of an object with fully replicated properties. 
 * Each property of an object will be copied recursively
 *
 * @param	Mixed
 * @result	Mixed
 *
 * @author	Ildar Shaimordanov (the common idea of 'clonning')
 */
Class.clone = function(object)
{
	if ( ! object || typeof(object) != "object" ) {
		return object;
	}
	var newObject = new object.constructor();
	for (var p in object) {
		newObject[p] = Class.clone(object[p]);
	}
	return newObject;
};

/**
 * Object.dump(object)
 *
 * @Description
 * Creates a dump of any object
 *
 * @param	Mixed
 * @param	Integer
 * @param	String
 * @return	String
 * @access	Static
 */
Class.dump = function(object, nest, padding)
{
	if ( ! nest || nest < 0 ) {
		nest = Number.MAX_VALUE;
	}

	if ( ! padding ) {
		padding = "";
	}

	var pred;
	var post;

	switch ( typeof object ) {
	case "object":
		if ( object === null ) {
			return object;
		}
		if ( ! nest ) {
			return "*** TOO MANY NESTIONS ***\n";
		}
		if ( object.constructor == Array ) {
			pred = "Array(" + object.length + ") [\n";
			post = "]";
		} else {
			pred = "Object {\n";
			post = "}";
		}
		post = padding + post;
		padding += "    ";
		var s = "";
		for (var value in object) {
			s += padding + value + ": " + Class.dump(object[value], nest - 1, padding) + "\n";
		}
		return pred + s + post;
	case "string":
		return "\"" + object
			.replace(/\&/g, "&amp;")
			.replace(/\"/g, "&quot;")
			.replace(/\</g, "&lt;")
			.replace(/\>/g, "&gt;")
			.replace(/\r/g, "\\r")
			.replace(/\n/g, "\\n")
			.replace(/\t/g, "\\t")
			+ "\"";
	case "function":
		return "[Function]";
	default:
		return object;
	}
};

