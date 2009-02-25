if ( ! Number.cartesian ) {

/**
 * Consider arguments as parts of Cartesian rectangular coordinates and convert to decimal
 * This is static method (cannot be call dynamically).
 *
 * @param	string	wside	Geographic notation or single character sign of direction (N, S, W, or E)
 * @param	number	degree	Degrees
 * @param	number	minute	Minutes
 * @param	number	second	Seconds
 * @return	number	Decimal value of cartesian coordinates or Number.NaN if values are not valid
 * @access	static
 */
Number.cartesian = function()
{
	var args = arguments;
	if ( args[0] && args[0].constructor == Array ) {
		args = args[0];
	} else {
		var matches = args[0].match(/^([nsweNSWE])(\d+\.?\d*)\*(?:(\d+\.?\d*)\'(?:(\d+\.?\d*)\")?)?$/); // '
		if ( matches ) {
			args = [matches[1], matches[2], matches[3] || 0, matches[4] || 0];
		}
	}

	var wside = String(args[0]);
	var degree = Number(args[1]);
	var minute = Number(args[2]);
	var second = Number(args[3]);

	var number = degree + minute / 60 + second / 3600;

	if ( 0 == number ) {
		return 0;
	}

	if ( wside ) {
		wside = wside.charAt(0).toUpperCase();
	} else {
		wside = Math.abs(number) <= 90 ? 'N' : 'E';
	}

	if ( 
		wside == 'E' && number > 0 && number <= +180 
		|| 
		wside == 'N' && number > 0 && number <= +90 
	) {
		return number;
	}

	if (
		wside == 'W' && number >= -180 && number <= +180 
		|| 
		wside == 'S' && number >= -90 && number <= +90 
	) {
		return -Math.abs(number);
	}

	return Number.NaN;
}

}

if ( ! Number.prototype.toAngular ) {

/**
 * Attempt numeric value as Cartesian rectangular coordinates accordingly the direction
 *
 * @param	boolean	isLongitude	If is true attempt a numeric value as a longitude, elsewehere as a latitude
 * @return	array	Array of numeric value in the cartesian coordinates or null if value is not vaild
 * @access	public
 */
Number.prototype.toAngular = function(isLongitude)
{
	var number = this;

	if ( isLongitude ) {
		var wside = number >= 0 ? 'E' : 'W';
	} else {
		var wside = number >= 0 ? 'N' : 'S';
	}

	if ( 0 == number ) {
		return [wside, 0, 0, 0, wside + '0*0\'0"'];
	}

	if ( 
		wside == 'E' && number > 0 && number <= +180 
		|| 
		wside == 'N' && number > 0 && number <= +90 
		|| 
		wside == 'W' && number >= -180 && number <= +180 
		|| 
		wside == 'S' && number >= -90 && number <= +90 
	) {
		var degree, minute, second;

		second = Math.abs(number);
		degree = Math.floor(second);

		second = (second - degree) * 60;
		minute = Math.floor(second);

		second = (second - minute) * 60;
		second = second.toPrecision(4).replace(/\.?0+$/, '');

		var notation = wside + degree + '*' + minute + '\'' + second + '"';

		return [wside, degree, minute, second, notation];
	}

	return null;
}

}

if ( ! Number.prototype.toLatitude ) {

/**
 * Attempt numeric value as a latitude
 * This is wrapper for Number.prototype.toAngular()
 *
 * @return	array	Array of numeric value in the cartesian coordinates or null if value is not vaild
 * @access	public
 */
Number.prototype.toLatitude = function()
{
	return this.toAngular(false);
}

}

if ( ! Number.prototype.toLongitude ) {

/**
 * Attempt numeric value as a longitude
 * This is wrapper for Number.prototype.toAngular()
 *
 * @return	array	Array of numeric value in the cartesian coordinates or null if value is not vaild
 * @access	public
 */
Number.prototype.toLongitude = function()
{
	return this.toAngular(true);
}

}

