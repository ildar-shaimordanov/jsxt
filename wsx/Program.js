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
	script: [],

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
	}
};
