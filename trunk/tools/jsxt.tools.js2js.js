
/*

Embeds one javascript file into the another one. Provides options to the 
internally called mathod jsxt.tools.jsCode. 

*/
jsxt.tools.js2js = function(text, options)
{
	options = options || {};
	var that = this;

	return text.replace(
		( /\s*\/\/\[requires\[\s*(.+\.js)\s*\]\]/ig ), 
		function($0, $1)
		{
			var s;

			s = that.readFromFile($1);
			s = that.jsCode(s, options);

			return '\n//' + $1 + '\n' + s + '\n';
		});
};
