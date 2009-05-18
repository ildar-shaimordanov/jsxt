//
// Math.js
// Extension for Math object
//
// Copyright (c) 2009 by Ildar Shaimordanov
//

if ( ! Math.PI_2 ) {

/**
 * Returns Pi / 2 value
 *
 * @const	Number
 * @value	Pi / 2
 */
Math.PI_2 = Math.PI / 2;

}

if ( ! Math.PI_3 ) {

/**
 * Returns Pi / 3 value
 *
 * @const	Number
 * @value	Pi / 3
 */
Math.PI_3 = Math.PI / 3;

}

if ( ! Math.PI_4 ) {

/**
 * Returns Pi / 4 value
 *
 * @const	Number
 * @value	Pi / 4
 */
Math.PI_4 = Math.PI / 4;

}

if ( ! Math.PI_6 ) {

/**
 * Returns Pi / 6 value
 *
 * @const	Number
 * @value	Pi / 6
 */
Math.PI_6 = Math.PI / 6;

}

if ( ! Math.sign ) {

/**
 * Returns the sign value of a number.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.sign = function(number)
{
	var s = Number(number);
	return s == 0 ? 0 : s > 0 ? +1 : -1;
};

}

if ( ! Math.square ) {

/**
 * Returns the square of a number.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.square = function(number)
{
	return number * number;
};

}

if ( ! Math.cube ) {

/**
 * Returns the cube of a number.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.cube = function(number)
{
	return number * number * number;
};

}

if ( ! Math.cubt ) {

/**
 * Returns the cubic root of a number.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.cubt = function(number)
{
	return Math.sign(number) * Math.pow(Math.abs(number), 1 / 3);
};

}

if ( ! Math.log10 ) {

/**
 * Returns the decimal logarithm of a number.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.log10 = 
Math.lg = function(number)
{
	return Math.log(number) / Math.LN10;
};

}

if ( ! Math.cotan ) {

/**
 * Returns the cotangent of a number.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.cotan = function(number)
{
	return 1 / Math.tan(number);
};

}

if ( ! Math.sec ) {

/**
 * Returns the secans of a number.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.sec = function(number)
{
	return 1 / Math.cos(number);
};

}

if ( ! Math.cosec ) {

/**
 * Returns the cosecans of a number.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.cosec = function(number)
{
	return 1 / Math.sin(number);
};

}

if ( ! Math.acotan ) {

/**
 * Returns the arccotangent of a number.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.acotan = function(number)
{
	return Math.atan(number) + Math.PI_2;
};

}

if ( ! Math.asec ) {

/**
 * Returns the arcsecans of a number.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.asec = function(number)
{
	return Math.atan(number / Math.sqrt(number * number - 1)) + Math.sign(number - 1) * Math.PI_2;
};

}

if ( ! Math.acosec ) {

/**
 * Returns the arccosecans of a number.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.acosec = function(number)
{
	return Math.atan(number / Math.sqrt(number * number - 1)) + (Math.sign(number) - 1) * Math.PI_2;
};

}

if ( ! Math.hsin ) {

/**
 * Returns the hyperbolic sine of a number.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.hsin = function(number)
{
	var e = Math.exp(number);
	var f = 1 / e;
	return (e - f) / 2;
};

}

if ( ! Math.hcos ) {

/**
 * Returns the hyperbolic cosine of a number.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.hcos = function(number)
{
	var e = Math.exp(number);
	var f = 1 / e;
	return (e + f) / 2;
};

}

if ( ! Math.htan ) {

/**
 * Returns the hyperbolic tangent of a number.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.htan = function(number)
{
	var e = Math.exp(number);
	var f = 1 / e;
	return (e - f) / (e + f);
};

}

if ( ! Math.hcotan ) {

/**
 * Returns the hyperbolic cotangent of a number.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.hcotan = function(number)
{
	var e = Math.exp(number);
	var f = 1 / e;
	return (e + f) / (e - f);
};

}

if ( ! Math.hsec ) {

/**
 * Returns the hyperbolic secans of a number.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.hsec = function(number)
{
	var e = Math.exp(number);
	var f = 1 / e;
	return 2 / (e + f);
};

}

if ( ! Math.hcosec ) {

/**
 * Returns the hyperbolic cosecans of a number.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.hcosec = function(number)
{
	var e = Math.exp(number);
	var f = 1 / e;
	return 2 / (e - f);
};

}

if ( ! Math.hasin ) {

/**
 * Returns the hyperbolic arcsine of a number.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.hasin = function(number)
{
	return Math.log(number + Math.sqrt(number * number + 1));
};

}

if ( ! Math.hacos ) {

/**
 * Returns the hyperbolic arccosine of a number.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.hacos = function(number)
{
	return Math.log(number + Math.sqrt(number * number - 1));
};

}

if ( ! Math.hatan ) {

/**
 * Returns the hyperbolic arctangent of a number.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.hatan = function(number)
{
	return Math.log((1 + number) / (1 - number)) / 2;
};

}

if ( ! Math.hacotan ) {

/**
 * Returns the hyperbolic arccotangent of a number.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.hacotan = function(number)
{
	return Math.log((number + 1) / (number - 1)) / 2;
};

}

if ( ! Math.hasec ) {

/**
 * Returns the hyperbolic arcsecans of a number.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.hasec = function(number)
{
	return Math.log((Math.sqrt(-number * number + 1) + 1) / number);
};

}

if ( ! Math.hacosec ) {

/**
 * Returns the hyperbolic arccosecans of a number.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.hacosec = function(number)
{
	return Math.log((Sgn(number) * Math.sqrt(number * number + 1) + 1) / number);
};

}

if ( ! Math.sum ) {

/**
 * Returns the summa of supplied numeric expressions.
 *
 * @param	multiple
 * @return	Number
 * @access	static
 */
Math.sum = function()
{
	var result = 0;
	for (var i = 0; i < arguments.length; i++) {
		result += arguments[i];
	}
	return result;
};

}

if ( ! Math.avg ) {

/**
 * Returns the average value of supplied numeric expressions.
 *
 * @param	multiple
 * @return	Number
 * @access	static
 */
Math.avg = function()
{
	return Math.sum.apply(null, arguments) / arguments.length;
};

}

if ( ! Math.prd ) {

/**
 * Returns the product of supplied numeric expressions.
 *
 * @param	multiple
 * @return	Number
 * @access	static
 */
Math.prd = function()
{
	var result = 1;
	for (var i = 0; i < arguments.length; i++) {
		result *= arguments[i];
	}
	return result;
};

}

if ( ! Math.dsp ) {

/**
 * Returns the dispersion of supplied numeric expressions.
 *
 * @param	multiple
 * @return	Number
 * @access	static
 */
Math.dsp = function()
{
	var avg = Math.avg.apply(null, arguments);

	var result = 0;
	for (var i = 0; i < arguments.length; i++) {
		result += Math.square(arguments[i] - avg);
	}

	return Math.sqrt(result / arguments.length);
};

}

