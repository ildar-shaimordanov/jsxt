//
// http://slovari.yabndex.ru
// Command line version
//
// Copyright (c) 2010, Ildar Shaimordanov
//

///////////////////////////////////////////////////////////////////////////

//[requires[ js/Ajax.js ]]

///////////////////////////////////////////////////////////////////////////

var YaShell = {
	// Looking for text within these tags
	re_slovari: /(?:[\r\n]|.)*?<div class="b-holster.*">((?:[\r\n]|.)*)<\/div>\s*<.+?class="b-foot"(?:[\r\n]|.)*?/m, 

	// Use mobile version of Ynadex.Slovari
	url: 'http://m.slovari.yandex.ru/search.xml', 

	// Yandex Shell
	name: 'Yandex Shell/', 
	version: '0.1 beta'
};

YaShell.parse = function(xml)
{
	var m = xml.match(this.re_slovari);
	if ( ! m ) {
		return '';
	}

	return m[1]
		// Removes all unused tags and their contents
		.replace(/<(form|select|script)(?:[\r\n]|.)+?\/\1>/img, '')
		.replace(/<div class="b-tabs-line">.*?<\/div>/img, '')

		// Converts block tags to line breaks
		.replace(/<(div|h[\d])[^>]*>(.*?)<\/\1>/img, '$2\n')
		.replace(/<p[^>]*>(.*?)<\/p>/img, '$1\n')

		// Replaces tagged line breaks to text-oriented line breaks
		.replace(/<br[^>]*>/ig, '\n')

		// Removes the rest of tags
		.replace(/<[^<>]+>/g, '')

		// Leaves the most important entities
		.replace(/&nbsp;/ig, ' ')
		.replace(/&lt;/ig, '<')
		.replace(/&gt;/ig, '>')

		// Removes all unprintable entities
		.replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/ig, '')
		.replace(/\u2022/g, '')

		// removes all heading and trailing white spaces
		.replace(/(^\s+)|(\s+$)/, '')
		;
};

YaShell.get = function(word, lang)
{
	if ( ! word ) {
		return '';
	}

	var queryString = 'text=' + encodeURIComponent(word);

	if ( lang === undefined ) {
		queryString += '&where=2';
	} else {
		queryString += '&where=3&lang=' + (lang || 'en-ru-en');
	}

	return Ajax.query(this.url + '?' + queryString, {
		async: false,
		headers: {
			'User-Agent': this.name + ', ' + this.version + '; (compatible; Windows Script Host, Version ' + WScript.Version + ')'
		},
		onreadystate: function(xmlhttp)
		{
			if ( xmlhttp.readyState != 4 ) {
				return;
			}
			return xmlhttp.responseText;
		}
	});
};

YaShell.glossary = function(word, lang)
{
	return this.parse(this.get(word, lang));
};

///////////////////////////////////////////////////////////////////////////

var word = (function()
{
	var e;
	try {
		return WScript.Arguments.Unnamed.item(0);
	} catch (e) {
		return '';
	}
})();

var lang = (function()
{
	var e;
	try {
		return WScript.Arguments.Named.item('LANG');
	} catch (e) {
		return '';
	}
})();

var text = YaShell.glossary(word, lang);

WScript.Echo(text);

