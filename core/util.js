//
// util.js
//
// The "util"  module is partially similar to the module in NodeJS with
// the same name. It doesn't make attempts to emulate the original
// module. It just provides some of more frequently used methods and
// properties to have more compatibility in end user scripts.
//
// Some parts in this module are borrowed from the original
// repository https://github.com/nodejs/node "as is" or with some
// modifications. Because of specifics of JScript the most of good things
// provided by the original module are not supported and implemented in
// their own way.
//
// The module exports the limited set of the methods:
//
// util.format
// util.formatWithOptions
// util.inspect
//
// The following options are supported:
//
// depth
// colors
// sorted
//
// Non-standard extension
//
// util.inspect.enableColors
//
// More information about API for util:
// https://nodejs.org/api/util.html
//
// Copyright (c) 2012, 2013, 2019-2023 by Ildar Shaimordanov
//

var util = util || (function() {

	// Emulate Object.assign(target, source)
	function objectAssign(target) {
		for (var i = 1; i < arguments.length; i++) {
			var arg = arguments[i];
			for (var p in arg) {
				target[p] = arg[p];
			}
		}
		return target;
	}

	// Emulate Array.prototype.includes(value)
	function arrayIncludes(array, value) {
		for (var i = 0; i < array.length; i++) {
			if ( value === array[i] ) {
				return true;
			}
		}
		return false;
	}

	// Emulate Array.prototype.indexOf(value)
	function arrayIndexOf(array, value) {
		for (var i = 0; i < array.length; i++) {
			if ( value === array[i] ) {
				return i;
			}
		}
		return -1;
	}

	// Emulate Function.prototype.name
	var reFunction =
	/function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/;

	function functionName(object) {
		var m = String(object).match(reFunction);
		return m && m[1] || '';
	}

	var formatters = {};

	formatters.s = function(v, options) {
		return typeof v != 'object' ? String(v) : inspect(v, {
			compact: 3,
			colors: false,
			depth: 0
		});
	};

	formatters.d = function(v, options) {
		return Number(v);
	};

	formatters.i = function(v, options) {
		return parseInt(v);
	};

	formatters.f = function(v, options) {
		return parseFloat(v);
	};

	formatters.j = function(v, options) {
		return typeof JSON == 'undefined' ? String(v) : JSON.stringify(v);
	};

	formatters.o = function(v, options) {
		return inspect(v, objectAssign({}, options, {
			showHidden: true,
			showProxy: true,
			depth: 4
		}));
	};

	formatters.O = function(v, options) {
		return inspect(v, options);
	};

	formatters.c = function(v, options) {
		return '';
	};

	var reFormat = /%([%sdifjoOc])/g;

	function formatArgsWithOptions(options, args) {
		var pattern = args[0];

		var result = [];

		var i = 0;

		reFormat.lastIndex = 0;

		if ( typeof pattern == 'string' && reFormat.test(pattern) ) {
			if ( args.length == 1 ) {
				return pattern;
			}

			i = 1;
			var s = pattern.replace(reFormat, function(format, id) {
				if ( id == '%' ) {
					return '%';
				}

				if ( i >= args.length ) {
					return format;
				}

				return formatters[id](args[i++], options);
			});
			result.push(s);
		}

		for (; i < args.length; i++) {
			var v = args[i];
			result.push(typeof v == 'string' ? v : inspect(v, options));
		}

		return result.join(' ');
	}

// https://nodejs.org/api/util.html#utilformatwithoptionsinspectoptions-format-args

	function formatWithOptions(options) {
		return formatArgsWithOptions(options,
			Array.prototype.slice.call(arguments, 1));
	}

// https://nodejs.org/api/util.html#utilformatformat-args

	function format() {
		return formatArgsWithOptions({}, arguments);
	}

	function colorless(object) {
		return String(object);
	}

	var E = String.fromCharCode(27);

	function colorer(object, color) {
		return E + '[' + color[0] + 'm' + object + E + '[' + color[1] + 'm';
	}

	function colorful(object, styleType) {
		var style = inspect.styles[styleType];
		var color;

		if ( style ) {
			color = inspect.colors[style];
		}

		return color ? colorer(object, color) : String(object);
	}

	var escaped = {
		'\r': '\\r',
		'\n': '\\n',
		'\t': '\\t',
		'\b': '\\b',
		'\f': '\\f',
		'\\': '\\\\'
	};

	var reEscaped = /[\x00-\x1F\'\\]/g;

	var apos = {
		0: { quote: "'" },		// '   '
		1: { quote: '"', "'": "'" },	// " ' "
		2: { quote: "'", "'": "\\'" }	// ' \' " '
	};

	function formatString(value) {
		var i = value.indexOf("'") == -1 ? 0 :
			value.indexOf('"') == -1 ? 1 : 2;
		var q = apos[i].quote;
		var result = value.replace(reEscaped, function($0) {
			return escaped[$0]
				|| apos[i][$0]
				|| '\\x' + $0.charCodeAt(0).toString(16);
		});
		return q + result + q;
	};

	function formatPrimitive(ctx, object) {
		var t = typeof object;
		if ( t == 'string' ) {
			object = formatString(object);
		}
		return ctx.stylize(object, t);
	}

	// A duck typing test extending this answer:
	// https://stackoverflow.com/a/34296945/3627676
	// https://lodash.com/docs/4.17.15#isArguments

	function isObject(object) {
		return !! object && typeof object == 'object';
	}

	function hasSpecialProperty(object, name, type) {
		return Object.prototype.hasOwnProperty.call(object, name)
			&& typeof object.propertyIsEnumerable == 'function'
			&& ! Object.prototype.propertyIsEnumerable.call(object, name)
			&& typeof object[name] == type;
	}

	function isArrayLike(object) {
		return isObject(object)
			&& hasSpecialProperty(object, 'length', 'number');
	}

	function isArguments(object) {
		return isArrayLike(object)
			&& hasSpecialProperty(object, 'callee', 'function');
	}

	function formatArrayLikeItems(ctx, object, indent, items) {
		for (var i = 0; i < object.length; i++) {
			if ( ! ( i in object ) ) {
				continue;
			}
			var v = formatValue(ctx, object[i], indent);
			items.push(i + ': ' + v);
		}
		return items;
	}

	function stylizeUnknown(ctx) {
		return ctx.stylize('[Unknown]', 'special');
	}

	function objectCanForIn(object) {
		var e;
		try {
			for (var k in object) { return true };
		} catch(e) {
			return false;
		}
	}

	function formatObjectItems(ctx, object, indent, items) {
		if ( ! objectCanForIn(object) ) {
			return items;
		}

		for (var k in object) {
			if ( ! Object.prototype.hasOwnProperty.call(object, k) ) {
				continue;
			}
			var v = typeof object[k] == 'unknown'
				? stylizeUnknown(ctx)
				: formatValue(ctx, object[k], indent);
			if ( k === '' || /^\d/.test(k) || /\W/.test(k) ) {
				k = ctx.stylize(formatString(k), 'string');
			}
			items.push(k + ': ' + v);
		}
		return items;
	}

	var indentSpace = '  ';

	function formatObject(ctx, object, indent) {
		var prefix;
		var style;

		var brLeft = '{';
		var brRight = '}';
		var brOptional;

		var isArgs;

		if ( typeof object == 'function' ) {
			prefix = functionName(object);
			prefix = prefix
				? '[Function: ' + prefix + ']'
				: '[Function]';
			style = 'special';
			brOptional = 1;
		} else if ( typeof Array == 'function'
		&& object instanceof Array ) {
			prefix = 'Array(' + object.length + ')';
			brLeft = '[';
			brRight = ']';
		} else if ( typeof RegExp == 'function'
		&& object instanceof RegExp ) {
			prefix = object;
			style = 'regexp';
			brOptional = 1;
		} else if ( typeof Date == 'function'
		&& object instanceof Date ) {
			prefix = object.toUTCString();
			style = 'date';
			brOptional = 1;
		} else if ( typeof ActiveXObject == 'function'
		&& object instanceof ActiveXObject ) {
			prefix = '[ActiveXObject]';
			style = 'special';
			brOptional = 1;
		} else if ( typeof Enumerator == 'function'
		&& object instanceof Enumerator ) {
			prefix = '[Enumerator]';
			style = 'special';
			brOptional = 1;
		} else if ( isArguments(object) ) {
			prefix = '[Arguments]';
			isArgs = 1;
		} else if ( typeof object.constructor == 'function' ) {
			prefix = functionName(object.constructor);
		} else {
			prefix = '[Object]';
		}

		if ( ctx.depth !== null && ctx.currentDepth > ctx.depth ) {
			var objectType = Object.prototype.toString.call(object);
			return ctx.stylize(objectType, 'special');
		}

		var innerIndent = indent + indentSpace;

		ctx.seen.push(object);
		ctx.currentDepth++;

		var items = [];
		if ( isArgs ) {
			formatArrayLikeItems(ctx, object, innerIndent, items);
		}
		formatObjectItems(ctx, object, innerIndent, items);

		ctx.currentDepth--;
		ctx.seen.pop();

		if ( ctx.sorted ) {
			var compare = ctx.sorted === true ? null : ctx.sorted;
			items.sort(compare);
		}

		for (var i = 0; i < items.length; i++) {
			items[i] = '\n' + innerIndent + items[i];
		}

		var itemsStr = items.join('');
		if ( itemsStr ) {
			itemsStr += '\n' + indent;
		}

		var index = 1 + arrayIndexOf(ctx.circular, object);
		var reference = index
			? ctx.stylize('<ref *' + index + '>', 'special')
			: '';

		if ( items.length == 0 && index == 0 && style ) {
			prefix = ctx.stylize(prefix, style);
		}

		if ( items.length == 0 && brOptional ) {
			brLeft = '';
			brRight = '';
		}

		return ( reference ? reference + ' ' : '' ) + prefix +
			( prefix && brLeft ? ' ' : '' ) +
			brLeft +
			itemsStr +
			brRight;
	}

	function formatValue(ctx, object, indent) {
		if ( object === null ) {
			return ctx.stylize('null', 'null');
		}

		if ( typeof object == 'unknown' ) {
			return stylizeUnknown(ctx);
		}

		if ( typeof object != 'object'
		&& typeof object != 'function' ) {
			return formatPrimitive(ctx, object);
		}

		if ( ! arrayIncludes(ctx.seen, object) ) {
			return formatObject(ctx, object, indent);
		}

		ctx.circular.push(object);
		var index = 1 + arrayIndexOf(ctx.circular, object);
		return ctx.stylize('[Circular *' + index + ']', 'special');
	}

// https://nodejs.org/api/util.html#utilinspectobject-options
// https://nodejs.org/api/util.html#utilinspectobject-showhidden-depth-colors

	function inspect(object, options) {
		// 1. initialize the context with the global settings
		var ctx = objectAssign({}, inspect.defaultOptions);

		// 2. modify the context with the user defined settings
		if ( options && typeof options == 'object' ) {
			objectAssign(ctx, options);
		} else {
			if ( arguments[1] !== undefined ) {
				ctx.showHidden = arguments[1];
			}
			if ( arguments[2] !== undefined ) {
				ctx.depth = arguments[2];
			}
			if ( arguments[3] !== undefined ) {
				ctx.colors = arguments[3];
			}
		}

		// 3. initialize the internally used stuff
		objectAssign(ctx, {
			circular: [],
			seen: [],
			currentDepth: 0,
			stylize: colorless
		});

		if ( ctx.colors ) {
			ctx.stylize = colorful;
			enableColors();
		}

		return formatValue(ctx, object, '');
	}

	var colorsEnabled = false;

	function enableColors(skip) {
		if ( colorsEnabled ) {
			return;
		}

		colorsEnabled = true;

		if ( skip ) {
			return;
		}

		// The trick is borrowed from this thread:
		// https://www.dostips.com/forum/viewtopic.php?p=63393#p63393

		var shell = new ActiveXObject('WScript.Shell');
		var proc = shell.Exec('powershell -nop -ep bypass -c exit');

		while ( proc.Status == 0 ) {
			WScript.Sleep(50);
		}
	}

	inspect.enableColors = enableColors;

// Borrowed with modifications from
// https://github.com/nodejs/node/blob/950a4411facdcaf6450cf3943f034177d0e21e3d/lib/internal/util/inspect.js#L365-L416

	// Set Graphics Rendition
	// https://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	// Each entry is the color code and reset code
	var defaultFG = 39;
	var defaultBG = 49;

	inspect.colors = {
		reset: [0, 0],

		// Font styles
		bold: [1, 22],
		dim: [2, 22], // Alias: faint
		italic: [3, 23],
		underline: [4, 24],
		blink: [5, 25],
		// Swap foreground and background colors
		inverse: [7, 27], // Alias: swapcolors, swapColors
		hidden: [8, 28], // Alias: conceal
		strikethrough: [9, 29], // Alias: strikeThrough, crossedout, crossedOut
		doubleunderline: [21, 24], // Alias: doubleUnderline

		// Foreground normal
		black: [30, defaultFG],
		red: [31, defaultFG],
		green: [32, defaultFG],
		yellow: [33, defaultFG],
		blue: [34, defaultFG],
		magenta: [35, defaultFG],
		cyan: [36, defaultFG],
		white: [37, defaultFG],

		// Background normal
		bgBlack: [40, defaultBG],
		bgRed: [41, defaultBG],
		bgGreen: [42, defaultBG],
		bgYellow: [43, defaultBG],
		bgBlue: [44, defaultBG],
		bgMagenta: [45, defaultBG],
		bgCyan: [46, defaultBG],
		bgWhite: [47, defaultBG],

		framed: [51, 54],
		overlined: [53, 55],

		// Foreground bright
		gray: [90, defaultFG], // Alias: grey, blackBright
		redBright: [91, defaultFG],
		greenBright: [92, defaultFG],
		yellowBright: [93, defaultFG],
		blueBright: [94, defaultFG],
		magentaBright: [95, defaultFG],
		cyanBright: [96, defaultFG],
		whiteBright: [97, defaultFG],

		// Background bright
		bgGray: [100, defaultBG], // Alias: bgGrey, bgBlackBright
		bgRedBright: [101, defaultBG],
		bgGreenBright: [102, defaultBG],
		bgYellowBright: [103, defaultBG],
		bgBlueBright: [104, defaultBG],
		bgMagentaBright: [105, defaultBG],
		bgCyanBright: [106, defaultBG],
		bgWhiteBright: [107, defaultBG]
	};

// Borrowed with modifications from
// https://github.com/nodejs/node/blob/950a4411facdcaf6450cf3943f034177d0e21e3d/lib/internal/util/inspect.js#L418-L430

	// It's not safe, but JScript doesn't support getters/setters.
	// So we just use object references
	function defineColorAlias(target, alias) {
		inspect.colors[alias] = inspect.colors[target];
	}

// Borrowed 'as is' from
// https://github.com/nodejs/node/blob/950a4411facdcaf6450cf3943f034177d0e21e3d/lib/internal/util/inspect.js#L432-L443

	defineColorAlias('gray', 'grey');
	defineColorAlias('gray', 'blackBright');
	defineColorAlias('bgGray', 'bgGrey');
	defineColorAlias('bgGray', 'bgBlackBright');
	defineColorAlias('dim', 'faint');
	defineColorAlias('strikethrough', 'crossedout');
	defineColorAlias('strikethrough', 'strikeThrough');
	defineColorAlias('strikethrough', 'crossedOut');
	defineColorAlias('hidden', 'conceal');
	defineColorAlias('inverse', 'swapColors');
	defineColorAlias('inverse', 'swapcolors');
	defineColorAlias('doubleunderline', 'doubleUnderline');

// Borrowed with modifications from
// https://github.com/nodejs/node/blob/950a4411facdcaf6450cf3943f034177d0e21e3d/lib/internal/util/inspect.js#L447-L461

	inspect.styles = {
		special: 'cyan',
		number: 'yellow',
		bigint: 'yellow',
		'boolean': 'yellow',
		undefined: 'grey',
		'null': 'bold',
		string: 'green',
		symbol: 'green',
		date: 'magentaBright',
		regexp: 'redBright',
		module: 'underline'
	};

// Borrowed with modifications from
// https://github.com/nodejs/node/blob/950a4411facdcaf6450cf3943f034177d0e21e3d/lib/internal/util/inspect.js#L165-L178

	inspect.defaultOptions = {
		showHidden: false,
		depth: 2,
		colors: false,
		customInspect: true,
		showProxy: false,
		maxArrayLength: 100,
		maxStringLength: 10000,
		breakLength: 80,
		compact: 3,
		sorted: false,
		getters: false
	};

	return {
		format: format,
		formatWithOptions: formatWithOptions,
		inspect: inspect
	};

})();

if ( typeof module != "undefined" ) {
	module.exports = util;
}

// ========================================================================

// EOF
