
jsxt.tools.js2bat = function(text, options)
{
	options = options || {};

	var host = options.host || 'cscript';
	var args = options.args || '//nologo';
	var prolog = [
		'@set @x=0 /*!', 
		'@set @x=', 
		['@', host, args, '//e:javascript "%~dpnx0" %*'].join(' '), 
		'@goto :eof */', 
		'', 
		''].join('\n');

	return prolog + text;
};
