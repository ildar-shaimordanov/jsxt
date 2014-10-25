//
// Ajax.js
// Cross-browser JScript / Javascript extension for XMLHttpRequest
//
// Copyright (c) 2009, 2012 by Ildar Shaimordanov
//

if ( ! this.Ajax ) {
    this.Ajax = {};
}

/**
 * XMLHttpRequest generated error. 
 * If an attempt is made to use an object that is not, or is no longer, usable. 
 *
 * @const	Integer
 * @value	11
 */
Ajax.INVALID_STATE_ERR	= 11;

/**
 * XMLHttpRequest generated error. 
 * If an attempt is made of a request that is illegal by a browser security. 
 *
 * @const	Integer
 * @value	18
 */
Ajax.SECURITY_ERR	= 18;

/**
 * XMLHttpRequest generated error. 
 * Network error. 
 *
 * @const	Integer
 * @value	101
 */
Ajax.NETWORK_ERR	= 101;

/**
 * XMLHttpRequest generated error. 
 * User-aborted request. 
 *
 * @const	Integer
 * @value	11
 */
Ajax.ABORT_ERR		= 102;

/**
 * XMLHttpRequest.readyState constant.
 * Not initialized. 
 *
 * @const	Integer
 * @value	0
 */
Ajax.STATE_NOTINIT	= 0;

/**
 * XMLHttpRequest.readyState constant.
 * Request is open. 
 *
 * @const	Integer
 * @value	1
 */
Ajax.STATE_OPEN		= 1;

/**
 * XMLHttpRequest.readyState constant.
 * Sending of data. 
 *
 * @const	Integer
 * @value	2
 */
Ajax.STATE_SENT		= 2;

/**
 * XMLHttpRequest.readyState constant.
 * Receiving of data. 
 *
 * @const	Integer
 * @value	3
 */
Ajax.STATE_RECEIVING	= 3;

/**
 * XMLHttpRequest.readyState constant.
 * Data are downloaded. 
 *
 * @const	Integer
 * @value	4
 */
Ajax.STATE_LOADED	= 4;

/**
 * Creates the XMLHttpRequest object platform-independently. 
 * Returned object has the following methods and properties.
 *
 * Methods:
 * -- abort()
 * -- getAllResponseHeaders()
 * -- getResponseHeader()
 * -- open(method, url, async, username, password)
 * -- send(content)
 * -- setRequestHeader(label, value)
 * -- overrideMimeType(mimeType)
 *
 * Events:
 * -- onreadystatechange	EventListener	Sets or retrieves the event handler for asynchronous requests.
 * -- ontimeout			EventListener	Raised when there is an error that prevents the completion of the request.
 *
 * Properties:
 * -- readyState		Integer		Retrieves the current state of the request operation.
 * 						0 - not initialized, 
 * 						1 - open, 
 * 						2 - send of data, 
 * 						3 - receiving of data, 
 * 						4 - data are downloaded
 * -- responseBody		Array		Retrieves the response body as an array of unsigned bytes.
 * -- responseText		String		Retrieves the response body as a string.
 * -- responseXML		Document	Retrieves the response body as an XML Document Object Model (DOM) object.
 * -- status			Integer		Retrieves the HTTP status code of the request (200, 404, etc).
 * -- statusText		String		Retrieves the friendly HTTP status of the request ("OK", "Not Found", etc).
 * -- timeout			Integer		Gets or sets the time-out value in (milliseconds).
 *
 * The optional string argument comObject allows to use another 
 * COM object when get the error "msxml3.dll: Access is denied". 
 * In this case the better way is to use "MSXML2.ServerXMLHTTP". 
 *
 * https://social.msdn.microsoft.com/Forums/en-US/1abda1ce-e23c-4d0e-bccd-a323aa7f2ea5/access-is-denied-while-using-microsoftxmlhttp-to-get-a-url-link-in-vbscript-help?forum=xmlandnetfx
 * https://support.webafrica.co.za/index.php?/Knowledgebase/Article/View/615/41/msxml3dll-error-80070005-access-is-denied---loading-xml-file
 * http://www.experts-exchange.com/Programming/Languages/Scripting/ASP/Q_27305017.html
 * Methods:
 *
 * @param	string
 * @return	XMLHttpRequest
 * @access	static
 */
