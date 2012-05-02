//
// JavaScript unit
// Add-on for the Enumerator manipulations
//
// Copyright (c) 2009, 2010, 2012 by Ildar Shaimordanov
//

/**
 * Enumerator.forEach()
 *
 * @description
 * The static method allows to parse the collection of items 
 * using Enumerator to extract each item from collections.
 *
 * the callback is invoked with three arguments: 
 * - the item of the collection
 * - the reference to the collection
 * - the enumerator object
 *
 * The returned value from the callback is not required. 
 * 
 * If a thisp parameter is provided to map, it will be used as the this 
 * for each invocation of the callback. If it is not provided, or is null, 
 * the global object associated with callback is used instead. 
 * 
 * Note: This feature is available from Win32 only.
 *
 * @param	Collection
 * @param	Callback
 * @return	avoid
 * @access	static
 */
Enumerator.forEach = function(collection, fun, thisp)
{
	if ( typeof fun != "function" ) {
		throw new TypeError();
	}

	var fc = new Enumerator(collection);
	for ( ; ! fc.atEnd(); fc.moveNext()) {
		var i = fc.item();
		fun.call(thisp, i, collection, fc);
	}
};


/**
 * Enumerator.map()
 *
 * @description
 * The static method parses the collection and converts it to an array.
 *
 * the callback is invoked with three arguments: 
 * - the item of the collection
 * - the reference to the collection
 * - the enumerator object
 *
 * The callback function should return a value to put it in a new array. 
 * 
 * If a thisp parameter is provided to map, it will be used as the this 
 * for each invocation of the callback. If it is not provided, or is null, 
 * the global object associated with callback is used instead. 
 * 
 * Note: This feature is available from Win32 only.
 *
 * @param	Collection
 * @param	Callback
 * @return	Array
 * @access	static
 */
Enumerator.map = function(collection, fun, thisp)
{
	if ( typeof fun != "function" ) {
		throw new TypeError();
	}

	var result = [];
	var fc = new Enumerator(collection);
	for ( ; ! fc.atEnd(); fc.moveNext()) {
		var i = fc.item();
		var j = fun.call(thisp, i, collection, fc);
		result.push(j);
	}
	return result;
};

