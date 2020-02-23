//
// Compiler
// This script is the part of the wscmd
//
// Copyright (c) 2019, 2020 by Ildar Shaimordanov
//

var Compiler = {
	dryRun: false,
	quiet: false,
	inLoop: 0,

	engine: "js",

	modules: [],
	vars: [],

	main: [],

	begin: [],
	end: [],
	beginfile: [],
	endfile: [],

	files: [],

	getEngine: function(engine) {
		return (engine || this.engine).toLowerCase();
	},

	setMode: function(mode) {
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
	addModule: function(engine, name) {
		this.modules.push(this.addScript(engine, name));
	},

	vbsVar: function(name, value, setter) {
		var result = 'Dim ' + name;
		if ( value ) {
			switch( setter.toLowerCase() ) {
			case 'let': result += ' : ' + name + ' = \\"' + value + '\\"'; break;
			case 'set': result += ' : Set ' + name + ' = CreateObject(\\"' + value + '\\")'; break;
			case 'get': result += ' : Set ' + name + ' = GetObject(\\"' + value + '\\")'; break;
			}
		}
		return 'USE.Execute("' + result + '")';
	},
	jsVar: function(name, value, setter) {
		//var result = 'var ' + name;
		var result = ''
		if ( value ) {
			result = name;
			switch( setter.toLowerCase() ) {
			case 'let': result += ' = "' + value + '"'; break;
			case 'set': result += ' = CreateObject("' + value + '")'; break;
			case 'get': result += ' = GetObject("' + value + '")'; break;
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

	addFile: function(file) {
		this.files.push(file);
	},
	addFileFormat: function(format) {
		var fileFormats = { ascii: 0, unicode: -1, 'default': -2 };
		this.files.push({ format: fileFormats[format] });
	},

	detectScriptFile: function() {
		if ( this.main.length ) {
			return;
		}
		if ( this.inLoop ) {
			return;
		}
		if ( this.files.length ) {
			var engine = /\.vbs$/.test(scriptFile) ? 'vbs' : 'js';
			var scriptFile = this.files.shift();
			this.main.push(this.addScript(engine, scriptFile));
		}
	},
	compile: function(Runner, REPL) {
		this.detectScriptFile();

		var modules = this.modules.join(';\n');
		var vars = this.vars.join(';\n');
		var begin = this.begin.join(';\n');
		var beginfile = this.beginfile.join(';\n');
		var main = this.main.join(';\n');
		var endfile = this.endfile.join(';\n');
		var end = this.end.join(';\n');

		var executor = main || this.inLoop ? Runner : REPL;

		if ( this.dryRun ) {
			( typeof executor.dump == 'function' ? executor : this ).dump(
				modules, vars,
				begin, beginfile, main, endfile, end,
				this.files,
				this.inLoop, this.quiet, this.dryRun);
			return;
		}

		executor(
			modules, vars,
			begin, beginfile, main, endfile, end,
			this.files,
			this.inLoop, this.quiet, this.dryRun);
	},
	dump: function(modules, vars, begin, beginfile, main, endfile, end, files, inLoop, quiet, dryRun) {
		var s = [].concat(
			'::modules', modules,
			'::vars', vars,
			'::begin', begin,
			'::beginfile', beginfile,
			'::main', main,
			'::endfile',endfile,
			'::end', end
		).join(';\n');
		WScript.Echo(s);
	}
};
