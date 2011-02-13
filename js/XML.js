//
// XML.js
// Cross-browser JScript / Javascript extension for XML processing
//
// Copyright (c) 2010, 2011 by Ildar Shaimordanov
//

if ( ! this.XML ) {
    this.XML = {};
}

/**
 * Creates new XML document
 *
 */
XML.create = function(root, namespace)
{
	root = root || '';
	namespace = namespace || '';

	if ( 'undefined' != typeof document && document.implementation && document.implementation.createDocument ) {
		return document.implementation.createDocument(namespace, root, null);
	}

	var IDs = [
		'Msxml2.DOMDocument.6.0', 
		'Msxml2.DOMDocument.5.0', 
		'Msxml2.DOMDocument.4.0', 
		'Msxml2.DOMDocument.3.0', 
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

