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

This extension partially implements features from NodeJS modules.

See for details:

https://nodejs.org/api/modules.html

*/

var require = require || (function(exporter) {

	/*
	Stack is used to store and use information about require() calls.

	require(): stores the module's filename and dirname before running
	the module and releases after the module execution is completed.

	require.resolve(): uses the stack to properly invoke another
	modules by relative paths.
	*/
	var requireStack = [];

	function resolveParentPath() {
		var parent = requireStack[ requireStack.length - 1 ];
		if ( parent ) {
			return parent.dirname;
		}
	}

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
	 * - format	<Integer>	format of the opened file
	 *
	 * Available formats:
	 *  0 - ASCII file
	 * -1 - Unicode file
	 * -2 - system default
	 */
	var require = function require(id, options) {
		var filename = require.resolve(id, options);
		var dirname = filename.replace(/[\\\/][^\\\/]+$/, '')

		require.cache = require.cache || {};

		// https://nodejs.org/api/modules.html#cycles
		// "In order to prevent an infinite loop..."
		if ( ! require.cache[filename] ) {
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

			requireStack.push({
				filename: filename,
				dirname: dirname
			});

			// Load the module and populate the module.exports
			exporter(require.cache[filename]);

			requireStack.pop();

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
	 * - format	<Integer>	format of the opened file
	 *
	 * Available formats:
	 *  0 - ASCII file
	 * -1 - Unicode file
	 * -2 - system default
	 */
	require.loadFile = function loadFile(file, options) {
		options = options || {};

		var stream = fso.OpenTextFile(file, 1, false, options.format || 0);
		var text = stream.ReadAll();
		stream.Close();

		return text;
	};

	function validate(id) {
		var type = typeof id;
		if ( type != 'string' ) {
			throw new Error(
			'Expected a string argument. Received ' + (
				id === undefined ? 'undefined' :
				id === null ? 'null' :
				'type ' + type
			));
		}
		if ( id == '' ) {
			throw new Error(
			'Expected a non-empty string. Received ""');
		}
	}

	function resolveFilename(dir, file) {
		file = fso.BuildPath(dir, file);
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
	require.resolve = function resolve(id, options) {
		validate(id);

		var name = id + ( /\.[^.\\\/]+$/.test(id) ? '' : '.js' );

		options = options || {};

		var file;

		if ( /^(?:[A-Z]:)?[\\\/]/i.test(id) ) {
			// drive:/path/module, /path/module
			file = resolveFilename('', name);
		} else if ( /^\.\.?[\\\/]/.test(id) ) {
			// ./path/module, ../path/module
			file = resolveFilename(resolveParentPath(), name);
		} else {
			// attempt to find a library module
			var paths = [].concat(options.paths || [], require.paths);
			for (var i = 0; i < paths.length; i++) {
				file = resolveFilename(paths[i], name);
				if ( file ) {
					break;
				}
			}
		}

		if ( file ) {
			return file;
		}

		throw new Error('Module not found: ' + id);
	};

	var myDir = fso.GetParentFolderName(WScript.ScriptFullName);
	var me = WScript.ScriptName.replace(/(\.[^.]+\?)?\.[^.]+$/, '');

	require.paths = [
		  myDir + "\\js"
		, myDir + "\\" + me
		, myDir + "\\" + me + "\\js"
		, myDir + "\\lib"
	];

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

	If the file is detected as JSON (the filename ends with ".json"),
	try to parse it using JSON.parse() if the last one is established
	or simply store its content to module.exports even this way is
	not 100% reliable.
	*/
	function(module) {
		var exports = module.exports;
		var __filename = module.filename;
		var __dirname = module.path;

		eval((function() {
			var text = require.text;
			delete require.text;

			// What if it's JSON file?
			if ( /\.json$/i.test(__filename) ) {
				// We have JSON.parse()? Use it!
				if ( typeof JSON === 'object'
				&& typeof JSON.parse === 'function' ) {
					module.exports = JSON.parse(text);
					return;
				}

				// It's acceptable as a first simple approach
				text = 'module.exports = ' + text;
			}

			return text;
		})());
	}

);
