//
// JavaScript unit
// JavaScript/JScript Benchmarking
//
// Copyright (c) 2009 by Ildar Shaimordanov
//


if ( ! Function.prototype.eval ) {

/**
 * Function.prototype.eval()
 *
 * @description
 * This method allows to measure the JavaScript/JScript code performance. 
 * There are several parameters available for handling of benchmark.
 *
 * Function.prototype.count
 * This integer parameter keeps the number of iterations or the number 
 * of times of execution of the code. The default value is 1000.
 *
 * Function.prototype.duration
 * The integer parameter keeps a calculated duration of the function execution.
 *
 * Function.prototype.print
 * The helper function for output of benchmark statistics. 
 * By default, it outputs the duration of function execution and the number of iterations.
 *
 * @example
 * <code>
 * // Example 1.
 * function sum()
 * {
 * 	var result = 0;
 * 	for (var i = 0; i < arguments.length; i++) {
 * 		result += arguments[i];
 * 	}
 * }
 * 
 * // Original code - function call
 * var result = sum(1, 2, 3, 4);
 *
 * // Modified one, to estimate the function performance
 * var result = sum.eval(1, 2, 3, 4);
 * </code>
 * 
 * @example
 * <code>
 * // Example 2.
 * // Original code - part of a big routine
 * var arr = [100, 200, 300, 400];
 * 	var result = 0;
 * 	for (var i = 0; i < arr.length; i++) {
 * 		result += arr[i];
 * 	}
 *
 * // Modified one, to estimate the code performance
 * var arr = [100, 200, 300, 400];
 * (function()
 * {
 * 	var result = 0;
 * 	for (var i = 0; i < arr.length; i++) {
 * 		result += arr[i];
 * 	}
 * }).eval();
 *</code>
 *
 * @params	code-dependent
 * @return	code-dependent
 * @access	public
 */
Function.prototype.eval = function()
{
	var args = [];
	for (var i = 0; i < arguments.length; i++) {
		args.push(arguments[i]);
	}

	var result;
	var n = Number(this.count) || 1000;

	var start = (new Date()).getTime();

	for ( ; n--; ) {
		var result = this.apply(arguments.callee, args);
	}

	var stop = (new Date()).getTime();

	this.duration = stop - start;

	if ( 'function' == typeof this.print ) {
		this.print();
	}

	return result;
}

Function.prototype.count = 1000;
Function.prototype.print = function()
{
	var e;
	try {
		document.writeln([this.count, this.duration]);
	} catch (e) {
		WScript.Echo(this.count, this.duration);
	}
}

}

