//
// XML.js
// Cross-browser JScript / Javascript extension for XML processing
//
// Copyright (c) 2010, 2011, 2013 by Ildar Shaimordanov
//

if ( ! this.XML ) {
    this.XML = {};
}

/**
 * Creates new XML document
 * @link	http://www.webreference.com/programming/javascript/definitive2/index.html
 */
XML.create = function(root, namespace)
{
	root = root || '';
	namespace = namespace || '';

	if ( 'undefined' != typeof document && document.implementation && document.implementation.createDocument ) {
		return document.implementation.createDocument(namespace, root, null);
	}

	var IDs = [
//		'Msxml2.DOMDocument.6.0', 
//		'Msxml2.DOMDocument.5.0', 
//		'Msxml2.DOMDocument.4.0', 
		'Msxml2.DOMDocument.3.0', 
		'Msxml2.DOMDocument', 
		'Microsoft.XMLDOM'];

	var xmldoc;
	for (var i = 0; i < IDs.length; i++) {
		var e;
		try {
			xmldoc = new ActiveXObject(IDs[i]);
			break;
		} catch (e) {
		}
	}

	if ( ! xmldoc ) {
		throw new ReferenceError();
	}

	if ( root ) {
		// Look for a namespace prefix
		var prefix = '';
		var tagName = root;

		var p = root.indexOf(':');
		if ( p != -1 ) {
			prefix = root.substring(0, p);
			tagName = root.substring(p + 1);
		}

		// If we have a namespace, we must have a namespace prefix
		// If we don't have a namespace, we discard any prefix
		if ( namespace ) {
			if ( ! prefix ) prefix = 'a0'; // What Firefox uses
		} else {
			prefix = '';
		}

		// Create the root element (with optional namespace) as a string of text
		var text = '<' 
			+ ( prefix ? ( prefix + ':' ) : '' ) 
			+ tagName 
			+ ( namespace ? ( ' xmlns:' + prefix + '="' + namespace + '"' ) : '' ) 
			+ '/>';

		// And parse that text into the empty document
		xmldoc.loadXML(text);
	}

	return xmldoc;
};

XML.load = function(url, callback)
{
	var synchronously = typeof callback != 'function';

	var xmldoc = XML.create();

	if ( synchronously ) {
		xmldoc.async = false;
		xmldoc.load(url);
		return xmldoc;
	}

	xmldoc.async = true;
	xmldoc.onreadystatechange = function()
	{
		if ( xmldoc.readyState == 4 ) {
			callback(xmldoc);
		}
	};
	xmldoc.load(url);
};

XML.loadXML = function(text)
{
	if ( typeof DOMParser != 'undefined' ) {
		// Mozilla, Firefox, and related browsers
		return (new DOMParser()).parseFromString(text, "application/xml");
	}

	if ( typeof ActiveXObject != 'undefined' ) {
		// Internet Explorer, JScript
		var xmldoc = XML.create();
		xmldoc.async = false;
		xmldoc.loadXML(text);
		return xmldoc;
	}

	// As a last resort, try loading the document from a data: URL
	// This is supposed to work in Safari. Thanks to Manos Batsis and
	// his Sarissa library (sarissa.sourceforge.net) for this technique.
	var url = 'data:text/xml;charset=utf-8,' + encodeURIComponent(text);
	var request = new XMLHttpRequest();
	request.open('GET', url, false);
	request.send(null);
	return request.responseXML;
};

XML.transform = function(xml, xslt)
{
	return xml.transformNode(xslt);
};

/*
// http://forum.script-coding.com/viewtopic.php?id=9277
var xml = new ActiveXObject('MSXML2.DOMDocument');
xml.setProperty('SelectionLanguage', 'XPath');
xml.loadXML('<a><b/><b><c/><c id="1"/></b></a>');
var node = xml.selectSingleNode('//c[@id="1"]');
var path = XML.selectPath(node); // 'a/b[2]/c[2]'
*/
XML.selectPath = function(xml)
{
	if ( ! xml ) {
		return '';
	}

	var t = typeof xml.selectNodes;
	if ( t != 'function' && t != 'unknown' ) {
		return '';
	}

	var result = [];
	var ancestors = xml.selectNodes('ancestor-or-self::*')
	for (var i = 0; i < ancestors.length; i++) {
		var node = ancestors[i];
		var name = node.nodeName;

		var L = node.selectNodes('preceding-sibling::' + name).length;
		var R = node.selectNodes('following-sibling::' + name).length;
		if (L != 0 || R != 0) {
			name += '[' + ( L + 1 ) + ']';
		}
		result.push(name);
	}
	return  result.join('/')
};

if ( 'undefined' != typeof ActiveXObject ) {
// IE, WSH

XML.selectionW3CCompat = false;

XML.selectNodes = function(xml, path)
{
	// IE5+ has implemented that [0] should be the first node, 
	// but according to the W3C standard it should have been [1]!!
	// See "Select the title of the first book" at
	// http://www.w3schools.com/xpath/xpath_examples.asp
	XML.selectionW3CCompat && xml.setProperty('SelectionLanguage', 'XPath');
	return xml.selectNodes(path);
};

XML.selectSingleNode = function(xml, path)
{
	return xml.selectSingleNode(path);
};

} else if ( 'undefined' != typeof document && document.implementation && document.implementation.createDocument ) {
// Gecko

XML.selectNodes = function(xml, path)
{
	return xml.evaluate(path, xml, null, XPathResult.ANY_TYPE, null);
};

XML.selectSingleNode = function(xml, path)
{
	return xml.evaluate(path, xml, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
};

} else {

// Extremely impossible case

}

if ( 'undefined' != typeof Node && Node.prototype ) {

Node.prototype.loadXML = function(text)
{
	if ( typeof DOMParser != 'undefined' ) {
		// Mozilla, Firefox, and related browsers
		var parser = new DOMParser();
		return parser.parseFromString(text, "application/xml");
	}

	// As a last resort, try loading the document from a data: URL
	// This is supposed to work in Safari. Thanks to Manos Batsis and
	// his Sarissa library (sarissa.sourceforge.net) for this technique.
	var url = 'data:text/xml;charset=utf-8,' + encodeURIComponent(text);
	var request = new XMLHttpRequest();
	request.open('GET', url, false);
	request.send(null);
	return request.responseXML;
};

Node.prototype.__defineGetter__('xml', function()
{
	var serializer = new XMLSerializer();
	return serializer.serializeToString(this);
});

/**
 * This definition creates a version of IE's transformNode() method for Firefox. 
 *
 * @example
 * oXmlDom.load("employees.xml");
 * oXslDom.load("employees.xslt");
 * alert(oXmlDom.transformNode(oXslDom));
 *
 * @param	XMLDocument
 * @return	XMLDocument
 * @access	public
 * @see		http://www.developer.com/xml/article.php/3630526/JavaScript-XSLT-Support-in-Firefox.htm
 */
Node.prototype.transformNode = function (oXslDom)
{
	var processor = new XSLTProcessor();
	processor.importStylesheet(oXslDom);
	var resultDom = processor.transformToDocument(this);
	var result = resultDom.xml;
	if ( result.indexOf('<transformiix:result') > -1 ) {
		result = result.substring(result.indexOf('>') + 1, result.lastIndexOf('<'));
	}
	return result;
};

}
