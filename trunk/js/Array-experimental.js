/**
 * int Array.prototype.search(searchItem [ , compare [ , right ]] )
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
Array.prototype.search = function(searchItem, compare, right)
{
    if (searchItem === undefined) return null;
    if (!compare) {
        compare = function(a, b)
        {
            return (String(a) == String(b)) ? 0 : (String(a) < String(b)) ? -1 : +1;
        }
    }
    var found = false, l = 0, u = this.length - 1;
    while (l <= u) {
        var m = parseInt((l + u) / 2);
        switch (compare(this[m], searchItem)) {
        case -1:
            var ml = m;
            l = m + 1;
            break;
        case +1:
            var mu = m;
            u = m - 1;
            break;
        default:
            found = true;
            if (right) {
                l = m + 1;
            } else {
                u = m - 1;
            }
        }
    }
    if (!found) {
        this.insertIndex = (ml + 1) || mu || 0;
//        this.insertIndex = (ml) ? ml + 1 : mu;
        return -1;
    }
    return (right) ? u : l;
}

/**
 * int Array.prototype.indexOf(searchItem [ , compare ] )
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
Array.prototype.indexOf = function(searchItem, compare)
{
    return this.search(searchItem, compare, false);
}

/**
 * int Array.prototype.lastIndexOf(searchItem [ , compare ] )
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
Array.prototype.lastIndexOf = function(searchItem, compare)
{
    return this.search(searchItem, compare, true);
}

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
 */
String.prototype.__split__ = String.prototype.split;

String.prototype.split = function(delim, limit)
{
	if ( limit && limit > 0 ) {
		var isRegExp = delim && delim.constructor == RegExp;
		if ( isRegExp ) {
			var res = delim.source;
			var ref = "";
			if ( delim.ignoreCase ) {
				ref += "i";
			}
			if ( delim.multiline ) {
				ref += "m";
			}
//			if (delim.global) {
//				ref += "g";
//			}
		} else {
			var res = delim;
			var ref = "";
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
	return this.__split__(delim, limit);
}

