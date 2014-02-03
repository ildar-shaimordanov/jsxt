
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

	var host = options.useWScript ? 'wscript.exe' : 'cscript.exe';
	var args = options.args || '//nologo';

	var prolog4 = [
		'@if (true == false) @end /*!', 
		'@"%windir%\\System32\\' + host + '" ' + args + ' //e:javascript "%~dpnx0" %*', 
		'@goto :EOF */', 
		'', 
		''];

	var prolog5 = [
		'@if (true == false) @end /*!', 
		'@set "SYSDIR=SysWOW64"', 
		'@if "%PROCESSOR_ARCHITECTURE%" == "x86" if not defined PROCESSOR_ARCHITEW6432 set "SYSDIR=System32"', 
		'@"%windir%\\%SYSDIR%\\' + host + '" ' + args + ' //e:javascript "%~dpnx0" %*', 
		'@goto :EOF */', 
		'', 
		''];

	return ( options.useSysWOW64 ? prolog5 : prolog4 ).join('\n') + text;
//	return ( options.useSysWOW64 ? prolog5 : prolog4 ).join('\n') + this.jsCode(text, options);
};
