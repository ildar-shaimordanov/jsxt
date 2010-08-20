
/**
 *
 * The implementations of the Levenshtein algorithm.. 
 * This is implementation migrated from the modified Perl's one (see the wikibooks link)
 *
 * @usage
 * <code>
 * var s = 'google';
 * var t = 'googol';
 *
 * var result = s.levenshtein(t);
 * </code>
 *
 * @see	http://en.wikipedia.org/wiki/Levenshtein_distance
 * @see	http://ru.wikibooks.org/wiki/%D0%A0%D0%B0%D1%81%D1%81%D1%82%D0%BE%D1%8F%D0%BD%D0%B8%D0%B5_%D0%9B%D0%B5%D0%B2%D0%B5%D0%BD%D1%88%D1%82%D0%B5%D0%B9%D0%BD%D0%B0
 */
String.prototype.levenshtein = function()
{
	var s = this;
	var t = String(arguments[0] || '');

	var cuthalf = Number(arguments.callee.maxComparedLength) || t.length;

	s = s.substr(0, cuthalf);
	t = t.substr(0, cuthalf);

	var m = s.length;
	var n = t.length;

	if ( m == 0 ) {
		return n;
	}

	if ( n == 0 ) {
		return m;
	}

	var buf = new Array(cuthalf * 2 - 1);

	for (var i = 0; i <= n; i++) {
		buf[i] = i;
	}

	var curr;
	var next;

	for (var i = 0; i < m; i++) {
		curr = i + 1;
		for (var j = 0; j < n; j++) {
			var cost = s.charAt(i) == t.charAt(j) ? 0 : 1;
			next = Math.min(
				buf[j + 1] + 1, 
				curr + 1, 
				buf[j] + cost);
			buf[j] = curr;
			curr = next;
		}
		buf[n] = next;
	}

	return next;
};

String.prototype.levenshtein.maxComparedLength = 150;

/**
 * Soundex algorithm implementation
 *
 * @see	http://en.wikipedia.org/wiki/Soundex
 */
String.prototype.soundex = function()
{
	return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase()
		.replace(/\w/g, function($0)
		{
			return String.prototype.soundex.table[$0];
		})
		.replace(/(.)\1+/g, '$1')
		.slice(0, 3)
		;
};

String.prototype.soundex.init = function(table)
{
	String.prototype.soundex.table = {};

	table = table || {
		'bfpv': '1', 
		'cgjkqsxz': '2', 
		'dt': '3', 
		'l': '4', 
		'mn': '5', 
		'r': '6', 
		'aehiouwy': ''
	};

	for (var p in table) {
		if ( ! table.hasOwnProperty(p) ) {
			continue;
		}

		for (var i = 0; i < p.length; i++) {
			var c = p.charAt(i);
			String.prototype.soundex.table[c] = table[p];
		}
	}
};

String.prototype.soundex.init();

/**
 * Metaphone algorithm implementation
 *
 * @see	http://www.sound-ex.com/alternative_zu_soundex
 * @see	http://web.archive.org/web/20071107145942/http://kankowski.narod.ru/dev/metaphoneru.htm
 */
String.prototype.metaphone = function()
{
	throw ReferenceError();
};

