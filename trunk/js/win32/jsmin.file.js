//
// JScript add-on
//
// @require	jsmin.js
// 		win32/FileSystem.js
// 		Core.js
//
// @copyright	Copyright (c) 2009 by Ildar Shaimordanov
//

if ( Core.browser.isMSIE || Core.browser.isJScript ) {

if ( ! jsmin.file ) {

jsmin.file = function(filename, level, comment)
{
	var input = FileSystem.readFile(filename);
	return jsmin(input, level, comment);
};

}

}

