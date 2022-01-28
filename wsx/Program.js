//
// Program
// This script is the part of the wsx
//
// Copyright (c) 2019-2021 by Ildar Shaimordanov
//

var Program = {
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

	autosplit: false,
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

	addModule: function(lang, name, imports) {
		var s = this.addScript(lang, name);

		var r = [];

		var re = /([^:,;]+)(?::([^:,;]+))?/g;
		var m;
		while ( m = re.exec(imports) ) {
			r.push(m[1] + ' = exports.' + ( m[2] || m[1] ) + ';');
		}

		if ( r.length ) {
			r.unshift('(function(exports) {');
			r.push('})(' + s + ' || {})');
			s = r.join(' ');
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
		// Walk through all named and unnamed arguments because
		// we have to handle each of them even if they duplicate
		for (var i = 0; i < WScript.Arguments.length; i++) {

			var arg = WScript.Arguments.Item(i);

			var m;

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

			m = arg.match(/^\/m(?::(js|vbs))?:([^=]+)(?:=(.*))?$/i);
			if ( m ) {
				this.addModule(m[1], m[2], m[3]);
				continue;
			}

			m = arg.match(/^\/(let|set|get|re)(?::(js|vbs))?:(\w+)=(.*)$/i);
			if ( m ) {
				this.addVar(m[2], m[3], m[4], m[1]);
				continue;
			}

			m = arg.match(/^\/(?:e|((?:begin|end)(?:file)?))(?::(js|vbs))?(?::(.*))?$/i);
			if ( m ) {
				this.addCode(m[2], m[3], m[1]);
				continue;
			}

			m = arg.match(/^\/a(?::(.*))?$/i);
			if ( m ) {
				this.autosplit = true;
//				if ( m[1] ) {
//					this.splitBy = this.jsVar('', m[1], 're');
//				}
				continue;
			}

			m = arg.match(/^\/([np])$/i);
			if ( m ) {
				this.setInLoop(m[1]);
				continue;
			}

			/*
			This looks like ugly, but it works and reliable
			enough to stop looping over the rest of the CLI
			options. From this point we allow end users to
			specify their own options even, if their names
			intersect with names of our options.
			*/
			break;

		}

		if ( this.autosplit && this.inLoop ) {
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

	// Run the "optimized" code
	run: function() {
		eval('(function() { return ' + this.prepare() + '})()').apply(this);
	},

	// "Optimize" the code:
	// find each    : eval(this.SOMETHING.join(";"))
	// replace with : this.SOMETHING.join(";")
	prepare: function() {
		var that = this;
		return this.runner.toString()
		.replace(
			/^(\s*)eval\(this\.(\w+)\.join\(";"\)\)/gm,
			function(chunk, space, name) {
				return space + that[name].join(';');
			}
		);
	},

	/*
	Usage of "new Function()" instead "eval()" could be good
	approach. However any declared function becomes local and is not
	visible out of "new Function()". Also this method prohibits the
	"var" keyword. Again, because variables declared with "var"
	are local for their scope.
	*/
	runner: function() {
		/*
		The following variables are declared without the "var"
		keyword. So they become global and available for all
		one-line programs and script files both written in
		JScript and VBScript.
		*/

		// Helper to simplify VBS importing
		require.vbs = function(id) {
			require.vbs.exporter.IncludeFile(id);
		};
		require.vbs.exporter = CreateExporter();

		// Keep a last exception
		ERROR = null;

		// Reference to CLI arguments
		ARGV = this.argv;

		// Prepend directories to the search path for modules
		if ( this.libs.length ) {
			require.paths.unshift.apply(require.paths, this.libs);
			require.vbs.exporter.PathInsert(this.libs)
		}

		/*
		Turn on VT
		*/
		if ( this.vt ) {
			enableVT();
		}

		/*
		Load provided modules.
		*/
		eval(this.modules.join(";"));

		/*
		Set user-defined variables.
		*/
		eval(this.vars.join(";"));

		/*
		Load and run the external script.
		*/
		if ( this.script.length ) {
			eval(this.script.join(";"));
			return;
		}

		/*
		Run REPL
		*/
		if ( this.main.length == 0 && ! this.inLoop ) {
			REPL.quiet = this.quiet;
			REPL();
			return;
		}

		/*
		Load the main one-line program.
		*/
		if ( ! this.inLoop ) {
			eval(this.begin.join(";"));
			eval(this.main.join(";"));
			eval(this.end.join(";"));
			return;
		}

		// The currently open stream
		STREAM = null;

		// The current filename, file format and file number
		FILE = '';
		FILEFMT = 0;

		// The current line read from the stream
		LINE = '';

		// The line number in the current file
		FLN = 0;

		// The list of fields of each line
		FIELDS = [];

		// The total line number
		LN = 0;

		// Emulate the "continue" operator
		next = function() {
			throw new EvalError('next');
		};

		// Emulate the "break" operator
		last = function() {
			throw new EvalError('last');
		};

		/*
		Execute some code before starting to process any file.
		This is good place to initialize something.
		*/
		eval(this.begin.join(";"));

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
			eval(this.beginfile.join(";"));

			try {
				STREAM = FILE.toLowerCase() == 'con'
					? STDIN
					: FSO.OpenTextFile(FILE, 1, false, FILEFMT);
			} catch (ERROR) {
				this.print('StdErr', ERROR.message + ': ' + FILE);
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
			//	this.print('StdErr', 'Out of stream: ' + FILE);
			//	continue;
			//}

			while ( ! STREAM.AtEndOfStream ) {
				FLN++;
				LN++;

				LINE = STREAM.ReadLine();

		/*
		Perform the main one-line program per each input line.
		*/
				try {
					eval(this.main.join(";"));
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

				if ( this.inLoop == 2 ) {
					this.print('StdOut', LINE);
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
			eval(this.endfile.join(";"));

		} // while ( ARGV.length )

		/*
		Execute the code when everything is completed. We can
		finalize the processing (i.e.: print the total number
		of lines).
		*/
		eval(this.end.join(";"));
	}
};
