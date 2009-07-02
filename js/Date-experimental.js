
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
 * @return	Date
 * @access	public
 */
Date.prototype.moveTo = function(to)
{
	var part;
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
	return this;
};

}

if ( ! Date.prototype.moveMilliseconds ) {

/**
 * Moves the actual Date object for defined value of milliseconds. 
 * This method modifies the Date object.
 *
 * @param	Number	to
 * @return	Date
 * @access	public
 */
Date.prototype.moveMilliseconds = function(to)
{
	return this.moveTo({milliseconds: to});
};

}

if ( ! Date.prototype.moveSeconds ) {

/**
 * Moves the actual Date object for defined value of seconds. 
 * This method modifies the Date object.
 *
 * @param	Number	to
 * @return	Date
 * @access	public
 */
Date.prototype.moveSeconds = function(to)
{
	return this.moveTo({seconds: to});
};

}

if ( ! Date.prototype.moveMinutes ) {

/**
 * Moves the actual Date object for defined value of minutes. 
 * This method modifies the Date object.
 *
 * @param	Number	to
 * @return	Date
 * @access	public
 */
Date.prototype.moveMinutes = function(to)
{
	return this.moveTo({minutes: to});
};

}

if ( ! Date.prototype.moveHours ) {

/**
 * Moves the actual Date object for defined value of hours. 
 * This method modifies the Date object.
 *
 * @param	Number	to
 * @return	Date
 * @access	public
 */
Date.prototype.moveHours = function(to)
{
	return this.moveTo({hours: to});
};

}

if ( ! Date.prototype.moveDate ) {

/**
 * Moves the actual Date object for defined value of days. 
 * This method modifies the Date object.
 *
 * @param	Number	to
 * @return	Date
 * @access	public
 */
Date.prototype.moveDate = function(to)
{
	return this.moveTo({date: to});
};

}

if ( ! Date.prototype.moveWeek ) {

/**
 * Moves the actual Date object for defined value of weeks. 
 * This method modifies the Date object.
 *
 * @param	Number	to
 * @return	Date
 * @access	public
 */
Date.prototype.moveWeek = function(to)
{
	return this.moveTo({week: to});
};

}

if ( ! Date.prototype.moveMonth ) {

/**
 * Moves the actual Date object for defined value of months. 
 * This method modifies the Date object.
 *
 * @param	Number	to
 * @return	Date
 * @access	public
 */
Date.prototype.moveMonth = function(to)
{
	return this.moveTo({month: to});
};

}

if ( ! Date.prototype.moveYear ) {

/**
 * Moves the actual Date object for defined value of years. 
 * This method modifies the Date object.
 *
 * @param	Number	to
 * @return	Date
 * @access	public
 */
Date.prototype.moveYear = function(to)
{
	return this.moveTo({year: to});
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
//	if ( ! date || date.constructor != Number ) {
		throw new TypeError();
	}

	return date;
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

// http://www.datejs.com/
Date.prototype.next = function()
{
	this.__drift__ = +1;
	return this;
};

Date.prototype.prev = function()
{
	this.__drift__ = -1;
	return this;
};

Date.prototype.millisecond = function()
{
	this.moveMilliseconds(this.__drift__);
	return this;
};

Date.prototype.second = function()
{
	this.moveSeconds(this.__drift__);
	return this;
};

Date.prototype.minute = function()
{
	this.moveMinutes(this.__drift__);
	return this;
};

Date.prototype.hour = function()
{
	this.moveHours(this.__drift__);
	return this;
};

Date.prototype.date = function()
{
	this.moveDate(this.__drift__);
	return this;
};

Date.prototype.week = function()
{
	this.moveWeek(this.__drift__);
	return this;
};

Date.prototype.month = function()
{
	this.moveMonth(this.__drift__);
	return this;
};

Date.prototype.year = function()
{
	this.moveYear(this.__drift__);
	return this;
};


var x = new Date(2009, 6, 31);
x.next().date().print();
