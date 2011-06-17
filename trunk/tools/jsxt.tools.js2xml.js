
/*

Expands the declared an external javascript file and embeds it into the 
resulting file. Takes in account the options.escaped option to escape some 
characters when embedding to another scripts like (Perl or PHP). Provides 
other options to the internally called method jsxt.tools.jsCode. 

*/
jsxt.tools.js2xml = function(text, options)
{
	options = options || {};
	var that = this;

	return text.replace(
		/\x3Cscript.*?src="(.+\.js)".*?\/script\x3E/ig, 
		function($0, $1)
		{
			var s;

			s = that.readFromFile($1);
			s = that.jsCode(s, options);

			if ( options.escaped ) {
				s = s.replace(/\\/g, '\\\\').replace(/\$/g, '\\$');
			}

			return options.wsfFile 
				? '\x3Cscript language="javascript"\x3E\x3C![CDATA[' + '\n\n//' + $1 + '\n' + s + '\n\n' + ']]\x3E\x3C/script\x3E' 
				: '\x3Cscript type="text/javascript"\x3E\x3C!--'     + '\n\n//' + $1 + '\n' + s + '\n\n' + '--\x3E\x3C/script\x3E';
//			return options.wsfFile 
//				? '\x3Cscript language="javascript"\x3E\x3C![CDATA[' + '\n\n//' + $1 + '\n' + s + '\n\n' + ']]\x3E\x3C/script\x3E' 
//				: '\x3Cscript language="javascript"\x3E'             + '\n\n//' + $1 + '\n' + s + '\n\n' +       '\x3C/script\x3E';
		});
};
