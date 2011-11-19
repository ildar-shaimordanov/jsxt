
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

	var host = options.host || '%windir%\\System32\\cscript.exe';
	var args = options.args || '//nologo';

	var prolog = [
		'@set @x=0/*!', 
		'@set @x=', 
		['@', host, args, '//e:javascript "%~dpnx0" %*'].join(' '), 
		'@goto :eof */', 
		'', 
		''].join('\n');

	var prolog2 = [
		'@set @x=0/*!&&@set @x=', 
		['@', host, args, '//e:javascript "%~dpnx0" %*'].join(' '), 
		'@goto :eof */', 
		'', 
		''].join('\n');

	var prolog3 = [
		'@if (!@_jscript) == (!@_jscript) (@echo off)', 
		[host, args, '//e:javascript "%~dpnx0" %*'].join(' '), 
		'goto :eof', 
		'@end', 
		'', 
		''].join('\n');

	return prolog2 + this.jsCode(text, options);
};
