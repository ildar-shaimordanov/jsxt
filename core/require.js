//
// require.js
// Imitation of the NodeJS function require in the Windows Scripting Host
//
// Copyright (c) 2019, 2020 by Ildar Shaimordanov
//

/*

The module adds to WSH the "require" function, the useful NodeJS feature, and some additional extensions.

Load a module by name of filename
	require(id[, options])

Resolve a location of the module
	require.resolve(id[, options])

The list of of paths used to resolve the module location
	require.paths

Cache for the imported modules
	require.cache

*/

var require = require || (function() {

	var fso = WScript.CreateObject("Scripting.FileSystemObject");

	function loadFile(file, format) {
		var stream = fso.OpenTextFile(file, 1, false, format || 0);
		var text = stream.ReadAll();
		stream.Close();

		return text;
	};

	/**
	 * Load a module by name of filename
	 *
	 * @param	<String>	module name or path
	 * @param	<Object>	options
	 * @return	<Object>	exported module content
	 *
	 * Available options:
	 * - paths	<Array>		Paths to resolve the module location
	 * - format	<Integer>	format of the opened file (-2 - system default, -1 - Unicode file, 0 - ASCII file)
	 */
	function require(id, options) {
		if ( ! id ) {
			throw new TypeError("Missing path");
		}

		if ( typeof id != "string" ) {
			throw new TypeError("Path must be a string");
		}

		options = options || {};

		var file = require.resolve(id, options);

		require.cache = require.cache || {};

		if ( ! require.cache[file] || ! require.cache[file].loaded ) {
			var text = loadFile(file, options.format);

			var code
				= "(function(module) {\n"
				+ "var exports = module.exports;\n"
				+ text + ";\n"
				+ "return module.exports;\n"
				+ "})({ exports: {} })";

			var evaled = eval(code);

			require.cache[file] = {
				exports: evaled,
				loaded: true
			};
		}

		return require.cache[file].exports;
	};

	function absolutePath(file) {
		if ( fso.FileExists(file) ) {
			return fso.GetAbsolutePathName(file);
		}
	}

	/**
	 * Resolve a location of the module
	 *
	 * @param	<String>	module name or path
	 * @param	<Object>	options
	 * @return	<String>	resolved location of the module
	 *
	 * Available options:
	 * - paths	<Array>		Paths to resolve the module location
	 */
	require.resolve = function(id, options) {
		options = options || {};

		var file = /^\.\.?[\\\/]|^[A-Z]:|\.js$/i.test(id)

			// module looks like a path
			? absolutePath(/\.[^.\\\/]+$/.test(id) ? id : id + ".js")

			// attempt to find a librarian module
			: (function() {
				var paths = [].concat(options.paths || [], require.paths);
				for (var i = 0; i < paths.length; i++) {
					var file = absolutePath(paths[i] + "\\" + id + ".js");
					if ( file ) {
						return file;
					}
				}
			})();

		if ( ! file ) {
			throw new Error("Cannot find module '" + id + "'");
		}

		return file;
	};

	var myDir = fso.GetParentFolderName(WScript.ScriptFullName);
	var me = WScript.ScriptName.replace(/(\.[^.]+\?)?\.[^.]+$/, '');

	var shell = WScript.CreateObject ("WScript.Shell");
	var cwd = shell.CurrentDirectory;

	require.paths = [
		  myDir + "\\js"
		, myDir + "\\" + me
		, myDir + "\\" + me + "\\js"
		, myDir + "\\lib"
		, cwd
	];

	if ( fso.GetBaseName(myDir) == "bin" ) {
		require.paths.push(myDir + "\\..\\lib");
	}

	return require;
})();
