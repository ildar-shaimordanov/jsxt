//
// JavaScript unit
// Add-on for the object manipulation
//
// Copyright (c) 2009 by Ildar Shaimordanov
//

if ( ! Object.prototype.forEach ) {

/**
 * Executes a provided function once per object element.
 *
 * @Description
 * forEach executes the provided function (callback) once for each element 
 * present in the object. 
 * 
 * callback is invoked with three arguments: 
 * - the value of the elemeent, 
 * - the key of the element, 
 * - and the Object being traversed.
 * 
 * If a thisObject parameter is provided to forEach, it will be used as the 
 * this for each invocation of the callback. If it is not provided, or is 
 * null, the global object associated with callback is used instead. 
 * 
 * forEach does not mutate the object on which it is called. 
 *
 * This method is the same as forEach for Array but for Object. 
 * 
 * @param	Callback
 * @param	Boolean	Boolean value that indicates whether methods should be skipped when passing.
 * @return	void
 * @access	public
 * @see		http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:forEach
 */
Object.prototype.forEach = function(fun, skipFunction, thisp)
{
	if ( typeof fun != "function" ) {
		throw new TypeError();
	}

	for (var p in this) {
		if ( skipFunction && typeof this[p] == 'function' ) {
			continue;
		}
		fun.call(thisp, this[p], p, this);
	}
};

}

if ( ! Object.prototype.keys ) {

/**
 * Populates and returns array of the object's keys
 *
 * @param	Boolean	Boolean value that indicates whether methods should be skipped when populate.
 * @return	Array
 * @access	public
 */
Object.prototype.keys = function(skipFunction)
{
	var result = [];

	for (var p in this) {
		if ( skipFunction && typeof this[p] == 'function' ) {
			continue;
		}
		result.push(p);
	}

	return result;
};

}

if ( ! Object.prototype.values ) {

/**
 * Populates and returns array of the object's values
 *
 * @param	Boolean	Boolean value that indicates whether methods should be skipped when populate.
 * @return	Array
 * @access	public
 */
Object.prototype.values = function(skipFunction)
{
	var result = [];

	for (var p in this) {
		if ( skipFunction && typeof this[p] == 'function' ) {
			continue;
		}
		result.push(this[p]);
	}

	return result;
};

}

if ( ! Object.prototype.toArray ) {

/**
 * Converts an object to an array.
 *
 * @Description
 * toArray executes the provided function (callback) once for each element 
 * present in the object. callback is invoked for each element of the array 
 * and return new item to be inserted into the array. 
 * 
 * callback is invoked with three arguments: 
 * - the value of the element, 
 * - the key of the element, 
 * - and the Object object being traversed.
 * 
 * If a thisObject parameter is provided to toArray, it will be used as the 
 * this for each invocation of the callback. If it is not provided, or is 
 * null, the global object associated with callback is used instead. 
 * 
 * If a thisObject parameter is provided to toArray, it will be used as the 
 * this for each invocation of the callback. If it is not provided, or is 
 * null, the global object associated with callback is used instead. 
 * 
 * forEach does not mutate the object on which it is called. 
 *
 * This method is the same as forEach for Array. 
 * 
 * @param	Callback
 * @param	Boolean	Boolean value that indicates whether methods should be skipped when passing.
 * @return	void
 * @access	public
 */
Object.prototype.toArray = function(fun, skipFunction, thisp)
{
	if ( typeof fun != "function" ) {
		throw new TypeError();
	}

	var result = [];

	for (var p in this) {
		if ( skipFunction && typeof this[p] == 'function' ) {
			continue;
		}
		result.push(fun.call(thisp, this[p], p, this));
	}

	return result;
};

}