Ajax.create = function(comObject)
{
	if ( 'undefined' != typeof XMLHttpRequest ) {
		return new XMLHttpRequest()
	}

	if ( 'undefined' == typeof ActiveXObject ) {
		return null;
	}

	if ( comObject ) {
		return new ActiveXObject(comObject);
	}

	var e;
	var IDs = [
//		'Msxml2.XMLHttp.6.0', 
//		'Msxml2.XMLHttp.5.0', 
//		'Msxml2.XMLHttp.4.0', 
//		'Msxml2.XMLHttp.3.0', 
		'Msxml2.XMLHttp', 
		'Microsoft.XMLHTTP'];

	for (var i = 0; i < IDs.length; i++) {
		try {
			return new ActiveXObject(IDs[i]);
		} catch (e) {
		}
	}

	return null;
};

/**
 * Wrapper for encodeURIComponent over all own properties
 *
 * @param	Object
 * @return	String
 * @access	static
 */
Ajax.encode = function(content)
{
	if ( 'string' == typeof content ) {
		return content;
	}

	var result = [];
	for (var p in content) {
		if ( ! content.hasOwnProperty(p) ) {
			continue;
		}
		var part = encodeURIComponent(p) + '=' + encodeURIComponent(content[p]);
		result.push(part);
	}
	return result.join('&');
};

/**
 * Wrapper for fast query of requests.
 * Allows optional parameters provided via the object-like argument:
 * -- method		String		"GET", "POST", etc
 * -- async		Booelan		If it is true, then the request is asynchronous
 * -- username		String		Username for authorization
 * -- password		String		Password for authorization
 * -- headers		Object		Additional headers in the form as { key: value, ... }
 * -- content		String		Request body
 * -- onreadystate	Function	User-defined callback-handler of states of a request
 * -- nocache		Boolean		If it is true, then request will not be cached. 
 *
 * @param	String	The request address or the file
 * @param	Object	Options
 * @return	Boolean
 * @access	static
 */
Ajax.query = function(url, options)
{
	var options = options || {};

	var xmlhttp = Ajax.create(options.comObject);
	var result;

	xmlhttp.open((options.method || 'GET'), url, !! options.async, options.username, options.password);

	if ( typeof options.onload == 'function' ) {
		xmlhttp.onreadystatechange = function()
		{
			if ( xmlhttp.readyState != 4 ) {
				return;
			}
			result = options.onload(xmlhttp);
		};
	} else if ( typeof options.onreadystate == 'function' ) {
		xmlhttp.onreadystatechange = function()
		{
			result = options.onreadystate(xmlhttp);
		};
	}

	if ( options.nocache ) {
		if ( ! options.headers ) {
			options.headers = {};
		}
		options.headers['If-Modified-Since'] = (new Date(0)).toUTCString();
	}

	if ( options.content ) {
		if ( ! options.headers ) {
			options.headers = {};
		}
		options.content = Ajax.encode(options.content);
		options.headers['Content-Length'] = options.content.length;
		if ( ! options.headers.hasOwnProperty('Content-Type') ) {
			options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
		}
	}

	if ( options.headers ) {
		for (var p in options.headers) {
			if ( ! options.headers.hasOwnProperty(p) ) {
				continue;
			}
			if ( 'string' != typeof options.headers[p] ) {
				continue;
			}
			xmlhttp.setRequestHeader(p, options.headers[p]);
		}
	}

	xmlhttp.send(options.content);

	return result;
};

/**
 * Wrapper for Ajax.query for the fast query of the remote and local files.
 * It defines options to be as async=false, nocache=true and onreadystate as the internal function if they are not defined.
 *
 * @param	String	The request address or the file
 * @param	Object	Options
 * @return	Boolean
 * @access	static
 */
Ajax.queryFile = function(filename, options)
{
	if ( ! (/\w+:\/\//).test(filename) ) {
		filename = 'file:///' + filename;
	}

	options = options || {};

	if ( ! ( 'async' in options ) ) {
		options.async = false;
	}
	if ( ! ( 'nocache' in options ) ) {
		options.nocache = false;
	}
	if ( ! ( 'onreadystate' in options ) && ! ( 'onload' in options ) ) {
		options.onreadystate = function(xmlhttp)
		{
			if ( xmlhttp.readyState != 4 ) {
				return;
			}

			return xmlhttp.responseText;
		};
	}

	return Ajax.query(filename, options);
};

