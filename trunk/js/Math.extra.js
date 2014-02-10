//
// Math.js
// Extension for Math object
//
// Copyright (c) 2011 by Ildar Shaimordanov
//

/**
 * Returns the Golden ratio's value
 *
 * @const	Number
 * @value	(Math.sqrt(5) + 1) / 2
 */
Math.GOLDEN_RATIO = (Math.sqrt(5) + 1) / 2;

/**
 * Returns Pi / 2 value
 *
 * @const	Number
 * @value	Pi / 2
 */
Math.PI_2 = Math.PI / 2;

/**
 * Returns Pi / 3 value
 *
 * @const	Number
 * @value	Pi / 3
 */
Math.PI_3 = Math.PI / 3;

/**
 * Returns Pi / 4 value
 *
 * @const	Number
 * @value	Pi / 4
 */
Math.PI_4 = Math.PI / 4;

/**
 * Returns Pi / 6 value
 *
 * @const	Number
 * @value	Pi / 6
 */
Math.PI_6 = Math.PI / 6;

/**
 * Returns the largest value that is not greater than value and divisible 
 * by modulo
 *
 * @param	Number
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.floorModulo = function(value, modulo)
{
	return Math.floor(value / modulo) * modulo;
};

/**
 * Returns the smallest value that is not less than value and divisible 
 * by modulo
 *
 * @param	Number
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.ceilModulo = function(value, modulo)
{
	return Math.ceil(value / modulo) * modulo;
};

/**
 * Returns the nearest value that is divisible by modulo
 *
 * @param	Number
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.roundModulo = function(value, modulo)
{
	return Math.round(value / modulo) * modulo;
};

/**
 * Returns random integer value in the interval [a, b]
 *
 * @param	Number
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.randomInt = function(a, b)
{
	var x = Math.min(a, b);
	var y = Math.max(a, b);
	return Math.floor(Math.random() * y) + x;
};

/**
 * Returns a function generating weighted random integer values. 
 *
 * The first argument is array where each item means a weight of the value 
 * for its index. The bigger value means the more possibility of the the 
 * number appearance. 
 * The second integer argument defines the initial value for the interval 
 * of random values. 
 *
 * See the example below:

// A list of prizes
var prizes = ['PS4', 'DVD Player', 'Kit-Kat Bar', 'Nothing'];

// A list of weights
var weights = [1, 2, 3, 94];

// Generating function
var rnd = Math.randomWeight(weights);

// Gathering a value
var prize = prizes[ rnd() ];

 * @param	Array
 * @param	Number
 * @return	Function
 * @access	static
 */
Math.randomWeight = function(weights, start)
{
	var len = weights.length;
	var marks = [];
	var total = 0;
	for (var i = 0; i < len; i++) {
		marks[i] = total;
		total += weights[i];
	}

	start = Number(start) || 0;

	return function()
	{
		var rnd = Math.floor(Math.random() * total);
		for (var i = len - 1; i >= 0 && rnd < marks[i]; i--) {
		}
		return start + i;
	};
};

/**
 * Makes sure that the passed number is within both a minimum value and a maximum value
 *
 * @param	Number
 * @param	Number
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.clamp = function(x, a, b)
{
	return Math.max(a, Math.min(b, x));
};

/**
 * Returns the square of a number.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.square = function(x)
{
	return x * x;
};

/**
 * Returns the cube of a number.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.cube = function(x)
{
	return x * x * x;
};

/**
 * Returns the cubic root of a number.
 *
 * @param	Number
 * @return	Number
 * @access	static
 */
Math.cubt = function(x)
{
//	return Math.sign(x) * Math.pow(Math.abs(x), 1 / 3);
	var r = x && Math.pow(Math.abs(x), 1 / 3);
	return x < 0 ? -r : r;
};

/**
 * Returns the summa of supplied numeric expressions.
 *
 * @param	multiple
 * @return	Number
 * @access	static
 */
Math.sum = function()
{
	var result = 0;
	for (var i = 0; i < arguments.length; i++) {
		result += +arguments[i];
	}
	return result;
};

/**
 * Returns the average value of supplied numeric expressions.
 *
 * @param	multiple
 * @return	Number
 * @access	static
 */
Math.avg = function()
{
	return Math.sum.apply(null, arguments) / arguments.length;
};

/**
 * Returns the product of supplied numeric expressions.
 *
 * @param	multiple
 * @return	Number
 * @access	static
 */
Math.prod = function()
{
	var result = 1;
	for (var i = 0; i < arguments.length; i++) {
		result *= arguments[i];
	}
	return result;
};

/**
 * Returns the dispersion of supplied numeric expressions.
 *
 * @param	multiple
 * @return	Number
 * @access	static
 */
Math.disp = function()
{
	var avg = Math.avg.apply(null, arguments);

	var result = 0;
	for (var i = 0; i < arguments.length; i++) {
		result += Math.square(arguments[i] - avg);
	}

	return Math.sqrt(result / arguments.length);
};
