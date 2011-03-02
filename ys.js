//
// http://slovari.yandex.ru
// Command line version
//
// Copyright (c) 2010, 2011, Ildar Shaimordanov
//

/*!
*/

///////////////////////////////////////////////////////////////////////////

//[requires[ js/Ajax.js ]]

///////////////////////////////////////////////////////////////////////////

var YandexSlovary = {
	// Yandex Slovary Shell
	name: 'Yandex.Slovari Shell', 
	version: '0.1.6 Beta', 
	userAgent: function()
	{
		return this.name + '/' + this.version + '; (compatible; Windows Script Host, Version ' + WScript.Version + ')';
	}, 


	// Looking for text within these tags
	re_content: /<div class="b-holster.*?">((?:[\r\n]|.)*)<\/div>\s*<div class="b-foot">/m, 

	re_notags: [
		/<(form|select|script)(?:[\r\n]|.)+?\/\1>/img, 
		/<div class="b-tabs-line">.*?<\/div>/img
	], 

	re_noents: [
		/&(#\d+|#x[0-9a-f]+|[a-z]+);/ig, 
		/\u2022/g, 
	], 

	// Use mobile version of Ynadex.Slovari
	url: 'http://m.slovari.yandex.ru/search.xml'
};

YandexSlovary.help = function()
{
	var msg = this.name + '/' + this.version + '\n'
		+ 'Copyright (C) 2010, 2011, Ildar Shaimordanov\n' 
		+ '\n' 
		+ 'Usage: ' + WScript.ScriptName + ' "PHRASE" [ /LANG:lang-abbr-list ]' 
		;
	this.alert(msg);
};

YandexSlovary.alert = function()
{
	if ( arguments.length == 0 ) {
		return;
	}

	WScript.Echo([].slice.call(arguments));
};

YandexSlovary.quit = function(exitCode)
{
	WScript.Quit(exitCode);
};

YandexSlovary.parse = function(xml)
{
	var m = xml.match(this.re_content);
	if ( ! m ) {
		return '';
	}

	var result = m[0];

	// Removes all unused tags and their contents
	for (var i = 0; i < this.re_notags.length; i++) {
		result = result.replace(this.re_notags[i], '');
	}

	// Removes all unprintable entities
	for (var i = 0; i < this.re_noents.length; i++) {
		result = result.replace(this.re_noents[i], '');
	}

	return result
		// Converts block tags to line breaks
		.replace(/<(div|h[\d])[^>]*>(.*?)<\/\1>/img, '\n$2\n')
		.replace(/<p[^>]*>(.*?)<\/p>/img, '$1\n')

		// Replaces tagged line breaks to text-oriented line breaks
		.replace(/<br[^>]*>/ig, '\n')

		// Replaces <img alt="..."> with the text from the alt attribute
//		.replace(/<img.+?alt="([^"]+)"[^>]*>/g, '$1')

		// Removes the rest of tags
		.replace(/<[^<>]+>/g, '')

		// Leaves the most important entities
		.replace(/&nbsp;/ig, ' ')
		.replace(/&lt;/ig, '<')
		.replace(/&gt;/ig, '>')

		// removes all heading and trailing white spaces
		.replace(/^\s+|\s+$/g, '')
		;
};

YandexSlovary.query = function(url)
{
	return Ajax.queryFile(url, {
		headers: {
			'User-Agent': this.userAgent()
		}
	});
/*
	var IDs = [
		'Msxml2.XMLHTTP', 
		'Microsoft.XMLHTTP'];

	var xmlhttp;

	for (var i = 0; i < IDs.length; i++) {
		var e;
		try {
			xmlhttp = new ActiveXObject(IDs[i]);
			break;
		} catch (e) {
		}
	}

	if ( ! xmlhttp ) {
		throw new ReferenceError();
	}

	var result;

	xmlhttp.onreadystatechange = function()
	{
		if ( xmlhttp.readyState != 4 ) {
			return;
		}

		result = xmlhttp.responseText;
	};

	xmlhttp.open('GET', url, false);

	xmlhttp.setRequestHeader('If-Modified-Since', (new Date(0)).toUTCString());
	xmlhttp.setRequestHeader('User-Agent', this.userAgent());

	xmlhttp.send();

	return result;
*/
};

YandexSlovary.get = function(word, lang)
{
	if ( ! word ) {
		return '';
	}

	var queryString = 'text=' + encodeURIComponent(word);

	if ( lang === undefined ) {
		queryString += '&where=2';
	} else {
		queryString += '&where=3&lang=' + (encodeURIComponent(lang) || 'en-ru-en');
	}

	return this.query(this.url + '?' + queryString);
};

YandexSlovary.glossary = function(word, lang)
{
	return this.parse(this.get(word, lang));
};

///////////////////////////////////////////////////////////////////////////

if ( WScript.Arguments.Unnamed.length == 0 ) {
	YandexSlovary.help();
	YandexSlovary.quit();
}

var word = (function()
{
	var result = [];
	for (var i = 0; i < WScript.Arguments.Unnamed.length; i++) {
		result.push(WScript.Arguments.Unnamed.item(i));
	}
	return result.join(' ');
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

var text = YandexSlovary.glossary(word, lang);

YandexSlovary.alert(text);

