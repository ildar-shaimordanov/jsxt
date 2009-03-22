
(function()
{

	/**
	 * Creates a new window.
	 * This function is used internally by window.showModalDialog and window.showModlessDialog. 
	 * For detail of arguments see description of these methods. 
	 *
	 * @param	String	uri
	 * @param	String	args
	 * @param	String	props
	 * @return	HTMLWindow
	 * @access	private
	 */
	function createDialog(uri, args, props)
	{
		var dialogProps = {
			// Changeable properties
			width: window.screen.availWidth,
			height: window.screen.availHeight,
			screenX: 0,
			screenY: 0,
			scrollbars: 1,
			resizable: 0,
			status: 0,
			center: 1,

			// Unchangeable properties
			copyhistory: 0,
			dependent: 1,
			directories: 0,
			location: 0,
			menubar: 0,
			toolbar: 0,

			toString: function()
			{
				var result = [];
				for (var name in this) {
					result[result.length] = name + '=' + this[name];
				}
				return result.join(',');
			}};

		props = props.replace(/^\s+/g, '').replace(/\s+$/g, '');
		props = props.split(/\s*;\s*/);
		for (var i = 0; i < props.length; i++) {
			var p = props[i].split(/\s*:\s*/);
			switch (p[0]) {
			case 'dialogLeft':
			case 'dialogTop':
			case 'dialogWidth':
			case 'dialogHeight':
				var name = p[0].substr(6).toLowerCase();
				if ( name == 'left' ) {
					name = 'screenX';
				}
				if ( name == 'top' ) {
					name = 'screenY';
				}
				dialogProps[name] = parseInt(p[1]);
				break;
			case 'scroll':
			case 'resizable':
			case 'status':
			case 'center':
				var name = p[0] == 'scroll' ? 'scrollbars' : p[0];
				dialogProps[name] = p[1].match(/0|no|off/i) ? 0 : 1;
				break;
			case 'dialogHide':
			case 'help':
			case 'unadorned':
			case 'edge':
				// Unable to emulate
			}
		}

		if ( dialogProps.center ) {
			dialogProps.screenX = (window.screen.availWidth  - dialogProps.width)  >>> 1;
			dialogProps.screenY = (window.screen.availHeight - dialogProps.height) >>> 1;
		}

		var w = window.open(uri, '_dialog', dialogProps/*.toString()*/);
		w.dialogArguments = args;

		return w.returnValue;
	}

	if ( ! window.showModalDialog ) {

	/**
	 * window.showModalDialog
	 *
	 * @syntax
	 * window.showModalDialog(uri [, args?][, props?])
	 *
	 * @description
	 * This method developed in order to compatibility with the MSIE. 
	 *
	 * The 'showModalDialog' method creates a new modal window.
	 *
	 * The 'uri' argument specifies URI of the opened document, optional 'args' parameter is used for transfer a value of any type to the new window. 
	 * This value might be received within dialog window through 'dialogArguments' property. 
	 * The optional 'props' argument is a properties list of a window like a semicolon-separated 'propery:value' pair. 
	 * There is list of available properties and their values (the last ones are not supported that joined with a partial compatibility):
	 * - dialogHeight - a window height
	 * - dialogLeft   - a window left side
	 * - dialogTop    - a window top side
	 * - dialogWidth  - a window width
	 * - center       - to put a window to the screen center
	 * - resizable    - a user ables window sizes
	 * - scroll       - to show scrollbars
	 * - status       - to show statusbar
	 * - dialogHide   - hide a window during print (HTA only)
	 * - edge         - a frame type - sunken or raised (by default)
	 * - help         - to show context-dependent help icon
	 * - unadorned    - to show window frame (HTA only)
	 * The 'center', 'dialogHide', 'help', 'resizable', 'scroll', 'status', 'unadorned' properties are boolean 
	 * and can accept values like 'yes' or 'no' ('on', 'off', '1' or '0' give the same result). 
	 * The resulting value of the method is values of the 'returnValue' property assigned in a dialog window. 
	 *
	 * @param	String	uri
	 * @param	String	args
	 * @param	String	props
	 * @return	Mixed
	 * @access	public
	 */
	window.showModalDialog = function(uri, args, props)
	{
		var w = createDialog(uri, args, props);
		return w;
	}

	}

	if ( ! window.showModlessDialog ) {

	/**
	 * window.showModlessDialog
	 *
	 * @syntax
	 * window.showModlessDialog(uri [, args?][, props?])
	 *
	 * @description
	 * This method developed in order to compatibility with the MSIE. 
	 *
	 * The 'showModlessDialog' method creates a new non-modal window. 
	 * A non-modal window differs from a modal one by the follow fact that it is enable to switch to a parent window from the non-modal one. 
	 *
	 * The 'uri' argument specifies URI of the opened document, optional 'args' parameter is used for transfer a value of any type to the new window. 
	 * This value might be received within dialog window through 'dialogArguments' property. 
	 * The optional 'props' argument is a properties list of a window like a semicolon-separated 'propery:value' pair. 
	 * There is list of available properties and their values (the last ones are not supported that joined with a partial compatibility):
	 * - dialogHeight - a window height
	 * - dialogLeft   - a window left side
	 * - dialogTop    - a window top side
	 * - dialogWidth  - a window width
	 * - center       - to put a window to the screen center
	 * - resizable    - a user ables window sizes
	 * - scroll       - to show scrollbars
	 * - status       - to show statusbar
	 * - dialogHide   - hide a window during print (HTA only)
	 * - edge         - a frame type - sunken or raised (by default)
	 * - help         - to show context-dependent help icon
	 * - unadorned    - to show window frame (HTA only)
	 * The 'center', 'dialogHide', 'help', 'resizable', 'scroll', 'status', 'unadorned' properties are boolean 
	 * and can accept values like 'yes' or 'no' ('on', 'off', '1' or '0' give the same result). 
	 * The resulting value of the method is values of the 'returnValue' property assigned in a dialog window. 
	 *
	 * @param	String	uri
	 * @param	String	args
	 * @param	String	props
	 * @return	Mixed
	 * @access	public
	 */
	window.showModlessDialog = function(uri, args, props)
	{
		var w = createDialog(uri, args, props);
		return w;
	}

	}

})();

