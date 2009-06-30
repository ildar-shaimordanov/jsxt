
if ( ! Date.now ) {

Date.now = function()
{
	return new Date();
};

}

if ( ! Date.today ) {

Date.today = function(midnight)
{
	var here = Date.now();
	if ( midnight ) {
		here.setMilliseconds(0);
		here.setSeconds(0);
		here.setMinutes(0);
		here.setHours(0);
	}
	return here;
};

}

if ( ! Date.yesterday ) {

Date.yesterday = function(midnight)
{
	var here = Date.today(midnight);
	here.setDate(here.getDate() - 1);
	return here;
};

}

if ( ! Date.tomorrow ) {

Date.tomorrow = function(midnight)
{
	var here = Date.today(midnight);
	here.setDate(here.getDate() + 1);
	return here;
};

}

if ( ! Date.prototype.moveTo ) {

Date.prototype.moveTo = function(to)
{
	if ( Number(to.milliseconds) ) {
		this.setMilliseconds(this.getMilliseconds() + to.milliseconds);
	}
	if ( Number(to.seconds) ) {
		this.setSeconds(this.getSeconds() + to.seconds);
	}
	if ( Number(to.minutes) ) {
		this.setMinutes(this.getMinutes() + to.minutes);
	}
	if ( Number(to.hours) ) {
		this.setHours(this.getHours() + to.hours);
	}
	if ( Number(to.date) ) {
		this.setDate(this.getDate() + to.date);
	}
	if ( Number(to.week) ) {
		this.setDate(this.getDate() + to.week * 7);
	}
	if ( Number(to.month) ) {
		this.setMonth(this.getMonth() + to.month);
	}
	if ( Number(to.year) ) {
		this.setFullYear(this.getFullYear() + to.year);
	}
	return this;
};

}

if ( ! Date.prototype.moveMilliseconds ) {

Date.prototype.moveMilliseconds = function(value)
{
	this.moveTo({milliseconds: value});
};

}

if ( ! Date.prototype.moveSeconds ) {

Date.prototype.moveSeconds = function(value)
{
	this.moveTo({seconds: value});
};

}

if ( ! Date.prototype.moveMinutes ) {

Date.prototype.moveMinutes = function(value)
{
	this.moveTo({minutes: value});
};

}

if ( ! Date.prototype.moveHours ) {

Date.prototype.moveHours = function(value)
{
	this.moveTo({hours: value});
};

}

if ( ! Date.prototype.moveDate ) {

Date.prototype.moveDate = function(value)
{
	this.moveTo({date: value});
};

}

if ( ! Date.prototype.moveWeek ) {

Date.prototype.moveWeek = function(value)
{
	this.moveTo({week: value});
};

}

if ( ! Date.prototype.moveMonth ) {

Date.prototype.moveMonth = function(value)
{
	this.moveTo({month: value});
};

}

if ( ! Date.prototype.moveYear ) {

Date.prototype.moveYear = function(value)
{
	this.moveTo({year: value});
};

}

if ( ! Date.validate ) {

Date.validate = function(value)
{
	if ( value && value.constructor == Date ) {
		value = value.getTime();
	}

	if ( ! value || value.constructor != Number ) {
		throw new TypeError();
	}

	return value;
};

}

if ( ! Date.prototype.compareTo ) {

Date.prototype.compareTo = function(value)
{
	return here.getTime() - Date.validate(value).getTime();
};

}

if ( ! Date.prototype.between ) {

Date.prototype.between = function(a, b)
{
	var here = this.getTime();
	return here >= Date.validate(a).getTime() && here <= Date.validate(b).getTime();
};

}

