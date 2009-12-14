//
// JavaScript unit
// Wrapper for VBScript features in JScript
//
// Copyright (c) 2009 by Ildar Shaimordanov
//


var vb = {};


/**
 * The helper method creates VBScript functions to be available in JScript.
 *
 * @param	String	The name of VBScript function. 
 * @return	Function
 */
vb.Function = function(func)
{
	return function()
	{
		return vb.Function.eval.call(this, func, arguments);
	};
};


/**
 * The helper method runs VBScript functions to be available in JScript.
 *
 * @param	String	The name of VBScript function. 
 * @param	Array	The list of arguments for a VBScript function.
 * @return	Function
 */
vb.Function.eval = function(func)
{
	var args = Array.prototype.slice.call(arguments[1]);
	for (var i = 0; i < args.length; i++) {
		if ( typeof args[i] != 'string' ) {
			continue;
		}
		args[i] = '"' + args[i].replace(/"/g, '" + Chr(34) + "') + '"';
	}

	var vbe;
	vbe = new ActiveXObject('ScriptControl');
	vbe.Language = 'VBScript';

	return vbe.eval(func + '(' + args.join(', ') + ')');
};


/**
 * Displays a prompt in a dialog box, waits for the user to input 
 * text or click a button, and returns the contents of the text box. 
 *
 * InputBox(prompt[, title][, default][, xpos][, ypos][, helpfile, context])
 *
 * prompt 
 * String expression displayed as the message in the dialog box. 
 * The maximum length of prompt is approximately 1024 characters, 
 * depending on the width of the characters used. If prompt 
 * consists of more than one line, you can separate the lines using 
 * a carriage return character (Chr(13)), a linefeed character 
 * (Chr(10)), or carriage return-linefeed character combination 
 * (Chr(13) & Chr(10)) between each line. 
 *
 * title 
 * String expression displayed in the title bar of the dialog box. 
 * If you omit title, the application name is placed in the title 
 * bar. 
 *
 * default 
 * String expression displayed in the text box as the default 
 * response if no other input is provided. If you omit default, 
 * the text box is displayed empty. 
 *
 * xpos 
 * Numeric expression that specifies, in twips, the horizontal 
 * distance of the left edge of the dialog box from the left edge 
 * of the screen. If xpos is omitted, the dialog box is 
 * horizontally centered. 
 *
 * ypos 
 * Numeric expression that specifies, in twips, the vertical 
 * distance of the upper edge of the dialog box from the top of the 
 * screen. If ypos is omitted, the dialog box is vertically 
 * positioned approximately one-third of the way down the screen. 
 *
 * helpfile 
 * String expression that identifies the Help file to use to 
 * provide context-sensitive Help for the dialog box. If helpfile is 
 * provided, context must also be provided. 
 *
 * context 
 * Numeric expression that identifies the Help context number 
 * assigned by the Help author to the appropriate Help topic. 
 * If context is provided, helpfile must also be provided. 
 *
 * Remarks
 * When both helpfile and context are supplied, a Help button is 
 * automatically added to the dialog box.
 * If the user clicks OK or presses ENTER, the InputBox function 
 * returns whatever is in the text box. If the user clicks Cancel, 
 * the function returns a zero-length string ("").
 */
var InputBox = vb.Function('InputBox');


/**
 * Displays a message in a dialog box, waits for the user to click 
 * a button, and returns a value indicating which button the user 
 * clicked.
 *
 * MsgBox(prompt[, buttons][, title][, helpfile, context])
 *
 * prompt
 * String expression displayed as the message in the dialog box. 
 * The maximum length of prompt is approximately 1024 characters, 
 * depending on the width of the characters used. If prompt consists 
 * of more than one line, you can separate the lines using a 
 * carriage return character (Chr(13)), a linefeed character 
 * (Chr(10)), or carriage return-linefeed character combination 
 * (Chr(13) & Chr(10)) between each line. 
 *
 * buttons
 * Numeric expression that is the sum of values specifying the 
 * number and type of buttons to display, the icon style to use, 
 * the identity of the default button, and the modality of the 
 * message box. See vb.XXX constants for values. If omitted, 
 * the default value for buttons is 0. 
 *
 * title
 * String expression displayed in the title bar of the dialog box. 
 * If you omit title, the application name is placed in the 
 * title bar. 
 *
 * helpfile
 * String expression that identifies the Help file to use to 
 * provide context-sensitive Help for the dialog box. If helpfile 
 * is provided, context must also be provided. Not available on 
 * 16-bit platforms. 
 *
 * context
 * Numeric expression that identifies the Help context number 
 * assigned by the Help author to the appropriate Help topic. 
 * If context is provided, helpfile must also be provided. 
 * Not available on 16-bit platforms. 
 *
 * Remarks
 * See vb.XXX constants for identify a returned value. 
 * When both helpfile and context are provided, the user can 
 * press F1 to view the Help topic corresponding to the context. 
 * If the dialog box displays a Cancel button, pressing the ESC key 
 * has the same effect as clicking Cancel. If the dialog box 
 * contains a Help button, context-sensitive Help is provided for 
 * the dialog box. However, no value is returned until one of the 
 * other buttons is clicked.
 * When the MsgBox function is used with Microsoft Internet Explorer, 
 * the title of any dialog presented always contains "VBScript:" to 
 * differentiate it from standard system dialogs. 
 */
var MsgBox = vb.Function('MsgBox');


/**
 * The following constants are used with the MsgBox function to 
 * identify what buttons and icons appear on a message box and which 
 * button is the default. In addition, the modality of the MsgBox 
 * can be specified. Since these constants are built into VBScript, 
 * you don't have to define them before using them. Use them 
 * anywhere in your code to represent the values shown for each. 
 */
vb.OKOnly           =    0; // Display OK button only. 
vb.OKCancel         =    1; // Display OK and Cancel buttons. 
vb.AbortRetryIgnore =    2; // Display Abort, Retry, and Ignore buttons. 
vb.YesNoCancel      =    3; // Display Yes, No, and Cancel buttons. 
vb.YesNo            =    4; // Display Yes and No buttons. 
vb.RetryCancel      =    5; // Display Retry and Cancel buttons. 
vb.Critical         =   16; // Display Critical Message icon.  
vb.Question         =   32; // Display Warning Query icon. 
vb.Exclamation      =   48; // Display Warning Message icon. 
vb.Information      =   64; // Display Information Message icon. 
vb.DefaultButton1   =    0; // First button is default. 
vb.DefaultButton2   =  256; // Second button is default. 
vb.DefaultButton3   =  512; // Third button is default. 
vb.DefaultButton4   =  768; // Fourth button is default. 
vb.ApplicationModal =    0; // Application modal; the user must respond to the message box before continuing work in the current application. 
vb.SystemModal      = 4096; // System modal; all applications are suspended until the user responds to the message box. 


/**
 * The following constants are used with the MsgBox function to 
 * identify which button a user has selected. These constants are 
 * only available when your project has an explicit reference to 
 * the appropriate type library containing these constant 
 * definitions. For VBScript, you must explicitly declare 
 * these constants in your code. 
 */
vb.OK     = 1; // OK 
vb.Cancel = 2; // Cancel 
vb.Abort  = 3; // Abort 
vb.Retry  = 4; // Retry 
vb.Ignore = 5; // Ignore 
vb.Yes    = 6; // Yes 
vb.No     = 7; // No 

