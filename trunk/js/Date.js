//
// JavaScript unit
// Extension of the Date object
//
// Copyright (c) 2006, 2011, 2012 by Ildar Shaimordanov
//

/**
 * Parses a date string and returns the number of milliseconds 
 * between the date string and midnight of January 1, 1970. 
 * Extends the standard static method Date.parse allowing 
 * milliseconds in the input. 
 *
 * The second optional argument, matcher is a fucntion 
 * asccepting an input string and splitting it into an array 
 * with two items -- the standard date string and milliseconds. 
 *
 * By default it considers that an input string contains 
 * milliseconds at the end of a string. 
 *
 * The matcher function can be passed directly to the function 
 * or declared globally as parseDate.matcher method. 
 *
 * @param	String
 * @param	Function
 * @return	Number
 * @access	static
 */
function parseDate(v, matcher)
{
	var m = (matcher || arguments.callee.matcher)(v) || [v, 0];
	return Date.parse(m[0]) + (+m[1]);
};

parseDate.matcher = function(v)
{
	var m = v.match(/^(.+)\.(\d{3})$/);
	m && m.shift();
	return m;
};

if ( ! Date.now ) {

/**
 * Creates new Date object with the current date value.
 *
 * @param	void
 * @return	Date
 * @access	static
 */
Date.now = function()
{
	return new Date();
};

}

/**
 * Calculates difference of two dates and returns result as the object with properties:
 * -- milliseconds
 * -- seconds
 * -- minutes
 * -- hours
 * -- days
 *
 * @param	Date	date1
 * @param	Date	date2
 * @param	Boolean	detail
 * @return	Object
 * @access	static
 */
Date.diff = function(date1, date2, detail)
{
	var diff = date1.getTime() - date2.getTime();

	if ( ! detail ) {
		return diff;
	}

	diff = Math.abs(diff);

	var ms = diff % 1000;
	diff /= 1000;

	var s = Math.floor(diff % 60);
	diff /= 60;

	var m = Math.floor(diff % 60);
	diff /= 60;

	var h = Math.floor(diff % 24);
	diff /= 24;

	var d = Math.floor(diff);

	var w = Math.floor(diff / 7);

	return {
		milliseconds: ms,
		seconds: s,
		minutes: m,
		hours: h,
		days: d,
		weeks: w,
		rdays: diff
	};
};

/**
 * Compares the Date object is the same date to compare to.
 * If the Date object is not specified then the current time is used.
 *
 * @param	Date	date1
 * @param	Date	date2
 * @return	Boolean
 * @acceess	public
 */
Date.equal = function(date1, date2)
{
	return Math.abs(Date.diff(dat1, date2)) < 86400000;
};

/**
 * Validates that the current Date object is between range of two Date objects. 
 * This method does not differ minimal and maximal values of the range. 
 * At least, they should be instances of Date object and identify edge of the range. 
 *
 * @param	Date	date
 * @param	Date	date1
 * @param	Date	date2
 * @return	Boolean
 * @access	public
 */
Date.between = function(date, date1, date2)
{
	var d1 = date1.getTime();
	var d2 = date2.getTime();

	var c = date.getTime();

	var a = Math.min(d1, d2);
	var b = Math.max(d1, d2);

	return c >= a && c <= b;
};

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

/**
 * Date.prototype.getDayOfYear
 *
 * @syntax
 * object.getDayOfYear()
 *
 * @description
 * This method transforms primitive value of the Date object to 
 * number of the day due to the local timezone
 *
 * @result   Integer
 */
Date.prototype.getDayOfYear = function ()
{
	var here = new Date(this.getTime());
	here.setMonth(0, 1);
	return 1 + Math.round((this - here) / (60 * 60 * 24 * 1000));
};

/**
 * Date.prototype.getWeekOfYear
 *
 * @syntax
 * object.getWeekOfYear()
 *
 * @description
 * This method transforms primitive value of the Date object to 
 * number of the week due to the local timezone
 *
 * @result   Integer
 */
Date.prototype.getWeekOfYear = function ()
{
	var here = new Date(this.getTime());
	here.setMonth(0, 1);
	return Math.ceil((this - here) / (7 * 60 * 60 * 24 * 1000));
};

/**
 * Date.prototype.getDaysInMonth
 *
 * @syntax
 * object.getDaysInMonth()
 *
 * @description
 * This method transforms primitive value of the Date object to 
 * number of days in the month due to the local timezone
 *
 * @result   Integer
 */
