//
// JScript and JavaScript unit
// This module provides methods for the classical OOP
//
// Classical OOP implementation
// http://javascript.ru/forum/66098-post2.html
//
// Interface implementation
// http://javascript.ru/forum/90496-post55.html
//


/*

// Point is the base class, the parent of all other classes
var Point = Object.inherit({
	constructor: function(x, y)
	{
		this.x = x;
		this.y = y;
	}, 
	isa: function()
	{
		return 'point';
	}, 
	draw: function()
	{
		alert(this.isa());
		alert('[x,y]=' + [this.x, this.y]);
	}
});

// Circle is the new class inherited from the Point class
var Circle = Point.inherit({
	constructor: function(x, y, r)
	{
		Circle.superclass.constructor.call(this, x, y);
		this.r = r;
	}, 
	isa: function()
	{
		return 'circle';
	}, 
	draw: function()
	{
		Circle.superclass.draw.apply(this, arguments);
		alert('r=' + this.r);
	}
});

// Rectangle is another class inherited from the Point class
var Rectangle = Point.inherit({
	constructor: function(x, y, w, h)
	{
		Rectangle.superclass.constructor.call(this, x, y);
		this.w = w;
		this.h = h;
	}, 
	isa: function()
	{
		return 'rectangle';
	}, 
	draw: function()
	{
		Rectangle.superclass.draw.apply(this, arguments);
		alert('w=' + this.w);
		alert('h=' + this.h);
	}
});

// Square is the class inherited from the Rectangle class
var Square = Rectangle.inherit({
	constructor: function(x, y, s)
	{
		Square.superclass.constructor.call(this, x, y, s, s);
	}, 
	isa: function()
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


Object.mixin = function(dst, src)
{
	for (var prop in src) {
		if ( ! src.hasOwnProperty(prop) ) {
			continue;
		}
		dst[prop] = src[prop];
	}
	return dst;
};

Function.prototype.inherit = function(proto)
{
	var that = this;
	proto = proto || {};

	var constructor = proto.hasOwnProperty('constructor') ? proto.constructor : function() { that.apply(this, arguments); };
	var F = function() {};
	F.prototype = this.prototype;

	constructor.prototype = Object.mixin(new F(), proto);

	constructor.superclass = this.prototype;
	constructor.prototype.constructor = constructor;
	return constructor;
};


/*

// Interfaces
var IMovable = Interface.extend({
	move: Abstract()
});

var IDrawable = Interface.extend({
	draw: Abstract()
});

var IResizable = Interface.extend({
	resize: Abstract()
});

// Abstract class for all plain figures
var Figure = Abstract.extend({
	constructor: function(name, x, y)
	{
		this.name = name;
		this.move(x, y);
	}, 
	iam: function()
	{
		return this.name;
	}, 
	position: function()
	{
		return '[' + this.x + ',' + this.y + ']';
	}, 
	move: function(x, y)
	{
		this.x = x || 0;
		this.y = y || 0;
	}, 
	draw: function()
	{
		alert(this.iam() + ': ' + this.position());
	}, 
	resize: function()
	{
	}
}, IMovable, IDrawable, IResizable);

var Point = Figure.extend({
	constructor: function(x, y)
	{
		Point.superclass.constructor.call(this, 'point', x, y);
	}
});

var Circle = Figure.extend({
	constructor: function(x, y, r)
	{
		Circle.superclass.constructor.call(this, 'circle', x, y);
		this.resize(r);
	}, 
	position: function()
	{
		return Circle.superclass.position.call(this) + ', r=' + this.r;
	}, 
	resize: function(r)
	{
		this.r = r || 1;
	}
});

var Rectangle = Figure.extend({
	constructor: function(x, y, w, h)
	{
		Point.superclass.constructor.call(this, 'rectangle', x, y);
		this.resize(w, h);
	}, 
	position: function()
	{
		return Circle.superclass.position.call(this) + ', [w,h]=' + this.w + ', ' + this.h + ']';;
	}, 
	resize: function(w, h)
	{
		this.w = w || 1;
		this.h = h || 1;
	}
});

var Square = Rectangle.extend({
	constructor: function(x, y, s)
	{
		Square.superclass.constructor.call(this, x, y, s, s);
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


Object.checkMethods = function(dst, src)
{
	for (var p in src) {
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

Function.prototype.extend = function(proto)
{
	var that = this;
	proto = proto || {};

	// Forbid a constructor for inherited interfaces
	var isInterface = typeof Interface == 'function' && ( this.prototype instanceof Interface || this == Interface );
	if ( isInterface && proto.hasOwnProperty('constructor') ) {
		throw new Error('Interface can not implement the constructor');
	}
	// Override the constructor inherited from abstract classes
	var isAbstract = typeof Abstract == 'function' && ( this.prototype instanceof Abstract || this == Abstract );
	if ( isAbstract && ! proto.hasOwnProperty('constructor') ) {
		proto.constructor = function() {};
	}

	var constructor = proto.hasOwnProperty('constructor') ? proto.constructor : function() { that.apply(this, arguments); };
	var F = function() {};
	F.prototype = this.prototype;

	//constructor.prototype = Object.mixin(new F(), proto);

	var dst = Object.mixin(new F(), proto);
	var what = isInterface ? 'mixin' : 'checkMethods';
	for (var i = 1; i < arguments.length; i++) {
		if ( ! arguments[i] ) {
			continue;
		}
		var src = arguments[i].prototype;
		dst = Object[what](dst, src);
		if ( ! dst ) {
			throw new Error('Method is not implemented');
		}
	}
	constructor.prototype = dst;

	constructor.superclass = this.prototype;
	constructor.prototype.constructor = constructor;
	return constructor;
};

var Interface = Object.extend({
	constructor: function()
	{
		throw new Error('Object can not be instantiated from an interface');
	}
});

var Abstract = Object.extend({
	constructor: function()
	{
		// new Abstract()
		if ( this instanceof Abstract && this.constructor == Abstract ) {
			throw new Error('Object can not be instantiated from an abstract class');
		}

		var abstractMethod = 'Abstract method should be overridden';

		// Abstract.inherit({ method: Abstract })
		if ( this instanceof Abstract ) {
			throw new Error(abstractMethod);
		}
		// Abstract.inherit({ method: Abstract() })
		return function()
		{
			throw new Error(abstractMethod);
		};
	}
});

