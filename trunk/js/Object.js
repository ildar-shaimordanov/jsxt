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
 * @access	static
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
 * @access	static
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

/**
 * Returns an array whose elements are strings corresponding 
 * to the enumerable properties found directly upon object. 
 *
 * @param	An object
 * @access	static
 * @link	https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/keys
 */
(function ()
{
	if ( Object.keys ) {
		return;
	}

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
 * @access	static
 * @link	https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create
 */
Object.create = function(proto)
{
	var F = function() {};
	F.prototype = proto;
	return new F();
};

}

/**
 * Combines properties of one object to a another one. 
 * By default it implements copying of properties of the source object 
 * to the destionation object. A function provided as the third argument 
 * allows to implement another algorithm of combination. 
 *
 * @param	The destination object
 * @param	The source object
 * @param	The combinating function (optional)
 * @access	static
 * @require	Object.keys
 */
Object.mixin = function(dst, src, func)
{
	func = func || function(dst, src, prop)
	{
		dst[prop] = src[prop];
	};

	var props = Object.keys(src);
	for (var i = 0; i < props.length; i++) {
		var prop = props[i];
		if ( ! src.hasOwnProperty(prop) ) {
			continue;
		}
		func(dst, src, prop);
	}
	return dst;
};

/**
 * Emulates inheritance in terms of the classical OOP.
 * The first argument refers to the parent object which is inherited. 
 * The second argument provides properties and methods that are copied 
 * to a derived object. 
 *
 * There is the simplest example:
 * var Child = Object.extend(Parent, {});
 * var child = new Child();
 *
 * To keep access to the parent object the following things were implemented:
 *
 * Child.superclass
 * child.constructor.superclass
 *
 * The reference to the prototype of the parent object accessible anywhere. 
 * Literally it equals to Parent.prototype. 
 *
 * this.parent([arguments])
 *
 * The reference to the parent method. It simplifies access to the same
 * method from within overridden method of the derived object. It is visible
 * within the actual method only.
 *
 * object.instanceOf(Class)
 *
 * Simply the wrapper over the operator "object instanceof Class". 
 *

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
		this.parent(x, y);
		//Circle.superclass.constructor.call(this, x, y);
		this.r = r;
	}, 
	iam: function()
	{
		return 'circle';
	}, 
	at: function()
	{
		return this.parent() + ', r=' + this.r;
		//return Rectangle.superclass.at.call(this) + ', r=' + this.r;
	}
});

// Rectangle is another class inherited from the Point class
var Rectangle = Object.extend(Point, {
	constructor: function(x, y, w, h)
	{
		this.parent(x, y);
		//Rectangle.superclass.constructor.call(this, x, y);
		this.w = w;
		this.h = h;
	}, 
	iam: function()
	{
		return 'rect';
	}, 
	at: function()
	{
		return this.parent() + ', [w,h]=' + [this.w, this.h];
		//return Rectangle.superclass.at.call(this) + ', [w,h]=' + [this.w, this.h];
	}
});

// Square is the class inherited from the Rectangle class
var Square = Object.extend(Rectangle, {
	constructor: function(x, y, s)
	{
		this.parent(x, y, s, s);
		//Square.superclass.constructor.call(this, x, y, s, s);
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

 * @param	A parent object
 * @param	An object providing properties and methods for the derived object
 * @return	A new function
 * @access	static
 * @require	Object.create, Object.mixin
 * @link	http://javascript.ru/forum/66098-post2.html
 * @link	http://javascript.ru/forum/90496-post55.html
 * @link	http://learn.javascript.ru/files/tutorial/js/class-extend.js
 */
(function()
{
	// Make wrapper for overwritten methods to allow calling of inherited, 
	// parental methods within from child methods in the form "this.parent()"
	var _wrapParent = function(parentMethod, method)
	{
		return function()
		{
			var parent = this.parent;
			this.parent = parentMethod;
			var result = method.apply(this, arguments);
			this.parent = parent;
			return result;
		};
	};
	var _wrapParentProto = function(dst, src, prop)
	{
		if ( typeof dst[prop] != 'function' || typeof src[prop] != 'function' ) {
			dst[prop] = src[prop];
			return;
		}

		dst[prop] = 
		_wrapParent(dst[prop], src[prop]);
	};

	// Implementation of the "this.instanceOf()" method
	var _instanceOf = function(Class)
	{
		return this instanceof Class;
	};

	Object.extend = function(Parent, proto)
	{
		/*
		Object.extend( [Parent,] {...} )
		Object.extend( [Parent,] Function )
		*/
		if ( arguments.length < 2 ) {
			proto = arguments[0];
			Parent = null;
		}
		Parent = Parent || Object;
		proto = proto || {};

		if ( typeof proto == 'function' ) {
			proto = proto();
		}

		// Remove definitions of service methods
		delete proto.parent;
		delete proto.instanceOf

		// Create new prototype from the parent prototype and copy its methods
		// Make parental methods available via the reference "this.parent()"
		var child_proto = Object.create(Parent.prototype);
		Object.mixin(child_proto, proto, _wrapParentProto);

		// Specify a constructor
		if ( ! proto.hasOwnProperty('constructor') ) {
			child_proto.constructor = function()
			{
				Parent.apply(this, arguments);
			};
		}

		// Assign the "this.instanceOf" method
		child_proto.instanceOf = _instanceOf;

		// Make self reference to the constructor
		var child = child_proto.constructor;
		child.prototype = child_proto;

		// Add a reference to the Parent's prototype
		child.superclass = Parent.prototype;

		return child;
	};
})();

/**
 * Returns a function giving access to private data 
 * within from members of object instances
 *

// The "X" constructor should be declared in its scope
(function(that)
{
	// Create a scope for private data
	var privatize = Object.privatize();

	// Make in visible in the global scope
	that.X = function(x)
	{
		// Declare privatize for this instance
		privatize.create(this, {
			value: x || 'X'
		});
	};

	X.prototype.alert = function()
	{
		var p = privatize(this);
		alert(p.value);
	};
})(this);

// The "Y" constructor should be declared in its scope
(function(that)
{
	// Create a scope for private data
	var privatize = Object.privatize();

	// Make in visible in the global scope
	that.Y = function(x, y)
	{
		// Declare privatize for this instance
		privatize.create(this, {
			value: y || 'Y'
		});

		// Emulate Y inherits X
		X.call(this, x);
	};

	Y.prototype.alert = function()
	{
		// Call inherited parental method
		X.prototype.alert.apply(this);

		var p = privatize(this);
		alert(p.value);
	};
})(this);

 *
 * @param	string
 * @return	function
 * @access	static
 * @link	http://www.crockford.com/javascript/private.html
 * @link	http://gotochriswest.com/blog/2013/04/03/javascript-prototypes-private-data-safe-factories/
 * @link	http://www.codeproject.com/Articles/133118/Safe-Factory-Pattern-Private-instance-state-in-Jav
 * @link	http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html
 */
Object.privatize = function(getter)
{
	getter = getter || '_private';

	// Storage for private data
	var buffer;

	// An identifier to make a getter unique
	var id = 0;

	// Calls the getter method of the specified object
	// Returns the reference to the private container
	var privatize = function(object)
	{
		// Get private data to a local variable
		object[getter][id]();

		// Get a copy, cleanup the storage and return the copy
		var data = buffer;
		buffer = null;
		return data;
	};

	// Creates a container for private properties
	// Assigns a method for the provided object 
	// to get access to the private container
	privatize.create = function(object, data)
	{
		data = Object(data);

		// Find a unique identifier for the instance
		object[getter] = object[getter] || {};
		while ( object[getter].hasOwnProperty(id) ) {
			//id = Math.random();
			id++;
		}

		// Assign the private data getter
		object[getter][id] = function()
		{
			buffer = data;
		};
	};

	return privatize;
};

/**
 * Another way to implement classical OOP inheritance
 *
 * Class( [Parent,] {...} )
 * Class( [Parent,] Function )
 *

// The base class "X"
var X = Class(function()
{
	// The private variable for instances of "X"
	var p;
	return {
		constructor: function(x)
		{
			p = x;
		}, 
		hello: function()
		{
			alert('Hello, world!');
		}, 
		alert: function()
		{
			alert(p);
		}
	};
});

// The class "Y" inherited from "X"
var Y = Class(X, function()
{
	// The private variable for instances of "Y"
	var p;
	return {
		constructor: function(x, y)
		{
			// Call the inherited constructor
			this.parent(x)
			p = y;
		}, 
		alert: function()
		{
			// Call the inherited method
			this.hello();
			// Call the overwritten method
			this.parent();
			alert(p);
		}
	};
});

 *
 * @param	Function	A parental class
 * @param	Object, Function	A class structure
 * @return	Function	A constructor of a new class
 * @access	static
 * @require	Object.mixin
 * @link	http://javascript.ru/forum/168029-post1.html
 * @link	https://github.com/devote/jsClasses
 */
var Class = (function()
{
	// Make wrapper for overwritten methods to allow calling of inherited, 
	// parental methods within from child methods in the form "this.parent()"
	var _wrapParent = function(parentMethod, method)
	{
		return function()
		{
			var parent = this.parent;
			this.parent = parentMethod;
			var result = method.apply(this, arguments);
			this.parent = parent;
			return result;
		};
	};
	var _wrapParentClass = function(dst, src, prop)
	{
		if ( typeof dst[prop] != 'function' || typeof src[prop] != 'function' ) {
			dst[prop] = src[prop];
			return;
		}
		src[prop] = 
		dst[prop] = 
		_wrapParent(dst[prop], src[prop]);
	};

	// The stub to provide parental properties to a child class
	var F = function() {};

	var Class = function(Parent, proto)
	{
		/*
		Class( [Parent,] {...} )
		Class( [Parent,] Function )
		*/
		if ( arguments.length < 2 ) {
			proto = arguments[0];
			Parent = null;
		}
		Parent = Parent || Object;
		proto = proto || {};

		// Redefine the class structure to be a function returning it
		if ( typeof proto != 'function' ) {
			proto = (function(proto)
			{
				return function()
				{
					return proto;
				};
			})(proto);
		}

		// Implementation of the "this.instanceOf()" method
		var _instanceOf = function(Class)
		{
			var p = Child;
			while ( p ) {
				if ( p === Class ) {
					return true;
				}
				p = p.Parent;
			}
			return false;
		};

		// Common constructor of all classes
		var Child = function()
		{
			// Prepare properties for instantiating
			var object = proto();

			// Remove definitions of service methods
			delete object.parent;
			delete object.instanceOf

			// Prepare the structure of the parental class
			// Be sure that it is object anyway
			var parent = Object(Parent.call(new F()));

			// Fill in the instance with parental properties
			// It should be the first action to provide inherited properties
			Object.mixin(this, parent);

			// Fill in the instance with the actual properties
			// It may have overwrite parental properties
			// Inherited methods will be redefined with the purpose to have 
			// possibility to call the overwritten parental method
			Object.mixin(this, object, _wrapParentClass);

			// Assign the "this.instanceOf" method
			this.instanceOf = _instanceOf;

			// Return the parental structure
			if ( this instanceof F ) {
				return this;
			}

			object.constructor.apply(this, arguments);
		};

		// Create a link to the parental constructor
		Child.Parent = Parent;
		return Child;
	};

	return Class;
})();

/**
 * Creates a specified namespace and sets a value to the latest item. 
 *
 * See example below.

Object.ns('a.b.c.d', Math.PI);
Object.ns('a.x.y.z', Math.PI);

// The code above creates this structure
var a = {
	b: {
		c: {
			d: Math.PI
		}
	}, 
	x: {
		y: {
			z: Math.PI
		}
	}
};

 *
 * @param	String	A namespace in the dot notaion
 * @param	Object	A value to be added
 * @return	Object
 * @access	static
 */
(function(that)
{
	Object.ns = function(namespace, value)
	{
		var parts = namespace.split('.');
		var name = parts.pop();
		var len = parts.length;

		var root = that;

		for (var i = 0; i < len; i++) {
			var p = parts[i];
			root = root[p] = root[p] || {};
		}

		return root[name] = value;
	};

})(this);

/**
 * Creating a copy of an object with fully replicated properties. 
 * Each property of an object will be copied recursively
 *
 * @param	An object
 * @result	A copy of the object
 * @access	static
 *
 * @author	Ildar Shaimordanov (the common idea of 'object cloning')
 */
Object.clone = function(object)
{
	// Simple properties and NULL are copied as is
	if ( ! object || typeof object != 'object' ) {
		return object;
	}

	// Try as a DOM object
	if ( object.nodeType && typeof object.cloneNode == 'function' ) {
		return object.cloneNode(true);
	}

	// Check if the object is self-cloneable
	if ( typeof object.clone == 'function' ) {
		return object.clone();
	}

	// RegExp object?
	if ( object instanceof RegExp ) {
		return eval('' + object);
	}

	// Date, Boolean, Number, String?
	var innerObjects = [Date, Boolean, Number, String];
	for (var i = 0; i < innerObjects.length; i++) {
		if ( object.constructor == innerObjects[i] ) {
			return new innerObjects[i](object.valueOf())
		}
	}

	// COM object? It isn't cloneable
	if ( ! object.constructor || typeof ActiveXObject == 'function' && object instanceof ActiveXObject ) {
		throw new ReferenceError();
	}

	// Try cloning safely as much possible
	var clone = new object.constructor();
	for (var p in object) {
		clone[p] = object[p] === object 
			? clone 
			: arguments.callee(object[p]);
	}
	return clone;
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
