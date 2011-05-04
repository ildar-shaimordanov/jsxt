
jsxt.tools.jsEmbed = function(text, options)
{
	options = options || {};

	return text.replace(
		/\x3Cscript.*?src="(js\/.+\.js)".*?\/script\x3E|\s*\/\/\!\[requires\[\s*(js\/.+\.js)\s*\]\]/ig, 
		function($0, $1, $2)
		{
			var f = $1 || $2;
			var s;

			var e;
			try {
				s = options.readFile(f);
			} catch (e) {
				options.error();
			}

			if ( options.squeeze ) {
				s = jsxt.jsCode(s, {
					level: options.level, 
					comment: f
				});
			}

			if ( options.jsFile ) {
				return '\n\n' + s + '\n\n';
			}
			if ( options.wsfFile ) {
				return '\x3Cscript language="javascript"\x3E\x3C![CDATA[\n\n' + s + '\n\n]]\x3E\x3C/script\x3E';
			}
			return '\x3Cscript language="javascript"\x3E\n\n' + s + '\n\n\x3C/script\x3E';
		});
};
