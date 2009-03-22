
if ( ! Array.prototype.binarySearch ) {

/**
 * int Array.prototype.binarySearch(searchItem [ , compare [ , right ]] )
 * Binary search of the 'searchIem' element within an array.
 * Returned value may be one of them:
 * 1. value '-1' means the missing item at the array. In this case the new
 *    property 'Array.prototype.insertIndex' will be created. It returns the
 *    value of an array index for insertion of a new item.
 * 2. value 'null' means undefined value of the 'searchItem' argument
 * 3. index of found item (any value from 0 till Array.length - 1)
 *
 * @param  mixed    searchItem  the item has to been searched
 * @param  function compare     (optional) the criterion of items' sorting
 * @param  boolean  right       (optional) search of item from left (false) or right (true)
 *
 * @result integer
 */
Array.prototype.binarySearch = function(searchItem, compare, right)
{
	if ( searchItem === undefined ) {
		return null;
	}
	if ( ! compare ) {
		compare = function(a, b)
		{
			return (String(a) == String(b)) ? 0 : (String(a) < String(b)) ? -1 : +1;
		}
	}

	var found = false;
	var l = 0;
	var u = this.length - 1;
	var ml, mu;

	while (l <= u) {
		var m = parseInt((l + u) / 2);
		switch ( compare(this[m], searchItem) ) {
		case -1:
			ml = m;
			l = m + 1;
			break;
		case +1:
			mu = m;
			u = m - 1;
			break;
		default:
			found = true;
			if ( right ) {
				l = m + 1;
			} else {
				u = m - 1;
			}
		}
	}

	if ( ! found ) {
		this.insertIndex = (ml + 1) || mu || 0;
//		this.insertIndex = (ml) ? ml + 1 : mu;
		return -1;
	}
		return (right) ? u : l;
}

}

if ( ! Array.prototype.binaryIndexOf ) {

/**
 * int Array.prototype.binaryIndexOf(searchItem [ , compare ] )
 * binary search of elements within an array. Returned value is interpreted as
 * index of the most left 'searchItem' item in the array and may be one of them
 *
 * @param  mixed    searchItem
 * @param  function compare
 *
 * @result integer
 *
 * @see    'Array.protoptype.search'
 */
Array.prototype.binaryIndexOf = function(searchItem, compare)
{
	return this.binarySearch(searchItem, compare, false);
}

}

if ( ! Array.prototype.binaryLastIndexOf ) {

/**
 * int Array.prototype.binaryLastIndexOf(searchItem [ , compare ] )
 * binary search of elements within an array. Returned value is interpreted as
 * index of the most right 'searchItem' item in the array and may be one of them
 *
 * @param  mixed    searchItem
 * @param  function compare
 *
 * @result integer
 *
 * @see    'Array.protoptype.search'
 */
Array.prototype.binaryLastIndexOf = function(searchItem, compare)
{
	return this.binarySearch(searchItem, compare, true);
}

}

if ( ! String.prototype.splitLimit ) {

/**
 * Corrects the result of the standard method like described below:
 *
 * @example
 * <code>
 * var str = "a b c d e f";
 * var arr = str.split(" ", 3);
 *
 * // standard method
 * // required ["a", "b", "c d e f"]
 * // recieved ["a", "b", "c"]
 *
 * // modified method
 * // required ["a", "b", "c d e f"]
 * </code>
 *
 * @param	Mixed
 * @param	Integer
 * @return	Array
 * @access	public
 * @see		http://forum.dklab.ru/viewtopic.php?p=74826
 * 		http://msdn.microsoft.com/library/default.asp?url=/library/en-us/jscript7/html/jsmthsplit.asp
 * 		http://wdh.suncloud.ru/js09.htm#hsplit
 */
String.prototype.splitLimit = function(delim, limit)
{
	if ( ! limit && Number(limit) <= 0 ) {
		return this.split(delim, limit);
	}

	var isRegExp = delim && delim.constructor == RegExp;
	var res;
	var ref;

	if ( isRegExp ) {
		res = delim.source;
		ref = "";
		if ( delim.ignoreCase ) {
			ref += "i";
		}
		if ( delim.multiline ) {
			ref += "m";
		}
//		if (delim.global) {
//			ref += "g";
//		}
	} else {
		res = delim;
		ref = "";
	}

	var x = this.match(new RegExp("^((?:.*?" + res + "){" + (limit - 1) + "})(.*)", ref));
	if ( x ) {
		var result = x[1].__split__(delim, limit);
		var n = result.length;
		if ( ! isRegExp && n ) {
			n--;
		}
		result[n] = x[2];
		return result;
	}
	return this.valueOf();
}

}

