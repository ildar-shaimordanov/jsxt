//
// JScript and JavaScript unit
//
// This module provides methods for the classical OOP
// This module is experimental
// This module requires Object.js module
//
// Classical OOP implementation
// http://javascript.ru/forum/66098-post2.html
//
// Interface implementation
// http://javascript.ru/forum/90496-post55.html
//

/*

// Allow extended OOP
Object.extend.more();

// Implement IDrawable interface
var IDrawable = Object.extend(Interface, {
	draw: Abstract
});

// Implement IMovable interface
var IMovable = Object.extend(Interface, {
	move: Abstract
});

// Implement IResizable interface
var IResizable = Object.extend(Interface, {
	resize: Abstract
});

// Implement Window abstract with 
// the interfaces IDrawable, IMovable, IResizable
var Window = Object.extend(Abstract, {
}, 
IDrawable, IMovable, IResizable);

// Implement IModal interface
var IModal = Object.extend(Interface, {
	validate: Abstract
});

// Inherit Dialog abstract class from Window with 
// the additional interface IModal
var Dialog = Object.extend(Window, {
}, 
IModal);

*/

(function(Object_extend, that)
{

var _more = function()
{
	Interface = Object.extend(Function, {
		constructor: function()
		{
			throw new Error('Object cannot be instantiated from an interface');
		}
	});

	Abstract = Object.extend(Object, {
		constructor: function()
		{
			// new Abstract()
			if ( this instanceof Abstract && this.constructor == Abstract ) {
				throw new Error('Object cannot be instantiated from an abstract class');
			}

			// var Child = Object.extend(Parent, { method: Abstract })
			// Child.method();
			if ( this instanceof Abstract ) {
				Abstract.abstractMethod();
			}

			// var Child = Object.extend(Parent, { method: Abstract() })
			return Abstract.abstractMethod;
		}
	});

	Abstract.abstractMethod = function()
	{
		throw new Error('Abstract method should be overridden');
	};
};

var _mixin = function(dst, src)
{
	var props = Object.keys(src);
	for (var i = 0; i < props.length; i++) {
		var p = props[i];
		if ( ! src.hasOwnProperty(p) ) {
			continue;
		}
		if ( typeof src[p] == 'function' && typeof dst[p] != 'function' ) {
			dst[p] = src[p];
		}
	}
	return dst;
};

var _check = function(dst, src)
{
	var props = Object.keys(src);
	for (var i = 0; i < props.length; i++) {
		var p = props[i];
		if ( ! src.hasOwnProperty(p) ) {
			continue;
		}
		if ( typeof src[p] == 'function' && typeof dst[p] != 'function' ) {
			arguments.callee.missing = p;
			return false;
		}
	}
	return dst;
};

var _extend = function(parent, proto)
{
	// Forbid a constructor for inherited interfaces
	var isInterface = parent.prototype instanceof Interface || parent === Interface;
	if ( isInterface && proto.hasOwnProperty('constructor') ) {
		throw new Error('Interface can not implement the constructor');
	}

	// Override the constructor inherited from abstract classes
	var isAbstract = parent.prototype instanceof Abstract || parent === Abstract;
//	var isAbstract = parent === Abstract;
	if ( isAbstract && ! proto.hasOwnProperty('constructor' ) ) {
		proto.constructor = function() {};
	}

	// Inherit proeprties of the parent into the child
	var child = Object_extend(parent, proto);

	// In the case of inherited from Abstract -- append non-existent properties into child
	// In the case of inherited from Interface -- append all properties from interfaces
	// Otherwise check for missing methods inherited from interfaces
	var what = isInterface 
		? Object.mixin 
		: isAbstract 
		? _mixin 
		: _check;

	for (var i = 2; i < arguments.length; i++) {
		var iface = arguments[i];
		if ( ! iface ) {
			continue;
		}
		child.prototype = what(child.prototype, iface.prototype);
		if ( ! child.prototype ) {
			throw new Error('Method is not implemented: ' + what.missing);
		}
	}

	return child;
};


Object.extend.more = function()
{
	_more();
	Object.extend = _extend;
};

})(Object.extend, this);

