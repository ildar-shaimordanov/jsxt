/**
 * Parameters for the SHBrowseForFolder function and receives information about the folder selected by the user.
 *
 * @see		http://msdn.microsoft.com/en-us/library/bb773205(VS.85).aspx
 */
var BIF_RETURNONLYFSDIRS	= 0x0001; // Only return file system directories. If the user selects folders that are not part of the file system, the OK button is grayed. Note  The OK button remains enabled for "\\server" items, as well as "\\server\share" and directory items. However, if the user selects a "\\server" item, passing the PIDL returned by SHBrowseForFolder to SHGetPathFromIDList fails.
var BIF_DONTGOBELOWDOMAIN	= 0x0002; // Do not include network folders below the domain level in the dialog box's tree view control.
var BIF_STATUSTEXT		= 0x0004; // Include a status area in the dialog box. The callback function can set the status text by sending messages to the dialog box. This flag is not supported when BIF_NEWDIALOGSTYLE is specified.
var BIF_RETURNFSANCESTORS	= 0x0008; // Only return file system ancestors. An ancestor is a subfolder that is beneath the root folder in the namespace hierarchy. If the user selects an ancestor of the root folder that is not part of the file system, the OK button is grayed.
var BIF_EDITBOX			= 0x0010; // Version 4.71. Include an edit control in the browse dialog box that allows the user to type the name of an item.
var BIF_VALIDATE		= 0x0020; // Version 4.71. If the user types an invalid name into the edit box, the browse dialog box calls the application's BrowseCallbackProc with the BFFM_VALIDATEFAILED message. This flag is ignored if BIF_EDITBOX is not specified.
var BIF_NEWDIALOGSTYLE		= 0x0040; // Version 5.0. Use the new user interface. Setting this flag provides the user with a larger dialog box that can be resized. The dialog box has several new capabilities, including: drag-and-drop capability within the dialog box, reordering, shortcut menus, new folders, delete, and other shortcut menu commands. Note  If Component Object Model (COM) is initialized through CoInitializeEx with the COINIT_MULTITHREADED flag set, SHBrowseForFolder fails if BIF_NEWDIALOGSTYLE is passed.
var BIF_BROWSEINCLUDEURLS	= 0x0080; // Version 5.0. The browse dialog box can display URLs. The BIF_USENEWUI and BIF_BROWSEINCLUDEFILES flags must also be set. If any of these three flags are not set, the browser dialog box rejects URLs. Even when these flags are set, the browse dialog box displays URLs only if the folder that contains the selected item supports URLs. When the folder's IShellFolder::GetAttributesOf method is called to request the selected item's attributes, the folder must set the SFGAO_FOLDER attribute flag. Otherwise, the browse dialog box will not display the URL.
var BIF_USENEWUI		= BIF_EDITBOX | BIF_NEWDIALOGSTYLE; // Version 5.0. Use the new user interface, including an edit box. This flag is equivalent to BIF_EDITBOX | BIF_NEWDIALOGSTYLE. Note  If COM is initialized through CoInitializeEx with the COINIT_MULTITHREADED flag set, SHBrowseForFolder fails if BIF_USENEWUI is passed.
var BIF_UAHINT			= 0x0100; // Version 6.0. When combined with BIF_NEWDIALOGSTYLE, adds a usage hint to the dialog box, in place of the edit box. BIF_EDITBOX overrides this flag.
var BIF_NONEWFOLDERBUTTON	= 0x0200; // Version 6.0. Do not include the New Folder button in the browse dialog box.
var BIF_NOTRANSLATETARGETS	= 0x0400; // Version 6.0. When the selected item is a shortcut, return the PIDL of the shortcut itself rather than its target.
var BIF_BROWSEFORCOMPUTER	= 0x1000; // Only return computers. If the user selects anything other than a computer, the OK button is grayed.
var BIF_BROWSEFORPRINTER	= 0x2000; // Only allow the selection of printers. If the user selects anything other than a printer, the OK button is grayed. In Microsoft Windows XP and later systems, the best practice is to use a Windows XP-style dialog, setting the root of the dialog to the Printers and Faxes folder (CSIDL_PRINTERS).
var BIF_BROWSEINCLUDEFILES	= 0x4000; // Version 4.71. The browse dialog box displays files as well as folders.
var BIF_SHAREABLE		= 0x8000; // Version 5.0. The browse dialog box can display shareable resources on remote systems. This is intended for applications that want to expose remote shares on a local system. The BIF_NEWDIALOGSTYLE flag must also be set.

