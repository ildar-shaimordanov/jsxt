
jsxt.tools.jsCode = function(text, options)
{
	options = options || {};

	if ( options.minify ) {
		return eval.minify(text, {
			level: Number(options.level) || 0 
		});
	}

	if ( options.beautify ) {
		return eval.beautify(text, {
			indent_size: Number(options.indent_size) || 4, 
			indent_level: Number(options.indent_level) || 0, 
			indent_char: (options.indent_char || '').replace(
				/\\([fnrstv])|\\([0-9]+|0[0-7]+)|\\(x[0-9A-Fa-f]+)/g, 
				function($0, $1, $2, $3)
				{
					return $1 
						? eval('"\\' + $1 + '"') 
						: String.fromCharCode(parseInt($2 || ('0' + $3)));
				})
		});
	}

	return text;
};
