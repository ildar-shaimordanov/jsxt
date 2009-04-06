//
// JavaScript unit
// Add-on for the object manipulation
//
// Copyright (c) 2009 by Ildar Shaimordanov
//

if ( ! Object.isa ) {

/**
 * Evaluates the value is defined and has constructor
 *
 * @param	mixed	value
 * @param	mixed	constructor
 * @return	boolean
 * @access	static
 */
Object.isa = function(value, constructor)
{
	return value !== undefined && value !== null && value.constructor == constructor;
};

}

if ( ! Object.isArray ) {

/**
 * Evaluates the value as Array
 *
 * @param	mixed	value
 * @return	boolean
 * @access	static
 */
Object.isArray = function(value)
{
	return Object.isa(value, Array);
//	return value !== undefined && value !== null && value.constructor == Array;
};

}

if ( ! Object.isBoolean ) {

/**
 * Evaluates the value as Boolean
 *
 * @param	mixed	value
 * @return	boolean
 * @access	static
 */
Object.isBoolean = function(value)
{
	return Object.isa(value, Boolean);
//	return value !== undefined && value !== null && value.constructor == Boolean;
};

}

if ( ! Object.isEmpty ) {

/**
 * Evaluates the value as Empty
 * The empty value is as follow:
 * - Undefined
 * - Null
 * - Boolean == false
 * - String == ''
 * - Number == +0, -0 or NaN
 *
 * @param	mixed	value
 * @return	boolean
 * @access	static
 */
Object.isEmpty = function(value)
{
	return ! Boolean(value);
};

}

if ( ! Object.isFunction ) {

/**
 * Evaluates the value as Function
 *
 * @param	mixed	value
 * @return	boolean
 * @access	static
 */
Object.isFunction = function(value)
{
	return Object.isa(value, Function);
//	return value !== undefined && value !== null && value.constructor == Function;
};

}

if ( ! Object.isIndefinite ) {

/**
 * Evaluates the value as Undefined or Null
 *
 * @param	mixed	value
 * @return	boolean
 * @access	static
 */
Object.isIndefinite = function(value)
{
	return Object.isUndefined(value) || Object.isNull(value);
//	return value === undefined || value === null;
};

}

if ( ! Object.isNull ) {

/**
 * Evaluates the value as Null
 *
 * @param	mixed	value
 * @return	boolean
 * @access	static
 */
Object.isNull = function(value)
{
	return value === null;
};

}

if ( ! Object.isNumber ) {

/**
 * Evaluates the value as Number
 *
 * @param	mixed	value
 * @return	boolean
 * @access	static
 */
Object.isNumber = function(value)
{
	return Object.isa(value, Number);
//	return value !== undefined && value !== null && value.constructor == Number;
};

}

if ( ! Object.isObject ) {

/**
 * Evaluates the value as Object
 *
 * @param	mixed	value
 * @return	boolean
 * @access	static
 */
Object.isObject = function(value)
{
	return Object.isa(value, Object);
//	return value !== undefined && value !== null && value.constructor == Object;
};

}

if ( ! Object.isRegExp ) {

/**
 * Evaluates the value as RegExp
 *
 * @param	mixed	value
 * @return	boolean
 * @access	static
 */
Object.isRegExp = function(value)
{
	return Object.isa(value, RegExp);
//	return value !== undefined && value !== null && value.constructor == RegExp;
};

}

if ( ! Object.isString ) {

/**
 * Evaluates the value as String
 *
 * @param	mixed	value
 * @return	boolean
 * @access	static
 */
Object.isString = function(value)
{
	return Object.isa(value, String);
//	return value !== undefined && value !== null && value.constructor == String;
};

}

if ( ! Object.isUndefined ) {

/**
 * Evaluates the value as Undefined
 *
 * @param	mixed	value
 * @return	boolean
 * @access	static
 */
Object.isUndefined = function(value)
{
	return value === undefined;
};

}

if ( ! Object.dump ) {

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
Object.dump = function(object, nest, padding)
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
			s += padding + value + ": " + Object.dump(object[value], nest - 1, padding) + "\n";
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
		return "[Native code]";
	default:
		return object;
	}
};

}

