//
// Program
// This script is the part of the wsx
//
// Copyright (c) 2019, 2020 by Ildar Shaimordanov
//

var Program = {
	libs: [],

	vt: false,

	check: false,
	quiet: false,
	inLoop: 0,

	engine: "js",

	modules: [],
	vars: [],

	main: [],
	script: [],

	begin: [],
	end: [],
	beginfile: [],
	endfile: [],

	showHelp: function() {
		WScript.Arguments.ShowUsage();
	},
	showVersion: function() {
		var me = WScript.ScriptName.replace(/(\.[^.]+\?)?\.[^.]+$/, '');
		var name = typeof NAME == 'string' ? NAME : me;
		var version = typeof VERSION == 'string' ? VERSION : '0.0.1';
		WScript.Echo(name + ' (' + me + '): Version ' + version
			+ '\n' + WScript.Name
			+ ': Version ' + WScript.Version
			+ ', Build ' + WScript.BuildVersion);
	},

	getEngine: function(engine) {
		return (engine || this.engine).toLowerCase();
	},

	setInLoop: function(mode) {
		var loopTypes = { i: 0, n: 1, p: 2 };
		this.inLoop = loopTypes[mode];
	},

	addScript: function(engine, name) {
		name = name.replace(/\\/g, '\\\\');
		var result = '';
		if ( this.getEngine(engine) == "vbs" ) {
			result = 'USE.Import("' + name + '")';
		} else {
			result = 'require("' + name + '")';
		}
		return result;
	},
	addModule: function(engine, name, imports) {
		var s = this.addScript(engine, name);

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
		var m = str.match(/^\/(.+)\/([igm]+)?$|^((?!\/).+(?!\/))$/);
		if ( ! m ) {
			WScript.Echo('Bad regexp: ' + str);
			WScript.Quit(1);
		}
		return {
			pattern: m[1] || m[3],
			modifiers: m[2],
			origin: str
		};
	},
	vbsVar: function(name, value, setter) {
		var result = 'Dim ' + name;
		if ( value ) {
			switch( setter.toLowerCase() ) {
			case 'let': result += ' : ' + name + ' = \\"' + value + '\\"'; break;
			case 'set': result += ' : Set ' + name + ' = CreateObject(\\"' + value + '\\")'; break;
			case 'get': result += ' : Set ' + name + ' = GetObject(\\"' + value + '\\")'; break;
			case 're':
				var v = this.validateStringAsRegexp(value);
				result += ' : Set ' + name + ' = New RegExp';
				result += ' : ' + name + '.Pattern = \\"' + v.pattern.replace(/\\/g, '\\\\')  + '\\"';
				if ( v.modifiers.indexOf('i') >= 0 ) {
					result += ' : ' + name + '.IgnoreCase = True';
				}
				if ( v.modifiers.indexOf('g') >= 0 ) {
					result += ' : ' + name + '.Global = True';
				}
				if ( v.modifiers.indexOf('m') >= 0 ) {
					result += ' : ' + name + '.Multiline = True';
				}
				break;
			}
		}
		return 'USE.Execute("' + result + '")';
	},
	jsVar: function(name, value, setter) {
		//var result = 'var ' + name;
		var result = '';
		if ( value ) {
			result = name;
			switch( setter.toLowerCase() ) {
			case 'let': result += ' = "' + value + '"'; break;
			case 'set': result += ' = new ActiveXObject("' + value + '")'; break;
			case 'get': result += ' = GetObject("' + value + '")'; break;
			case 're':
				var v = this.validateStringAsRegexp(value);
				result += ' = /' + v.pattern + '/' + v.modifiers;
				break;
			}
		}
		return result;
	},
	addVar: function(engine, name, value, setter) {
		var result;
		if ( this.getEngine(engine) == "vbs" ) {
			result = this.vbsVar(name, value, setter);
		} else {
			result = this.jsVar(name, value, setter);
		}
		this.vars.push(result);
	},

	addCode: function(engine, code, region) {
		var result = '';
		if ( this.getEngine(engine) == "vbs" ) {
			result = 'USE.Execute("' + code + '")';
		} else {
			result = code;
		}
		this[region || 'main'].push(result);
	},

	detectScriptFile: function(args) {
		if ( this.main.length ) {
			return;
		}
		if ( this.inLoop ) {
			return;
		}
		if ( args.length ) {
			var scriptFile = args.shift();
			var engine = /\.vbs$/.test(scriptFile) ? 'vbs' : 'js';
			this.script.push(this.addScript(engine, scriptFile));
		}
	},

	showPseudoCode: function() {
		var s = [];

		if ( Program.vt ) {
			s.push('::turn on vt');
		}

		s.push.apply(s, this.modules);
		s.push.apply(s, this.vars);

		if ( this.script.length ) {
			// wsx scriptfile
			s.push.apply(s, this.script);
		} else if ( this.main.length == 0 && this.inLoop == false ) {
			// wsx [/q[uiet]]
			s.push.apply(s, [
				'::while read',
				'::eval',
				'::print',
				'::loop while'
			]);
		} else if ( ! this.inLoop ) {
			// wsx /e:"..."
			s.push.apply(s, this.main);
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

		WScript.Echo(s.join('\n'));
	},

	run: function(argv) {
		if ( this.check ) {
			this.showPseudoCode();
			return;
		}

		var modules = this.modules.join(';\n');
		var vars = this.vars.join(';\n');
		var script = this.script.join(';\n');
		var begin = this.begin.join(';\n');
		var beginfile = this.beginfile.join(';\n');
		var main = this.main.join(';\n');
		var endfile = this.endfile.join(';\n');
		var end = this.end.join(';\n');

		/*
		The following variables are declared without the keyword "var". So
		they become global and available for all codes in JScript and VBScript.
		*/

		// Helper to simplify VBS importing
		USE = CreateImporter();

		// Keep a last exception
		ERROR = null;

		// Reference to CLI arguments
		ARGV = argv;

		// Prepend directories to the search path for modules
		if ( Program.libs.length ) {
			require.paths.unshift.apply(require.paths, Program.libs);
			USE.PathInsert(Program.libs)
		}

		// Turn on VT
		if ( Program.vt ) {
			enableVT();
		}

		/*
		Load provided modules
		Set user-defined variables
		*/
		eval(modules);
		eval(vars);

		if ( this.script.length ) {
			/*
			Load and run the external script and do nothing more.
			*/
			eval(script);
			return;
		}

		if ( this.main.length == 0 && ! this.inLoop ) {
			/*
			Run REPL
			*/
			REPL.quiet = this.quiet;
			REPL();
			return;
		}

		if ( ! this.inLoop ) {
			/*
			Load the main script and do nothing more.
			*/
			eval(main);
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
		Execute the code before starting to process any file.
		This is good place to initialize.
		*/
		eval(begin);

		if ( ! ARGV.length ) {
			ARGV.push('con');
		}

		while ( ARGV.length ) {
			FILE = ARGV.shift();

			var m = FILE.match(/^\/f:(ascii|unicode|default)$/i);

			if ( m ) {
				var fileFormats = { ascii: 0, unicode: -1, 'default': -2 };
				FILEFMT = fileFormats[ m[1] ];
				continue;
			}

			FLN = 0;

			/*
			Execute the code before starting to process the file.
			We can do here something while the file is not opened.
			*/
			eval(beginfile);

			try {
				STREAM = FILE.toLowerCase() == 'con'
					? STDIN
					: FSO.OpenTextFile(FILE, 1, false, FILEFMT);
			} catch (ERROR) {
				WScript.Echo(ERROR.message + ': ' + FILE);
				continue;
			}

			/*
			Prevent failure of reading out of STDIN stream
			The real exception number is 800a005b (-2146828197)
			"Object variable or With block variable not set"
			*/
			//// NEED MORE INVESTIGATION
			//try {
			//	stream.AtEndOfStream;
			//} catch (ERROR) {
			//	WScript.StdErr.WriteLine('Out of stream: ' + file);
			//	continue;
			//}

			while ( ! STREAM.AtEndOfStream ) {
				FLN++;
				LN++;

				LINE = STREAM.ReadLine();

				/*
				Execute the main code per each input line.
				*/
				try {
					eval(main);
				} catch (ERROR) {
					if ( ERROR instanceof EvalError && ERROR.message == 'next' ) {
						continue;
					}
					if ( ERROR instanceof EvalError && ERROR.message == 'last' ) {
						break;
					}
					throw ERROR;
				}

				if ( this.inLoop == 2 ) {
					WScript.Echo(LINE);
				}
			}

			if ( STREAM != STDIN ) {
				STREAM.Close();
			}

			/*
			Execute the code when the file is already closed. We can do
			some finalization (i.e.: print the number of lines in the file).
			*/
			eval(endfile);
		}

		/*
		Execute the code when everything is completed.
		We can finalize the processing (i.e.: print the total number of lines).
		*/
		eval(end);
	}
};
