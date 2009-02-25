if ( ! ZipFile ) {

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
 * @param	String	zipName		Required. The name of zip-file.
 * @param	Boolean	overwrite	Required. Indicates whether you can overwrite an existing file. 
 *					The value is true if the file can be overwritten, false if it can't be overwritten. 
 *					If omitted, existing files are not overwritten.
 * @return	Folder object
 *
 * @properties	none
 * @methods	copy, flush, move
 */
function ZipFile(filename, overwrite)
{

	// {{{ private

	var self = this;

	var shell = new ActiveXObject("Shell.Application");

	var zipFolder = null;

	function createEmptyZip()
	{
		// Create the empty zip-file (it is created as an ASCII file)
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		var file = fso.CreateTextFile(filename, overwrite, 0);
		file.Write("PK" + String.fromCharCode(5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)); // 18 zeros
		file.Close();
	}

	function doCopyMove(action, fileList, option)
	{
		if ( ! fileList ) {
			return;
		}

		if ( fileList.constructor != Array ) {
			fileList = [fileList.toString()];
		}

		if ( ! zipFolder ) {
			zipFolder = shell.NameSpace(filename);
		}

		if ( zipFolder == null ) {
			throw new TypeError();
		}

		for (var i = 0; i < fileList.length; i++) {
			zipFolder[action](fileList[i], option);
		}
	}

	// }}}
	// {{{ public

	/**
	 * Copies an item or items to this zip-file.
	 *
	 * @param	Mixed	fileList	Required. The item or the list of items to copy. 
	 *					This can be a string or an array of string that represent 
	 *					a filename(s), a FolderItem object, or a FolderItems object.
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
	 * @return	void
	 * @access	public
	 * @see		http://msdn.microsoft.com/en-us/library/bb787866(VS.85).aspx
	 */
	self.copy = function(fileList, option)
	{
		return doCopyMove("CopyHere", fileList, option);
	}

	/**
	 * Flushes this zip-file to be created properly.
	 *
	 * @param	Integer	timeout	Optional. Suspends the script execution for this time (milliseconds). 
	 *				This provides a correct finishing, so the zip-file will contain all archived files exactly.
	 * @return	void
	 * @access	public
	 */
	self.flush = function(timeout)
	{
		if ( ! zipFolder ) {
			return;
		}

		// Sleep to be sure that the zip file was created completely
		if ( ! timeout || Number(timeout) < 500 ) {
			timeout = 500;
		}
		WScript.Sleep(timeout);
	}

	/**
	 * Moves an item or items to this zip-file.
	 *
	 * @param	Mixed	fileList	Required. The item or the list of items to copy. 
	 *					This can be a string or an array of string that represent 
	 *					a filename(s), a FolderItem object, or a FolderItems object.
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
	 * @return	void
	 * @access	public
	 * @see		http://msdn.microsoft.com/en-us/library/bb787874(VS.85).aspx
	 */
	self.move = function(fileList, option)
	{
		return doCopyMove("MoveHere", fileList, option);
	}

	// }}}

	createEmptyZip();

}

}

if ( ! ZipFile.create ) {

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
 * @param	String	zipName		Required. The name of zip-file.
 * @param	Boolean	overwrite	Optional. Indicates whether you can overwrite an existing file. 
 *					The value is true if the file can be overwritten, false if it can't be overwritten. 
 *					If omitted, existing files are not overwritten.
 * @return	Folder object
 * @access	public
 */
ZipFile.create = function(filename, overwrite)
{
	return new ZipFile(filename, overwrite);
}

}

