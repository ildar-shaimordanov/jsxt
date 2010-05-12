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
 * var zip = new ZipFile();
 * zip.addFiles("C:\\tmp");
 * zip.save("C:\\test.zip", {
 *     overwrite: true, 
 * });
 * </code>
 *
 * @param	void
 * @return	Folder object
 *
 * @properties	none
 * @methods	addFiles, save
 */
function ZipFile()
{

	// {{{ private

	var self = this;

	var files = [];

	// }}}
	// {{{ public

	/**
	 * Adds an item or items to this zip-file. 
	 *
	 * @param	Mixed	filename	The item or the list of items to copy.
	 * 					This can be a string or an array of string that represent 
	 *					a filename(s), a FolderItem object, or a FolderItems object. 
	 * @return	Boolean
	 * @access	public
	 */
	self.addFiles = function()
	{
		for (var i = 0; i < arguments.length; i++) {
			files.push(arguments[i]);
		}
	};

	/**
	 * Creates an archive file and store files within. 
	 *
	 * @param	String	filename	Required. The name of zip-file.
	 * @param	Object	options		Optional. There are available options:
	 * 
	 *					overwrite
	 *					Indicates whether you can overwrite an existing file. 
	 *					The value is true if the file can be overwritten, false if it can't be overwritten. 
	 *					If omitted, existing files are not overwritten.
	 * 
	 *					timout
	 *					Suspends the script execution for this time (milliseconds). 
	 *					This provides a correct finishing, so the zip-file will contain all archived files exactly.
	 * 
	 *					option
	 * 					Options for the copy operation. 
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
	 *
	 *					onerror
	 *					User-defined function can implement some additional actions with the archive file before it will be deleted. 
	 * @return	Boolean
	 * @access	public
	 */
	self.save = function(filename, options)
	{
		options = options || {};

		// Create the empty zip-file (it is created as an ASCII file)
		var fso = new ActiveXObject("Scripting.FileSystemObject");

		var zipFile = fso.CreateTextFile(filename, !! options.overwrite, 0);
		zipFile.Write('PK' + String.fromCharCode(5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)); // 18 zeros
		zipFile.Close();

		// Opens the empty archive file and a Shell folder
		var shell = new ActiveXObject("Shell.Application");

		var zipFolder = shell.NameSpace(filename);

		if ( zipFolder == null ) {
			if ( typeof options.onerror == 'function' ) {
				options.onerror(filename);
			}
			if ( fso.FileExists(filename) ) {
				fso.DeleteFile(filename, true);
			}
			throw new TypeError();
		}

		// Copy files to an archive file
		var o = Number(options.option) || 0;
		for (var i = 0; i < files.length; i++) {
			zipFolder.CopyHere(files[i], o);
		}

		// Sleep to be sure that the zip file was created completely
		var t = ( ! options.timeout || Number(options.timeout) < 500 ) 
			? 500 
			: options.timeout;
		WScript.Sleep(t);
	};

	// }}}

};

/**
 * Shortcut for creation of an archive, and copying of files. 
 *
 * @example
 * // Overwrites the achive with the specified folder as the content.
 * ZipFile.create("C:\\test.zip", ["C:\\tmp"], {
 * 	overwrite: true
 * });
 * 
 * @param	String	filename	Required. The name of zip-file.
 * @param	Array	fileList	Required. The list of items to be archived. 
 * @param	Object	options		Optional. 
 * @return	Boolean
 * @access	static
 */
ZipFile.create = function(filename, fileList, options)
{
	var zip = new ZipFile();
	zip.addFiles.apply(this, fileList);
	zip.save(filename, options);
};

