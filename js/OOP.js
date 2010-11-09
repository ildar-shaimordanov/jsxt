//
// JScript and JavaScript unit
// This module provides methods for the classical OOP
//
// http://javascript.ru/forum/66098-post2.html


/*

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

var c = new Point(1, 1);
c.draw();

var c = new Circle(0, 0, 1);
c.draw();

var c = new Rectangle(0, 0, 1, 2);
c.draw();

var c = new Square(0, 0, 1);
c.draw();

*/


Object.mixin = function(dst /*, arg1, arg2... */)
{
	for (var i = 1; i < arguments.length; i++) {
		for (var prop in arguments[i]) {
			if ( arguments[i].hasOwnProperty(prop) ) {
				dst[prop] = arguments[i][prop];
			}
		}
	}
	return dst;
}

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

