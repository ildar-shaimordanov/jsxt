
/**
 *
 * Drive types
 *
 */
var DT_UNKNOWN		= 0;
var DT_REMOVABLE	= 1;
var DT_FIXED		= 2;
var DT_NETWORK		= 3;
var DT_CDROM		= 4;
var DT_RAMDISK		= 5;


/**
 *
 * File attributes
 *
 */
var FA_READONLY		= 1;
var FA_HIDDEN		= 2;
var FA_SYSTEM		= 4;
var FA_VOLUME		= 8;
var FA_DIRECTORY	= 16;
var FA_ARCHIVE		= 32;
var FA_ALIAS		= 64;
var FA_COMPRESSED	= 128;


/**
 *
 * Input/output mode
 *
 */
var IO_FOR_READING	= 1;
var IO_FOR_WRITING	= 2;
var IO_FOR_APPENDING	= 8;


/**
 *
 * Tristate values used to indicate the format of the opened file. 
 *
 */
var FO_TRISTRATE_DEFAULT	= -2; // Opens the file using the system default.
var FO_TRISTRATE_TRUE		= -1; // Opens the file as Unicode.
var FO_TRISTRATE_FALSE		=  0; // Opens the file as ASCII.

