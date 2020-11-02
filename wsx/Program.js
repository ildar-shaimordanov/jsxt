//
// Program
// This script is the part of the wsx
//
// Copyright (c) 2019, 2020 by Ildar Shaimordanov
//

var Program = {
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

	setEngine: function(engine) {
		this.engine = engine;
	},
	getEngine: function(engine) {
		return (engine || this.engine).toLowerCase();
	},

	setMode: function(mode) {
		var loopTypes = { i: 0, n: 1, p: 2 };
		this.inLoop = loopTypes[mode];
	},

	setQuiet: function() {
		this.quiet = true;
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
		var result = '';
		if ( value ) {
			result = name;
			switch( setter.toLowerCase() ) {
			case 'let': result += ' = "' + value + '"'; break;
			case 'set': result += ' = new ActiveXObject("' + value + '")'; break;
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
			this.main.push(this.addScript(engine, scriptFile));
		}
	}
};
