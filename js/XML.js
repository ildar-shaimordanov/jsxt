/*

WSH-based extension to simplify XML processing and AJAX queries

Copyright (c) 2009-2023 Ildar Shaimordanov

*/

/*
Program with DOM in JScript
https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ms761349(v=vs.85)
XML DOM Properties
https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ms763798(v=vs.85)
Second-Level DOM Properties
https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ms766391(v=vs.85)
XML DOM Methods
https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ms757828(v=vs.85)
XML DOM Events
https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ms764697(v=vs.85)
*/

var XML = {};

// for supporting module system provided by require()
// https://github.com/ildar-shaimordanov/jsxt/blob/master/core/require.js
if ( typeof module != "undefined" ) {
	module.exports = XML;
}

/*
Create an XmlHttp object for processing AJAX requests.

See also: XML.create, XML.queryURL

// Example 1
var xmlhttp = XML.createHTTP();
*/
XML.createHTTP = function(options) {
	if ( typeof XMLHttpRequest != 'undefined' ) {
		return new XMLHttpRequest();
	}
	return XML.create([
		'Msxml2.XMLHTTP.6.0',
		'Msxml2.XMLHTTP.5.0',
		'Msxml2.XMLHTTP.4.0',
		'Msxml2.XMLHTTP.3.0',
		'Msxml2.XMLHTTP',
		'Microsoft.XMLHTTP'
	], options);
};

/*
Create an XmlHttp object and make an AJAX request.

Available options:
* method	`GET`, `POST`, etc
* async		true means sending asynchronously
* username	username for authorization
* password	password for authorization
* proxy		proxy settings
  * type	proxy configuration
		0 - configuration is taken from yteh Windows registry
		1 - for direct access
		2 - to specify one or more proxy servers
  * servers	names or names of proxy servers
  * bypassList	the list of host names of IP addresses to bypass proxies
  * username	the name of the user
  * password	the password for the user
* noCache	don't cache (add the `If-Modified-Since` header implicitly)
* continueAt	the starting position to continue downloading. It adds (without
		overwriting) the header `Range: bytes={range-start}-`, where
		`{range-start}` means the current file size
* body		request body (if required it can be URL-encoded manually).
		If request body is specified, its length is estimated and
		the `Content-Length` is initialized, respectively.
		If no `Content-Type` header specified, set it to the value
		`application/x-www-form-urlencoded`.
* headers	request headers
* onreadystatechange
		extended version of the standard use-defined callback.
		It accepts the reference to the xmlhttp object created by
		XML.createHTTP(). Also it can return the query result.
* onload	non-standard use-defined callback. It's almost the same as
		onreadystatechange but it's invoked when and only when
		`xmlhttp.readyState == 4`. It has higher priority against
		onreadystatechange.

See also: XML.create

// Example 1
var text = XML.queryURL(url);

// Example 2
var xml = XML.queryURL(url, {
	onreadystatechange: function(xmlhttp) {
		if ( xmlhttp.readState == 4 ) {
			return xmlhttp.responseXML;
		}
	}
});

// Example 3
var xml = XML.queryURL(url, {
	onload: function(xmlhttp) {
		return xmlhttp.responseXML;
	}
});

// Example 4
// https://stackoverflow.com/questions/11605613/differences-between-xmlhttp-and-serverxmlhttp
XML.queryURL(url, {
	method: 'POST',
	progIds: [ 'WinHttp.WinHttpRequest', 'Msxml2.ServerXMLHTTP' ],
	body: XML.encode({
		username: username,
		password: password
	}),
	onload: function(xmlhttp) {
		return xmlhttp.responseXML;
	}
});

See also:
onreadystatechange (IXMLHTTPRequest)
https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ms762767(v=vs.85)
open (IXMLHTTPRequest)
https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ms757849(v=vs.85)
send (IXMLHTTPRequest)
https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ms763706(v=vs.85)
setRequestHeader (IXMLHTTPRequest)
https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ms766589(v=vs.85)
setProxy/setProxyCredentials
https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ms760236(v=vs.85)
https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ms763680(v=vs.85)
*/
XML.queryURL = function(url, options) {
	options = options || {};

	var xmlhttp = XML.createHTTP({ progIds: options.progIds });
	var result = null;

	if ( ! /^\w+:\/\//.test(url) ) {
		url = 'file:///' + url;
	}

	xmlhttp.open(options.method || 'GET', url, !! options.async,
		options.username, options.password);

	if ( options.proxy ) {
		xmlhttp.setProxy(
			options.proxy.type,
			options.proxy.servers,
			options.proxy.bypassList);
		xmlhttp.setProxyCredentials(
			options.proxy.username,
			options.proxy.password);
	}

	var fn;

	if ( typeof options.onload == 'function' ) {
		fn = function() {
			if ( xmlhttp.readyState != 4 ) {
				return;
			}
			result = options.onload(xmlhttp);
		};
	} else if ( typeof options.onreadystatechange == 'function' ) {
		fn = function() {
			result = options.onreadystatechange(xmlhttp);
		};
	}

	if ( fn ) {
		xmlhttp.onreadystatechange = fn;
	}

	var headers = {};
	for (var p in options.headers) {
		headers[p] = options.headers[p];
	}

	if ( options.noCache ) {
		headers['If-Modified-Since'] =
		headers['If-Modified-Since'] ||
		new Date(0).toUTCString();
	}

	if ( options.continueAt ) {
		headers['Range'] =
		headers['Range'] ||
		'bytes=' + options.continueAt + '-';
	}

	var body = null;

	if ( options.body ) {
		body = options.body;

		headers['Content-Length'] = body.length;
		headers['Content-Type'] =
		headers['Content-Type'] ||
		'application/x-www-form-urlencoded';
	}

	for (var p in headers) {
		xmlhttp.setRequestHeader(p, headers[p]);
	}

	xmlhttp.send(body);

	return !! options.async || fn ? result : xmlhttp.responseText;
};