Date.prototype.getDaysInMonth = function()
{
	return (new Date(this.getFullYear(), this.getMonth() + 1, 0)).getDate();
};

/**
 * Date.prototype.getDaysInYear
 *
 * @syntax
 * object.getDaysInYear()
 *
 * @description
 * Returns the number of days in the year corresponding this Date
 *
 * @result   Integer
 */
Date.prototype.getDaysInYear = function()
{
	return this.isLeapYear() ? 366 : 365;
};

/**
 * Date.prototype.getWorkingDaysInMonth
 *
 * @syntax
 * object.getWorkingDaysInMonth()
 *
 * @description
 * This method transforms primitive value of the Date object to 
 * number of working days in the month due to the local timezone. 
 *
 * The callback is invoked to pass the actual amount of holiday 
 * days for this month. It is invoked with the single argument 
 * referencing to the Date object. 
 *
 * Pass a non-false value to the second argument to consider 
 * a 6 days' wroking week. 
 *
 * @param	Integer
 * @param	Callback|Integer
 * @result	Integer
 * @access	public
 */
Date.prototype.getWorkingDaysInMonth = function(longWeek, holidays)
{
	var here = new Date(this.getFullYear(), this.getMonth() + 1, 0);
	var dim = here.getDate();
	var ldm = here.getDay();

	var t = typeof holidays;
	var h = 
		t == 'number' 
		? holidays 
		: t == 'function' 
		? holidays(this) 
		: 0;

	return arguments.callee[longWeek ? 6 : 5][dim][ldm] - h;
};
/*
Date.prototype.getWorkingDaysInMonth = function(longWeek, func)
{
	var dim = this.getDaysInMonth();
	var ldm = this.getLastDay();

	var holidays = typeof func == 'function' ? func(this) : 0;

	return arguments.callee[longWeek ? 6 : 5][dim][ldm] - holidays;
};
*/

// Weekday of the last day in month
// Short week - 5 days' week
Date.prototype.getWorkingDaysInMonth[5] = {
	//   Sun Mon Tue Wed Thu Fri Sat
	28: [20, 20, 20, 20, 20, 20, 20],
	29: [20, 21, 21, 21, 21, 21, 20],
	30: [20, 21, 22, 22, 22, 22, 21],
	31: [21, 21, 22, 23, 23, 23, 22]
};

// Long week - 6 days' week
Date.prototype.getWorkingDaysInMonth[6] = {
	//   Sun Mon Tue Wed Thu Fri Sat
	28: [24, 24, 24, 24, 24, 24, 24],
	29: [24, 25, 25, 25, 25, 25, 25],
	30: [25, 25, 26, 26, 26, 26, 26],
	31: [26, 26, 26, 27, 27, 27, 27]
};

/**
 * Date.prototype.getFirstDay
 *
 * @syntax
 * object.getFirstDay()
 *
 * @description
 * Returns the numeric value of weekday for 
 * the first day of a month of this date object
 *
 * @result	Integer
 * @acess	public
 */
Date.prototype.getFirstDay = function()
{
	return (new Date(this.getFullYear(), this.getMonth(), 1)).getDay();
};

/**
 * Date.prototype.getLastDay
 *
 * @syntax
 * object.getLastDay()
 *
 * @description
 * Returns the numeric value of weekday for 
 * the last day of a month of this date object
 *
 * @result	Integer
 * @acess	public
 */
Date.prototype.getLastDay = function()
{
	return (new Date(this.getFullYear(), this.getMonth() + 1, 0)).getDay();
};

/**
 * NOTE!!! 
 * The original code of this method can be found by the following link: 
 * http://svn.debugger.ru/repos/jslibs/BrowserExtensions/trunk/ext/date.js
 * @author
 * Ilya Lebedev
 *
 *  return year according to Iso notation
 *
 *  @return int year number
 *  @access public
 */
Date.prototype.getIsoYear = function()
{
	var d = this.getDayOfYear();
	var j1 = (new Date(this.getFullYear(), 0, 1)).getIsoDay();
	var y = this.getFullYear();
	if ( d <= (8 - j1) && j1 > 4 ) {
		return y - 1;
	} else if ( ( this.getDaysInYear() - d ) < ( 4 - this.getIsoDay() ) ) {
		return y + 1;
	} else {
		return y;
	}
};

