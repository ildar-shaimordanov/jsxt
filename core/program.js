//
// program.js
// This script is the part of the wsx
//
// Copyright (c) 2019-2024 by Ildar Shaimordanov
//

var program = {
	argv: [],

	libs: [],

	vt: false,

	check: false,
	quiet: false,
	inLoop: 0,

	lang: "js",

	modules: [],
	vars: [],

	main: [],
	script: [],

	begin: [],
	end: [],
	beginfile: [],
	endfile: [],

	splitMode: false,
	splitBy: '/\\s+/',

	print: (function() {
		var printCScript = function(streamId, msg) {
			WScript[streamId].WriteLine(msg);
		};

		var printWScript = function(streamId, msg) {
			WScript.Echo(msg);
		};

		return WScript.FullName.match(/cscript\.exe$/i)
			? printCScript
			: printWScript;
	})(),

	showHelp: function() {
		WScript.Arguments.ShowUsage();
		this.print('StdOut', getResource('HELP'));
	},

	showVersion: (function() {
		var me = WScript.ScriptName;
		var versionStr = [
			typeof NAME == 'string' ? NAME + ' (' + me + ')' : me
		,	': Version '
		,	typeof VERSION == 'string' ? VERSION : '0.0.1'
		,	'\n'
		,	WScript.Name
		,	': Version '
		,	WScript.Version
		,	', Build '
		,	WScript.BuildVersion
		].join('');

		return function() {
			this.print('StdOut', versionStr);
		};
	})(),

	getLang: function(lang) {
		return (lang || this.lang).toLowerCase();
	},

	setInLoop: function(mode) {
		var loopTypes = { i: 0, n: 1, p: 2 };
		this.inLoop = loopTypes[ mode.toLowerCase() ];
	},

	setSplitMode: function(pattern) {
		this.setInLoop('n');
		this.splitMode = true;
		if ( ! pattern ) {
			return;
		}
		var v = this.validateStringAsRegexp(pattern);
		this.splitBy = v.pattern == v.origin
			? '"' + v.pattern + '"'
			: '/' + v.pattern + '/' + v.modifiers;
	},

	addScript: function(lang, name) {
		name = name.replace(/\\/g, '\\\\');
		var result = '';
		if ( this.getLang(lang) == "vbs" ) {
			result = 'require.vbs("' + name + '")';
		} else {
			result = 'require("' + name + '")';
		}
		return result;
	},

	addModule: function(lang, imports) {
		var re = /(?:([^=,]+)=)?([^=,]+)(?:,|$)/g;

		var m = re.exec(imports);

		if ( ! m ) {
			return;
		}

		var s = this.addScript(lang, m[2]);
		var r = [];

		var aliasName = m[1];
		var alias = aliasName || 'imports';

		while ( m = re.exec(imports) ) {
			r.push(( m[1] || m[2] ) + ' = ' + alias + '.' + m[2]);
		}

		if ( r.length || aliasName ) {
			r.unshift(alias + ' = ' + s);
			s = r.join('; ');
		}

		this.modules.push(s);
	},

	validateStringAsRegexp: function(str) {
		var m = str.match(/^\/(.+)\/([igm]*)$|^((?!\/).+(?!\/))$/);
		if ( ! m ) {
			throw new Error('StdErr', 'Bad regexp: ' + str);
		}
		return {
			pattern: m[1] || m[3],
			modifiers: m[2],
			origin: str
		};
	},

	vbsVar: function(name, value, setter) {
		var result = 'Dim ' + name;
		switch( setter.toLowerCase() ) {
		case 'let': result += ' : ' + name + ' = \\"' + value + '\\"'; break;
		case 'set': result += ' : Set ' + name + ' = CreateObject(\\"' + value + '\\")'; break;
		case 'get': result += ' : Set ' + name + ' = GetObject(\\"' + value + '\\")'; break;
		case 're':
			var v = this.validateStringAsRegexp(value);
			result += ' : Set ' + name + ' = New RegExp';
			result += ' : ' + name + '.Pattern = \\"' + v.pattern.replace(/\\/g, '\\\\')  + '\\"';

			var f = {
				i: 'IgnoreCase',	// name.IgnoreCase = True
				g: 'Global',		// name.Global = True
				m: 'Multiline'		// name.Multiline = true
			};
			for (var p in f) {
				if ( v.modifiers.indexOf(p) >= 0 ) {
					result += ' : ' + name + '.' + f[p] + ' = True';
				}
			}

			break;
		}
		return 'require.vbs.exporter.Execute("' + result + '")';
	},

	jsVar: function(name, value, setter) {
		//var result = 'var ' + name;
		var result = name;
		switch( setter.toLowerCase() ) {
		case 'let': result += ' = "' + value + '"'; break;
		case 'set': result += ' = new ActiveXObject("' + value + '")'; break;
		case 'get': result += ' = GetObject("' + value + '")'; break;
		case 're':
			var v = this.validateStringAsRegexp(value);
			result += ' = /' + v.pattern + '/' + v.modifiers;
			break;
		}
		return result;
	},

	addVar: function(lang, name, value, setter) {
		var result;
		if ( this.getLang(lang) == "vbs" ) {
			result = this.vbsVar(name, value, setter);
		} else {
			result = this.jsVar(name, value, setter);
		}
		this.vars.push(result);
	},

	addCode: function(lang, code, region) {
		var result = '';
		if ( this.getLang(lang) == "vbs" ) {
			result = 'require.vbs.exporter.Execute("' + code + '")';
		} else {
			result = code;
		}
		this[region || 'main'].push(result);
	},

	detectScriptFile: function() {
		if ( this.main.length ) {
			return;
		}
		if ( this.inLoop ) {
			return;
		}
		if ( ! this.argv.length ) {
			return;
		}

		var scriptFile = this.argv.shift();
		if ( ! /^\.?\.?[\\\/]|^[A-Z]:/.test(scriptFile) ) {
			scriptFile = './' + scriptFile;
		}
		var m = scriptFile.match(/\.(vbs|js)$/i);
		var lang = m ? m[1].toLowerCase() : this.lang;
		this.script.push(this.addScript(lang, scriptFile));
	},

	parseArguments: function() {
		var optionsDisabled = false;

		// Walk through all named and unnamed arguments because
		// we have to handle each of them even if they duplicate
		for (var i = 0; i < WScript.Arguments.length; i++) {

			var arg = WScript.Arguments.Item(i);

			var m;

			m = arg.match(/^\/(?:e|((?:begin|end)(?:file)?))(?::(js|vbs))?(?::(.*))?$/i);
			if ( m ) {
				this.addCode(m[2], m[3], m[1]);
				optionsDisabled = true;
				continue;
			}

			/*
			Any other options specified after the options
			declaring a one-liner program are considered
			as arguments for the program and will be passed
			without processing.
			*/
			if ( optionsDisabled ) {
				break;
			}

			m = arg.match(/^\/h(?:elp)?$/i);
			if ( m ) {
				this.showHelp();
				WScript.Quit();
			}

			m = arg.match(/^\/version$/i);
			if ( m ) {
				this.showVersion();
				WScript.Quit();
			}

			m = arg.match(/^\/check$/i);
			if ( m ) {
				this.check = true;
				continue;
			}

			m = arg.match(/^\/vt$/i);
			if ( m ) {
				this.vt = true;
				continue;
			}

			m = arg.match(/^\/l(?:ib)?:(.+)$/i);
			if ( m ) {
				this.libs.push(m[1]);
				continue;
			}

			m = arg.match(/^\/q(?:uiet)?$/i);
			if ( m ) {
				this.quiet = true;
				continue;
			}

			m = arg.match(/^\/use:(js|vbs)$/i);
			if ( m ) {
				this.lang = m[1];
				continue;
			}

			m = arg.match(/^\/m(?::(js|vbs))?:(.+)?$/i);
			if ( m ) {
				this.addModule(m[1], m[2]);
				continue;
			}

			m = arg.match(/^\/(let|set|get|re)(?::(js|vbs))?:(\w+)=(.*)$/i);
			if ( m ) {
				this.addVar(m[2], m[3], m[4], m[1]);
				continue;
			}

			m = arg.match(/^\/split(?::(.*))?$/i);
			if ( m ) {
				this.setSplitMode(m[1]);
				continue;
			}

			m = arg.match(/^\/([np])$/i);
			if ( m ) {
				this.setInLoop(m[1]);
				continue;
			}

			/*
			If nothing more matching our options, we pass
			them to the program or script. This looks a bit
			ugly, but it is reliable enough to stop looping
			over the rest of the CLI options.
			*/
			break;

		}

		if ( this.splitMode && this.inLoop ) {
			this.main.unshift('FIELDS = LINE.split(' + this.splitBy + ')');
		}

		// Now the rest of arguments goes to user scripts
		for ( ; i < WScript.Arguments.length; i++) {
			var arg = WScript.Arguments.Item(i);
			this.argv.push(arg);
		}

		// Detect invocation and setup the main script
		this.detectScriptFile();
	},

	showPseudoCode: function() {
		var s = [];

		if ( this.vt ) {
			s.push('::turn on vt');
		}

		s.push.apply(s, this.modules);
		s.push.apply(s, this.vars);

		if ( this.script.length ) {
			// wsx scriptfile
			s.push.apply(s, this.script);
		} else if ( this.main.length == 0 && ! this.inLoop ) {
			// wsx [/q[uiet]]
			s.push.apply(s, [
				'::while read',
				'::eval',
				'::print',
				'::loop while'
			]);
		} else if ( ! this.inLoop ) {
			// wsx /e:"..."
			s.push.apply(s, this.begin);
			s.push.apply(s, this.main);
			s.push.apply(s, this.end);
		} else {
			// wsx /n
			// wsx /p
			s.push.apply(s, this.begin);

			if ( this.inLoop ) {
				s.push('::foreach FILE do');
				s.push.apply(s, this.beginfile);
				s.push('::while read LINE do');
			}

			s.push.apply(s, this.main);

			if ( this.inLoop == 2 ) {
				s.push('::print LINE');
			}

			if ( this.inLoop ) {
				s.push('::loop while');
				s.push.apply(s, this.endfile);
				s.push('::loop foreach');
			}

			s.push.apply(s, this.end);
		}

		this.print('StdOut', s.join('\n'));
	},

	// Run the code in the global scope
	run: function() {
		this.runner.call(null, this);
	},

	/*
	This method itself is executed in the global scope. Thus, "this"
	refers to the global object. Everything is declared and executed
	within the scope of this method. So everything is visible to
	each other.
	*/
	runner: function(program) {
		/*
		The following variables are declared without the "var"
		keyword. So they become global and available for all
		one-liner programs and script files both written in
		JScript and VBScript.
		*/

		/*
		Helper to simplify VBS importing
		*/
		require.vbs = function(id) {
			require.vbs.exporter.IncludeFile(id);
		};
		require.vbs.exporter = CreateExporter();

		/*
		Keep the latest exception
		*/
		ERROR = null;

		/*
		Reference to the CLI arguments
		*/
		ARGV = program.argv;

		/*
		Prepend directories to the search path for modules
		*/
		if ( program.libs.length ) {
			require.paths.unshift.apply(require.paths, program.libs);
			require.vbs.exporter.PathInsert(program.libs)
		}

		/*
		Turn on VT
		*/
		if ( program.vt ) {
			enableVT();
		}

		/*
		Load provided modules.
		*/
		eval(program.modules.join(";"));

		/*
		Set user-defined variables.
		*/
		eval(program.vars.join(";"));

		/*
		Load and run the external script.
		*/
		if ( program.script.length ) {
			eval(program.script.join(";"));
			return;
		}

		/*
		Run REPL
		*/
		if ( program.main.length == 0 && ! program.inLoop ) {
			REPL.quiet = program.quiet;
			REPL();
			return;
		}

		/*
		Load the main one-liner program.
		*/
		if ( ! program.inLoop ) {
			eval(program.begin.join(";"));
			eval(program.main.join(";"));
			eval(program.end.join(";"));
			return;
		}

		/*
		The currently open stream
		*/
		STREAM = null;

		/*
		The current filename, file format and file number
		*/
		FILE = '';
		FILEFMT = 0;

		/*
		The current line read from the stream
		*/
		LINE = '';

		/*
		The line number in the current file
		*/
		FLN = 0;

		/*
		The list of fields of each line
		*/
		FIELDS = [];

		/*
		The total line number
		*/
		LN = 0;

		/*
		Emulate the "continue" operator
		*/
		next = function() {
			throw new EvalError('next');
		};

		/*
		Emulate the "break" operator
		*/
		last = function() {
			throw new EvalError('last');
		};

		/*
		Execute some code before starting to process any file.
		This is good place to initialize something.
		*/
		eval(program.begin.join(";"));

		if ( ! ARGV.length ) {
			ARGV.push('con');
		}

		/*
		This is the main loop over the list of files
		*/
		while ( ARGV.length ) {

			FILE = ARGV.shift();

			if ( FILE.match(/^\/f:(ascii|unicode|default)$/i) ) {
				FILEFMT = ({
					'/f:ascii': 0,
					'/f:unicode': -1,
					'/f:default': -2
				})[ FILE.toLowerCase() ];
				continue;
			}

			FLN = 0;

		/*
		Execute the code before starting to process the file. We
		can do here something while the file is not opened.
		*/
			eval(program.beginfile.join(";"));

			try {
				STREAM = FILE.toLowerCase() == 'con'
					? STDIN
					: FSO.OpenTextFile(FILE, 1, false, FILEFMT);
			} catch (ERROR) {
				program.print('StdErr', ERROR.message + ': ' + FILE);
				continue;
			}

		/*
		Prevent failure of reading out of STDIN stream. The
		real exception number is 800a005b (-2146828197) "Object
		variable or With block variable not set".
		*/
			//// NEED MORE INVESTIGATION
			//try {
			//	STREAM.AtEndOfStream;
			//} catch (ERROR) {
			//	program.print('StdErr', 'Out of stream: ' + FILE);
			//	continue;
			//}

			while ( ! STREAM.AtEndOfStream ) {
				FLN++;
				LN++;

				LINE = STREAM.ReadLine();

		/*
		Perform the main one-liner program per each input line.
		*/
				try {
					eval(program.main.join(";"));
				} catch (ERROR) {
					if ( ERROR instanceof EvalError
					&& ERROR.message == 'next' ) {
						continue;
					}
					if ( ERROR instanceof EvalError
					&& ERROR.message == 'last' ) {
						break;
					}
					throw ERROR;
				}

				if ( program.inLoop == 2 ) {
					program.print('StdOut', LINE);
				}
			} // while ( ! STREAM.AtEndOfStream )

			if ( STREAM != STDIN ) {
				STREAM.Close();
			}

		/*
		Execute the code when the file is already closed. We can
		do some finalization (i.e.: print the number of lines
		in the file).
		*/
			eval(program.endfile.join(";"));

		} // while ( ARGV.length )

		/*
		Execute the code when everything is completed. We can
		finalize the processing (i.e.: print the total number
		of lines).
		*/
		eval(program.end.join(";"));
	}
};
