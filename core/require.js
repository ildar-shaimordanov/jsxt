//
// require.js
// Imitation of the NodeJS function require in the Windows Scripting Host
//
// Copyright (c) 2019-2021 by Ildar Shaimordanov
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

var require = require || (function(exporter) {

	/**
	 * require()
	 *
	 * Load a module by name or filename
	 *
	 * @param	<String>	module name or path
	 * @param	<Object>	options
	 * @return	<Object>	exported module content
	 *
	 * Available options:
	 * - paths	<Array>		Paths to resolve the module location
	 * - format	<Integer>	format of the opened file (-2 - system default, -1 - Unicode file, 0 - ASCII file)
	 */
	var require = function(id, options) {
		var type = typeof id;
		if ( type != 'string' ) {
			throw new Error("require(): The \"id\" argument must be of type string. Received type " + type);
		}
		if ( id == '' ) {
			throw new Error("require(): The \"id\" argument must be a non-empty string. Received ''");
		}

		options = options || {};

		var filename = require.resolve(id, options);
		var dirname = filename.replace(/[\\\/][^\\\/]+$/, '')

		require.cache = require.cache || {};

		// https://nodejs.org/api/modules.html#cycles
		// "In order to prevent an infinite loop..."
		if ( ! require.cache[filename] /* || ! require.cache[filename].loaded */ ) {
			// Keep the module content
			require.text = require.loadFile(filename, options);

			// Prepare the cache
			require.cache[filename] = {
				id: id,
				filename: filename,
				path: dirname,
				loaded: false,
				exports: {}
			};

			// Load the module and populate the module.exports
			exporter(require.cache[filename], filename, dirname);

			// Set the flag, when loading is finished
			require.cache[filename].loaded = true;
		}

		return require.cache[filename].exports;
	};

	var fso = WScript.CreateObject("Scripting.FileSystemObject");

	/**
	 * require.loadFile()
	 *
	 * Loads and returns a file content
	 *
	 * @param	<String>	the file name
	 * @param	<Object>	options
	 * @return	<Object>	the file content
	 *
	 * Available options:
	 * - format	<Integer>	format of the opened file (-2 - system default, -1 - Unicode file, 0 - ASCII file)
	 */
	require.loadFile = function(file, options) {
		options = options || {};

		var stream = fso.OpenTextFile(file, 1, false, options.format || 0);
		var text = stream.ReadAll();
		stream.Close();

		return text;
	};

	function absolutePath(file) {
		if ( fso.FileExists(file) ) {
			return fso.GetAbsolutePathName(file);
		}
	}

	/**
	 * require.resolve()
	 *
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

		var file;

		// ../path, ./path, /path, drive:/path
		if ( /^\.?\.?[\\\/]|^[A-Z]:/i.test(id) ) {
			// module looks like a path
			file = absolutePath(/\.[^.\\\/]+$/.test(id) ? id : id + ".js")
		} else {
			// attempt to find a library module
			var paths = [].concat(options.paths || [], require.paths);
			for (var i = 0; i < paths.length; i++) {
				var file = absolutePath(paths[i] + "\\" + id + ".js");
				if ( file ) {
					break;
				}
			}
		}

		if ( ! file ) {
			throw new Error("require.resolve(): Cannot find module '" + id + "'");
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
})(

	/*
	This function is used internally by the `require()` function to
	import the items defined in the module. So to avoid a messy with
	internal variables used by `require()` function and the most outer
	anonymous function, this small function is moved out of the scope.

	To this moment the module content is already loaded and stored
	temporarily as the `require.text` property which will be deleted
	immediately after its reading.
	*/
	function(module, __filename, __dirname) {
		var exports = module.exports;
		eval((function() {
			var text = require.text;
			delete require.text;
			return text;
		})());
	}

);
