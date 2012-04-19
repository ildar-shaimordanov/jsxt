//
// ZipFile.js
// Extension for handling with ZIP archives
//
// Copyright (c) 2010, 2012 by Ildar Shaimordanov
//

/*

// Ex.1: Creation of the archive
var filename = 'test.zip';
var create = true;
var overwrite = true;

WScript.Echo('*** Create the file');
var zipfile = new ZipFile();
zipfile.open(filename, create, overwrite);

WScript.Echo('*** Put objects to the archive');
zipfile.forInput(
	[
		'C:\\Logs', 
		'C:\\tmp', 
	], 
	function(folderItem, arcfile)
	{
		WScript.Echo(folderItem.Path);

		arcfile.CopyHere(folderItem.Path, 0);
		WScript.Sleep(3000);
	}
);

// Ex.2: Reading the list of files from the archive
var filename = 'test.zip';

WScript.Echo('*** Open the file');
var zipfile = new ZipFile(filename);

WScript.Echo('*** Show the content of the archive recursively');
zipfile.forEach(function(folderItem, arcfile)
{
	if ( ! folderItem.IsFolder ) {
		WScript.Echo(folderItem.Path, folderItem.Size);
		return;
	}

	WScript.Echo(folderItem.Path);

	var items = folderItem.GetFolder.Items();
	var len = items.Count;
	for (var i = 0; i < len; i++) {
		var g = items.Item(i);
		arguments.callee(g, arcfile);
	}
});

*/

/**
 * Creates new object to work with archives. It can accept the same 
 * arguments as the ZipFile#open method. For details see the description 
 * of the method. 
 *
 * @return	ZipFile
 * @acess	public
 * @see		ZipFile#open
 */
function ZipFile()
{
	if ( arguments.length == 0 ) {
		return;
	}
	this.open.apply(this, arguments);
};

(function()
{

var fso = new ActiveXObject('Scripting.FileSystemObject');
var shellApp = new ActiveXObject("Shell.Application");

/**
 * Opens a specified file. Creates a file if it was pointed. The name is 
 * mandatory argument passing the name of the existing archive or the name 
 * of the file that will be created. In the last case additional arguments 
 * are needed. 
 *
 * @param	String	Mandatory. String expression that identifies the 
 * 			existing file or the file to create. 
 * @param	Boolean	Optional. Boolean value that indicates whether a 
 * 			new file can be created 
 * @param	Boolean	Optional. Boolean value that indicates whether you 
 * 			can overwrite an existing file. It depends on the 
 * 			create argument is true. 
 *
 * @return	void
 * @acess	public
 */
ZipFile.prototype.open = function(name, create, overwrite)
{
	if ( create ) {
		var zipFile = fso.CreateTextFile(name, !! overwrite, 0);
		zipFile.Write('PK\05\06' + new Array(19).join('\0')); // 18 zeros
		zipFile.Close();
	}

	this.name = fso.GetFile(name).Path;
	this.file = shellApp.NameSpace(this.name);
};

/**
 * Fake method. It allows a script to flush data to a disk to complete 
 * processing. In fact, it just suspends script execution for a specified 
 * length of time. 
 *
 * @param	Number	Integer value indicating the interval (in 
 * 			milliseconds) you want the script process to be 
 * 			inactive. 
 *
 * @return	void
 * @access	public
 */
ZipFile.prototype.flush = function(timeout)
{
	timeout = Math.max(Number(timeout) || 0, 100);
	WScript.Sleep(timeout);
};

/**
 * Executes a provided function once for each item from within a archive. 
 * Once called it allows to perform any action with items from an archive.
 * The callback function is invoked with two arguments:
 * -- The FolderItem argument refers to the real object (file or folder) 
 *    within the archive 
 * -- The Folder object that refers to the archive file
 *
 * @param	Function	Mandatory. A function that will be called 
 * 				for each item in the archive
 *
 * @return	void
 * @access	piblic
 */
ZipFile.prototype.forEach = function(func)
{
	if ( typeof func != 'function' ) {
		throw new TypeError();
	}

	var arcfile = this.file;
	var items = arcfile.Items();

	for (var e = new Enumerator(items); ! e.atEnd(); e.moveNext()) {
		var folderItem = e.item();
		func(folderItem, arcfile);
	}
};

/**
 * Executes a provided function once for each item before input it to the 
 * archive. Once called it allows to perform any action with items. The 
 * callback function is invoked with two arguments: 
 * -- The FolderItem argument refers to the real object (file or folder) 
 *    before putting it into the archive 
 * -- The Folder object that refers to the archive file
 *
 * @param	Array/String	Mandatory. The list of items taht will be 
 * 				put into the archive. 
 * @param	Function	Mandatory. A function that will be called 
 * 				before an item will be put into the 
 * 				archive 
 *
 * @return	void
 * @access	piblic
 */
ZipFile.prototype.forInput = function(input, func)
{
	if ( typeof func != 'function' ) {
		throw new TypeError();
	}

	var arcfile = this.file;

	if ( typeof input == 'string' ) {
		input = [input];
	}

	for (var i = 0; i < input.length; i++) {
		var p = input[i];
		if ( ! p ) {
			continue;
		}

		var folderItem = null;
		if ( fso.FileExists(p) ) {
			folderItem = fso.GetFile(p);
		} else if ( fso.FolderExists(p) ) {
			folderItem = fso.GetFolder(p);
		}

		func(folderItem, arcfile);
	}
};

})();
