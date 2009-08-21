//
// JavaScript unit
// DOM extensions
//
// Copyright (c) 2009 by Ildar Shaimordanov
//

if ( ! window.XHTMLDOM ) {

window.XHTMLDOM = {};

}

if ( ! XHTMLDOM.utils ) {

XHTMLDOM.utils = {};

}

if ( ! XHTMLDOM.utils.SpinButton ) {

/**
 * Creates the spin button from the existing text input. 
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
 * For better view use the next CSS sheet
 * <pre>

div.xf_spinbutton_frame {
	display: inline;
	padding-right: 12px;
	position: relative;
}

div.xf_spinbutton_frame input.xf_spinbutton_value {
	text-align: right;
}

div.xf_spinbutton_frame input.xf_spinbutton_up,
div.xf_spinbutton_frame input.xf_spinbutton_down {
	font-size: 4px;
	margin: 0;
	padding: 0;
	position: absolute;
	width: 12px;
}

div.xf_spinbutton_frame input[type="button"]	{
	right: 0;
}

div.xf_spinbutton_frame input.xf_spinbutton_up {
	margin-bottom: 10px;
}

div.xf_spinbutton_frame input.xf_spinbutton_down {
	margin-top: 11px !important;
	margin-top: 12px;
}

 * </pre>
 *
 * @return	void
 * @access	static
 */
XHTMLDOM.utils.Spinbutton = function(el, options)
{
	if ( 'string' == typeof el ) {
		el = document.getElementById(el);
	}

	if ( ! el || el.tagName.toLowerCase() != 'input' || el.type.toLowerCase() != 'text' ) {
		throw new TypeError();
	}

	options = options || {};

	//
	// create a holder for the spin button
	//
	var holder = document.createElement('div');
	holder.className = 'xf_spinbutton_frame';
	el.parentNode.insertBefore(holder, el);

	//
	// move the input into this holder
	//
	el.className += ' xf_spinbutton_value';
	holder.appendChild(el);

	//
	// add the down arrow
	//
	var dn = document.createElement('input');
	dn.type = 'button';
	dn.className = 'xf_spinbutton_down';
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
	up.className = 'xf_spinbutton_up';
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

	var self = this;

	/**
	 * Updates the rotate options
	 */
	self.updateRotate = function(rotate)
	{
		options.rotate = !! rotate;
	};

	/**
	 * Updates the actual value of the element
	 */
	self.updateValue = function(value)
	{
		if ( /^\s*min\s*$/.test(value) ) {
			el.value = options.min;
		} else if ( /^\s*max\s*$/.test(value) ) {
			el.value = options.max;
		} else if ( isFinite(value) && Number(value) >= options.min && Number(value) <= options.max ) {
			el.value = Number(value);
		} else {
			setMediana();
		}
	};

	/**
	 * Updates the next options
	 * -- min
	 * -- max
	 * -- delta
	 */
	self.updateOptions = function(opts)
	{
		if ( ! opts ) {
			return;
		}

		var numOpts = 'min max delta'.split(/\s+/);
		for (var i = 0; i < numOpts.length; i++) {
			var p = numOpts[i];
			if ( opts.hasOwnProperty(p) && isFinite(opts[p]) ) {
				continue;
			}
			opts[p] = options[p];
		}

		if ( opts.min < opts.max &&  opts.min + opts.delta <= opts.max ) {
			options.min = opts.min;
			options.max = opts.max;
			options.delta = opts.delta;
		}

		el.value = Math.max(Math.min(el.value, options.max), options.min);

		setNearest();
	};

	//
	// correct options
	//
	if ( ! options.hasOwnProperty('rotate') ) {
		options.rotate = false;
	}

	if ( ! options.hasOwnProperty('behavior') ) {
		options.behavior = null;
	}

	// -2^32+1 .. +2^32-1 is enough
	if ( ! isFinite(options.min) ) {
		options.min = -0xFFFFFFFF;
	}

	if ( ! isFinite(options.max) ) {
		options.max = +0xFFFFFFFF;
	}

	options.delta = Math.abs(options.delta);
	if ( ! isFinite(options.delta) ) {
		options.delta = 1;
	}

	self.updateValue(options.value);

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

	//
	// assign handlers
	//
	var interval;

	//
	// up arrow mousedown
	//
	up.onmousedown = function()
	{
		if ( el.disabled ) {
			return;
		}

		interval = setInterval(function()
		{
			if ( Number(el.value) + options.delta <= options.max ) {
				el.value = Math.max(options.min, el.value);
				el.value -= -options.delta;
			} else if ( options.rotate ) {
				el.value = options.min;
			}
			setNearest();
		}, 100);
	};

	//
	// down arrow mousedown
	//
	dn.onmousedown = function()
	{
		if ( el.disabled ) {
			return;
		}

		interval = setInterval(function()
		{
			if ( Number(el.value) - options.delta >= options.min ) {
				el.value = Math.min(options.max, el.value);
				el.value -= +options.delta;
			} else if ( options.rotate ) {
				el.value = options.max;
			}
			setNearest();
		}, 100);
	};

	//
	// up/down arrow mouseup/mouseout
	//
	up.onmouseup = 
	dn.onmouseup = 
	up.onmouseout = 
	dn.onmouseout = function()
	{
		clearInterval(interval);
	};

	//
	// up/down arrow focus
	//
	up.onfocus = 
	dn.onfocus = function()
	{
		if ( el.disabled ) {
			return;
		}
		el.focus();
	};

	return self;
};

}

