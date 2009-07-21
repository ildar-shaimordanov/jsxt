
var JSXT = {

	/**
	 * Asynchronous work
	 *
	 * @var		Boolean
	 * @access	public
	 */
	async: false,

	/**
	 * Suppress caching
	 *
	 * @var		Boolean
	 * @access	public
	 */
	nocache: true,

	/**
	 * Base URL
	 *
	 * @var		String
	 * @access	public
	 */
	url: 'http://jsxt.googlecode.com/svn/trunk/js/',

	/**
	 * Allowed fragments
	 *
	 * @var		Array
	 * @access	public
	 */
	allow: [/^$/, /^\w+\.js$/, /^win32\/\w+\.js$/],

	/**
	 * Output for the response, etc
	 *
	 * @param	XMLHttpRequest
	 * @result	void
	 * @access	public
	 */
	print: function(xmlhttp, text)
	{
		text.print();
	},

	/**
	 * Updates the application based on the request state
	 *
	 * @param	XMLHttpRequest
	 * @result	void
	 * @access	public
	 */
	update: function(xmlhttp)
	{
		if ( xmlhttp.readyState == 2 ) {
			'Loading'.print();
		}

		if ( xmlhttp.readyState == 4 ) {
		}
	},

	/**
	 * Warning for the response status, etc
	 *
	 * @param	XMLHttpRequest
	 * @result	void
	 * @access	public
	 */
	warn: function(xmlhttp)
	{
		'Sorry. Try later. The next error has been encoutered: %d %s'.sprintf(xmlhttp.status, xmlhttp.statusText).print();
	},

	/**
	 * Keeping place for onreadystate events
	 *
	 * @var		Object
	 * @access	public
	 */
	onreadystate: {
	}
};

JSXT.onreadystate.root = function(xmlhttp)
{
	JSXT.update(xmlhttp);

	if ( xmlhttp.readyState != 4 ) {
		return;
	}

	if ( xmlhttp.status != 200 ) {
		JSXT.warn(xmlhttp);
		return;
	}

	var s;

	// Get the server response
	s = xmlhttp.responseText;

	// Extract the list of files
	s = s.replace(/(?:.|[\r\n])*?<(body)>((?:.|[\r\n])+?)<\/\1>(?:.|[\r\n])*/img, function($0, $1, $2)
	{
		return $2;
	});

	// Remove the upper-level links and experimental JSes
	s = s.replace(/(<li><a href=")([^"]+)("[^>]*>)(.+?)(<\/a><\/li>)/ig, function($0, $1, $2, $3, $4, $5)
	{
		if ( $2 != $4 ) {
			return '';
		}

		if ( /experimental/i.test($2) ) {
			return '';
		}

		if ( /\.\./.test($2) ) {
			return '';
		}

		return $1 + JSXT.url + $2 + $3 + $4 + $5;
	});

	// Put additional links
	s = s.replace(/(?=<\/ul>)/, function($0)
	{
		return [
			'',
			'<li><hr /></li>',
			'<li><a href="how-it-works.html">How It Works</a></li>',
			''
		].join('\n');
	});

	// Make the menu frame
	s = '<div id="menu">' + s + '</div>';

	JSXT.print(xmlhttp, s);
};

JSXT.onreadystate.common = function(xmlhttp)
{
	JSXT.update(xmlhttp);

	if ( xmlhttp.readyState != 4 ) {
		return;
	}

	if ( xmlhttp.status != 200 ) {
		JSXT.warn(xmlhttp);
		return;
	}

	var s;

	// Get the server response
	s = xmlhttp.responseText;



	JSXT.print(xmlhttp, s);
};

Ajax.query(JSXT.url, {
	async: JSXT.async,
	nocache: JSXT.nocache,
	onreadystate: JSXT.onreadystate.root
});

