//
// Math.js
// Extension for Math object
//
// Copyright (c) 2009 by Ildar Shaimordanov
//

/**
 * Returns the Golden ratio's value
 *
 * @const	Number
 * @value	(Math.sqrt(5) + 1) / 2
 */
Math.GOLDEN_RATIO = (Math.sqrt(5) + 1) / 2;

/**
 * Returns Pi / 2 value
 *
 * @const	Number
 * @value	Pi / 2
 */
Math.PI_2 = Math.PI / 2;

/**
 * Returns Pi / 3 value
 *
 * @const	Number
 * @value	Pi / 3
 */
Math.PI_3 = Math.PI / 3;

/**
 * Returns Pi / 4 value
 *
 * @const	Number
 * @value	Pi / 4
 */
Math.PI_4 = Math.PI / 4;

/**
 * Returns Pi / 6 value
 *
 * @const	Number
 * @value	Pi / 6
 */
Math.PI_6 = Math.PI / 6;

/**
 * Makes sure that the passed number is within both a minimum value and a maximum value
 *
 * @param	Number
 * @param	Number
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.clamp = function(number, minValue, maxValue) {
	return Math.max(minValue, Math.min(maxValue, number));
};

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
		result += +arguments[i];
	}
	return result;
};

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

