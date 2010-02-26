
//
// ZipFile.js
// Extension for handling with ZIP archives
//
// Copyright (c) 2010 by Ildar Shaimordanov
//


/**
 * Implements the simple interface for handling of zip-files.
 *
 * @example
 * <code>
 * var zip = ZipFile.create("C:\\test.zip", true);
 * zip.copy("C:\\tmp");
 * zip.flush();
 * </code>
 *
 * @param	String	filename	Required. The name of zip-file.
 * @param	Boolean	overwrite	Optional. Indicates whether you can overwrite an existing file. 
 *					The value is true if the file can be overwritten, false if it can't be overwritten. 
 *					If omitted, existing files are not overwritten.
 * @param	Integer	option		Optional. Options for the copy operation. 
 *					This value can be zero or a combination of the following values.
 *					4	Do not display a progress dialog box.
 *					8	Give the file being operated on a new name in a move, copy, 
 *						or rename operation if a file with the target name already exists.
 *					16	Respond with "Yes to All" for any dialog box that is displayed.
 *					64	Preserve undo information, if possible.
 *					128	Perform the operation on files only if a wildcard file name (*.*) is specified.
 *					256	Display a progress dialog box but do not show the file names.
 *					512	Do not confirm the creation of a new directory if the operation 
 *						requires one to be created.
 *					1024	Do not display a user interface if an error occurs.
 *					2048	Version 4.71. Do not copy the security attributes of the file.
 *					4096	Only operate in the local directory. Don't operate recursively into subdirectories.
 *					9182	Version 5.0. Do not copy connected files as a group. Only copy the specified files. 
 * @return	Folder object
 *
 * @properties	none
 * @methods	copy, flush, move
 */
function ZipFile(filename, overwrite, option)
{

	// {{{ private

	var self = this;

	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var shell = new ActiveXObject("Shell.Application");

	var zipFolder = null;

	var files = [];

	function createEmptyZip()
	{
		// Create the empty zip-file (it is created as an ASCII file)
		var file = fso.CreateTextFile(filename, overwrite, 0);
		file.Write("PK" + String.fromCharCode(5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)); // 18 zeros
		file.Close();

		return true;
	};

	function preload(action, fileList)
	{
		if ( fileList.length < 1 ) {
			return;
		}

		for (var i = 0; i < fileList.length; i++) {
			files.push({
				action: action,
				file: fileList[i]
			});
		}
	};

	function perform(fileList)
	{
		if ( ! zipFolder ) {
			zipFolder = shell.NameSpace(filename);
		}

		if ( zipFolder == null ) {
			throw new TypeError();
		}

		var action;
		var file;

		for (var i = 0; i < fileList.length; i++) {
			action = fileList[i].action;
			file = fileList[i].file;
			zipFolder[action](file, option);
		}
	};

	// }}}
	// {{{ public

	self.copy = function()
	{
		return preload.call(this, 'CopyHere', arguments);
	};

	self.move = function()
	{
		return preload.call(this, 'MoveHere', arguments);
	};

	self.flush = function(timeout)
	{
		createEmptyZip();

		perform(files);

		if ( ! zipFolder ) {
			return;
		}

		// Sleep to be sure that the zip file was created completely
		if ( ! timeout || Number(timeout) < 500 ) {
			timeout = 500;
		}
		WScript.Sleep(timeout);
	};

	// }}}

};

/**
 * Creates the zip-file specified by the name.
 *
 * @example
 * <code>
 * var zip = ZipFile.create("C:\\test.zip");
 * zip.copy("C:\\tmp");
 * zip.flush();
 * </code>
 *
 * @param	String	filename	Required. The name of zip-file.
 * @param	Boolean	overwrite	Optional. Indicates whether you can overwrite an existing file. 
 * @param	Integer	option		Optional. Options for the copy operation. 
 * @return	Folder object
 * @access	public
 */
ZipFile.create = function(filename, overwrite, option)
{
	return new ZipFile(filename, overwrite, option);
};