/*
Create an XML document.

See also: XML.create

// Example 1
var xml = XML.createXML();
*/
XML.createXML = function(options, properties) {
	return XML.create([
		'Msxml2.DOMDocument.6.0', 
		'Msxml2.DOMDocument.5.0', 
		'Msxml2.DOMDocument.4.0', 
		'Msxml2.DOMDocument.3.0', 
		'Msxml2.DOMDocument', 
		'Microsoft.XMLDOM'
	], options, properties);
};

/*
Load an XML document from a file.

// Example 1
var xml = XML.load('example.xml');

See also:
https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ms762722(v=vs.85)
*/
XML.load = function(filename, options, properties) {
	var xml = XML.createXML(options, properties);
	xml.load(filename);
	XML.checkParseError(xml);
	return xml;
};

/*
Load an XML document from a text.

// Example 1
var xml = XML.loadXML('<a />');

See also:
https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ms754585(v=vs.85)
*/
XML.loadXML = function(text, options, properties) {
	var xml = XML.createXML(options, properties);
	xml.loadXML(text);
	XML.checkParseError(xml);
	return xml;
};

/*
Validate the XML document against the provided schema and namespace.
Return the valid XML document.

// Example 1
var xml = XML.load('example.xml', {
	async: false,
	validateOnParse: true,
	resolveExternals: true,
	schemas: XML.loadSchemaCache('', 'example.xsd')
});
XML.validate(xml);

// Example 2
var xml = XML.validate(
	XML.load('example.xml', {
		async: false,
		validateOnParse: true,
		resolveExternals: true,
		schemas: XML.loadSchemaCache('', 'example.xsd')
	})
);

See also:
https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ms756003(v=vs.85)
*/
XML.validate = function(xml) {
	var err = xml.validate();
	XML.checkParseError(err);
	return xml;
};

/*
Based on the forum thread:
http://forum.script-coding.com/viewtopic.php?id=9277

// Example 1
var xml = XML.loadXML('<a><b/><b><c/><c id="1"/></b></a>');
var node = xml.selectSingleNode('//c[@id="1"]');
var path = XML.selectXPath(node); // path == /a/b[2]/c[2]
*/
XML.selectXPath = function(xmlNode) {
	var result = [];

	var ancestors = xmlNode.selectNodes('ancestor-or-self::*')
	for (var i = 0; i < ancestors.length; i++) {
		var node = ancestors[i];
		var nodeName = node.nodeName;
		var baseName = node.baseName;

		var L = node.selectNodes('preceding-sibling::' + baseName).length;
		var R = node.selectNodes('following-sibling::' + baseName).length;
		if ( L || R ) {
			nodeName += '[' + ( L + 1 ) + ']';
		}
		result.push(nodeName);
	}

	// It's xml attribute. Store its name manually, because the code
	// above doesn't work for xml attributes.
	if ( xmlNode.nodeType == 2 ) {
		result.push('@' + xmlNode.name);
	}

	return '/' + result.join('/')
};

/*
Based on the answer to the question:
How to get xpath from an XmlNode instance
https://stackoverflow.com/a/18184670/3627676

// Example 1
var xml = XML.loadXML('<a><b/><b><c/><c id="1"/></b></a>');
var node = xml.selectSingleNode('//c[@id="1"]');
var path = XML.getXPath(node); // path == /a[1]/b[2]/c[2]
*/
XML.getXPath = function(xmlNode) {
	// It's xml attribute. Take its owner and continue.
	if ( xmlNode.nodeType == 2 ) {
		return arguments.callee(xmlNode.selectSingleNode('..')) +
			'/@' + xmlNode.name;
	}

	if ( xmlNode.parentNode == null ) {
		return '';
	}

	var i = 1;
	for (var sibling = xmlNode; sibling = sibling.previousSibling; ) {
		if ( sibling.nodeName == xmlNode.nodeName ) {
			i++;
		}
	}

	return arguments.callee(xmlNode.parentNode) +
		'/' + xmlNode.nodeName + '[' + i + ']';
};

