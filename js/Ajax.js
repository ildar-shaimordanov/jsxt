//
// Ajax.js
// Cross-browser JScript / Javascript extension for XMLHttpRequest
//
// Copyright (c) 2009 by Ildar Shaimordanov
//

if ( 'undefined' == typeof Ajax ) {

function Ajax()
{
};

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

}

if ( ! Ajax.create ) {

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
 * @param	void
 * @return	XMLHttpRequest
 * @access	static
 */
Ajax.create = function()
{
	if ( 'undefined' != typeof XMLHttpRequest ) {
		return new XMLHttpRequest()
	}

	if ( 'undefined' == typeof ActiveXObject ) {
		return null;
	}

	var e;
	try {
		return new ActiveXObject('Msxml2.XMLHTTP');
	} catch (e) {
		try {
			return new ActiveXObject('Microsoft.XMLHTTP');
		} catch (e) {
			return null;
		}
	}
};

}

if ( ! Ajax.query ) {

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
 * @param	String	The request address
 * @param	Object	Options
 * @return	Boolean
 * @access	static
 */
Ajax.query = function(url, options)
{
	options = options || {};

	var xmlhttp = Ajax.create();
	var result;

	xmlhttp.onreadystatechange = function()
	{
		if ( 'function' != typeof options.onreadystate ) {
			return;
		}

		result = options.onreadystate(xmlhttp);
	};

	xmlhttp.open((options.method || 'GET'), url, options.async, options.username, options.password);

	if ( options.nocache ) {
		if ( ! options.headers ) {
			options.headers = {};
		}
		options.headers['If-Modified-Since'] = (new Date(0)).toUTCString();
	}

	if ( options.headers ) {
		for (var p in options.headers) {
			if ( 'string' != typeof options.headers[p] ) {
				continue;
			}
			xmlhttp.setRequestHeader(p, options.headers[p]);
		}
	}

	xmlhttp.send(options.content);

	return result;
};

}

