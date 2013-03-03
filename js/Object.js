//
// JavaScript unit
// Add-on for the object manipulation
//
// Copyright (c) 2009-2013 by Ildar Shaimordanov
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
 * The empty value is following:
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

if ( typeof Object.getPrototypeOf != 'function' ) {

/**
 * Returns the prototype (i.e. the internal [[Prototype]]) of 
 * the specified object.
 *
 * @param	The object whose prototype is to be returned.
 * @return	A prototype of the specified object
 * @access	public
 * @link	http://ejohn.org/blog/objectgetprototypeof/
 */
if ( typeof 'test'.__proto__ == 'object' ) {

Object.getPrototypeOf = function(object)
{
	return object.__proto__;
};

} else {

Object.getPrototypeOf = function(object)
{
	return object.constructor.prototype;
};

}

}

if ( ! Object.keys ) {

/**
 * Returns an array whose elements are strings corresponding 
 * to the enumerable properties found directly upon object. 
 *
 * @param	Boolean
 * @access	public
 * @link	https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/keys
 */

(function ()
{
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var hasDontEnumBug = ! ({toString: null}).propertyIsEnumerable('toString');
	var dontEnums = [
		'toString',
		'toLocaleString',
		'valueOf',
		'hasOwnProperty',
		'isPrototypeOf',
		'propertyIsEnumerable',
		'constructor'
	];
	var dontEnumsLength = dontEnums.length;

	Object.keys = function(obj)
	{
		if ( typeof obj !== 'object' && typeof obj !== 'function' || obj === null ) {
			throw new TypeError('Object.keys called on non-object');
		}

		var result = [];

		for (var prop in obj) {
			if ( ! hasOwnProperty.call(obj, prop) ) {
				continue;
			}
			result.push(prop);
		}

		if ( hasDontEnumBug ) {
			for (var i = 0; i < dontEnumsLength; i++) {
				if ( ! hasOwnProperty.call(obj, dontEnums[i]) ) {
					continue;
				}
				result.push(dontEnums[i]);
			}
		}

		return result;
	};
})();

}

if ( ! Object.create ) {

/**
 * Creates a new object with the specified prototype object and properties. 
 * 
 * This polyfill covers the main use case which is creating a new object 
 * for which the prototype has been chosen but doesn't take the second 
 * argument into account.
 *
 * @param	The object which should be the prototype of the newly-created object.
 * @return	A new object
 * @access	public
 * @link	https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create
 */
Object.create = function(proto)
{
	if ( arguments.length > 1 ) {
		throw new Error('Object.create implementation only accepts the first parameter.');
	}

	function F() {};
	F.prototype = proto;

	return new F();
};

}

Object.mixin = function(dst, src)
{
	var props = Object.keys(src);
	for (var i = 0; i < props.length; i++) {
		var prop = props[i];
		if ( ! src.hasOwnProperty(prop) ) {
			continue;
		}
		dst[prop] = src[prop];
	}
	return dst;
};

/*

// Point is a base class, a parent of all other classes
var Point = Object.extend(Object, {
	constructor: function(x, y)
	{
		this.x = x;
		this.y = y;
	}, 
	iam: function()
	{
		return 'point';
	}, 
	at: function()
	{
		return '[x,y]=' + [this.x, this.y];
	}, 
	draw: function()
	{
		alert(this);
	}, 
	toString: function()
	{
		return this.iam() + ':\t' + this.at();
	}
});

// Circle is a new class inherited from the Point class
var Circle = Object.extend(Point, {
	constructor: function(x, y, r)
	{
		Circle.superclass.constructor.call(this, x, y);
		this.r = r;
	}, 
	iam: function()
	{
		return 'circle';
	}, 
	at: function()
	{
		return Circle.superclass.at.apply(this) + ', r=' + this.r;
	}
});

// Rectangle is another class inherited from the Point class
var Rectangle = Object.extend(Point, {
	constructor: function(x, y, w, h)
	{
		Rectangle.superclass.constructor.call(this, x, y);
		this.w = w;
		this.h = h;
	}, 
	iam: function()
	{
		return 'rect';
	}, 
	at: function()
	{
		return Rectangle.superclass.at.apply(this) + ', [w,h]=' + [this.w, this.h];
	}
});

// Square is the class inherited from the Rectangle class
var Square = Object.extend(Rectangle, {
	constructor: function(x, y, s)
	{
		Square.superclass.constructor.call(this, x, y, s, s);
	}, 
	iam: function()
	{
		return 'square';
	}
});

// Instances of the each class
var c = new Point(1, 1);
c.draw();

var c = new Circle(0, 0, 1);
c.draw();

var c = new Rectangle(0, 0, 1, 2);
c.draw();

var c = new Square(0, 0, 1);
c.draw();

*/
Object.extend = function(parent, proto)
{
	proto = proto || {};

	var child = proto.hasOwnProperty('constructor') 
		? proto.constructor 
		: function() { parent.apply(this, arguments); };

//	var F = function() {};
//	F.prototype = parent.prototype;
//	child.prototype = Object.mixin(new F(), proto);
	child.prototype = Object.mixin(Object.create(parent.prototype), proto);

	child.superclass = parent.prototype;
	child.prototype.constructor = child;
	return child;
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

var escaped = /[\x00-\x1F\"\\]/g;
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
		return special[$0] || $0;
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

		// Assume win32 COM objects
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
					// Only functions can return an empty string when func == 0
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
Object.dump = function(object, options)
{
	var $ = Object.dump.$ || {};

	options = options || {};

	space = options.space || $.space;
	var t = Object.prototype.toString.call(space);
	if ( t == '[object Number]' && space >= 0 ) {
		space = new Array(space + 1).join(' ');
	} else if ( t != '[object String]' ) {
		space = '    ';
	}

	deep = Number(options.deep) > 0 ? options.deep : Number($.deep) > 0 ? $.deep : 5;

	proto = options.proto || $.proto || 0;
	func = options.func || $.func || 0;

	return _dump(object);
};

Object.dump.$ = {};

})();
