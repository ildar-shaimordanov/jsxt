<!-- toc-begin -->
# Table of Content
* [NAME](#name)
* [USAGE](#usage)
  * [Usage (briefly)](#usage-briefly)
  * [Usage (in details)](#usage-in-details)
* [DESCRIPTION](#description)
* [VARIABLES, FUNCTIONS and OBJECTS](#variables-functions-and-objects)
  * [CommonJS](#commonjs)
  * [Frequently used WSH objects](#frequently-used-wsh-objects)
  * [General purpose objects](#general-purpose-objects)
  * [Loop mode](#loop-mode)
  * [REPL mode](#repl-mode)
* [EXAMPLES](#examples)
* [AUTHORS and CONTRIBUTORS](#authors-and-contributors)
* [LICENSE](#license)
<!-- toc-end -->


# NAME

**WSX** - execute external scripts, one-liner programs or run in REPL mode


# USAGE

The CLI options supplying the program codes for execution could be infixed with the language identifier (`js` or `vbs`) supposed to be used for processing these options. See examples below.

## Usage (briefly)

Run the script file

    wsx [options] scriptfile [arguments]

Run in the interactive mode

    wsx [options] [/quiet]
    wsx [options] [/q]

Run the one line program

    wsx [options] [/begin:...] [/end:...] /e:... [arguments]

Run the program in a loop

    wsx [options] [/begin:...] [/end:...] [/beginfile:...] [/endfile:...] /n [/e:...] [arguments]
    wsx [options] [/begin:...] [/end:...] [/beginfile:...] [/endfile:...] /p [/e:...] [arguments]

The [options] above refers to other options not mentioned explicitly (see below).

## Usage (in details)

Be aware: the options following after the script file or after the options declaring the one-liner program parts are considered as the arguments of the program and will be passed respectively.

```

Usage: wsx.wsf [/help] [/version] [/check] [/quiet] [/lib:value] [/vt] [/use:value] [/m:value] [/let:value] [/set:value] [/get:value] [/re:value] [/split:value] [/n] [/p] [/e:value] [/begin:value] [/end:value] [/beginfile:value] [/endfile:value] [scriptfile] [/f:value] [arguments]

Options:

help       : Print full description and exit ("/h" shortcut)
version    : Print version information and exit
check      : Show in pseudo-code what is assumed to be executed and exit. It MUST preface other options
quiet      : Be quiet in the interactive mode ("/q" shortcut)
lib        : Prepend directories to the search path for modules ("/l" shortcut)
vt         : Enable VT globally, for all outputs
use        : Use (switch to) the language ("js" or "vbs")
m          : Load the module and import identifiers "[alias=]module[,[alias=]id,...]"
let        : Assign the value: "name=value"
set        : Create the object: "name=CreateObject(object)"
get        : Get the object: "name=GetObject(object)"
re         : Assign the regular expression: "name=regexp" or "name=/regexp/igm"
split      : Split "LINE" to "FIELDS" by a pattern (string or regexp; defaults to "/\s+/")
n          : Apply a program in the loop like "while read LINE { ... }"
p          : Apply a program in the loop like "while read LINE { ... print LINE }"
e          : One line program (multiple "/e"'s supported)
begin      : The code for executing before the loop or main program
end        : The code for executing after the loop or main program
beginfile  : The code for executing before processing the input file
endfile    : The code for executing after processing the input file
scriptfile : The script file
f          : Open a file as "ascii", "unicode" or using system "default"
arguments  : Other arguments to be passed to the program

```


# DESCRIPTION

**WSX** stands for the recursive acronym **WSX Simulating eXecutable**.

It runs an external script file in the same way as it can be done traditionally via CScript or WScript with additional benefits making its usage closer to NodeJS, Perl, Python etc.

Run itself in the interactive mode. Type in the prompt any JS or VBS commands and execute them immediately. In this mode each entered line is evaluated immediately. To enable many lines executed as one you need to surround them with the double colons `::`. The first double colon turns on the multiline mode, the second one turns it off. After that everything entered will be executed.

It runs the one-liner program from CLI and apply it on inputstream and other files. The one-line program allows to estimate some code on the fly, without creating a temporary file. Writing it, you focus on the most important parts of the program implementation. Even if some implementation stuff -- like objects initialization, preliminary I/O operations etc -- are hidden off your eyes, they are still executed implicitly.

If the tool is launched with the one-liner program, everything after is assumed as a file name. Each argument is opened as a file and processed line by line until the end of file. Otherwise, if no any one-liner program is entered, the first item of the argument list is the script file and the rest of arguments are arguments for the script file. They could be everything and the script can use them accordingly its functionality.


# VARIABLES, FUNCTIONS and OBJECTS

The tool supplies set of predefined objects to make its own functionality closer to NodeJS, Rhino and other modern and powerful JavaScript engines.

For more convenience they are presented separately in the sections below.

## CommonJS

This script implements few features suggested by CommonJS extending them with WSH specialties.

* `console.log()` and friends - display messages
* `require()`                 - load a JS module in RT
* `require.vbs()`             - ditto for VBS (extension)

For details see these links:

* https://nodejs.org/api/console.html
* https://nodejs.org/api/modules.html

## Frequently used WSH objects

* `FSO`     - The object `Scripting.FileSystemObject`
* `SHELL`   - The object `WScript.Shell`
* `STDIN`   - The reference to `WScript.StdIn`
* `STDOUT`  - The reference to `WScript.StdOut`
* `STDERR`  - The reference to `WScript.StdErr`

## General purpose objects

Functions:

* `usage()`, `help()`            - Display this help
* `echo()`, `print()`, `alert()` - Print expressions
* `quit()`, `exit()`             - Quit this shell
* `cmd()`, `shell()`             - Run a command or DOS-session
* `exec()`                       - Run a command in a child shell
                                   (callback handles StdIn/StdOut/StdErr)
* `sleep(n)`                     - Sleep n milliseconds
* `clip()`                       - Read from or write to clipboard
* `enableVT()`                   - Enable VT globally, for all outputs

Objects:

* `ERROR`   - The variable keeping the last error
* `ARGV`    - The CLI arguments

## Loop mode

The following objects are available when the tool is executed in the loop mode as `wsx /n /e:...` or `wsx /p /e:...`.

* `STREAM`  - The reference to the stream of the current file
* `FILE`    - The name of the current file
* `FILEFMT` - The format to open files (`ascii`, `unicode` or system `default`)
* `LINE`    - The current line
* `FLN`     - The line number in the current file
* `LN`      - The total line number

The following array is available when the split mode is turned on with the `/split:...` option.

* `FIELDS`  - The array of fields

These special functions can be used in the loop mode only to cover the issue when we can't use `continue` and `break`.

* `next()`  - acts as the `continue` operator
* `last()`  - acts as the `break` operator

## REPL mode

The interactive mode provides the following useful properties for referencing to the history of the commands and REPL mode:

* `REPL.number`  - the current line number
* `REPL.history` - the list of all commands entered in the current session
* `REPL.quiet`   - the current session mode


# EXAMPLES

Count the number of lines (similar to `wc -l` in Unix).

    wsx /n /endfile:"echo(FLN, FILE)" /end:"echo(LN)"
    wsx /n /endfile:vbs:"echo FLN, FILE" /end:vbs:"echo LN"
    wsx /use:vbs /n /endfile:"echo FLN, FILE" /end:"echo LN"

Numerate lines of each input file (similar to `cat -n` in Unix).

    wsx /p /e:"LINE = LN + ':' + LINE"
    wsx /let:delim=":" /p /e:vbs:"LINE = LN & delim & LINE"

Print first 5 lines (similar to `head -n 5` in Unix). Due to VBScript specifics and necessity of str-to-int conversion, the one-liner program is almost twice longer.

    wsx /let:limit=5 /p /e:"LN > limit && last()"
    wsx /use:vbs /let:limit=5 /begin:"limit = cint(limit)" /p /e:"if LN > limit then last"

Print last 5 lines (similar to `tail -n 5` in Unix). The example is splitted on two lines for better readability.

    wsx /let:limit=5 /n /begin:"L=[]" /end:"echo(L.join('\n'))" ^
        /e:"L.push(LINE); L.length > limit && L.shift()"

The following command generates a markdown file available as a part of the repository. Any changes in the script and its parts are supposed to be replicated to this file also.

    wsx /help | git-md-toc -cut > doc/wsx.md

Also the documentation can be seen as HTML.

    wsx /help | git-md-toc -cut | git-md-html | 2 html

* `git-md-toc` - the Perl script for creating Table of Content.
  It's hosted at https://github.com/ildar-shaimordanov/git-markdown-toc
* `git-md-html` - the set of scripts for converting markdown to HTML.
  They are hosted at https://github.com/ildar-shaimordanov/git-markdown-html
* `2` - the batch script for redirecting STDOUT to any GUI application.
  It's hosted at https://github.com/ildar-shaimordanov/my-scripts


# AUTHORS and CONTRIBUTORS

Ildar Shaimordanov is the main author maintaining the tool since 2009. Initially it was JSCmd.js, the simple jscript file able to perform REPL. Later it evolved to wscmd.bat, the more powerful and configurable BAT+JS hybrid script creating a temporary WSF-file and executing it.

Copyright (C) 2009-2015, 2019-2022 Ildar Shaimordanov


# LICENSE

    MIT

