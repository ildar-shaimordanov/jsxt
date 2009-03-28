/**
 * String.prototype.split(delim, limit)
 *
 * @description
 * Returns the array of strings that results when a string is separated into substrings.
 * The result of the split method is an array of strings split at each point where 
 * separator occurs in the string. The separator is not returned as part of any array element.
 *
 * @note
 * This method is overrides the native Array.prototype.split method because of 
 * the optional 'limit' argument does not correctly splits a string to the array items. 
 * The original method is stored as Array.prototype.__split__
 *
 * The follow example does not work corredctly with the native Array.prototype.split:
 * <code>
 * var str = "a b c d e f";
 * var arr = str.split(" ", 3);
 * 
 * // expected and returned with overriden method ["a", "b", "c d e f"]
 * // really returned with the native method ["a", "b", "c"]
 * </code>

 * @param  mixed    delim    A string or an instance of a Regular Expression object identifying 
 *                           one or more characters to use in separating the string. If omitted, 
 *                           a single-element array containing the entire string is returned. 
 * @param  integer  limit    Optional. A value used to limit the number of elements returned in the array.
 *
 * @result Array
 * @see    http://forum.dklab.ru/viewtopic.php?p=74826
 *         http://msdn.microsoft.com/library/default.asp?url=/library/en-us/jscript7/html/jsmthsplit.asp
 *         http://wdh.suncloud.ru/js09.htm#hsplit
 */
String.prototype.__split__ = String.prototype.split;
String.prototype.split = function(delim, limit)
{
    if (limit && limit > 0) {
        var isRegExp = delim && delim.constructor == RegExp;
        if (isRegExp) {
            var res = delim.source;
            var ref = "";
            if (delim.ignoreCase) ref += "i";
            if (delim.multiline) ref += "m";
//            if (delim.global) ref += "g";
        } else {
            var res = delim;
            var ref = "";
        }
        var x = this.match(new RegExp("^((?:.*?" + res + "){" + (limit - 1) + "})(.*)", ref));
        if (x) {
            var result = x[1].__split__(delim, limit);
            var n = result.length;
            if (!isRegExp && n) n--;
            result[n] = x[2];
            return result;
        }
        return this.valueOf();
    }
    return this.__split__(delim, limit);
};

if ( ! String.prototype.parseUrl ) {

/**
 * Considers the string object as URL and returns it's parts separately
 *
 * @param	void
 * @return	Object
 * @access	public
 */
String.prototype.parseUrl = function()
{
	var matches = this.match(arguments.callee.re);

	if ( ! matches ) {
		return null;
	}

	var result = {
		'scheme': matches[1] || '',
		'subscheme': matches[2] || '',
		'user': matches[3] || '',
		'pass': matches[4] || '',
		'host': matches[5],
		'port': matches[6] || '',
		'path': matches[7] || '',
		'query': matches[8] || '',
		'fragment': matches[9] || ''};

	return result;
};

String.prototype.parseUrl.re = /^(?:([a-z]+):(?:([a-z]*):)?\/\/)?(?:([^:@]*)(?::([^:@]*))?@)?((?:[a-z0-9_-]+\.)+[a-z]{2,}|localhost|(?:(?:[01]?\d\d?|2[0-4]\d|25[0-5])\.){3}(?:(?:[01]?\d\d?|2[0-4]\d|25[0-5])))(?::(\d+))?(?:([^:\?\#]+))?(?:\?([^\#]+))?(?:\#([^\s]+))?$/i;

}

String.prototype.camelize = function()
{
	return this
		.replace(/^[^-]+/, function($0)
		{
			return $0.toLowerCase();
		})
		.replace(/-(.)([^-]+)/g, function($0, $1, $2)
		{
			return $1.toUpperCase() + $2.toLowerCase();
		});
}

String.prototype.uncamelize = function()
{
	return this
		.replace(/[A-Z]/g, function($0)
		{
			return '-' + $0.toLowerCase();
		});
}

