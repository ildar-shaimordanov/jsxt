//
// JavaScript unit
// Calendar builder object
//
// Copyright (c) 2010 by Ildar Shaimordanov
//

/**
 * Calendar builder
 *
 * @description
 * Prepares and renders a calendar for the provided date object. 
 *
 * The Calendar object prepares and renders the date object. 
 * It's methods accept additional object helping to render the calendar. 
 * This object should have several properties and methods.
 *
 * There are available properties of the renderer object:
 * -- firstDay   - the first day of week (0 - Sunday, 1 - Monday, etc) 
 * -- orientaion - 0 for horizontal (default value), 1 for vertical 
 * -- viewType   - 0 for simple, 1 to fill empty days, 2 for the compact view
 *
 * Empty days are days before and after the current month 
 * that can be displayed in a calendar to fill empty cells in a table
 *
 * There available methods used to render a date: 
 * -- renderDate(input, index, calendar)
 * -- renderWeek(input, index, calendar)
 * -- renderMonth(input, calendar)
 * -- renderRow(input, calendar)
 * -- renderCalendar(input, calendar)
 *
 * Each method acepts the definite number of arguments:
 * -- input    - actual value to be rendered (date for renderDate, etc)
 * -- index    - index in the holding array 
 *               (calendar for renderDate or calendar.weekdays for renderWeek)
 * -- calendar - the specially prepared array containing 
 *               enough information to render a calendar
 *
 * @syntax
 * // Outputs to STDOUT a calendar for the actual month
 * var cal = new Calendar();
 * var result = cal.render();
 * WScript.Echo(result);
 *
 * // Renders a calendar and prints into a HTML page 
 * // with Monday as the first day of weeks
 * var date = new Date();
 * var cal = new Calendar();
 * var result = cal.render(date, {
 *     firstDay: 1
 * });
 * document.write('<pre>' + result + '</pre>');
 *
 * @param  void
 * @result Calendar
 * @access public
 */
