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

