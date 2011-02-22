//
// JavaScript unit
// Extension of the Date object
//
// Copyright (c) 2006 by Ildar N. Shaimordanov aka Rumata
//

Date.english = {
	WEEKDAY_SHORT: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	WEEKDAY_LONG: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	MONTH_SHORT: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	MONTH_LONG: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
};

Date.locale = {
	WEEKDAY_SHORT: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	WEEKDAY_LONG: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	MONTH_SHORT: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	MONTH_LONG: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
};

if ( ! Date.prototype.getDayShortName ) {

/**
 * Date.prototype.getDayShortName
 *
 * @syntax
 * object.getDayShortName()
 *
 * @description
 * Returns the short name of weekday
 *
 * @param	void
 * @return	String
 * @access	public
 */
Date.prototype.getDayShortName = function()
{
	return Date.english.WEEKDAY_SHORT[this.getDay()];
};

}

if ( ! Date.prototype.getDayLongName ) {

/**
 * Date.prototype.getDayLongName
 *
 * @syntax
 * object.getDayLongName()
 *
 * @description
 * Returns the long name of weekday
 *
 * @param	void
 * @return	String
 * @access	public
 */
Date.prototype.getDayLongName = function()
{
	return Date.english.WEEKDAY_LONG[this.getDay()];
};

}

if ( ! Date.prototype.getLocaleDayShortName ) {

/**
 * Date.prototype.getLocaleDayShortName
 *
 * @syntax
 * object.getLocaleDayShortName()
 *
 * @description
 * Returns the short name of weekday using the current locale
 *
 * @param	void
 * @return	String
 * @access	public
 */
Date.prototype.getLocaleDayShortName = function()
{
	return Date.locale.WEEKDAY_SHORT[this.getDay()];
};

}

if ( ! Date.prototype.getLocaleDayLongName ) {

/**
 * Date.prototype.getLocaleDayLongName
 *
 * @syntax
 * object.getLocaleDayLongName()
 *
 * @description
 * Returns the long name of weekday using the current locale
 *
 * @param	void
 * @return	String
 * @access	public
 */
Date.prototype.getLocaleDayLongName = function()
{
	return Date.locale.WEEKDAY_LONG[this.getDay()];
};

}

if ( ! Date.prototype.getMonthShortName ) {

/**
 * Date.prototype.getMonthShortName
 *
 * @syntax
 * object.getMonthShortName()
 *
 * @description
 * Returns the short name of month
 *
 * @param	void
 * @return	String
 * @access	public
 */
Date.prototype.getMonthShortName = function()
{
	return Date.english.MONTH_SHORT[this.getMonth()];
};

}

if ( ! Date.prototype.getMonthLongName ) {

/**
 * Date.prototype.getMonthLongName
 *
 * @syntax
 * object.getMonthLongName()
 *
 * @description
 * Returns the long name of month
 *
 * @param	void
 * @return	String
 * @access	public
 */
Date.prototype.getMonthLongName = function()
{
	return Date.english.MONTH_LONG[this.getMonth()];
};

}

if ( ! Date.prototype.getLocaleMonthShortName ) {

/**
 * Date.prototype.getLocaleMonthShortName
 *
 * @syntax
 * object.getLocaleMonthShortName()
 *
 * @description
 * Returns the short name of month using the current locale
 *
 * @param	void
 * @return	String
 * @access	public
 */
Date.prototype.getLocaleMonthShortName = function()
{
	return Date.locale.MONTH_SHORT[this.getMonth()];
};

}