/**
 * ShellSpecialFolderConstants Enumerated Type
 *
 * @see		http://msdn.microsoft.com/en-us/library/bb774096(VS.85).aspx
 */
var BSF_DESKTOP			= 0x00; // (0). Microsoft Windows desktop-the virtual folder that is the root of the namespace.
//var BSF_INTERNETEXPLORER	= 0x01; // (1). Internet Explorer is the root.
var BSF_PROGRAMS		= 0x02; // (2). File system directory that contains the user's program groups (which are also file system directories). A typical path is C:\Users\username\AppData\Roaming\Microsoft\Windows\Start Menu\Programs.
var BSF_CONTROLS		= 0x03; // (3). Virtual folder that contains icons for the Control Panel applications.
var BSF_PRINTERS		= 0x04; // (4). Virtual folder that contains installed printers.
var BSF_PERSONAL		= 0x05; // (5). File system directory that serves as a common repository for a user's documents. A typical path is C:\Users\username\Documents.
var BSF_FAVORITES		= 0x06; // (6). File system directory that serves as a common repository for the user's favorite URLs. A typical path is C:\Documents and Settings\username\Favorites.
var BSF_STARTUP			= 0x07; // (7). File system directory that corresponds to the user's Startup program group. The system starts these programs whenever any user first logs into their profile after a reboot. A typical path is C:\Users\username\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\StartUp.
var BSF_RECENT			= 0x08; // (8). File system directory that contains the user's most recently used documents. A typical path is C:\Users\username\AppData\Roaming\Microsoft\Windows\Recent.
var BSF_SENDTO			= 0x09; // (9). File system directory that contains Send To menu items. A typical path is C:\Users\username\AppData\Roaming\Microsoft\Windows\SendTo.
var BSF_BITBUCKET		= 0x0a; // (10). Virtual folder that contains the objects in the user's Recycle Bin.
var BSF_STARTMENU		= 0x0b; // (11). File system directory that contains Start menu items. A typical path is C:\Users\username\AppData\Roaming\Microsoft\Windows\Start Menu.

var BSF_DESKTOPDIRECTORY	= 0x10; // (16). File system directory used to physically store the file objects that are displayed on the desktop. It is not to be confused with the desktop folder itself, which is a virtual folder. A typical path is C:\Documents and Settings\username\Desktop.
var BSF_DRIVES			= 0x11; // (17). My Computer-the virtual folder that contains everything on the local computer: storage devices, printers, and Control Panel. This folder can also contain mapped network drives.
var BSF_NETWORK			= 0x12; // (18). Network Neighborhood-the virtual folder that represents the root of the network namespace hierarchy.
var BSF_NETHOOD			= 0x13; // (19). A file system folder that contains any link objects in the My Network Places virtual folder. It is not the same as var BSF_NETWORK, which represents the network namespace root. A typical path is C:\Users\username\AppData\Roaming\Microsoft\Windows\Network Shortcuts.
var BSF_FONTS			= 0x14; // (20). Virtual folder that contains installed fonts. A typical path is C:\Windows\Fonts.
var BSF_TEMPLATES		= 0x15; // (21). File system directory that serves as a common repository for document templates.
var BSF_COMMONSTARTMENU		= 0x16; // (22). File system directory that contains the programs and folders that appear on the Start menu for all users. A typical path is C:\Documents and Settings\All Users\Start Menu. Valid only for Windows NT systems.
var BSF_COMMONPROGRAMS		= 0x17; // (23). File system directory that contains the directories for the common program groups that appear on the Start menu for all users. A typical path is C:\Documents and Settings\All Users\Start Menu\Programs. Valid only for Windows NT systems.
var BSF_COMMONSTARTUP		= 0x18; // (24). File system directory that contains the programs that appear in the Startup folder for all users. A typical path is C:\Documents and Settings\All Users\Microsoft\Windows\Start Menu\Programs\StartUp. Valid only for Windows NT systems.
var BSF_COMMONDESKTOPDIR	= 0x19; // (25). File system directory that contains files and folders that appear on the desktop for all users. A typical path is C:\Documents and Settings\All Users\Desktop. Valid only for Windows NT systems.
var BSF_APPDATA			= 0x1a; // (26). Version 4.71. File system directory that serves as a common repository for application-specific data. A typical path is C:\Documents and Settings\username\Application Data.
var BSF_PRINTHOOD		= 0x1b; // (27). File system directory that contains any link objects in the Printers virtual folder. A typical path is C:\Users\username\AppData\Roaming\Microsoft\Windows\Printer Shortcuts.
var BSF_LOCALAPPDATA		= 0x1c; // (28). Version 5.0. File system directory that serves as a data repository for local (non-roaming) applications. A typical path is C:\Users\username\AppData\Local.
var BSF_ALTSTARTUP		= 0x1d; // (29). File system directory that corresponds to the user's non-localized Startup program group.
var BSF_COMMONALTSTARTUP	= 0x1e; // (30). File system directory that corresponds to the non-localized Startup program group for all users. Valid only for Microsoft Windows NT systems.
var BSF_COMMONFAVORITES		= 0x1f; // (31). File system directory that serves as a common repository for the favorite URLs shared by all users. Valid only for Windows NT systems.
var BSF_INTERNETCACHE		= 0x20; // (32). File system directory that serves as a common repository for temporary Internet files. A typical path is C:\Users\username\AppData\Local\Microsoft\Windows\Temporary Internet Files.
var BSF_COOKIES			= 0x21; // (33). File system directory that serves as a common repository for Internet cookies. A typical path is C:\Documents and Settings\username\Application Data\Microsoft\Windows\Cookies.
var BSF_HISTORY			= 0x22; // (34). File system directory that serves as a common repository for Internet history items.
var BSF_COMMONAPPDATA		= 0x23; // (35). Version 5.0. Application data for all users. A typical path is C:\Documents and Settings\All Users\Application Data.
var BSF_WINDOWS			= 0x24; // (36). Version 5.0. Windows directory. This corresponds to the %windir% or %SystemRoot% environment variables. A typical path is C:\Windows.
var BSF_SYSTEM			= 0x25; // (37). Version 5.0. The System folder. A typical path is C:\Windows\System32.
var BSF_PROGRAMFILES		= 0x26; // (38). Version 5.0. Program Files folder. A typical path is C:\Program Files.
var BSF_MYPICTURES		= 0x27; // (39). My Pictures folder. A typical path is C:\Users\username\Pictures.
var BSF_PROFILE			= 0x28; // (40). Version 5.0. User's profile folder.
var BSF_SYSTEMx86		= 0x29; // (41). Version 5.0. System folder. A typical path is C:\Windows\System32, or C:\Windows\Syswow32 on a 64-bit computer.

