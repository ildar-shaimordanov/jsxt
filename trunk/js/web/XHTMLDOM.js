

if ( ! window.XHTMLDOM ) {

window.XHTMLDOM = {};

}

if ( ! XHTMLDOM.utils ) {

XHTMLDOM.utils = {};

}

if ( ! XHTMLDOM.utils.initSpinbox ) {

/**
 * Creates the spinbox from the existing text input. 
 *
 * @param	HTMLElement	el
 * @param	Object		options
 * There are avaliable properties of the options:
 * -- value
 * -- min
 * -- max
 * -- delta
 * -- rotate
 * -- behavior
 * -- customArrows
 *
 * Example
 * <pre>

<input type="text" id="sb_0" />
<input type="text" id="sb_1" /><script type="text/javascript">XHTMLDOM.utils.initSpinbox('sb_1', {});</script>
<input type="text" id="sb_2" /><script type="text/javascript">XHTMLDOM.utils.initSpinbox('sb_2', {rotate: 1});</script>

 * </pre>
 *
 * For better view use the next CSS sheet
 * <pre>

div.xf_spinbox {
	display: inline;
	padding-right: 12px;
	position: relative;
}

div.xf_spinbox input.xf_spinbox_value {
	text-align: right;
}

div.xf_spinbox input.xf_spinbox_up,
div.xf_spinbox input.xf_spinbox_down {
	font-size: 4px;
	margin: 0;
	padding: 0;
	position: absolute;
	width: 12px;
}

div.xf_spinbox input[type="button"]	{
	right: 0;
}

div.xf_spinbox input.xf_spinbox_up {
	margin-bottom: 10px;
}

div.xf_spinbox input.xf_spinbox_down {
	margin-top: 11px !important;
	margin-top: 12px;
}

 * </pre>
 *
 * @return	void
 * @access	static
 */
XHTMLDOM.utils.initSpinbox = function(el, options)
{
	if ( 'string' == typeof el ) {
		el = document.getElementById(el);
	}

	if ( ! el.type || el.type.toLowerCase() != 'text' ) {
		throw new TypeError();
	}

	options = options || {};

	//
	// create a holder for the spinbox
	//
	var holder = document.createElement('div');
	holder.className = 'xf_spinbox';
	el.parentNode.insertBefore(holder, el);

	//
	// move the input into this holder
	//
	el.className += ' xf_spinbox_value';
	holder.appendChild(el);

	//
	// add the down arrow
	//
	var dn = document.createElement('input');
	dn.type = 'button';
	dn.className = 'xf_spinbox_down';
	dn.tabIndex = 32767;
	if ( ! options.customArrows ) {
		dn.value = String.fromCharCode(1639);
		dn.title = 'Down';
	}
	holder.appendChild(dn);

	//
	// add the up arrow
	//
	var up = document.createElement('input');
	up.type = 'button';
	up.className = 'xf_spinbox_up';
	up.tabIndex = 32767;
	if ( ! options.customArrows ) {
		up.value = String.fromCharCode(1640);
		up.title = 'Up';
	}
	holder.appendChild(up);

	//
	// find the nearest value for delta != 1
	//
	function setNearest()
	{
		var r = (el.value - options.min) % options.delta;
		if ( r > 0 ) {
			el.value -= r;
		}
	};

	//
	// estimate the mediana of the interval
	//
	function setMediana()
	{
		// Preventing of 'Infinity' value appearance
		var n = options.min + Number.MAX_VALUE <= options.max 
			? options.max / 2 - options.min / 2 
			: (options.max - options.min) / 2;
		el.value = options.min + options.delta * Math.floor(n / options.delta);

		setNearest();
	};

	//
	// correct options
	//
	if ( ! isFinite(options.min) ) {
		options.min = 0;
	}

	if ( ! isFinite(options.max) ) {
		options.max = 10;
	}

	options.delta = Math.abs(options.delta);
	if ( ! isFinite(options.delta) ) {
		options.delta = 1;
	}

	if ( /^\s*min\s*$/.test(options.value) ) {
		el.value = options.min;
	} else if ( /^\s*max\s*$/.test(options.value) ) {
		el.value = options.max;
	} else if ( isFinite(options.value) && Number(options.value) >= options.min && Number(options.value) <= options.max ) {
		el.value = Number(options.value);
	} else {
		setMediana();
	}

	//
	// initialize the main handler
	//
	setInterval(function()
	{
		if ( arguments.callee.value == el.value ) {
			return;
		}

		var value = Number(el.value);

		if ( isNaN(value) ) {
			return;
		}

		arguments.callee.value = value;

		if ( 'function' == typeof options.behavior ) {
			options.behavior(el, options);
		}
	}, 50);

	var interval = null;

	//
	// up/down arrow mouseup/mouseout
	//
	function stopChange()
	{
		clearInterval(arguments.callee.interval);
	};

	//
	// up arrow mousedown
	//
	function incValue()
	{
		if ( el.disabled ) {
			return;
		}

		stopChange.interval = setInterval(function()
		{
			if ( Number(el.value) + options.delta <= options.max ) {
				el.value = Math.max(options.min, el.value);
				el.value -= -options.delta;
			} else if ( options.rotate ) {
				el.value = options.min;
				setNearest();
			}
		}, 100);
	};

	//
	// down arrow mousedown
	//
	function decValue()
	{
		if ( el.disabled ) {
			return;
		}

		stopChange.interval = setInterval(function()
		{
			if ( Number(el.value) - options.delta >= options.min ) {
				el.value = Math.min(options.max, el.value);
				el.value -= +options.delta;
			} else if ( options.rotate ) {
				el.value = options.max;
				setNearest();
			}
		}, 100);
	};

	//
	// up/down arrow focus
	//
	function focusValue()
	{
		if ( el.disabled ) {
			return;
		}
		el.focus();
	};

	//
	// assign handlers
	//
	if ( document.attachEvent ) {
		up.attachEvent('onmousedown', incValue);
		dn.attachEvent('onmousedown', decValue);
		up.attachEvent('onmouseup', stopChange);
		dn.attachEvent('onmouseup', stopChange);
		up.attachEvent('onmouseout', stopChange);
		dn.attachEvent('onmouseout', stopChange);
		up.attachEvent('onfocus', focusValue);
		dn.attachEvent('onfocus', focusValue);
	} else if ( document.addEventListener ) {
		up.addEventListener('mousedown', incValue, false);
		dn.addEventListener('mousedown', decValue, false);
		up.addEventListener('mouseup', stopChange, false);
		dn.addEventListener('mouseup', stopChange, false);
		up.addEventListener('mouseout', stopChange, false);
		dn.addEventListener('mouseout', stopChange, false);
		up.addEventListener('focus', focusValue, false);
		dn.addEventListener('focus', focusValue, false);
	}
};

}

