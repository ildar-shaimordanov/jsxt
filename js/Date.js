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
Date.prototype.getDaysInMonth = function ()
{
	var here = new Date(this.getTime());
	here.setDate(32);
	return 32 - here.getDate();
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

	var d = Math.abs(date2 - date1);

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
/*
	date1 = Date.validate(date1);
	date2 = Date.validate(date2 || 0);

	var d = Math.abs(date2 - date1);

	var x = new Date(d);
	return {
		milliseconds: x.getUTCMilliseconds(),
		seconds: x.getUTCSeconds(),
		minutes: x.getUTCMinutes(),
		hours: x.getUTCHours(),
		days: Math.floor(d / 86400000)
	};
*/
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
	date1 = Date.validate(date1);
	date2 = Date.validate(date2);

	var c = Date.validate(this);

	var a = Math.min(date1, date2);
	var b = Math.max(date1, date2);

	return c >= a && c <= b;
};

}

