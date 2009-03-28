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
 * Function.prototype.evalCount
 * This integer parameter keeps the number of iterations or the number 
 * of times of execution of the code. The default value is 1000.
 *
 * Function.prototype.evalDuration
 * The integer parameter keeps a calculated duration of the function execution.
 *
 * Function.prototype.evalPrint
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
//	var args = [];
//	for (var i = 0; i < arguments.length; i++) {
//		args.push(arguments[i]);
//	}

	var result;
	var n = Number(this.evalCount) || 1000;

	var start = (new Date()).getTime();

	for ( ; n--; ) {
//		result = this.apply(arguments.callee, args);
		result = this.apply(arguments.callee, arguments);
	}

	var stop = (new Date()).getTime();

	this.evalDuration = stop - start;

	if ( 'function' == typeof this.evalPrint ) {
		this.evalPrint();
	}

	return result;
};

Function.prototype.evalCount = 1000;
Function.prototype.evalPrint = function()
{
	var e;
	try {
		document.writeln(this.evalCount, this.evalDuration);
	} catch (e) {
		WScript.Echo(this.evalCount, this.evalDuration);
	}
};

}

