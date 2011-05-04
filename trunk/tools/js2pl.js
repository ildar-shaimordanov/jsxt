
jsxt.tools.js2pl = function(text, options)
{
	options = options || {};

	return text
		.replace(/\\/g, '\\\\')
		.replace(/\$/g, '\\$')
		;
};