/*
Create XML Schema Cache.

See also: XML.create

// Example 1
var cache = XML.createSchemaCache();
*/
XML.createSchemaCache = function(options, properties) {
	return XML.create([
		'Msxml2.XMLSchemaCache.6.0',
		'Msxml2.XMLSchemaCache.5.0',
		'Msxml2.XMLSchemaCache.4.0',
		'Msxml2.XMLSchemaCache.3.0',
		'Msxml2.XMLSchemaCache'
	], options, properties);
};

/*
Initialize an XML Schema Cache.

// Example 1
var xml = XML.load('example.xml');
xml.schemas = XML.loadSchemaCache('', 'example.xsd');
xml.validate();

// Example 2
var xml = XML.load('example.xml', {
	async: false,
	validateOnParse: true,
	resolveExternals: true,
	schemas: XML.loadSchemaCache('', 'example.xsd')
});

See also:
https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ms766451(v=vs.85)
*/
XML.loadSchemaCache = function(nsURI, xsd, options, properties) {
	var cache = XML.createSchemaCache(options, properties);
	cache.add(nsURI || '', xsd);
	return cache;
};

/*
Partner for encodeURIComponent().

In most cases you don't need to call it directly.
*/
XML.encode = function(data) {
	if ( typeof data == 'string' ) {
		return encodeURIComponent(data);
	}

	var result = [];
	for (var p in data) {
		var r = encodeURIComponent(p) + '=' + encodeURIComponent(data[p]);
		result.push(r);
	}
	return result.join('&');
};

/*
Partner for decodeURIComponent().

In most cases you don't need to call it directly.
*/
XML.decode = function(data) {
	var result = {};
	var parts = String(data).split(/&(amp;)?/);
	for (var i = 0; i < parts.length; i++) {
		var m = parts[i].match(/^([^=]+)=(.*)$/);
		result[ decodeURIComponent(m[1]) ] = decodeURIComponent(m[2]);
	}
	return result;
};

/*
Create an MSXML object based on a list of ActiveX classes
and set up the object's options and properties.

Arguments:
* ids		the list of predefined ActiveX classes
* options	other options for configuring the object
* properties	the second level DOM properties

Available options:
* progIds	a user-custom list of ActiveX classes

It's used internally. You don't need to call it directly.

See also:
XML DOM Properties
https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ms763798(v=vs.85)
Second-Level DOM Properties
https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ms766391(v=vs.85)
setProperty
https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ms760290(v=vs.85)
*/
XML.create = function(ids, options, properties) {
	var errors = [];

	ids = [].concat(options && options.progIds || [], ids || []);
	for (var i = 0; i < ids.length; i++) {
		var e;
		try {
			var obj = new ActiveXObject(ids[i]);
			XML.setOptions(obj, options);
			XML.setProperties(obj, properties);
			return obj;
		} catch(e) {
			errors.push(ids[i] + ': ' + e.description);
		}
	}

	throw new Error('Unable to create ActiveX. Reasons: ' + errors.join('; '));
};

/*
Set the options available only for the document.

It's used internally. You don't need to call it directly.

See also:
XML DOM Properties
https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ms763798(v=vs.85)
*/
XML.setOptions = function(obj, options) {
	var has = Object.prototype.hasOwnProperty;
	for (var p in options) {
		if ( has.call(obj, p) ) {
			obj[p] = options[p];
		}
	}
};

/*
Set the second-level DOM properties.

It's used internally. You don't need to call it directly.

See also:
Second-Level DOM Properties
https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ms766391(v=vs.85)
setProperty
https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ms760290(v=vs.85)
*/
XML.setProperties = function(obj, properties) {
	for (var p in properties) {
		obj.setProperty(p, properties[p]);
	}
};

/*
Check the parsing error. If error is in place throws the expection.

It's used internally. You don't need to call it directly.

See also:
https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ms756041(v=vs.85)
*/
XML.checkParseError = function(obj) {
	if ( 'parseError' in obj ) {
		obj = obj.parseError;
	}

	var code = obj.errorCode;
	if ( code == 0 ) {
		return;
	}

	throw new Error('XML document error ' +
		( code < 0 ? code + 0x100000000 : code ).toString(16) +
		' [' + code.toString(16) + ']' +
		( obj.line ? ' at line ' + obj.line : '' ) +
		'. Reason: ' + obj.reason);
};
