
/*

Embeds one vbscript file into javascript. 

*/
jsxt.tools.vbs2js = function(text, options)
{
	options = options || {};
	var that = this;

	var jsProlog = (function()
	{
		return arguments.callee.toString().replace(/[\s\S]+\/\*!JS-PROLOG|\*\/[\s\S]+$/gm, '');
/*!JS-PROLOG
var vb = new ActiveXObject('MSScriptControl.ScriptControl');
vb.Language = 'VBScript';
vb.AddObject('WScript', WScript, true);

var prologLen = 0;

var e;
try {
	vb.AddCode((function() {
		var fso = new ActiveXObject('Scripting.FileSystemObject');
		var f = fso.OpenTextFile(WScript.ScriptFullName, 1, false);
		do {
			prologLen++;
		} while ( f.ReadLine() != '/*!VBScript' );
		var code = f.ReadAll();
		f.Close();
		return code;
	})());
} catch (e) {
	WScript.Echo(
		WScript.ScriptFullName + 
		'(' + ( prologLen + vb.Error.Line ) + ', ' + vb.Error.Column + ') ' + 
		vb.Error.Source + ': ' + vb.Error.Description);
}
*/
	})();

	return jsProlog + '/*!VBScript\n' + text + '\n\'*/';
};
