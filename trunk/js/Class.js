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
Object.clone = 
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
 * Creates a dump of any object. 
 * The second arguments provides options affecting on the result. 
 * Options are:
 * -- nesting - defines the deep of nesting (default is 3)
 * -- padding - defines initial value of padding
 * -- walkFunction - (0 - do not show function, 1 - show [Function] string, 2 - show a details)
 * -- walkPrototype - (0 - do not show properties from prototype, 1 - show then) 
 *
 * @param	Mixed
 * @param	Mixed
 * @return	String
 * @access	Static
 */
Object.dump = 
Class.dump = function(object, options)
{
	options = options || {};
	options.padding = options.padding || '';
	if ( typeof options.nesting == 'undefined' || options.nesting < 0 ) {
		options.nesting = 5;
	}

	switch ( typeof object ) {
	case 'object':
		if ( object === null ) {
			return object;
		}

		if ( ! options.nesting ) {
			return '*** TOO MANY NESTIONS ***\n';
		}

		var pred;
		var post;

		if ( object.constructor == Array ) {
			pred = 'Array(' + object.length + ') [\n';
			post = options.padding + ']';
		} else {
			pred = 'Object {\n';
			post = options.padding + '}';
		}
		options.padding += '    ';

		var result = [];
		for (var value in object) {
			if ( ! object.hasOwnProperty(value) && ! options.walkPrototype ) {
				continue;
			}
			var s = arguments.callee(object[value], {
				nesting: options.nesting - 1, 
				padding: options.padding, 
				walkFunction: options.walkFunction, 
				walkPrototype: options.walkPrototype
			});
			if ( s === '' ) {
				// Sure that any property will return non-empty string
				// Only functions can return an empty string with walkFunction == 0
				continue;
			}
			result.push(options.padding + value + ': ' + s + '\n');
		}
		return pred + result.join('') + post;

	case 'string':
		return '\"' + object
			.replace(/\&/g, '&amp;')
			.replace(/\"/g, '&quot;')
			.replace(/\</g, '&lt;')
			.replace(/\>/g, '&gt;')
			.replace(/\r/g, '\\r')
			.replace(/\n/g, '\\n')
			.replace(/\t/g, '\\t')
			+ '\"';

	case 'function':
		if ( options.walkFunction == 1 ) {
			return '[Function]';
		}
		if ( options.walkFunction > 1 ) {
			return object.toString();
		}
		return '';

	default:
		return object;
	}
};

