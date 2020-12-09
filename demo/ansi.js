/*

Parse the specified text from the input file or pipe and output it
accordingly the ANSI codes provided within the text.

Escaping

Interpret the following escaped characters:
  \a        Bell
  \b        Backspace
  \e        Escape character
  \f        Form feed
  \n        New line
  \r        Carriage return
  \t        Horizontal tabulation
  \v        Vertical tabulation
  \\        Backslash
  \0nnn     The character by its ASCII code (octal)
  \xHH      The character by its ASCII code (hexadecimal)

ANSI sequences

  <ESC> [ <list> <code>

  <ESC>     Escape character in the form "\e", "\033", "\x1B", "^["
  <list>    The list of numeric codes
  <code>    The sequence code

Moves the cursor n (default 1) cells in the given direction. If the cursor
is already at the edge of the screen, this has no effect.
  \e[nA     Cursor Up
  \e[nB     Cursor Down
  \e[nC     Cursor Forward
  \e[nD     Cursor Back

Moves cursor to beginning of the line n (default 1).
  \e[nE     Cursor Next Line
  \e[nF     Cursor Previous Line

Cursor position
  \e[nG     Moves the cursor to column n.
  \e[n;mH   Moves the cursor to row n, column m.
  \e[n;mf   The same as above.

Erasing
  \e[nJ     Clears part of the screen. If n is 0 (or missing), clear from
            cursor to end of screen. If n is 1, clear from cursor to
            beginning of the screen. If n is 2, clear entire screen.
  \e[nK     Erases part of the line. If n is zero (or missing), clear from
            cursor to the end of the line. If n is one, clear from cursor
            to beginning of the line. If n is two, clear entire line.
            Cursor position does not change.

Colorizing
  \e[n1[;n2;...]m, where n's are as follows:

  0         All attributes off
  1         Increase intensity
  2         Faint (decreased intensity)
  3         Italic (not widely supported)
  4         Underline
  5         Slow blink
  6         Rapid blink
  7         Reverse (invert the foreground and background colors)
  8-29      Rarely supported
  30-37     Set foreground color (30+x, where x from the tables below)
  38        Set foreground color (Next arguments are 5;n or 2;r;g;b)
  39        Default foreground text color
  40-47     Set background color (40+x)
  48        Set foreground color (Next arguments are 5;n or 2;r;g;b)
  49        Default background color
  50-74     Rarely supported
  90-97     Set foreground color, high intensity (90+x)
  100-107   Set background color, high intensity (100+x)

ANSI colors (default usage)
  Intensity 0       1       2       3       4       5       6       7
  Normal    Black   Red     Green   Yellow  Blue    Magenta Cyan    White
  Bright    Black   Red     Green   Yellow  Blue    Magenta Cyan    White

References

http://en.wikipedia.org/wiki/ANSI_escape_code
http://misc.flogisoft.com/bash/tip_colors_and_formatting
http://stackoverflow.com/a/24273024/3627676
http://www.robvanderwoude.com/ansi.php#AnsiArt

*/

function ansi(text, options) {
	options = options || {};

	text = String(text);

	if ( options.safe ) {
		text += '\\e[0m';
	}

	var chars = {
		'a': String.fromCharCode(7),
		'b': '\b',
		'e': String.fromCharCode(27),
		'f': '\f',
		'n': '\n',
		'r': '\r',
		't': '\t',
		'v': '\v',
		'\\': '\\'
	};

	var re_src = [
		'(?:\\\\(' + '[abefnrtv\\\\]' + '))'	// Escaped chars above
	,       '|'
	,       '(?:\\\\(' + '0[0-7]{1,3}' + '))'	// ASCII code (oct)
	,       '|'
	,       '(?:\\\\(' + 'x[0-9a-fA-F]{1,2}' + '))'	// ASCII code (hex)
	,	'|'
	,	'(' + '\\^\\[' + ')'			// ^[ stands for <ESC>
	].join('');

	if ( options.no_eol && options.no_space ) {
		re_src += '|[ ](?:\\r?\\n|$)';
	} else if ( options.no_eol ) {
		re_src += '|\\r?\\n';
	} else if ( options.no_space ) {
		re_src += '|[ ](?=\\r?\\n|$)';
	}

	var re = new RegExp(re_src, 'g');

	return text.replace(re, function($0, $1, $2, $3, $4) {
		return $1 ? chars[$1] :
			$2 ? String.fromCharCode(parseInt($2)) :
			$3 ? String.fromCharCode(parseInt('0' + $3)) :
			$4 ? chars.e : '';
	});
};

ansi.enable = function() {
	// Don't rely on settings in the Registry:
	// HKCU\\Console\\VirtualTerminalLevel

	// The following trick was found in this thread:
	// https://www.dostips.com/forum/viewtopic.php?p=63393#p63393
	var trick = shell.Exec("powershell -nop -ep bypass -c exit");
	while ( trick.Status == 0 ) {
		WScript.Sleep(100);
	}
};

if (typeof exports !== "undefined") {
	exports.ansi = ansi;
}
