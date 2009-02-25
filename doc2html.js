/**
* Convert WinWord compatible files to the html pages
*
* USAGE:
*    CSCRIPT.EXE doc2html.js <source>
*    <source> - WinWord files have to been converted
*
* Note:
*    All files are saved at the same folders where from they has been opened
*
* Copyright (C) 2004, Ildar N. Shaimordanov
*/

// do not show WinWord interface, background execution
var backgroundExecute = true;

// the file has to be saved as web-page
var SAVE_AS_HTML = 8;

// the function returns the list of available WinWord files
function getWordFileList()
{
    var cmd = WScript.Arguments;
    var s = new Array();
    for (var i = 0; i < cmd.length; i++) {
        var f = cmd.Unnamed(i);
        if (fso.FileExists(f)) s[s.length] = fso.GetAbsolutePathName(f);
    }
    return s;
}

// the function returns the name of file has to being saved as web-page
function getHtmlFileName(filename)
{
    return filename.replace(/\..*?$/, ".htm");
}

var fso = new ActiveXObject("Scripting.FileSystemObject");
var fl = getWordFileList();
var word = new ActiveXObject("Word.Application");

if (!backgroundExecute) {
    word.Visible = true;
    word.Activate();
}

for (var i = 0; i < fl.length; i++) {
    word.Documents.Open(fl[i]);
    word.ActiveDocument.SaveAs(getHtmlFileName(fl[i]), SAVE_AS_HTML);
}

word.Quit();