if ( ! Date.prototype.getLocaleMonthLongName ) {

/**
 * Date.prototype.getLocaleMonthLongName
 *
 * @syntax
 * object.getLocaleMonthLongName()
 *
 * @description
 * Returns the long name of month
 *
 * @param	void
 * @return	String
 * @access	public
 */
Date.prototype.getLocaleMonthLongName = function()
{
	return Date.locale.MONTH_LONG[this.getMonth()];
};

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

if ( ! Date.prototype.getDayOfYear ) {

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

}

if ( ! Date.prototype.getWeekOfYear ) {

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
 * number of days in the month due to the local timezone
 *
 * @result   Integer
 */
Date.prototype.getDaysInMonth = function()
{
	return (new Date(this.getFullYear(), this.getMonth() + 1, 0)).getDate();
};

/*
Date.prototype.getDaysInMonth = function ()
{
	var here = new Date(this.getTime());
	here.setDate(32);
	return 32 - here.getDate();
};
*/

}

if ( ! Date.prototype.getWorkingDaysInMonth ) {

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
 * @param	Callback
 * @result	Integer
 * @access	public
 */
Date.prototype.getWorkingDaysInMonth = function(longWeek, func)
{
	var dim = this.getDaysInMonth();
	var ldm = this.getLastDay();

//	var here = new Date(
//		x.getFullYear(), 
//		x.getMonth(), 
//		dim);
//
//	var ldm = here.getDay();

	var holidays = typeof func == 'function' ? func(this) : 0;

	return arguments.callee[longWeek ? 6 : 5][dim][ldm] - holidays;
};

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

};

if ( ! Date.prototype.getFirstDay ) {

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

}

if ( ! Date.prototype.getLastDay ) {

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

}

if ( ! Date.prototype.getDaysInYear ) {

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
 * @example
 * var weekstart = 1;
 * var namesOfWeekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
 * var padding = function (x)
 * {
 * 	return ! x ? '    ' : '  ' + (x < 10 ? ' ' : '') + x;
 * };
 * 
 * var now = new Date();
 * var cal = now.getCalendar();
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

if ( ! Date.prototype.getIsoYear ) {

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

}

if ( ! Date.prototype.getIsoDay ) {

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

}

if ( ! Date.prototype.getIsoWeek ) {

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

}

if ( ! Date.prototype.isLeapYear ) {

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

}

if ( ! Date.prototype.moveTo ) {

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
Date.prototype.moveTo = function(to, exactly)
{
	var part;
	if ( exactly ) {
		if ( part = Number(to.milliseconds) ) {
			this.setMilliseconds(part);
		}
		if ( part = Number(to.seconds) ) {
			this.setSeconds(part);
		}
		if ( part = Number(to.minutes) ) {
			this.setMinutes(part);
		}
		if ( part = Number(to.hours) ) {
			this.setHours(part);
		}
		if ( part = Number(to.date) ) {
			this.setDate(part);
		}
		if ( part = Number(to.week) ) {
			this.setDate(part * 7);
		}
		if ( part = Number(to.month) ) {
			this.setMonth(part);
		}
		if ( part = Number(to.year) ) {
			this.setFullYear(part);
		}
	} else {
		if ( part = Number(to.milliseconds) ) {
			this.setMilliseconds(this.getMilliseconds() + part);
		}
		if ( part = Number(to.seconds) ) {
			this.setSeconds(this.getSeconds() + part);
		}
		if ( part = Number(to.minutes) ) {
			this.setMinutes(this.getMinutes() + part);
		}
		if ( part = Number(to.hours) ) {
			this.setHours(this.getHours() + part);
		}
		if ( part = Number(to.date) ) {
			this.setDate(this.getDate() + part);
		}
		if ( part = Number(to.week) ) {
			this.setDate(this.getDate() + part * 7);
		}
		if ( part = Number(to.month) ) {
			this.setMonth(this.getMonth() + part);
		}
		if ( part = Number(to.year) ) {
			this.setFullYear(this.getFullYear() + part);
		}
	}
	return this;
};

}

if ( ! Date.prototype.moveMilliseconds ) {

/**
 * Moves the actual Date object for defined value of milliseconds. 
 * This method modifies the Date object.
 *
 * @param	Number	to
 * @param	Boolean	exactly
 * @return	Date
 * @access	public
 */
Date.prototype.moveMilliseconds = function(to, exactly)
{
	return this.moveTo({milliseconds: to}, exactly);
};

}

if ( ! Date.prototype.moveSeconds ) {

/**
 * Moves the actual Date object for defined value of seconds. 
 * This method modifies the Date object.
 *
 * @param	Number	to
 * @param	Boolean	exactly
 * @return	Date
 * @access	public
 */
Date.prototype.moveSeconds = function(to, exactly)
{
	return this.moveTo({seconds: to}, exactly);
};

}

if ( ! Date.prototype.moveMinutes ) {

/**
 * Moves the actual Date object for defined value of minutes. 
 * This method modifies the Date object.
 *
 * @param	Number	to
 * @param	Boolean	exactly
 * @return	Date
 * @access	public
 */
Date.prototype.moveMinutes = function(to, exactly)
{
	return this.moveTo({minutes: to}, exactly);
};

}

if ( ! Date.prototype.moveHours ) {

/**
 * Moves the actual Date object for defined value of hours. 
 * This method modifies the Date object.
 *
 * @param	Number	to
 * @param	Boolean	exactly
 * @return	Date
 * @access	public
 */
Date.prototype.moveHours = function(to, exactly)
{
	return this.moveTo({hours: to}, exactly);
};

}

if ( ! Date.prototype.moveDate ) {

/**
 * Moves the actual Date object for defined value of days. 
 * This method modifies the Date object.
 *
 * @param	Number	to
 * @param	Boolean	exactly
 * @return	Date
 * @access	public
 */
Date.prototype.moveDate = function(to, exactly)
{
	return this.moveTo({date: to}, exactly);
};

}

if ( ! Date.prototype.moveWeek ) {

/**
 * Moves the actual Date object for defined value of weeks. 
 * This method modifies the Date object.
 *
 * @param	Number	to
 * @param	Boolean	exactly
 * @return	Date
 * @access	public
 */
Date.prototype.moveWeek = function(to, exactly)
{
	return this.moveTo({week: to}, exactly);
};

}

if ( ! Date.prototype.moveMonth ) {

/**
 * Moves the actual Date object for defined value of months. 
 * This method modifies the Date object.
 *
 * @param	Number	to
 * @param	Boolean	exactly
 * @return	Date
 * @access	public
 */
Date.prototype.moveMonth = function(to, exactly)
{
	return this.moveTo({month: to}, exactly);
};

}

if ( ! Date.prototype.moveYear ) {

/**
 * Moves the actual Date object for defined value of years. 
 * This method modifies the Date object.
 *
 * @param	Number	to
 * @param	Boolean	exactly
 * @return	Date
 * @access	public
 */
Date.prototype.moveYear = function(to, exactly)
{
	return this.moveTo({year: to}, exactly);
};

}

if ( ! Date.prototype.moveNextWeekday ) {

/**
 * Moves the actual Date object to the definite weekday forward
 * This method modifies the Date object.
 *
 * @param	Number	to
 * @return	Date
 * @access	public
 */
Date.prototype.moveNextWeekday = function(to)
{
	var d = to - this.getDay();
	if ( d <= 0 ) {
		d += 7;
	}

	this.setDate(this.getDate() + d);
	return this;
};

}

if ( ! Date.prototype.movePreviousWeekday ) {

/**
 * Moves the actual Date object to the definite weekday backward
 * This method modifies the Date object.
 *
 * @param	Number	to
 * @return	Date
 * @access	public
 */
Date.prototype.movePreviousWeekday = function(to)
{
	var d = to - this.getDay();
	if ( d >= 0 ) {
		d -= 7;
	}

	this.setDate(this.getDate() + d);
	return this;
};

}

if ( ! Date.prototype.clone ) {

/**
 * Creates new instance of the existing date object
 *
 * @syntax
 * object.clone()
 *
 * @param	void
 * @return	Date
 * @access	public
 */
Date.prototype.clone = function () {
	return new Date(this.getTime()); 
};

}

if ( ! Date.prototype.midnight ) {

/**
 * Moves the actual Date object to the start of day corresponding to the midnight.
 *
 * @param	void
 * @return	Date
 * @access	public
 */
Date.prototype.midnight = function()
{
	this.setMilliseconds(0);
	this.setSeconds(0);
	this.setMinutes(0);
	this.setHours(0);
	return this;
};

}

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

if ( ! Date.today ) {

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
	var here = Date.now();
	if ( midnight ) {
		here.midnight();
	}
	return here;
};

}

if ( ! Date.yesterday ) {

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
	return Date.today(midnight).moveDate(-1);
};

}