/**
 * NOTE!!! 
 * The original code of this method can be found by the following link: 
 * http://svn.debugger.ru/repos/jslibs/BrowserExtensions/trunk/ext/date.js
 * @author
 * Ilya Lebedev
 *
 *  find day number in ISO notation (Mon = 1, Sun=7)
 *
 *  @return day number
 *  @access public
 */
Date.prototype.getIsoDay = function()
{
	var y = this.getFullYear();
	var yy = (y - 1) % 100;
	var c = (y - 1) - yy;
	var g = yy + Math.floor(yy/4);
	var j1 = 1 + ((((Math.floor(c / 100) % 4) * 5) + g) % 7);
	return (1 + ((this.getDayOfYear() + (j1 - 1) - 1) % 7));
};

/**
 * NOTE!!! 
 * The original code of this method can be found by the following link: 
 * http://svn.debugger.ru/repos/jslibs/BrowserExtensions/trunk/ext/date.js
 * @author
 * Ilya Lebedev
 *
 *  return week number in ISO notation
 *
 *  @return int week number
 *  @access public
 */
Date.prototype.getIsoWeek = function()
{
	var y = this.getFullYear();
	var yi = this.getIsoYear();
	var j1 = (new Date(y, 0, 1)).getIsoDay();
	if ( yi < y ) {
		if ( j1 == 5 || ( j1 == 6 && (new Date(yi, 0, 1)).isLeapYear() ) ) {
			w = 53;
		} else {
			w = 52;
		}
	} else if (yi > y) {
		w = 1;
	} else {
		var w = Math.floor((this.getDayOfYear() + (7 - this.getIsoDay()) + (j1 - 1)) / 7);
		if ( j1 > 4 ) {
			w -= 1;
		}
	}
	return w;
};

if ( ! Date.prototype.toISOString ) {

/**
 * Return a Date object as a String, using the ISO standard
 *
 * @syntax
 * object.toISOString()
 *
 * @param	Date
 * @return	Date
 * @access	public
 *
 * @link	http://en.wikipedia.org/wiki/ISO_8601
 */
Date.prototype.toISOString = (function()
{
	var pad = function(n)
	{
		return ('00' + n).slice(-2);
	};

	return function()
	{
		return [
			this.getUTCFullYear(), 
			'-', 
			pad(1 + this.getUTCMonth()), 
			'-', 
			pad(this.getUTCDate()), 
			'T', 
			pad(this.getUTCHours()), 
			':', 
			pad(this.getUTCMinutes()), 
			':', 
			pad(this.getUTCSeconds()), 
			'.', 
			(this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5), 
			'Z'
		].join('');
	};
})();

}

/**
 * Sets the day of the week value of the Date object using local time. 
 * 
 * The weekday is an integer between 0 and 6 representing the day of 
 * the week and corresponds to the day of the week as follows:
 * 0 - Sunday
 * 1 - Monday
 * 2 - Tuesday
 * 3 - Wednesday
 * 4 - Thurday
 * 5 - Friday
 * 6 - Saturday
 * 
 * If the second argument is defined then it sets to the week number 
 * when this day of the week ocurs. It is the number of the week 
 * (the first week of the month is 0). 
 *
 * @param	Integer	Required. A numeric value of the day of the week. 
 * @param	Integer	Optional. A numeric value of the week of the month. 
 * @param	Date
 * @access	public
 */
Date.prototype.setDay = function(w, n)
{
	// Get the reference to the Date object
	var x = this;
	// Set the date to the first day of the month
	x.setDate(1);
	// Calculate the distance to the nearest required weekday
	var d = w - x.getDay() + 1;
	if ( d < 0 ) {
		d += 7;
	}
	// Calculate the date corresponding to the required weekday
	d += (n || 0) * 7;
	// Set the date and return the result as all methods do
	return x.setDate(d);
};

/**
 * Date.prototype.isLeapYear
 *
 * @syntax
 * object.isLeapYear()
 *
 * @description
 * Evaluates the Date object that it corresponds to the leap year
 *
 * @result   Boolean
 */
Date.prototype.isLeapYear = function()
{
	var y = this.getFullYear();
	return y % 4 == 0 && y % 100 != 0 || y % 400 == 0;
};

