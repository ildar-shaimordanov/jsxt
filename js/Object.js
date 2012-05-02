//
// JavaScript unit
// Add-on for the object manipulation
//
// Copyright (c) 2009-2012 by Ildar Shaimordanov
//

/**
 * Evaluates that the value is defined and is identified by the provided id
 *
 * @param	mixed	value
 * @param	string	is
 * @return	boolean
 * @access	static
 */
Object.isa = function(value, id)
{
	return value !== (void 0) && value !== null && Object.prototype.toString.call(value) == id;
};

/**
 * Evaluates the value as Array
 *
 * @param	mixed	value
 * @return	boolean
 * @access	static
 */
Object.isArray = function(value)
{
	return Object.isa(value, '[object Array]');
};

/**
 * Evaluates the value as Boolean
 *
 * @param	mixed	value
 * @return	boolean
 * @access	static
 */
Object.isBoolean = function(value)
{
	return Object.isa(value, '[object Boolean]');
};

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

/**
 * Evaluates the value as Function
 *
 * @param	mixed	value
 * @return	boolean
 * @access	static
 */
Object.isFunction = function(value)
{
	return Object.isa(value, '[object Function]');
};

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

/**
 * Evaluates the value as Number
 *
 * @param	mixed	value
 * @return	boolean
 * @access	static
 */
Object.isNumber = function(value)
{
	return Object.isa(value, '[object Number]');
};

/**
 * Evaluates the value as Object
 *
 * @param	mixed	value
 * @return	boolean
 * @access	static
 */
Object.isObject = function(value)
{
	return Object.isa(value, '[object Object]');
};

/**
 * Evaluates the value as RegExp
 *
 * @param	mixed	value
 * @return	boolean
 * @access	static
 */
Object.isRegExp = function(value)
{
	return Object.isa(value, '[object RegExp]');
};

/**
 * Evaluates the value as String
 *
 * @param	mixed	value
 * @return	boolean
 * @access	static
 */
Object.isString = function(value)
{
	return Object.isa(value, '[object String]');
};

/**
 * Evaluates the value as Undefined
 *
 * @param	mixed	value
 * @return	boolean
 * @access	static
 */
Object.isUndefined = function(value)
{
	return value === void 0;
};

/**
 * Executes a provided function once per object element.
 *
 * @Description
 * forIn executes the provided function (callback) once for each element 
 * present in the object. 
 * 
 * callback is invoked with three arguments: 
 * - the value of the elemeent, 
 * - the key of the element, 
 * - and the Object being traversed.
 * 
 * If a thisObject parameter is provided to forIn, it will be used as the 
 * this for each invocation of the callback. If it is not provided, or is 
 * null, the global object associated with callback is used instead. 
 * 
 * forIn does not mutate the object on which it is called. 
 *
 * This method is the same as forEach for Array but for Object. 
 * 
 * func=true tells to include methods to the result.
 * By default, non-function properties only are iterated 
 *
 * @param	Callback
 * @param	Boolean
 * @return	void
 * @access	public
 * @see		http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:forEach
 */
Object.forIn = function(object, fun, func, thisp)
{
	if ( typeof fun != "function" ) {
		throw new TypeError();
	}

	for (var p in object) {
		if ( ! object.hasOwnProperty(p) ) {
			continue;
		}
		if ( 'function' == typeof object[p] && ! func ) {
			continue;
		}
		fun.call(thisp, object[p], p, object);
	}
};

if ( ! Object.keys ) {

/**
 * Populates and returns array of the object's keys
 * skipFunction=true tells to exclude methods from the result.
 * By default, all properties are iterated (including methods too). 
 *
 * The second arguments provides options affecting on the result. 
 * Options are:
 * -- func
 * Boolean value controls the visibility of functions. The default value is 0. 
 * (0 - no functions, 1 - walk through functions)
 * -- proto
 * Boolean value controls the visibility properties from the prototype of the oject. 
 * The default value is false. (0 - no properties from prototype, 1 - walk through prototype properties) 
 *
 * @param	Boolean
 * @return	Array
 * @access	public
 */
Object.keys = function(object)
{
	var options = arguments[1] || {};

	var result = [];

	for (var p in object) {
		if ( ! object.hasOwnProperty(p) && ! options.proto ) {
			continue;
		}
		if ( ! options.func && 'function' == typeof object[p] ) {
			continue;
		}
		result.push(p);
	}

	return result;
};

}