if ( ! Date.tomorrow ) {

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
	return Date.today(midnight).moveDate(+1);
};

}

if ( ! Date.validate ) {

/**
 * Validates the Date object and returns the primitive value of Date. 
 *
 * @param	Date	date
 * @return	Number
 * @access	static
 */
Date.validate = function(date)
{
	if ( date && date.constructor == Date ) {
		date = date.getTime();
	}

	if ( isNaN(date) ) {
		throw new TypeError();
	}

	return date;
};

}

if ( ! Date.diff ) {

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
 * @return	Object
 * @access	static
 */
Date.diff = function(date1, date2)
{
	date1 = Date.validate(date1);
	date2 = Date.validate(date2 || 0);

	var result = date1 - date2;

	var d = Math.abs(result);

	var f, h, m, s, ms;

	ms = d % 1000;
	d /= 1000;

	s = Math.floor(d % 60);
	d /= 60;

	m = Math.floor(d % 60);
	d /= 60;

	h = Math.floor(d % 24);
	d /= 24;

	f = Math.floor(d);

	return {
		milliseconds: ms,
		seconds: s,
		minutes: m,
		hours: h,
		days: f,
		rdays: d
	};
};

}

if ( ! Date.fromObject ) {

/**
 * Creates new Date object from the Object object with the following properties:
 * -- milliseconds
 * -- seconds
 * -- minutes
 * -- hours
 * -- date
 * -- week
 * -- year
 *
 * @param	Object	from
 * @return	Date
 * @access	static
 */
Date.fromObject = function(from)
{
	var here = new Date();

	from = from || {};

	if ( from.hasOwnProperty('year') ) {
		here.setFullYear(from.year);
	}
	if ( from.hasOwnProperty('month') ) {
		here.setMonth(from.month);
	}
	if ( from.hasOwnProperty('date') ) {
		here.setDate(from.date);
	}

	if ( from.hasOwnProperty('hours') ) {
		here.setHours(from.hours);
	}
	if ( from.hasOwnProperty('minutes') ) {
		here.setMinutes(from.minutes);
	}
	if ( from.hasOwnProperty('seconds') ) {
		here.setSeconds(from.seconds);
	}
	if ( from.hasOwnProperty('milliseconds') ) {
		here.setMilliseconds(from.milliseconds);
	}

	return here;
};

}

