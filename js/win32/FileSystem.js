/*

FileSystem.js

Extension for FileSystemObject

Copyright (C) 2009 by Ildar Shaimordanov

*/

if ( ! FileSystem ) {

function FileSystem()
{
}

}

if ( ! FileSystem.glob ) {

/**
 * Finds pathnames matching a pattern. 
 * Returns an array containing the matched files/folders.
 *
 * @code
 * <code>
 * var filespec = 'C:\\WINDOWS\\*';
 *
 * // Get the file list
 * var filelist = FileSystem.glob(filespec);
 *
 * //Get the folder list
 * var foldlist = FileSystem.glob(filespec, true);
 * </code>
 *
 * @param	String	filespec	The pattern which is looking for
 * @param	Boolean	foldersOnly	Return only folder entries which match the pattern instead of files
 * @return	Array
 * @access	public
 */
FileSystem.glob = function(pattern, foldersOnly)
{
	var fso = new ActiveXObject('Scripting.FileSystemObject');

	// Validate the single file/folder
	var matches = pattern.match(/((?:[a-zA-Z]\:)?.*?\\?)([^\\]*?[\*\?][^\\]*?$)/);
	if ( ! matches ) {
		if ( 
		( foldersOnly && fso.FolderExists(pattern) ) 
		|| 
		( ! foldersOnly && fso.FileExists(pattern) ) ) {
			return [fso.GetAbsolutePathName(pattern)];
		}
		throw new Error(pattern + ': File not found');
	}

	var regexp = new RegExp();
	var regsrc = matches[2]
		.replace(/\\/g, '\\\\')
		.replace(/([\^\$\+\.\[\]\(\)\|])/g, '\\$1')
		.replace(/\?/g, '.')
		.replace(/\*/g, '.*?');

	regexp.compile('\\\\' + regsrc + '$');

	var folderspec = matches[1];
	var collection = foldersOnly ? 'SubFolders' : 'Files';

	var f = fso.GetFolder(fso.GetAbsolutePathName(folderspec));
	var fc = new Enumerator(f[collection]);

	var result = [];
	for ( ; !fc.atEnd(); fc.moveNext()) {
		var i = fc.item();
		if ( ! regexp.test(i) ) {
			continue;
		}
		result.push(i);
	}
	return result;
}

}