function Calendar()
{

	var self = this;

	/**
	 * Prepares the special array with enough information to render
	 *
	 * @param  Date    Date object
	 * @param  Object  Renderer object
	 * @result Array
	 * @access public
	 */
	self.prepare = function(date, renderer)
	{
		date = date || new Date();

		renderer = renderer || {};
		renderer.firstDay = (Number(renderer.firstDay) % 7) || 0;

		// Last date of the actual, previous and next months
		var lastPrev = new Date(date.getFullYear(), date.getMonth(), 0);
		var lastThis = new Date(date.getFullYear(), date.getMonth() + 1, 0);
		var lastNext = new Date(date.getFullYear(), date.getMonth() + 2, 0);

		var fdm = (new Date(date.getFullYear(), date.getMonth(), 1)).getDay();
		var dim = lastThis.getDate();

		var N = (fdm - renderer.firstDay + 7) % 7;
		var M = (7 - (N + dim + 7) % 7) % 7;

		var prev = new Array(N);
		var next = new Array(M);

		if ( renderer.viewType == 1 ) {
			for (var j = lastPrev.getDate() - N + 1, i = 0; i < N; i++) {
				prev[i] = i + j;
			}
			for (var i = 0; i < M; i++) {
				next[i] = i + 1;
			}
		}

		var days = new Array(dim);
		for (var i = 0; i < days.length; i++) {
			days[i] = i + 1;
		}

		var calendar = [].concat(
			prev, 
			days, 
			next);

		// Keep the order of week days
		calendar.weekdays = new Array(7);
		for (var i = 0; i < 7; i++) {
			calendar.weekdays[i] = (i + renderer.firstDay) % 7;
		}

		// Keep an information for this month
		calendar.indexFirstDate = N;
		calendar.indexLastDate = calendar.length - M - 1;
		calendar.firstDay = fdm;
		calendar.lastDay = lastThis.getDay();

		// Keep an information for starting and stopping indexes
		calendar.startIndex = 0;
		calendar.stopIndex = calendar.length;
		if ( renderer.viewType == 2 ) {
			if ( N > 3 || N == 3 && M < 4 || N == 2 && M == 2 ) {
				calendar.startIndex = 7;
			}
			if ( M > 3 || M == 3 && N < 3 ) {
				calendar.stopIndex = calendar.length - 7;
			}
		};

		// Keep an information for the month and year
		calendar.year = date.getFullYear();
		calendar.leap = calendar.year % 4 == 0 && calendar.year % 100 != 0 || calendar.year % 400 == 0;
		calendar.month = date.getMonth();
		calendar.date = date.getDate();

		// Keep information for the actual date of the month
		var now = new Date();
		if ( date.getFullYear() == now.getFullYear() && date.getMonth() == now.getMonth() ) {
			calendar.indexToday = N - 1 + now.getDate();
			calendar.todayDay = now.getDay();
		} else {
			calendar.indexToday = -1;
			calendar.todayDay = -1;
		}

		// Keep references for the previous month
		calendar.prevYear = lastPrev.getFullYear();
		calendar.prevMonth = lastPrev.getMonth();
		calendar.prevDays = lastPrev.getDate();

		// Keep references for the next month
		calendar.nextYear = lastNext.getFullYear();
		calendar.nextMonth = lastNext.getMonth();
		calendar.nextDays = lastNext.getDate();

		return calendar;
	};

	/**
	 * Prepares and renders the Date object to be printed
	 *
	 * @param  Date    Date object
	 * @param  Object  Renderer object
	 * @result String
	 * @access public
	 */
	self.render = function(date, renderer)
	{
		date = date || new Date();

		renderer = renderer || self;
		renderer.renderDate = renderer.renderDate || self.renderDate;
		renderer.renderWeek = renderer.renderWeek || self.renderWeek;
		renderer.renderMonth = renderer.renderMonth || self.renderMonth;
		renderer.renderRow = renderer.renderRow || self.renderRow;
		renderer.renderCalendar = renderer.renderCalendar || self.renderCalendar;

		var calendar = self.prepare(date, renderer);

		var result = [];
		result.push(renderer.renderMonth(calendar.month, calendar));

		if ( renderer.orientation ) {

			// Vertical rendering
			for (var i = 0; i < 7; i++) {
				var line = [];
				line.push(renderer.renderWeek(calendar.weekdays[i], i, calendar));
				for (var j = i + calendar.startIndex; j < calendar.stopIndex; j += 7) {
					line.push(renderer.renderDate(calendar[j], j, calendar));
				}
				result.push(renderer.renderRow(line, calendar));
			}

		} else {

			// Horizontal rendering
			var line = new Array(7);
			for (var i = 0; i < 7; i++) {
				line[i] = renderer.renderWeek(calendar.weekdays[i], i, calendar);
			}
			result.push(renderer.renderRow(line, calendar));

			for (var i = calendar.startIndex; i < calendar.stopIndex; i += 7) {
				var line = [];
				for (var j = i; j < i + 7; j++) {
					line.push(renderer.renderDate(calendar[j], j, calendar));
				}
				result.push(renderer.renderRow(line, calendar));
			}

		}

		return renderer.renderCalendar(result, calendar);
	};

	self.renderLine = function(a, b, c)
	{
		var line = [];
		for (var j = c; j < b; j += c) {
			line.push(renderer.renderDate(calendar[j], j, calendar));
		}
		return line;
	};

	/**
	 * Renders a date of a month
	 *
	 * @param  Integer  a date
	 * @param  Integer  an index in the array
	 * @param  Array    a calendar array
	 * @result String
	 * @access public
	 */
	self.renderDate = function(input, index, calendar)
	{
		return input > 9 ? '  ' + input : input ? '   ' + input : '    ';
	};

	/**
	 * Renders a week name
	 *
	 * @param  Integer  a week number
	 * @param  Integer  an index in the array
	 * @param  Array    a calendar array
	 * @result String
	 * @access public
	 */
	var weekList = 'Sun Mon Tue Wed Thu Fri Sat'.split(/\s+/);
	self.renderWeek = function(input, index, calendar)
	{
		return ' ' + weekList[input];
	};

	/**
	 * Renders a month name
	 *
	 * @param  Integer  a month number
	 * @param  Array    a calendar array
	 * @result String
	 * @access public
	 */
	var monthList = 'January February March April May June July August September October November December'.split(/\s+/);
	self.renderMonth = function(input, calendar)
	{
		return ' ' + monthList[input] + ' - ' + calendar.year + '\n';
	};

	/**
	 * Renders a row of a calendar
	 *
	 * @param  Array    a list of days
	 * @param  Array    a calendar array
	 * @result String
	 * @access public
	 */
	self.renderRow = function(input, calendar)
	{
		return input.join('') + '\n';
	};

	/**
	 * Renders a calendar
	 *
	 * @param  Array    a list of rows
	 * @param  Array    a calendar array
	 * @result String
	 * @access public
	 */
	self.renderCalendar = function(input, calendar)
	{
		return input.join('');
	};

};