if ( ! Date.prototype.toObject ) {

/**
 * Stores the actual Date object to the next properties of the Object object:
 * -- milliseconds
 * -- seconds
 * -- minutes
 * -- hours
 * -- date
 * -- week
 * -- year
 *
 * @param	void
 * @return	Object
 * @access	public
 */
Date.prototype.toObject = function()
{
	return {
		milliseconds: this.getMilliseconds(),
		seconds: this.getSeconds(),
		minutes: this.getMinutes(),
		hours: this.getHours(),
		date: this.getDate(),
		month: this.getMonth(),
		year: this.getFullYear(),
		wday: this.getDay(),
		yday: this.getYearDay()
	};
};

}

if ( ! Date.prototype.copy ) {

/**
 * Creates (clones) new copy of the Date object.
 *
 * @param	viod
 * @return	Date
 * @access	public
 */
Date.prototype.copy = 
Date.prototype.clone = 
function()
{
	return new Date(this.getTime());
};

}

if ( ! Date.prototype.compareTo ) {

/**
 * Compares the Date object with another Date object. 
 * Returns as follows:
 * < 0 - the current object is less than the value
 * = 0 - the current object is equals to the value
 * > 0 - the current object is greater than the value
 *
 * @param	Date	date
 * @return	Number
 * @access	public
 */
Date.prototype.compareTo = function(date)
{
	return Date.validate(this) - Date.validate(date);
};

}

if ( ! Date.prototype.isAfter ) {

/**
 * Compares the Date object is date after the date to compare to.
 * If the Date object is not specified then the current time is used.
 *
 * @param	Date	date
 * @return	Boolean
 * @acceess	public
 */
Date.prototype.isAfter = function(date)
{
	return this.compareTo(date || new Date()) > 0;
};

}

if ( ! Date.prototype.isBefore ) {

/**
 * Compares the Date object is date before the date to compare to.
 * If the Date object is not specified then the current time is used.
 *
 * @param	Date	date
 * @return	Boolean
 * @acceess	public
 */
Date.prototype.isBefore = function(date)
{
	return this.compareTo(date || new Date()) < 0;
};

}

