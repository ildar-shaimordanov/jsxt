
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
