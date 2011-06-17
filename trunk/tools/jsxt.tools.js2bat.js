
/*

Converts the specified javascript file to the batch file adding the 
appropriate prolog. 

Options are:
host - WSCRIPT or CSCRIPT (the default value)
args - additional arguments for the Scripting Host

*/
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

	return prolog + this.jsCode(text, options);
};
