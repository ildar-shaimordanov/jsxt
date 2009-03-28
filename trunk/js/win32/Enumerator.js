//
// JavaScript unit
// Add-on for the Enumerator manipulations
//
// Copyright (c) 2009 by Ildar Shaimordanov
//

if ( ! Array.enumerate ) {

/**
 * Array.enumerate()
 *
 * @description
 * The static method allows to get an array from the collection 
 * using Enumerator to extract each item from collections.
 *
 * The callback is invoked with two arguments: 
 * - the item of the collection, 
 * - the reference to the collection.
 * 
 * If a thisObject parameter is provided to map, it will be used as the this 
 * for each invocation of the callback. If it is not provided, or is null, 
 * the global object associated with callback is used instead. 
 * 
 * Note: This feature is available from Win32 only.
 *
 * @param	Object
 * @param	Callback
 * @return	Array
 * @access	static
 */
Array.enumerate = function(collection, fun, thisp)
{
	if ( typeof fun != "function" ) {
		throw new TypeError();
	}

	var result = [];

	var fc = new Enumerator(collection);
	for ( ; ! fc.atEnd(); fc.moveNext()) {
		var i = fc.item();
		result.push(fun.call(thisp, i, collection));
	}

	return result;
};

}

if ( ! Object.enumerate ) {

/**
 * Object.enumerate()
 *
 * @description
 * The static method allows to get an object from the collection 
 * using Enumerator to extract each item from collections.
 *
 * the callback is invoked with two arguments: 
 * - the item of the collection, 
 * - the reference to the collection.
 *
 * The callback should return as the result the object with two items
 * 'key' with key and 'value' with value. 
 * 
 * If a thisObject parameter is provided to map, it will be used as the this 
 * for each invocation of the callback. If it is not provided, or is null, 
 * the global object associated with callback is used instead. 
 * 
 * Note: This feature is available from Win32 only.
 *
 * @param	Object
 * @param	Callback
 * @return	Array
 * @access	static
 */
Object.enumerate = function(collection, fun, thisp)
{
	if ( typeof fun != "function" ) {
		throw new TypeError();
	}

	var result = {};

	var fc = new Enumerator(collection);
	for ( ; ! fc.atEnd(); fc.moveNext()) {
		var i = fc.item();
		var r = fun.call(thisp, i, collection);
		result[r.key] = r.value;
	}

	return result;
}

}

