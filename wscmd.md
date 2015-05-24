_This page tells about wscmd, Windows Scripting Command Interpreter. The very fresh version of the script can be downloaded from [FossHub](http://code.fosshub.com/jsxt/downloads) or the [repository](http://code.google.com/p/jsxt/source/browse/trunk/wscmd.bat)._



# Introduction #

Once I understood that absence of any kind of a console mode in WSH is big omission. I thought to myself why masters from Redmond have not implemented this feature for JScript and VBScript. Of course, I know that there are many JavaScript interpreters with the supported console mode (for example, [Rhino](http://www.mozilla.org/rhino/), [JSDB](http://www.jsdb.org/) or [NodeJS](http://nodejs.org/), etc). But all of them have two main shortcomings:
  * They are foreign tools in Windows and should be downloaded and/or installed firstly;
  * They have their own interface of communication with the world that differs of the interface used in JScript.

I had got motivation to start my little job in this direction. Working on my tool I crystallized several features and implemented all of them step by step. Recently now it works almost properly with some limitation. These are the features:
  1. run an external script
  1. execute an inline code both JScript or VBScript entered in the command line
  1. enter to the console or interactive mode
  1. create the resulting WSF file with linked or embeded external libraries
  1. configurable via an external configuration file

Let's consider this tool closer. Its name is Windows Scripting Command Interpreter, or shortly wscmd.

# Help #

First of all it has the displayable help:

```
wscmd /h
wscmd /help
```

Both these commands show the help looking like below:

```
Windows Scripting Command Version 0.22.7 Beta

wscmd [/h | /help | /man]
wscmd [/compile | /embed] [/v var "val"] [/i | /q]
wscmd [/compile | /embed] [/v var "val"] [/js | /vbs] /e "code"
wscmd [/compile | /embed] [/v var "val"] [/js | /vbs] scriptfile
wscmd [/debug] [/v var "val"] [/i | /q] [arguments]
wscmd [/debug] [/v var "val"] [/js | /vbs] /e "code" [arguments]
wscmd [/debug] [/v var "val"] [/js | /vbs] scriptfile [arguments]

    /h, /help    - Display this help
    /man         - Display the configuration files guide
    /compile     - Compile but not execute. Just store to a temporary file
    /embed       - The same as above but embed external scripts into a file
    /debug       - Output debugging information and execute
    /v var "val" - Assign the value "val" to the variable var, before
                   execution of the program begins
    /i           - Interactive mode
    /q           - The same as /i but in quiet mode
    /js          - Assume a value as a JavaScript
    /vbs         - Assume a value as a VBScript
    /e "code"    - Assume a value as a code to be executed
    /e /n "code" - Apply the code in a loop per each line of file(s)
    /e /p "code" - The same as /e /n but print a line also

Extra options are available with /e /n or /e /p:
    /d file      - Opens the file using the system default
    /u file      - Opens the file as Unicode
    /a file      - Opens the file as ASCII

Extra options are used like /n or /p in the same way
    /begin       - A code will be executed at the very beginning
    /end         - A code will be executed at the very end
    /before      - A code will be executed before a file
    /after       - A code will be executed after a file
```

Looking on this help we can say that the tool has a lot of arguments but all of them are optional.

**NOTE**: Order of all arguments is mostly mandatory as they are listed in the help page.

# Execution modes #

The tool has several modes of execution. All of them are considered in the separate sections below. All these modes are controllable using by command line arguments. Which mode will be used depends on which arguments are defined when the toll was launched.

# Console mode #

Let's run it by the following command:

```
wscmd
```

We will find ourselves in the prompt. Try any command that is valid in JScript:

```
wscmd > 2 * 2
4
wscmd > Math.pow(2, 4)
16
wscmd > quit()
```

Excellent! We can see that each command is executed and its result is displayed immediately. And we know that stop an execution of wscmd is performed by the command `quit()`. This function is wrapper for the `WScript.Quit()` method from WSH.

Fine! We have the working console mode and it allows us to execute any JScript command and to see results. To know better the console mode let's run the command `help()`:

```
wscmd > help()

Commands                 Descriptions
========                 ============
help(), usage()          Display this help
alert(), echo(), print() Print expressions
quit(), exit()           Quit this shell
eval.history             Display the history
eval.save([format])      Save the history to the file
eval.inspect()           The stub to transform output additionally
cmd(), shell()           Run new DOS-session
sleep(n)                 Sleep n milliseconds
clip()                   Gets from the clipboard data formatted as text
reload()                 Stop this session and run new
gc()                     Run the garbage collector
```

We see that the console mode provides us several useful functions that are wrappers over some standard methods from WSH. They are implemented for the faster typing and some commands have aliases like `cmd()`, `quit()`, or `alert()`.

The `eval.history` variable keeps the history of all commands enteredduring this session. The `eval.save()` command allows to store all commands to the `.\wscmd.history` file that is always located in the current directory.

The `sleep()` function suspends script execution for a specified length of time.

The `gc` function is the alias of the built-in function `CollectGarbage`.

The `reload()`function reloads the tool and the current session.

The `eval.inspect()` is the stub function. It can be useful in the case when you want customize of displaying results. For example, complex objects are displayed as the `[object Object]` string. If you have some function allowing display structures of objects so you want to apply it. Just assign this function to the `eval.transform`.

The `clip()` function is used to get text data from the clipboard.

## Multiple lines ##

This mode is a part of the Console mode. Working in this mode you can feel the feature allowing enter commands in several lines. For example (Make sure! The backslash at the end of the first line starts the multiple lines mode):

```
wscmd > function sign(a, b) {\
wscmd ::  if ( a > b ) {
wscmd ::    return +1;
wscmd ::  }
wscmd ::  if ( a < b ) {
wscmd ::    return -1;
wscmd ::  }
wscmd ::  return 0;
wscmd ::}
wscmd ::
wscmd >
wscmd > sign
```

The multiline mode is stopped when you enter an empty string twice. If you need keep empty lines in a code or you copy-and-paste some code having empty lines then this will fail because double entered empty line stops the multiline mode and brings to exception. For this reason multiline mode was extended to enable entering of empty lines. To start this kind of mode just enter the string having two and only two backslashes `\\`. This enough to keep empty lines and do not break entering of code. To stop this mode just repeat entering of backslashes `\\`.

```
wscmd > \\
wscmd :: function sign(a, b) {
wscmd ::  if ( a > b ) {
wscmd ::    return +1;
wscmd ::  }
wscmd :: 
wscmd ::  if ( a < b ) {
wscmd ::    return -1;
wscmd ::  }
wscmd :: 
wscmd ::  return 0;
wscmd ::}
wscmd ::\\
wscmd >
wscmd > sign
```

Do not mix up one mode with another one -- single trailing backslash is stopped by the doubled empty string; but the string of double backslashes only `\\` starts and stops the extended mode.

# External scripts #

Ok. We were introduced to the console mode. It's time to know others. Let's create the file `script.js` and save it with the following text:

```
alert('Hello, world!');
```

and run it as follows:

```
wscmd script.js
```

Fine again! It works. What about VBScript? It works too:

```
' Save this file as script.vbs and run it
alert "Hello, world!"
```

```
wscmd /vbs script.vbs
```

# Inline mode #

Now we can investigate the last mode of the tool - inline mode. It considers any string from the command line as valid JScript or VBScript commands and executes them:

```
wscmd /js  /e "alert(2 * 2)"

wscmd /vbs /e "alert 2 * 2"
```

There is some small trouble with a command line in DOS. The DOS-shell has many restrictions in its syntax, and we should double quotes characters within quotes:

```
wscmd /js  /e "alert(""Hello, World^!"")" 
wscmd /vbs /e "alert ""Hello, World^!""" 
```

This is slightly uncomfortable because we have to follow the number of quotes. Also do not forget the question mark -- it should be escaped by the caret character as it is usual in the DOS-shell (see both examples above).

If you feel discomfort with this you can try another solution -- pipes:

```
echo alert("Hello, world") | wscmd /q
```

For VBScript Inline mode the workaround solution was not found.

## Inline mode for processing of files ##

Using the `/e /n` (or `/e /p`) option the rest of arguments is considered as a list of files. Thus each file will be open, read and processed line-by-line. The code provided in the command line will be applied per each line.

This is good feature because you do not need to implement a code like below:

```
var fso = new ActiveXObject(�Scripting.FileSystemObject�);

var args = WScript.Arguments;
for (var i = 0; i < args.length; i++) {
    var filename = args[i];
    var h = fso.OpenTextFile(filename);
    var lineNumber = 0;
    while ( ! h.AtEndOfStream ) {
        var line = h.ReadLine();
        lineNumber++;
        line = filename + ':' + lineNumber + ':' + line;
        WScript.Echo(line);
    }
    h.Close();
}
```

The following examples show how use this option with others.

```
wscmd /e /n "line && alert(line)" file1
```

The code above will display non-empty lines only from the `file1` file.

Another option, `/p`, is the same as but prints each line:

```
wscmd /e /p "line = lineNumber + line" file1
```

The code above will display all lines with the line number at the beginning of a line.

There are several options performing preprocessing and postprocessing actions
  * `/begin` assumes a code to be executed at the very beginning, before any file will be processed.
  * `/end` assumes a code to be executed at the very end, after all fies have been processed.
  * `/before` will execute a code before opening a file.
  * `/after` will execute a code after closing a file.

The next code shows how to print the summary line number for all files:

```
wscmd /e /end "alert(lineNumber)" file1 file2
```

This code shows how to print the number of lines in each file:

```
wscmd /e /after "alert(currentNumber)" file1 file2
```

It should be noticed that the code above does not implement needful validation of input files (file existence, readable, etc). Using `/e /n` (or `/e /p`) you are free of this because it is implemented already.

To force a format of input files there are three additional arguments:
  * `/d` - Opens the file using the system default
  * `/u` - Opens the file as Unicode
  * `/a` - Opens the file as ASCII

The next example shows how to parse both Unicode and ASCII encoded files:
```
wscmd /e /p "" /u file1 file2 /a file3 file4 
```

# Variables #

Using `/v var "val"` option you can assign the `"val"` text value to the `var` variable, before the execution of the script (external or inline one) begins. The following example will output the string `Hello,World`:

```
wscmd /v x "Hello" /v y "World" /e "alert(x, y)"
```

# Extras #

## Debug mode ##

The debug mode is an additional feature that allows to see what libraries are linked:

```
wscmd /debug

wscmd /debug script.js

wscmd /debug /vbs /e "print 2 * 2"
```

## So-called compilation ##

Surely, this is not real compilation. But this allows to put together all libraries and the working script into one WSH file as a) linked external scripts using the `<script>` tag or b) embed into this WSH file directly. Use one of them:
  * `/compile` - creates the temporary file on a disk without execution. All external libraries will be Linked using `<script src="...">` tag.
  * `/embed` - the same as above but all scripts will be embeded into the resulting file. This will grow the file but make it standalone and portable with no dependencies.

## Configuration ##

Now this is the time to talk about hwo to configure the tool. It is easy. Just create the file named as `wscmd.ini`, fill it and save into one of the two places: the directory where `wscmd.bat` is located or into the current working directory. Also you can create a file in the same location as your script (let say `script.ext`) and with the name `script.ext.ini` (that means the same name and extension of your working script with appended an additional extension `.ini`). The content of this file is easy too -- three configurational parameters:

`import` - defines a pattern of files to be included as libraries. You can use the following macros for refer to
  * `%~d0` - the disk
  * `%~p0` - the path
  * `%~n0` - the filename
  * `%~x0` - the extension

The default value allows all `js\*.js`, `js\win32\*.js` and `vbs\win32\*.vbs` files from the tool's location directory.

It is possible to prevent including of any files. Just use the following configuration string `import=no`, so none external script will be included.

`execute` - defines the path to the temporary file. The default value refers to the `$$$wscmd.wsf` file in the current directory.

`command` - defines the command that will run your script. Don't tuch it. This is `%WINDIR%\system32\cscript.exe //NoLogo`, mostly optimal for all purposes.

# Conclusion #

In spite of these bugs `wscmd` is very useful and flexible, allows to develop new scripts and both the console mode and the inline mode aloows quickly estimate any expressions.

Due to the script is under persistent modification, download the very actual version from [this page](http://code.google.com/p/jsxt/source/browse/trunk/wscmd.bat) and try its features as described here.