if ( ! Object.clone ) {

/**
 * Object.clone(object)
 *
 * @Description
 * Creating a copy of an array or an object with fully replicated properties. 
 * Each property of an object will be copied recursively
 *
 * @param	mixed
 * @result	mixed
 *
 * @author	Ildar Shaimordanov (the common idea of 'clonning')
 */
Object.clone = function(object)
{
	if ( object === undefined ) {
		object = this;
	}
	if ( typeof(object) != "object" ) {
		return object;
	}
	var newObject = new object.constructor();
	for (var objectItem in object) {
		newObject[objectItem] = Object.clone(object[objectItem]);
	}
	return newObject;
};

}

if ( ! Object.prototype.forEach ) {

/**
 * Executes a provided function once per object element.
 *
 * @Description
 * forEach executes the provided function (callback) once for each element 
 * present in the object. 
 * 
 * callback is invoked with three arguments: 
 * - the value of the elemeent, 
 * - the key of the element, 
 * - and the Object being traversed.
 * 
 * If a thisObject parameter is provided to forEach, it will be used as the 
 * this for each invocation of the callback. If it is not provided, or is 
 * null, the global object associated with callback is used instead. 
 * 
 * forEach does not mutate the object on which it is called. 
 *
 * This method is the same as forEach for Array but for Object. 
 * 
 * @param	Callback
 * @param	Boolean	Boolean value that indicates whether methods should be skipped when passing.
 * @return	void
 * @access	public
 * @see		http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:forEach
 */
Object.prototype.forEach = function(fun, skipFunction, thisp)
{
	if ( typeof fun != "function" ) {
		throw new TypeError();
	}

	for (var p in this) {
		if ( skipFunction && typeof this[p] == 'function' ) {
			continue;
		}
		fun.call(thisp, this[p], p, this);
	}
};

}

if ( ! Object.prototype.keys ) {

/**
 * Populates and returns array of the object's keys
 *
 * @param	void
 * @return	Array
 * @access	public
 */
Object.prototype.keys = function()
{
	var result = [];

	for (var p in this) {
		if ( ! this.hasOwnProperty(p) ) {
			continue;
		}
		result.push(p);
	}

	return result;
};

}

if ( ! Object.prototype.values ) {

/**
 * Populates and returns array of the object's values
 *
 * @param	void
 * @return	Array
 * @access	public
 */
Object.prototype.values = function(skipFunction)
{
	var result = [];

	for (var p in this) {
		if ( ! this.hasOwnProperty(p) ) {
			continue;
		}
		result.push(this[p]);
	}

	return result;
};

}

if ( ! Object.prototype.toArray ) {

/**
 * Converts an object to an array.
 *
 * @Description
 * toArray executes the provided function (callback) once for each element 
 * present in the object. callback is invoked for each element of the array 
 * and return new item to be inserted into the array. 
 * 
 * callback is invoked with three arguments: 
 * - the value of the element, 
 * - the key of the element, 
 * - and the Object object being traversed.
 * 
 * If a thisObject parameter is provided to toArray, it will be used as the 
 * this for each invocation of the callback. If it is not provided, or is 
 * null, the global object associated with callback is used instead. 
 * 
 * If a thisObject parameter is provided to toArray, it will be used as the 
 * this for each invocation of the callback. If it is not provided, or is 
 * null, the global object associated with callback is used instead. 
 * 
 * forEach does not mutate the object on which it is called. 
 *
 * This method is the same as forEach for Array. 
 * 
 * @param	Callback
 * @param	Boolean	Boolean value that indicates whether methods should be skipped when passing.
 * @return	void
 * @access	public
 */
Object.prototype.toArray = function(fun, skipFunction, thisp)
{
	if ( typeof fun != "function" ) {
		throw new TypeError();
	}

	var result = [];

	for (var p in this) {
		if ( skipFunction && typeof this[p] == 'function' ) {
			continue;
		}
		result.push(fun.call(thisp, this[p], p, this));
	}

	return result;
};

}

