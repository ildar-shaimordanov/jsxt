//
// Math.js
// Extension for Math object
//
// Copyright (c) 2009, 2011 by Ildar Shaimordanov
//
// @see	http://wiki.ecmascript.org/doku.php?id=harmony:more_math_functions
//

if ( ! Math.cbrt ) {

/**
 * Returns the cubic root of a number.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.cbrt = function(x)
{
//	return Math.sign(x) * Math.pow(Math.abs(x), 1 / 3);
	var r = x && Math.pow(Math.abs(x), 1 / 3);
	return x < 0 ? -r : r;
};

}

if ( ! Math.clz32 ) {

/**
 * The Math.clz32() function returns the number of leading zero bits in
 * the 32-bit binary representation of a number.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.clz32 = function(x) {
	var n = x >>> 0;
	return n ? 31 - Math.floor(Math.log(n + 0.5) * Math.LOG2E) : 32;
};

}

if ( ! Math.log10 ) {

/**
 * Returns an implementation-dependent approximation 
 * to the base 10 logarithm of x.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.log10 = function(x)
{
	return Math.log(x) / Math.LN10;
};

}

if ( ! Math.log2 ) {

/**
 * Returns an implementation-dependent approximation 
 * to the base 2 logarithm of x.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.log2 = function(x)
{
	return Math.log(x) / Math.LN2;
};

}

if ( ! Math.log1p ) {

/**
 * Returns an implementation-dependent approximation 
 * to the natural logarithm of 1 + x. The result is computed 
 * in a way that is accurate even when the value of x is close to zero.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.log1p = function(x)
{
	return Math.log(1 + x);
};

}

if ( ! Math.expm1 ) {

/**
 * Returns an implementation-dependent approximation 
 * to subtracting 1 from the exponential function of x (e raised 
 * to the power of x, where e is the base of the natural logarithms). 
 * The result is computed in a way that is accurate even when 
 * the value of x is close 0.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.expm1 = function(x)
{
	return Math.exp(x) - 1;
};

}

if ( ! Math.cosh ) {

/**
 * Returns an implementation-dependent approximation 
 * to the hyperbolic cosine of x.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.cosh = function(x)
{
	var e = Math.exp(x);
	var f = 1 / e;
	return (e + f) / 2;
};

}

if ( ! Math.sinh ) {

/**
 * Returns an implementation-dependent approximation 
 * to the hyperbolic sine of x.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.sinh = function(x)
{
	var e = Math.exp(x);
	var f = 1 / e;
	return (e - f) / 2;
};

}

if ( ! Math.tanh ) {

/**
 * Returns an implementation-dependent approximation 
 * to the hyperbolic tangent of x.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.tanh = function(x)
{
	var e = Math.exp(x);
	var f = 1 / e;
	return (e - f) / (e + f);
};

}

if ( ! Math.acosh ) {

/**
 * Returns an implementation-dependent approximation 
 * to the inverse hyperbolic cosine of x.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.acosh = function(x)
{
	return Math.log(x + Math.sqrt(x * x - 1));
};

}

if ( ! Math.asinh ) {

/**
 * Returns an implementation-dependent approximation 
 * to the inverse hyperbolic sine of x.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.asinh = function(x)
{
	return Math.log(x + Math.sqrt(x * x + 1));
};

}

if ( ! Math.atanh ) {

/**
 * Returns an implementation-dependent approximation 
 * to the inverse hyperbolic tangent of x.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.atanh = function(x)
{
	return Math.log((1 + x) / (1 - x)) / 2;
};

}

if ( ! Math.hypot ) {

/**
 * Returns an implementation-dependent approximation 
 * to the hypotenuse of a right triangle with sides of length x and y.
 *
 * @param	Number
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.hypot = function(x, y)
{
//	return Math.sqrt(x * x + y * y);
	var args = arguments;
	var result = 0;
	for (var i = 0; i < args.length; i++) {
		var v = args[i];
		result += v * v;
	}
	return Math.sqrt(result);
};

}

if ( ! Math.trunc ) {

/**
 * Returns the integral part of the number x, removing 
 * any fractional digits. If x is already an integer, the result is x.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.trunc = function(x)
{
	return parseInt(x);
};

}

if ( ! Math.sign ) {

/**
 * Returns the sign of the x, indicating 
 * whether x is positive, negative or zero.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.sign = function(x)
{
	return x === 0 ? 0 : x > 0 ? +1 : -1;
};

}