/**
 * Creating a copy of an object with fully replicated properties. 
 * Each property of an object will be copied recursively
 *
 * @param	Mixed
 * @result	Mixed
 *
 * @author	Ildar Shaimordanov (the common idea of 'clonning')
 */
Object.clone = function(object)
{
	if ( ! object || typeof(object) != "object" ) {
		return object;
	}
	var newObject = new object.constructor();
	for (var p in object) {
		newObject[p] = object[p] === object 
			? newObject 
			: arguments.callee(object[p], 1);
	}
	return newObject;
};

(function()
{

var entities = {
	'&': '&amp;', 
	'"': '&quot;', 
	'<': '&lt;', 
	'>': '&gt;'
};

var escaped = /["\r\n\t\b\f\\\\]/g;
var special = {
	'"': '\\"', 
	'\r': '\\r', 
	'\n': '\\n', 
	'\t': '\\t', 
	'\b': '\\b', 
	'\f': '\\f', 
	'\\': '\\\\'
};

var space;
var indent = '';

var deep;

var proto;
var func;

function _quote(value)
{
	var result = value.replace(escaped, function($0)
	{
		return special[$0];
	});
	return '"' + result + '"';
};

function _dump(object)
{
	switch (typeof object) {
	case 'string':
		return _quote(object);

	case 'boolean':
	case 'number':
	case 'undefined':
	case 'null':
		return String(object);

	case 'function':
		if ( func == 1 ) {
			return '[Function]';
		}
		if ( func > 1 ) {
			return object.toString();
		}
		return '';

	case 'object':
		if ( object === null ) {
			return String(object);
		}

		// Assume thr win32 COM object
		if ( ! object.constructor ) {
			return '[Object]';
		}

		var t = Object.prototype.toString.call(object);

		// Assume the RegExp object
		if ( t == '[object RegExp]' ) {
			return String(object);
		}

		// Assume the Date object
		if ( t == '[object Date]' ) {
			return object.toUTCString();
		}

		// Stop the deeper nestings
		if ( ! deep ) {
			return '[...]';
		}

		var saveDeep = deep;
		deep--;

		var saveIndent = indent;
		indent += space;

		var result = [];
		for (var k in object) {
			if ( ! object.hasOwnProperty(k) && ! proto ) {
				continue;
			}

			var v;

			if ( object[k] === object ) {
				v = '[Recursive]';
			} else {
				v = arguments.callee(object[k]);
				if ( v === '' ) {
					// Sure that any property will return non-empty string
					// Only functions can return an empty string with func  == 0
					continue;
				}
			}

			result.push(k + ': ' + v);
		}

		var pred;
		var post;

		if ( t == '[object Array]' ) {
			pred = 'Array(' + object.length + ') [';
			post = ']';
		} else {
			pred = 'Object {';
			post = '}';
		}

		result = result.length == 0 
			? '\n' + saveIndent 
			: '\n' + indent + result.join('\n' + indent) + '\n' + saveIndent;

		indent = saveIndent;
		deep = saveDeep;

		return pred + result + post;

	default:
		return '[Unknown]';
	}
};

/**
 * Object.dump(object)
 *
 * @Description
 * Creates a dump of any object. 
 * The second arguments provides options affecting on the result. 
 * Options are:
 * -- deep
 * defines the deep of nestings for complex structures (default is 5)
 * -- space
 * defines initial value of indentation (4 whitespaces, by default). 
 * the numeric value defines indentaion size, the number of space chars
 * -- func
 * Numeric values controls the visibility of functions. The default value is 0. 
 * (0 - do not show function, 1 - show [Function] string, 2 - show a details)
 * -- proto
 * Boolean value controls the visibility properties from the prototype of the oject. 
 * The default value is false. (0 - do not show properties from prototype, 1 - show then) 
 *
 * @param	Mixed
 * @param	Mixed
 * @return	String
 * @access	Static
 */
Object.dump = function(object)
{
	var options = arguments[1] || {};

	var t = Object.prototype.toString.call(options.space);
	if ( t == '[object Number]' ) {
		space = new Array(options.space + 1).join(' ');
	} else if ( t == '[object String]' ) {
		space = options.space;
	} else {
		space = '    ';
	}

	deep = Number(options.deep) > 0 ? options.deep : 5;

	proto = options.proto || 0;
	func = options.func || 0;

	return _dump(object);
};

})();