var BSF_PROGRAMFILESx86		= 0x30; // (48). Version 6.0. Program Files folder. A typical path is C:\Program Files, or C:\Program Files (X86) on a 64-bit computer.

/**
 * Creates a dialog box that enables the user to select a folder and then returns the selected folder's path.
 *
 * @param	Integer	Hwnd		The handle to the parent window of the dialog box. This value can be zero. 
 * @param	String	sTitle		A String value that represents the title displayed inside the Browse dialog box.
 * @param	Integer	iOptions	An Integer value that contains the options for the method. This can be zero or a combination of the BIF_xxx values.
 * @param	Mixed	vRootFolder	The root folder to use in the dialog box. The user cannot browse higher in the tree than this folder. If this value is not specified, the root folder used in the dialog box is the desktop. This value can be a string that specifies the path of the folder or one of the BSF_XXX values. 
 * @return	String	Fully qualified path to folder
 *
 * @see		http://msdn.microsoft.com/en-us/library/bb774065(VS.85).aspx
 * @see		http://msdn.microsoft.com/en-us/library/bb773205(VS.85).aspx
 * @see		http://msdn.microsoft.com/en-us/library/bb774096(VS.85).aspx
 * @see		http://blogs.msdn.com/gstemp/archive/2004/02/17/74868.aspx#ctl00___ctl00___ctl00_ctl00_bcr_ctl00___Comments___Comments_ctl07_NameLink
 */
function BrowseForFolder(Hwnd, sTitle, iOptions, vRootFolder)
{
	var shell = new ActiveXObject("Shell.Application");
	var folder = shell.BrowseForFolder(Hwnd, sTitle, iOptions, vRootFolder);

	// Dialog has been closed (by the Close command or the Cancel button)
	if ( folder == null ) {
		return null;
	}

	var e;
	var path = null;

	try {
		path = folder.ParentFolder.ParseName(folder.Title).Path;
	} catch (e) {
		var colon = folder.Title.lastIndexOf(":");
		if ( colon == -1 ) {
			return null;
		}

		path = folder.Title.slice(colon - 1, colon + 1) + "\\";
	}

	return path;
};

