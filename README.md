_The collection of Javascript / JScript / VBScript extensions, tools and more_

<!-- md-toc-begin -->
# Table of Content
* [List of standalone tools](#list-of-standalone-tools)
* [History](#history)
* [Other REPL implementations](#other-repl-implementations)
<!-- md-toc-end -->

# List of standalone tools

This is the collection of the Javascript / JScript extensions and standalone scripts. It consists of the original scripts by myself and other authors with proper credits.

There are standalone applications:

  * [Network Calculator](https://github.com/ildar-shaimordanov/jsxt/blob/master/wiki/NetCalc.md)
  * [doc2html](https://github.com/ildar-shaimordanov/jsxt/blob/master/wiki/doc2html.md)
  * [Windows Scripting Commander (beta version)](https://github.com/ildar-shaimordanov/jsxt/blob/master/wiki/wscmd.md)

# History

Years ago I invented a simple [REPL](https://en.wikipedia.org/wiki/REPL) script in JScript allowing me to run any (or almost any) javascript code without creating temporary file (in the same way as it can be donw in Perl/Python/NodeJS etc).

Initially it was called as `JSCmd.wsf` in far March 2009 and it could execute any (or almost any) javascript code reading it from command line or STDIN. I did all my best to make it easy in use and flexible as much as possible. I polished it and transformed to `wscmd`, the `bat` + `js` hybrid. Once called, it generates a temporary `wsf` file which acts further and performs all the logic in JScript and VBScript.

# Other REPL implementations

* __JSXT__, the current repository, at https://github.com/ildar-shaimordanov/jsxt/
  - the historically first release in March 23, 2009 [jsxt/5dac276](https://github.com/ildar-shaimordanov/jsxt/commit/5dac2764f8883fe84b085f33cf9aa8c94100c005)
  - announce and discussions (in Russian) http://forum.script-coding.com/viewtopic.php?id=7766
* __JavaScript REPL for Windows__ at https://github.com/rcrossrd/JSREPL.
  There is three part story about the project:
  - [Part 1](https://sinesquare.wordpress.com/2011/08/25/javascript-repl-for-windows-part1motivation-choices-and-first-steps/)
  - [Part 2](https://sinesquare.wordpress.com/2011/08/25/javascript-repl-for-windows-part-2breakpoints-and-debug-repl/)
  - [Part 3](https://sinesquare.wordpress.com/2011/08/25/javascript-repl-for-windows-part-3dynamic-breakpoints/)
* __JREPL__, the cool tool, actively supported by the author on his page at https://www.dostips.com/forum/viewtopic.php?f=3&t=6044
* Something close to the subject of the discussion (in Russian) http://forum.script-coding.com/viewtopic.php?id=11325