/**
 * Date.calendar
 *
 * @syntax
 * object.getCalendar()
 *
 * @description
 * This method transforms primitive value of the Date object to 
 * the 2D-array of days arranged by weeks
 *
 * @example
 * var weekstart = 1;
 * var namesOfWeekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
 * var padding = function (x)
 * {
 * 	return ! x ? '    ' : '  ' + (x < 10 ? ' ' : '') + x;
 * };
 * 
 * var now = new Date();
 * var cal = Date.calendar(now);
 * 
 * // Example will output vertically oriented weeks
 * var result = '';
 * for (var j = 0; j < 7; j++) {
 *     result += ' ' + namesOfWeekDays[j + weekstart];
 *     for (var i = 0; i < cal.length; i++) {
 *         result += padding(cal[i][j + weekstart]);
 *     }
 *     result += '\n';
 * }
 * 
 * // Example will output horizontally oriented weeks
 * var result = '';
 * for (var j = 0; j < 7; j++) {
 *     result += ' ' + namesOfWeekDays[j + weekstart];
 * }
 * result += '\n';
 * for (var i = 0; i < cal.length; i++) {
 *     for (var j = 0; j < 7; j++) {
 *         result += padding(cal[i][j + weekstart]);
 *     }
 *     result += '\n';
 * }
 *
 * @result   Array
 */
