if ( ! isa ) {

/**
 * Evaluates the value is defined and has constructor
 *
 * @param	mixed	value
 * @param	mixed	constructor
 * @return	boolean
 * @access	public
 */
function isa(value, constructor)
{
	return value !== undefined && value !== null && value.constructor == constructor;
};

}

if ( ! isArray ) {

/**
 * Evaluates the value as Array
 *
 * @param	mixed	value
 * @return	boolean
 * @access	public
 */
function isArray(value)
{
	return isa(value, Array);
//	return value !== undefined && value !== null && value.constructor == Array;
};

}

if ( ! isBoolean ) {

/**
 * Evaluates the value as Boolean
 *
 * @param	mixed	value
 * @return	boolean
 * @access	public
 */
function isBoolean(value)
{
	return isa(value, Boolean);
//	return value !== undefined && value !== null && value.constructor == Boolean;
};

}

if ( ! isEmpty ) {

/**
 * Evaluates the value as Empty
 * The empty value is as follow:
 * - Undefined
 * - Null
 * - Boolean == false
 * - String == ''
 * - Number == +0, -0 or NaN
 *
 * @param	mixed	value
 * @return	boolean
 * @access	public
 */
function isEmpty(value)
{
	return ! Boolean(value);
};

}

if ( ! isFunction ) {

/**
 * Evaluates the value as Function
 *
 * @param	mixed	value
 * @return	boolean
 * @access	public
 */
function isFunction(value)
{
	return isa(value, Function);
//	return value !== undefined && value !== null && value.constructor == Function;
};

}

if ( ! isIndefinite ) {

/**
 * Evaluates the value as Undefined or Null
 *
 * @param	mixed	value
 * @return	boolean
 * @access	public
 */
function isIndefinite(value)
{
	return value === undefined || value === null;
};

}

if ( ! isNull ) {

/**
 * Evaluates the value as Null
 *
 * @param	mixed	value
 * @return	boolean
 * @access	public
 */
function isNull(value)
{
	return value === null;
};

}

if ( ! isNumber ) {

/**
 * Evaluates the value as Number
 *
 * @param	mixed	value
 * @return	boolean
 * @access	public
 */
function isNumber(value)
{
	return isa(value, Number);
//	return value !== undefined && value !== null && value.constructor == Number;
};

}

if ( ! isObject ) {

/**
 * Evaluates the value as Object
 *
 * @param	mixed	value
 * @return	boolean
 * @access	public
 */
function isObject(value)
{
	return isa(value, Object);
//	return value !== undefined && value !== null && value.constructor == Object;
};

}

if ( ! isRegExp ) {

/**
 * Evaluates the value as RegExp
 *
 * @param	mixed	value
 * @return	boolean
 * @access	public
 */
function isRegExp(value)
{
	return isa(value, RegExp);
//	return value !== undefined && value !== null && value.constructor == RegExp;
};

}

if ( ! isString ) {

/**
 * Evaluates the value as String
 *
 * @param	mixed	value
 * @return	boolean
 * @access	public
 */
function isString(value)
{
	return isa(value, String);
//	return value !== undefined && value !== null && value.constructor == String;
};

}

if ( ! isUndefined ) {

/**
 * Evaluates the value as Undefined
 *
 * @param	mixed	value
 * @return	boolean
 * @access	public
 */
function isUndefined(value)
{
	return value === undefined;
};

}

