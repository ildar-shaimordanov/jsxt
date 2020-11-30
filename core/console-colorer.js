//
// console-colorer.js
// Colorizing feature; requires console
//
// Copyright (c) 2020 by Ildar Shaimordanov
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

*/

(function() {

	var re = new RegExp(
	[ '^'
	, '(\\s*)'	// head = SPACE*
	, '(?:'
		, '('	// quoteKey = QUOTE ... QUOTE
			, '".*"'
		, ')'
		, '|'
		, '('	// bareKey = ...
			, '\\S+'
		, ')'
	, ')'
	, ': '
	, '(?:'
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
			, '(?:Mon|Tue|Wed|Thu|Fi|Sat|Sun)'
			, ', \\d\\d'
			, ' (?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)'
			, ' \\d{4}'
			, ' \\d\\d:\\d\\d:\\d\\d'
			, ' UTC'
		, ')'
		, '|'
		, '('	// regexp = "/" ... "/"
			, '\\/.+\\/'
		, ')'
		, '|'
		, '('	// func = "[Function]"
			, '\\[Function\\]'
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
	, '$'
	].join(''), 'gm');

	var colorPreprinter = function(
		chunk,
		head,

		quoteKey,
		bareKey,

		string,
		bool,
		nulls,
		undef,
		number,
		date,
		regexp,
		func,
		comobj,
		circular,

		any
	) {
		return head
		+ (
			quoteKey	? C._string(quoteKey) : bareKey
		)
		+ ': '
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
		);
	};

	// In rare cases, when console.fn.func == 2, it can colorize parts
	// of function bodies, corresponding objects initialization.
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
	var colors = 'black red green yellow blue magenta cyan white'.split(' ');

	for (var i = 0; i < colors.length; i++) {
		(function(
			i,
			normal,
			bright
		) {
			C.fg[normal] = function(text) {
				return E +  '[3' + i + 'm' + text + E + '[0m';
			};
			C.fg[bright] = function(text) {
				return E +  '[9' + i + 'm' + text + E + '[0m';
			};
			C.bg[normal] = function(text) {
				return E +  '[4' + i + 'm' + text + E + '[0m';
			};
			C.bg[bright] = function(text) {
				return E + '[10' + i + 'm' + text + E + '[0m';
			};
		})(
			i,
			colors[i],
			colors[i] + 'Bright'
		);
	}

	C.fg.gray = C.fg.blackBright;
	C.fg.grayBright = C.fg.white;

	C.bg.gray = C.bg.blackBright;
	C.bg.grayBright = C.bg.white;

	C._string = C.fg.green;
	C._bool = C.fg.yellow;
	C._null = C.fg.whiteBright;
	C._undef = C.fg.gray;
	C._number = C.fg.yellow;
	C._date = C.fg.magenta;
	C._regexp = C.fg.red;
	C._func = C.fg.cyan;
	C._comobj = C.fg.cyan;
	C._circular = C.fg.gray;

})();
