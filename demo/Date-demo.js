//
// control variables
//
var transpose = false;
var transpose = true;

var weekstart = 0;
var weekstart = 1;

var year = 2006;

//
// main loop
//
var time = new Date();
time.setFullYear(year);

var s = '\t\t' + time.getFullYear() + '\n';
for (var i = 0; i < 12; i++) {
	time.setMonth(i);
	s += simple(time);
}

//
// universal output
//
try {
	if (document) { document.writeln(s); }
} catch (e) {
	WScript.Echo(s);
}

//
// auxiliary routine
//
function simple(time, tr)
{
        var w = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        var m = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	var padding = function (x, y) { return !x ? '    ' : '  ' + (x < 10 ? ' ' : '') + (x == y ? '<b><u>' + x + '</u></b>' : x); }

	var cal = time.getCalendar();

	var today = time.getDateToday();

	var result = '';
	result += '\t\t' + m[time.getMonth()];
	result += ' (' + time.getDaysInMonth() + ')';
	result += '\n';
	if (transpose) {
		for (var j = 0; j < 7; j++) {
			result += ' ' + w[j + weekstart];
			for (var i = 0; i < cal.length; i++) { result += padding(cal[i][j + weekstart], today); }
			result += '\n'
		}
	} else {
		for (var j = 0; j < 7; j++) { result += ' ' + w[j + weekstart]; }
		result += '\n';
		for (var i = 0; i < cal.length; i++) {
			for (var j = 0; j < 7; j++) { result += padding(cal[i][j + weekstart], today); }
			result += '\n';
		}
	}
	return result;
}

