
//
// cls.js
//
// Copyright (c) 2014 by Ildar Shaimordanov
//

/**
 * Clears the screen using the external "mode.com" utility.
 *
 * @link	http://forum.script-coding.com/viewtopic.php?id=9346
 */
function cls(useSystem32Path)
{
	var shell = new ActiveXObject('WScript.Shell');

	var path = WScript.Path;
	if ( useSystem32Path || cls.USE_SYSTEM32_PATH ) {
		var env = shell.Environment('PROCESS');
		path = env('WINDIR') + '\\System32';
	}

	var cmd = shell.Exec(path + '\\mode.com con: lines=0');

	// is not running
	if ( cmd.Status != 0 ) {
		return;
	}

	// while not finished
	while ( cmd.Status != 1 ) {
		cmd.StdOut.ReadAll();
		cmd.StdErr.ReadAll();
		WScript.Sleep(50);
	}
};

cls.USE_SYSTEM32_PATH = 0;

