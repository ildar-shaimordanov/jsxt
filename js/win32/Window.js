
//
// FileSystem.js
// Extension for FileSystemObject
//
// Copyright (c) 2009, 2011 by Ildar Shaimordanov
//


/*

// @example
// Delay
var t = 3000; // milliseconds

var w = Window.openHTA();

var h = w.document.createElement('h1');
h.innerHTML = 'HTA created from WSH will be closed by WSH during ' + (t / 1000) + ' seconds.';
w.document.body.appendChild(h);

// During t milliseconds the window will be closed
WScript.Sleep(t);

w.close();


// @example
// Delay
var t = 3000; // milliseconds

var w = Window.openHTA();

var h = w.document.createElement('h1');
h.innerHTML = 'HTA created from WSH will be closed by itself during ' + (t / 1000) + ' seconds after clicking within.';
w.document.body.appendChild(h);

// Close the window after click within
w.document.attachEvent('onclick', function()
{
    w.setTimeout(function()
    {
        w.close();
    }, t);
});

// Wait of the window closing
var e;
try {
    while ( w.document ) {
    }
} catch (e) {
}


// @example
var window = Window.openHTA();
var document = window.document;

var html = document.getElementsByTagName('html')[0];

var body = document.createElement('body');
html.appendChild(body);

var div = document.createElement('div');
document.body.appendChild(div);

div.innerHTML = div.innerHTML + CreateWindow.ID;

 */


var Window = Window || {};

/**
 * Creates new HTML application and returns the reference to the main window. 
 * Passes two global variable into the window: 
 * WSHost - for the access to the global scope of WSH 
 * WScript - for the access to the WScript object
 *
 * Window.openHTA.ID parameter keeps the last used ID for reference. 
 *
 * @note
 * The main algorithm of the searching for a window opened by this script was implemented previously here
 * http://forum.script-coding.com/viewtopic.php?pid=45812#p45812
 *
 * @param	String	The window title
 * @param	Object	Attributes of a HTML application
 * @param	Object	Arguments of the WshShell.Run method
 * @return	Object
 * @access	static
 */
Window.openHTA = function(title, htaProps, runProps)
{
	title = (title || 'hta:blank').replace(/"/g, '&quot;');
	htaProps = htaProps || {};
	runProps = runProps || {};

	var attrs = [];
	for (var p in htaProps) {
		if ( ! htaProps.hasOwnProperty(p) || 'string' != typeof htaProps[p] ) {
			continue;
		}
		attrs.push(p.toUpperCase() + '=\'' + htaProps[p] + '\'');
	}
	var props = attrs.join(' ');

	// Generate new ID and store it in the Window.lastID and Window.openHTA.ID properties
	var lastID = Window.lastID = arguments.callee.ID = Math.floor(Math.random() * 1e16);

	// Genereate the original HTA content
	var htmlApp = [
		'mshta.exe javascript:', 
		'"', 
		'<hta:application ', props, ' />', 
		'<object id=', lastID, ' classid=clsid:8856F961-340A-11D0-A96B-00C04FD705A2><param name=RegisterAsBrowser value=1></object>', 
		'<title>', title, '</title>', 
		'"'
		].join('');


	var appList = (new ActiveXObject('Shell.Application')).Windows();

	(new ActiveXObject('WScript.Shell')).Run(htmlApp, Number(runProps.windowStyle) || 0, !! runProps.waitOnReturn);

	if ( !! runProps.waitOnReturn ) {
		return null;
	}

	// Search the application with the newly created window
	var window;
	while ( ! window ) {
		WScript.Sleep(10);
		for (var i = appList.Count; --i >= 0; ) {
			var id;
			var e;
			try {
				id = appList.item(i).id;
				if ( lastID == appList.item(i).id ) {
					window = appList.item(i).parent.parentWindow;
				}
			} catch (e) {
			}
		}
	}

	// Clean up the window
	window.document.getElementById(lastID).removeNode();
	window.document.body.removeNode();

	// Put the references to the current WSH scenario
	window.WScript = WScript;
	window.WSHost  = this;

	return window;
};

