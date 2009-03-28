//
// JavaScript unit
// Extension of the Date object
//
// Copyright (c) 2006 by Ildar N. Shaimordanov aka Rumata
//

if ( ! Date.prototype.getDayName ) {

/**
 * Date.prototype.getDayName
 *
 * @syntax
 * object.getDayName()
 *
 * @description
 * Returns the short or full name of weekday
 *
 * @param	Boolean	full
 * @return	String
 * @access	public
 */
Date.prototype.getDayName = function(full)
{
	var sname = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	var lname = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	return (full ? lname : sname)[this.getDay()];
};

}

if ( ! Date.prototype.getLocaleDayName ) {

/**
 * Date.prototype.getLocaleDayName
 *
 * @syntax
 * object.getLocaleDayName()
 *
 * @description
 * Returns the short or full name of weekday using the current locale
 * This method should be overriden in order to return true value respectively the locale
 *
 * @param	Boolean	full
 * @return	String
 * @access	public
 */
Date.prototype.getLocaleDayName = Date.prototype.getDayName;

}

if ( ! Date.prototype.getMonthName ) {

/**
 * Date.prototype.getMonthName
 *
 * @syntax
 * object.getMonthName()
 *
 * @description
 * Returns the short or full name of month
 *
 * @param	Boolean	full
 * @return	String
 * @access	public
 */
Date.prototype.getMonthName = function(full)
{
	var sname = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var lname = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	return (full ? lname : sname)[this.getMonth()];
};

}

if ( ! Date.prototype.getLocaleMonthName ) {

/**
 * Date.prototype.getLocaleMonthName
 *
 * @syntax
 * object.getLocaleMonthName()
 *
 * @description
 * Returns the short or full name of month using the current locale
 * This method should be overriden in order to return true value respectively the locale
 *
 * @param	Boolean	full
 * @return	String
 * @access	public
 */
Date.prototype.getLocaleMonthName = Date.prototype.getMonthName;

}

if ( ! Date.prototype.getTZ || ! Date.prototype.getTimezone ) {

/**
 * Date.prototype.getTZ
 *
 * @syntax
 * object.getTZ()
 *
 * @description
 * Returns timezone as string like GMT+hhmm
 *
 * @result   String
 */
Date.prototype.getTZ = 
Date.prototype.getTimezone = function()
{
	var tz = Math.abs(this.getTimezoneOffset());
	var h = '00' + Math.floor(tz / 60);
	var m = '00' + (tz % 60);

	var result = 'GMT' 
		+ ( this.getTimezoneOffset() < 0 ? '+' : '-' ) 
		+ h.substr(h.length - 2) 
		+ m.substr(m.length - 2) ;
	return result;
};

}

if ( ! Date.prototype.getDaytime ) {

/**
 * Date.prototype.getDaytime
 *
 * @syntax
 * object.getDaytime()
 *
 * @description
 * Returns day time as string like AM or PM
 *
 * @result   String
 */
Date.prototype.getDaytime = function()
{
	return this.getHours() < 12 ? 'AM' : 'PM';
};

}

if ( ! Date.prototype.getDateToday ) {

/**
 * Date.prototype.getDateToday
 *
 * @syntax
 * object.getDateToday()
 *
 * @description
 * If the year and the month of the actual date are equal the same ones of 
 * the Date object the method returns the day of today elsewhere `false'
 *
 * @result   Integer
 */
Date.prototype.getDateToday = function ()
{
	var here = new Date();
	return (this.getMonth() == here.getMonth() && this.getFullYear() == here.getFullYear()) ? here.getDate() : 0;
};

}

if ( ! Date.prototype.getYearDay ) {

/**
 * Date.prototype.getYearDay
 *
 * @syntax
 * object.getYearDay()
 *
 * @description
 * This method transforms primitive value of the Date object to 
 * number of the year due to the local timezone
 *
 * @result   Integer
 */
Date.prototype.getYearDay = function ()
{
	var here = new Date(this.getTime());
	here.setMonth(0, 1);
	return Math.round((this - here) / (60 * 60 * 24 * 1000));
};

}

if ( ! Date.prototype.getDaysInMonth ) {

/**
 * Date.prototype.getDaysInMonth
 *
 * @syntax
 * object.getDaysInMonth()
 *
 * @description
 * This method transforms primitive value of the Date object to 
 * number of the month due to the local timezone
 *
 * @result   Integer
 */
Date.prototype.getDaysInMonth = function ()
{
	var here = new Date(this.getTime());
	here.setDate(32);
	return 32 - here.getDate();
};

}

if ( ! Date.prototype.getCalendar ) {

/**
 * Date.prototype.getCalendar
 *
 * @syntax
 * object.getCalendar()
 *
 * @description
 * This method transforms primitive value of the Date object to 
 * the 2D-array of days arranged by weeks
 *
 * @result   Array
 */
Date.prototype.getCalendar = function ()
{
	var here = new Date(this.getTime());
	here.setDate(1);
	var fday = here.getDay();
	if (!fday) {
		fday = 7;
	}

	var gdim = this.getDaysInMonth();
	var lday = gdim + fday;
	var wcnt = Math.ceil((gdim + fday) / 7);

	var weeks = new Array(wcnt);
	for (var i = 0; i < wcnt; i++) {
		weeks[i] = new Array(8);
	}
	for (var i = fday; i < lday; i++) {
		weeks[Math.floor(i / 7)][i % 7] = i - fday + 1;
	}
	for (var i = 0; i < wcnt - 1; i++) {
		weeks[i][7] = weeks[i + 1][0];
	}
	return weeks;
};

}

/**

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
};

**/
