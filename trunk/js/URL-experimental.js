
if ( 'function' != typeof URL ) {

function URL(url)
{

	var p;

	var self = this;

	//
	// Getters
	//

	self.getHref = function()
	{
		return self.toString();
	};

	self.getProtocol = function()
	{
		return p.protocol ? p.protocol + (p.subscheme ? ':' + p.subscheme : '') + '://' : 'http://';
	};

	self.getSubscheme = function()
	{
		return p.subscheme;
	};

	self.getUserinfo = function()
	{
		return p.user || p.password ? p.user + ':' + p.password : '';
	};

	self.getUser = function()
	{
		return p.user;
	};

	self.getPassword = function()
	{
		return p.password;
	};

	self.getHost = function()
	{
		return p.host + (p.port ? ':' + p.port : '');
	};

	self.getHostname = function()
	{
		return p.host;
	};

	self.getPort = function()
	{
		return p.post;
	};

	self.getPathname = function()
	{
		return p.path ? p.path : '/';
	};

	self.getSearch = function()
	{
		return p.search ? '?' + p.search : '';
	};

	self.getHash = function()
	{
		return p.hash ? '#' + p.hash : '';
	};

	//
	// Setters
	//

	self.setHref = function(value)
	{
		var matches = String(value).match(URL.reHREF);

		if ( ! matches ) {
			throw new TypeError();
		}

		p = {
			'protocol': matches[1] || '',
			'subscheme': matches[2] || '',
			'user': matches[3] || '',
			'password': matches[4] || '',
			'host': matches[5],
			'port': matches[6] || '',
			'path': matches[7] || '',
			'search': matches[8] || '',
			'hash': matches[9] || ''};

		return self.getHref();
	};

	self.setProtocol = function(value)
	{
		return p.protocol = String(value).replace(/:\/\/$/, '');
	};

	self.setSubscheme = function(value)
	{
		return p.subscheme = value;
	};

	self.setUserinfo = function(value)
	{
		var matches = String(value).match(URL.reAUTH);

		if ( matches ) {
			throw new TypeError();
		}

		p.user = matches[1] || '';
		p.password = matches[2] || '';

		return self.getUserinfo();
	};

	self.setUser = function(value)
	{
		return p.user = value;
	};

	self.setPassword = function(value)
	{
		return p.password = value;
	};

	self.setHost = function(value)
	{
		var matches = String(value).match(URL.reADDR);

		if ( matches ) {
			throw new TypeError();
		}

		p.host = matches[1] || '';
		p.port = matches[2] || '';

		return self.getHost();
	};

	self.setHostname = function(value)
	{
		return p.host = value;
	};

	self.setPort = function(value)
	{
		return p.post = value;
	};

	self.setPathname = function(value)
	{
		return p.path = value;
	};

	self.setSearch = function(value)
	{
		return p.search = String(value).replace(/^\?/, '');
	};

	self.setHash = function(value)
	{
		return p.hash = String(value).replace(/^\#/, '');
	};

	self.toString = function()
	{
		return self.getProtocol() 
			+ self.getAuth() 
			+ self.getHost() 
			+ self.getPath() 
			+ self.getSearch() 
			+ self.getHash();
	};

	self.setHref(url);

};

URL.reHREF = /^(?:([a-z]+):(?:([a-z]*):)?\/\/)?(?:([^:@]*)(?::([^:@]*))?@)?((?:[a-z0-9_-]+\.)+[a-z]{2,}|localhost|(?:(?:[01]?\d\d?|2[0-4]\d|25[0-5])\.){3}(?:(?:[01]?\d\d?|2[0-4]\d|25[0-5])))(?::(\d+))?(?:([^:\?\#]+))?(?:\?([^\#]+))?(?:\#([^\s]+))?$/i;
URL.reADDR = /^((?:[a-z0-9_-]+\.)+[a-z]{2,}|localhost|(?:(?:[01]?\d\d?|2[0-4]\d|25[0-5])\.){3}(?:(?:[01]?\d\d?|2[0-4]\d|25[0-5])))(?::(\d+))?$/i;
URL.reAUTH = /^([^:]*)(?::([^:]*))?$/;

}