if ( ! Date.prototype.equals ) {

/**
 * Compares the Date object is the same date to compare to.
 * If the Date object is not specified then the current time is used.
 *
 * @param	Date	date
 * @return	Boolean
 * @acceess	public
 */
Date.prototype.equals = function(date)
{
	return this.copy().midnight().compareTo(date || Date.today(true)) == 0;
};

}

if ( ! Date.prototype.between ) {

/**
 * Validates that the current Date object is between range of two Date objects. 
 * This method does not differ minimal and maximal values of the range. 
 * At least, they should be instances of Date object and identify edge of the range. 
 *
 * @param	Date	date1
 * @param	Date	date2
 * @return	Boolean
 * @access	public
 */
Date.prototype.between = function(date1, date2)
{
	var d1 = Date.validate(date1);
	var d2 = Date.validate(date2);

	var c = Date.validate(this);

	var a = Math.min(d1, d2);
	var b = Math.max(d1, d2);

	return c >= a && c <= b;
};

}

if ( ! Date.prototype.format ) {

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
Date.prototype.format = function (fmt, spacer)
{
	var self = this;

	if ( ! fmt ) {
		return this.toString();
	}
	
	if ( typeof spacer != 'string' ) {
		spacer = "0";
	}

	if ( spacer.length > 1 ) {
		spacer.length = 1;
	}

	return fmt.replace(/%\w+/g, function(a)
	{
		a = a.replace(/[%\s]/,"");
		switch (a) {
		case "a" : return self.getLocaleDayShortName();
		case "A" : return self.getLocaleDayLongName();
		case "b" : 
		case "h" : return self.getLocaleMonthShortName();
		case "B" : return self.getLocaleMonthLongName();
		case "c" : return; //???
		case "C" : return Math.round(self.getFullYear()/100);
		case "d" : return String(self.getDate()).padLeft(2, spacer);
		case "D" : return self.format("%m/%d/%y", spacer);//String(self.getMonth()+1).padLeft(2,"0")+"/"+String(self.getDate()+1).padLeft(2,"0")+"/"+String(self.getFullYear()).slice(-2);
		case "e" : return String(self.getDate() + 1).padLeft(2);
		case "g" : return String(self.getIsoYear()).slice(-2);
		case "G" : return self.getIsoYear();
		case "H" : return String(self.getHours()).padLeft(2, spacer);
		case "I" : return String(self.getHours() > 12 ? self.getHours() - 12 : self.getHours()).padLeft(2, spacer);
		case "j" : return String(self.getDayOfYear()).padLeft(3, spacer);
		case "m" : return String(self.getMonth() + 1).padLeft(2, spacer);
		case "M" : return String(self.getMinutes()).padLeft(2, spacer);
		case "n" : return "\n";
		case "p" : return self.getDaytime();
		case "r" : return self.format("%I", spacer) + ":" + self.format("%M", spacer) + ":" + self.format("%S", spacer) + " " + self.format("%p", spacer);
		case "R" : return self.format("%H", spacer) + ":" + self.format("%M", spacer);
		case "S" : return String(self.getSeconds()).padLeft(2, spacer);
		case "t" : return "\t";
		case "T" : return self.format("%H", spacer) + ":" + self.format("%M", spacer) + ":" + self.format("%S", spacer);
		case "u" : return self.getIsoDay();
		case "U" : return String(parseInt((self.getDayOfYear() - 1 - self.getIsoDay() + 13) / 7 - 1)).padLeft(2, "0");
		case "V" : return String(self.getIsoWeek()).padLeft(2, spacer);
		case "w" : return self.getDay();
		case "W" : return String(parseInt((self.getDayOfYear() - 1 - self.getDay() + 13) / 7 - 1)).padLeft(2, "0");
		case "x" : return; // ???
		case "X" : return; // ???
		case "y" : return String(self.getFullYear()).slice(-2);
		case "Y" : return self.getFullYear();
		case "z" : return; // ???
		case "Z" : return self.getTimezoneOffset() / 60;
		}
		return a;
	})
};

}

