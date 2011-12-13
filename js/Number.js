//
// Number.js
// Extension for Number object
//
// Copyright (c) 2011 by Ildar Shaimordanov
//
// @see	http://wiki.ecmascript.org/doku.php?id=harmony:more_math_functions
//

if ( ! Number.isNaN ) {

/**
 * Returns true if the argument is a Number value equal to NaN, 
 * and otherwise returns false.
 *
 * @param	Number
 * @return	Bollean
 * @access	static
 */
Number.isNaN = function(x)
{
	return isNaN(x);
};

}

if ( ! Number.isFinite ) {

/**
 * Returns false if the argument is a Number value equal 
 * to NaN, +INF, or -INF, and otherwise returns true.
 *
 * @param	Number
 * @return	Bollean
 * @access	static
 */
Number.isFinite = function(x)
{
	return isFinite(x);
};

}

if ( ! Number.isInteger ) {

/**
 * Returns true if the argument is a Number value 
 * which is an integral value.
 * This implementation is not compatible with 
 * the implementation described by the link below.
 *
 * @param	Number
 * @return	Bollean
 * @access	static
 * @see	http://wiki.ecmascript.org/doku.php?id=harmony:number.isinteger
 */
Number.isInteger = function(x)
{
	if ( Object.prototype.toString.call(x) != '[object Number]' ) {
		return false;
	}
	var y = Number.toInteger(x);
	return x == y;
};

}

if ( ! Number.toInteger ) {

/**
 * Returns true if the argument is a Number value 
 * which is an integral value.
 *
 * @param	Number
 * @return	Bollean
 * @access	static
 */
Number.toInteger = function(x)
{
	return parseInt(x);
};

}
