
var Window = {};

(function(WSHost)
{

var randID = (new Date()).getTime() + '_' + Math.floor(Math.random() * 1e16) + '_';
var nextID = 0;

/**
 * Creates new HTML application and returns the reference to the main window. 
 * Passes two global variable into the window: 
 * WSHost - for the access to the global scope of WSH 
 * WScript - for the access to the WScript object
 *
 * @example
 * // Delay
 * var t = 3000;
 * 
 * var w = Window.openHTA();
 * 
 * var h = w.document.createElement('h1');
 * h.innerHTML = 'HTA created from WSH will be closed by WSH during ' + (t / 1000) + ' seconds.';
 * w.document.body.appendChild(h);
 * 
 * // During t seconds the window will be closed
 * WScript.Sleep(t);
 * 
 * w.close();
 * 
 * @example
 * // Delay
 * var t = 3000;
 * 
 * var w = Window.openHTA();
 * 
 * var h = w.document.createElement('h1');
 * h.innerHTML = 'HTA created from WSH will be closed by itself during ' + (t / 1000) + ' seconds after clicking within.';
 * w.document.body.appendChild(h);
 * 
 * // Close the window after click within
 * w.document.attachEvent('onclick', function()
 * {
 *     w.setTimeout(function()
 *     {
 *         w.close();
 *     }, t);
 * });
 * 
 * // Wait of the window closing
 * var e;
 * try {
 *     while ( w.document ) {
 *     }
 * } catch (e) {
 * }
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

	var lastID = randID + nextID;
	nextID++;

	var htmlApp = [
		'mshta.exe javascript:', '"', 
		'<hta:application ', props, ' />', 
		'<object id=', lastID, ' classid=clsid:8856F961-340A-11D0-A96B-00C04FD705A2><param name=RegisterAsBrowser value=1></object>', 
		'<title>', title, '</title>', 
		'"'
		].join('');


	var appList = (new ActiveXObject('Shell.Application')).Windows();
	var appCount = appList.Count;

	(new ActiveXObject('WScript.Shell')).Run(htmlApp, Number(runProps.windowStyle) || 0, !! runProps.waitOnReturn);

	if ( !! runProps.waitOnReturn ) {
		return null;
	}

	while ( appCount == appList.Count ) {
		WScript.Sleep(10);
	}

	var window;

	for (var i = 0; i < appList.Count; i++) {
		var id;

		var e;
		try {
			id = appList.item(i).id;
		} catch (e) {
			continue;
		}

		if ( lastID == id ) {
			window = appList.item(i).parent.parentWindow;
			break;
		}
	}

	if ( ! window ) {
		return null;
	}

	window.document.getElementsByTagName('body')[0].innerHTML = '';
	window.WScript = WScript;
	window.WSHost  = WSHost;

	return window;
};

})(this);

