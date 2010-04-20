//
// JavaScript unit
// Add-on for the Enumerator manipulations
//
// Copyright (c) 2009 by Ildar Shaimordanov
//

var Enumerate = {};

/**
 * Enumerate.toArray()
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
Enumerate.toArray = function(collection, fun, thisp)
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

/**
 * Enumerate.toObject()
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
Enumerate.toObject = function(collection, fun, thisp)
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
};

/**
 * Enumerate.forItems()
 *
 * @description
 * The static method allows to parse the collection of items 
 * using Enumerator to extract each item from collections.
 *
 * the callback is invoked with two arguments: 
 * - the item of the collection, 
 * - the reference to the collection.
 *
 * The returned value from the callback is not required. 
 * 
 * If a thisObject parameter is provided to map, it will be used as the this 
 * for each invocation of the callback. If it is not provided, or is null, 
 * the global object associated with callback is used instead. 
 * 
 * Note: This feature is available from Win32 only.
 *
 * @param	Object
 * @param	Callback
 * @return	avoid
 * @access	static
 */
Enumerate.forItems = function(collection, fun, thisp)
{
	if ( typeof fun != "function" ) {
		throw new TypeError();
	}

	var fc = new Enumerator(collection);
	for ( ; ! fc.atEnd(); fc.moveNext()) {
		var i = fc.item();
		fun.call(thisp, i, collection);
	}
};