Date.calendar = function(date)
{
	date = date || new Date();

	var fday = (new Date(date.getFullYear(), date.getMonth(), 1)).getDay();
	if (!fday) {
		fday = 7;
	}

	var gdim = (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate();
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

/**
 * Moves the actual Date object to the start of day corresponding to the midnight. 
 * This mthod modifies the Date object. 
 *
 * @param	Date
 * @return	Date
 * @access	public
 */
Date.midnight = function(date)
{
	date = date || new Date();

	date.setMilliseconds(0);
	date.setSeconds(0);
	date.setMinutes(0);
	date.setHours(0);
	return date;
};

/**
 * Creates new Date object with the current date value.
 * Adjust the date to the start of day corresponding to the midnight.
 *
 * @param	Boolean	midnight
 * @return	Date
 * @access	static
 */
Date.today = function(midnight)
{
	var here = new Date();
	if ( midnight ) {
		Date.midnight(here);
	}
	return here;
};

/**
 * Creates new Date object with the yesterday date value.
 * Adjust the date to the start of day corresponding to the midnight.
 *
 * @param	Boolean	midnight
 * @return	Date
 * @access	static
 */
Date.yesterday = function(midnight)
{
	var here = Date.today(midnight);
	here.setDate(here.getDate() - 1);
	return here;
};

/**
 * Creates new Date object with the tomorrow date value.
 * Adjust the date to the start of day corresponding to the midnight.
 *
 * @param	Boolean	midnight
 * @return	Date
 * @access	static
 */
Date.tomorrow = function(midnight)
{
	var here = Date.today(midnight);
	here.setDate(here.getDate() + 1);
	return here;
};

/**
 * Moves the actual Date object accordingly the provided parameters. 
 * Available paramters are properties of the Object object:
 * -- milliseconds
 * -- seconds
 * -- minutes
 * -- hours
 * -- date
 * -- week
 * -- year
 *
 * This method modifies the Date object.
 *
 * @param	Object	to
 * @param	Boolean	exactly
 * @return	Date
 * @access	public
 */
Date.moveTo = function(date, to, exactly)
{
	var part;
	if ( exactly ) {
		if ( part = Number(to.milliseconds) ) {
			date.setMilliseconds(part);
		}
		if ( part = Number(to.seconds) ) {
			date.setSeconds(part);
		}
		if ( part = Number(to.minutes) ) {
			date.setMinutes(part);
		}
		if ( part = Number(to.hours) ) {
			date.setHours(part);
		}
		if ( part = Number(to.date) ) {
			date.setDate(part);
		}
		if ( part = Number(to.week) ) {
			date.setDate(part * 7);
		}
		if ( part = Number(to.month) ) {
			date.setMonth(part);
		}
		if ( part = Number(to.year) ) {
			date.setFullYear(part);
		}
	} else {
		if ( part = Number(to.milliseconds) ) {
			date.setMilliseconds(date.getMilliseconds() + part);
		}
		if ( part = Number(to.seconds) ) {
			date.setSeconds(date.getSeconds() + part);
		}
		if ( part = Number(to.minutes) ) {
			date.setMinutes(date.getMinutes() + part);
		}
		if ( part = Number(to.hours) ) {
			date.setHours(date.getHours() + part);
		}
		if ( part = Number(to.date) ) {
			date.setDate(date.getDate() + part);
		}
		if ( part = Number(to.week) ) {
			date.setDate(date.getDate() + part * 7);
		}
		if ( part = Number(to.month) ) {
			date.setMonth(date.getMonth() + part);
		}
		if ( part = Number(to.year) ) {
			date.setFullYear(date.getFullYear() + part);
		}
	}
	return date;
};

/**
 * Date.moveMilliseconds(date, to, exactly)
 * Date.moveSeconds(date, to, exactly)
 * Date.moveMinutes(date, to, exactly)
 * Date.moveHours(date, to, exactly)
 * Date.moveDate(date, to, exactly)
 * Date.moveWeek(date, to, exactly)
 * Date.moveMonth(date, to, exactly)
 * Date.moveYear(date, to, exactly)
 *
 * These methods modify the actual date for the particular date part
 */
(function()
{

var parts = 'Milliseconds Seconds Minutes Hours Date Week Month Year'.split(/\s+/);
for (var i = 0; i < parts.length; i++) {
	(function()
	{
		var m = 'move' + parts[i];
		var p = parts[i].toLowerCase();
		Date[m] = function(date, to, exactly)
		{
			var o = {};
			o[p] = to;
			return Date.moveTo(date, o, exactly);
		};
	})();
}

})();

/**
 * Moves the actual Date object to the definite weekday forward
 * This method modifies the Date object.
 *
 * @param	Number	to
 * @return	Date
 * @access	public
 */
Date.moveNextWeekday = function(date, to)
{
	var d = to - date.getDay();
	if ( d <= 0 ) {
		d += 7;
	}

	date.setDate(date.getDate() + d);
	return date;
};

/**
 * Moves the actual Date object to the definite weekday backward
 * This method modifies the Date object.
 *
 * @param	Number	to
 * @return	Date
 * @access	public
 */
Date.movePreviousWeekday = function(date, to)
{
	var d = to - date.getDay();
	if ( d >= 0 ) {
		d -= 7;
	}

	date.setDate(date.getDate() + d);
	return date;
};

/**
 * NOTE!!! 
 * The original code of this method can be found by the following link: 
 * http://svn.debugger.ru/repos/jslibs/BrowserExtensions/trunk/ext/date.js
 * @author
 * Ilya Lebedev
 *
 *  Converts Date object to formatted string
 *
 *  @description
 *  Possible formatting options
 *    %a - abbreviated weekday name according to the current locale
 *    %A - full weekday name according to the current locale
 *    %b - abbreviated month name according to the current locale
 *    %B - full month name according to the current locale
 *    %c - preferred date and time representation for the current locale
 *    %C - century number (the year divided by 100 and truncated to an integer, range 00 to 99)
 *    %d - day of the month as a decimal number (range 01 to 31)
 *    %D - same as %m/%d/%y
 *    %e - day of the month as a decimal number, a single digit is preceded by a space (range ' 1' to '31')
 *    %g - like %G, but without the century.
 *    %G - The 4-digit year corresponding to the ISO week number (see %V). 
 *         self has the same format and value as %Y, except that if the ISO week number belongs 
 *         to the previous or next year, that year is used instead.
 *    %h - same as %b
 *    %H - hour as a decimal number using a 24-hour clock (range 00 to 23)
 *    %I - hour as a decimal number using a 12-hour clock (range 01 to 12)
 *    %j - day of the year as a decimal number (range 001 to 366)
 *    %m - month as a decimal number (range 01 to 12)
 *    %M - minute as a decimal number
 *    %n - newline character
 *    %p - either `am' or `pm' according to the given time value, or the corresponding strings for the current locale
 *    %r - time in a.m. and p.m. notation
 *    %R - time in 24 hour notation
 *    %S - second as a decimal number
 *    %t - tab character
 *    %T - current time, equal to %H:%M:%S
 *    %V - The ISO 8601:1988 week number of the current year as a decimal number, range 01 to 53, 
 *         where week 1 is the first week that has at least 4 days in the current year, 
 *         and with Monday as the first day of the week. 
 *         (Use %G or %g for the year component that corresponds to the week number for the specified timestamp.)
 *    %u - weekday as a decimal number [1,7], with 1 representing Monday
 *    %U - week number of the current year as a decimal number, starting with the first Sunday as the first day of the first week
 *    %w - day of the week as a decimal, Sunday being 0
 *    %W - week number of the current year as a decimal number, starting with the first Monday as the first day of the first week
 *    %x - preferred date representation for the current locale without the time
 *    %X - preferred time representation for the current locale without the date
 *    %y - year as a decimal number without a century (range 00 to 99)
 *    %Y - year as a decimal number including the century
 *    %Z or %z - time zone or name or abbreviation
 *
 *  @link http://php.net/strftime
 *
 *  @param string optional date format
 *  @param string optional single char spacer, used to pad short values
 *  @return string formatted Date
 *  @access public
 */
Date.format = function (format, date, spacer)
{
	date = date || new Date();

	if ( ! format ) {
		return date.toString();
	}

	var spacer = (spacer || '0').charAt(0);

	Date.locale = Date.locale || Date.english;
	for (var p in Date.english) {
		if ( ! Date.locale.hasOwnProperty(p) ) {
			Date.locale[p] = Date.english[p];
		}
	}

	return String(format).replace(/%(\w)/g, function($0, $1)
	{
		switch ($1) {
		case 'a': return Date.locale.SWEEK[date.getDay()];
		case 'A': return Date.locale.LWEEK[date.getDay()];
		case 'h': 
		case 'b': return Date.locale.SMONTH[date.getMonth()];
		case 'B': return Date.locale.LMONTH[date.getMonth()];
		case 'c': return Date.locale.DATETIME(date, spacer);
		case 'C': return Math.round(date.getFullYear() / 100);
		case 'd': return Date.format.pad(date.getDate(), 2, spacer);
		case 'D': return Date.format("%m/%d/%y", date, spacer);
		case 'e': return Date.format.pad(date.getDate(), 2, ' ');
		case 'g': return String(date.getIsoYear()).slice(-2);
		case 'G': return date.getIsoYear();
		case 'H': return Date.format.pad(date.getHours(), 2, spacer);
		case 'I': return Date.format.pad(date.getHours() > 12 ? date.getHours() - 12 : date.getHours(), 2, spacer);
		case 'j': return Date.format.pad(date.getDayOfYear(), 3, spacer);
		case 'm': return Date.format.pad(date.getMonth() + 1, 2, spacer);
		case 'M': return Date.format.pad(date.getMinutes(), 2, spacer);
		case 'n': return "\n";
		case 'p': return date.getDaytime();
		case 'r': return Date.format("%I:%M:%S %p", date, spacer);
		case 'R': return Date.format("%H:%M", date, spacer);
		case 'S': return Date.format.pad(date.getSeconds(), 2, spacer);
		case 't': return "\t";
		case 'T': return Date.format("%H:%M:%S", date, spacer);
		case 'u': return date.getIsoDay();
		case 'U': return Date.format.pad(parseInt((date.getDayOfYear() - 1 - date.getIsoDay() + 13) / 7 - 1), 2, "0");
		case 'V': return Date.format.pad(date.getIsoWeek(), 2, spacer);
		case 'w': return date.getDay();
		case 'W': return Date.format.pad(parseInt((date.getDayOfYear() - 1 - date.getDay() + 13) / 7 - 1), 2, "0");
		case 'x': return Date.locale.DATE(date, spacer);
		case 'X': return Date.locale.TIME(date, spacer);
		case 'y': return String(date.getFullYear()).slice(-2);
		case 'Y': return date.getFullYear();
		case 'z': 
		case 'Z': return date.getTimezoneOffset() / 60;
		}
		return $1;
	})
};
Date.format.pad = function(v, n, c)
{
	var s = new Array(Math.abs(n) + 1).join(c.charAt(0));
	return n < 0 ? (v + s).slice(0, n) : (s + v).slice(-n)
};
Date.english = {
	SWEEK:  'Sun Mon Tue Wed Thu Fri Sat'.split(/\s+/), 
	LWEEK:  'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(/\s+/), 
	SMONTH: 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(/\s+/), 
	LMONTH: 'January February March April May June July August September October November December'.split(/\s+/), 
	DATE: function(date, spacer)
	{
		return date.toLocaleDateString();
	}, 
	TIME: function(date, spacer)
	{
		return date.toLocaleTimeString();
	}, 
	DATETIME: function(date, spacer)
	{
		return date.toLocaleString();
	}
};

