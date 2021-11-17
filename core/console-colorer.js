//
// console-colorer.js
// Colorizing feature; requires console
//
// Copyright (c) 2020-2021 by Ildar Shaimordanov
//

/*

The default colorer object
	console.fn.colorer

Turn on colorer functionality
-- execute the trick with powershell and
-- initialize console.fn.preprint to console.fn.colorer.preprint
	console.fn.colorer.enable()

The default colorer method
	console.fn.colorer.preprint(text)

Low-level colorer methods (foreground and background colors)
<color> stands for black, red, green, yellow, blue, magenta, cyan, white, gray
gray synonym for blackBright
grayBright synonym for white
	console.fn.colorer.fg.<color>
	console.fn.colorer.bg.<color>
	console.fn.colorer.fg.<color>Bright
	console.fn.colorer.bg.<color>Bright

High-level colorer methods
<part> stands for string, bool, null, undef, number, date, regexp, func, comobj, circular
	console.fn.colorer._<part>

This extension partially combines features from console and util.inspect.

See for details:

https://nodejs.org/api/console.html
https://nodejs.org/api/util.html#util_util_inspect_object_options

*/

(function() {

	var re = new RegExp(
	[ '^'
	, '(\\s*)'	// head = SPACE*
	, '(?:'
	, '('		// key
		, '('	// quoteKey = QUOTE ... QUOTE
			, '".*?"'
		, ')'
		, '|'
		, '('	// bareKey = ... (except something like [...])
			, '(?!\\[)\\S+'
		, ')'
	, ')'
	, ': '
	, ')?'
	, '('		// val
		, '('	// string = QUOTE ... QUOTE
			, '".*"'
		, ')'
		, '|'
		, '('	// bool
			, 'false'
			, '|'
			, 'true'
		, ')'
		, '|'
		, '('	// nulls
			, 'null'
		, ')'
		, '|'
		, '('	// undef
			, 'undefined'
		, ')'
		, '|'
		, '('	// number
			, '[+-]?'
			, '(?:\\d*\.)?'
			, '\\d+'
			, '(?:[Ee][+-]\\d+)?'
			, '|'
			, 'NaN'
			, '|'
			, '[+-]?Infinity'
		, ')'
		, '|'
		, '('	// date = UTC (compliant to RFC822, RFC1123)
			, '(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)'
			, ', \\d\\d?'
			, ' (?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)'
			, ' \\d{4}'
			, ' \\d\\d:\\d\\d:\\d\\d'
			, ' (?:UTC|GMT)'
		, ')'
		, '|'
		, '('	// regexp = "/" ... "/"
			, '\\/.+\\/i?g?m?'
		, ')'
		, '|'
		, '('	// func = "[Function]"
			, '\\[Function[^\\]]*\\]'
		, ')'
		, '|'
		, '('	// comobj = "[ActiveXObject]"
			, '\\[ActiveXObject\\]'
		, ')'
		, '|'
		, '('	// circular = "[...]", or "[Circular]"
			, '\\[\\.\\.\\.\\]'
			, '|'
			, '\\[Circular\\]'
		, ')'
		, '|'
		, '('	// any = "Object {", or "Array(...) [", or any
			, '.*'
		, ')'
	, ')'
	, '('		//rest
		, '.*'
	, ')'
	, '$'
	].join(''), 'gm');

	var colorPreprinter = function(
		chunk
	,	head

	,	key
	,	quoteKey
	,	bareKey

	,	val
	,	string
	,	bool
	,	nulls
	,	undef
	,	number
	,	date
	,	regexp
	,	func
	,	comobj
	,	circular

	,	any

	,	rest
	) {
		return head
		+ (
			quoteKey	? C._string(quoteKey) + ': ' :
			bareKey		? bareKey + ': ' : ''
		)
		+ (
			string		? C._string(string) :
			bool		? C._bool(bool) :
			nulls		? C._null(nulls) :
			undef		? C._undef(undef) :
			number		? C._number(number) :
			date		? C._date(date) :
			regexp		? C._regexp(regexp) :
			func		? C._func(func) :
			comobj		? C._comobj(comobj) :
			circular	? C._circular(circular) :
			any
		)
		+ rest;
	};

	var colorPreprint = function(text) {
		return text.replace(re, colorPreprinter);
	};

	var colorEnable = function(preprint) {
		// Use the trick to enable coloring
		// https://www.dostips.com/forum/viewtopic.php?p=63393#p63393
		var shell = new ActiveXObject('WScript.Shell');
		var proc = shell.Exec('powershell -nop -ep bypass -c exit');

		while ( proc.Status == 0 ) {
			WScript.Sleep(50);
		}

		console.fn.preprint = console.fn.colorer.preprint;
	};

	var C = console.fn.colorer = {
		fg: {},
		bg: {},
		preprint: colorPreprint,
		enable: colorEnable
	};

	var E = String.fromCharCode(27);

	var loColors = 'black red green yellow blue magenta cyan white';
	var hiColors = loColors.replace(/(?=[ ]|$)/g, 'Bright');
	var colors = ( loColors + ' ' + hiColors ).split(' ');

	for (var i = 0; i < colors.length; i++) {
		(function(
			i,
			name
		) {
			C.fg[name] = function(text) {
				return E + '[38;5;' + i + 'm' + text + E + '[0m';
			};
			C.bg[name] = function(text) {
				return E + '[48;5;' + i + 'm' + text + E + '[0m';
			};
		})(
			i,
			colors[i]
		);
	}

	C.fg.gray = C.fg.blackBright;
	C.fg.grayBright = C.fg.white;

	C.bg.gray = C.bg.blackBright;
	C.bg.grayBright = C.bg.white;

	C._string = C.fg.green;
	C._bool = C.fg.yellowBright;
	C._null = C.fg.whiteBright;
	C._undef = C.fg.gray;
	C._number = C.fg.yellow;
	C._date = C.fg.magentaBright;
	C._regexp = C.fg.redBright;
	C._func = C.fg.cyan;
	C._comobj = C.fg.cyan;
	C._circular = C.fg.gray;

})();
