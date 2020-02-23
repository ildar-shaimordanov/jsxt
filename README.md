# jsxt2

The collection of Javascript / JScript extensions, tools and more

# Preamble

This project is assumed to supersede the earlier one having the stuff with the same funtionality. These days both projects are still supported. However in the future the useful components will migrate here. Finally when all the good things will have came here, the predecessor will be deprecated, archived and kept just in historical reasons.

The key tool of this repository is `wscmd`. Initially it was invented as `JSCmd.wsf` in far March 2009 in the attempts to close the existing hole and implement REPL in Windows JScript. During these years it was transformed to the current `bat` + `js` hybrid producing a temporary `wsf` file which acts further.

## What do we have and not have?

Most of languages have REPL. Other JavaScript implementations have REPL. NodeJS, the popular JavaScript engine at the present, has REPL. Rhino, Java-based JavaScript engine, has REPL. Win10 wins the world and PowerShell has REPL, but JScript doesn't still have REPL.

JScript (not JScript.Net) is not very popular engine and it seems not having strong support from Microsoft. Most probably that's why it doesn't have a lot of useful stuff like REPL and/or core features declared by the Standard of ECMA262 and supplied by other engines.

To close this lack I tried to implement REPL with JavaScript itself only, simple as much as possible and without invoking any external tools.

# Other implementations (in the order of publication)

* __JSXT__, my previous implementation, at https://github.com/ildar-shaimordanov/jsxt/
  - announce and discussions (in Russian) http://forum.script-coding.com/viewtopic.php?id=7766
* __JavaScript REPL for Windows__ at https://github.com/rcrossrd/JSREPL.
  There is three part story about the project:
  - [Part 1](https://sinesquare.wordpress.com/2011/08/25/javascript-repl-for-windows-part1motivation-choices-and-first-steps/)
  - [Part 2](https://sinesquare.wordpress.com/2011/08/25/javascript-repl-for-windows-part-2breakpoints-and-debug-repl/)
  - [Part 3](https://sinesquare.wordpress.com/2011/08/25/javascript-repl-for-windows-part-3dynamic-breakpoints/)
* __JREPL__ at https://www.dostips.com/forum/viewtopic.php?f=3&t=6044
* Something close to the subject of the discussion (in Russian) http://forum.script-coding.com/viewtopic.php?id=11325
