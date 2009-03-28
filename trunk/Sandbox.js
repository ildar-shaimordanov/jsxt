
// Project name is the name of the sandbox and its folder name
// Define here your own project name for the sandbox
sandbox.setProjectName('Sandbox Demo');

// Content installer is the full pathname of the installer
// This dummy will never be used in the demo
// Define your own uninstaller if you need it
sandbox.setContentInstaller('C:\\WINDOWS\\system32\\cmd.exe');

// Content uninstaller is the same as above but for the uninstaller
// It just will open DOS window
// Define your own uninstaller if you need it
sandbox.setContentUninstaller(env('TEMP') + '\\sandbox_uninstaller.bat');

// Launcher of the content installer
// It should return TRUE to remove the uninstaller during uninstalling process
// Remove next lines until the end of the file
sandbox.launchContentInstaller = function(sandbox_path)
{
	alert('Close this dialog and demo uninstaller will be created in the "' + sandbox.getContentUninstaller() + '"');
	var result = wsh.Run('cmd /c echo @echo Demo of content uninstalling from "' + sandbox_path + '" ^&^& pause>' + sandbox.getContentUninstaller(), 1, true);

	alert('Close this dialog and the demo sandbox will be opened');
	var result = wsh.Run('explorer ' + sandbox_path, 1, true);

	return true;
};

