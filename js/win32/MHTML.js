
function MHTML()
{

	var self = this;

	var fso = new ActiveXObject('Scripting.FileSystemObject');

	var _headers = {};
	var _headers_len = 0;

	var _postFiles = {};
	var _postFiles_len = 0;

	var _body = '';

	self.addHeader = function(name, value)
	{
		_headers[name.toLowerCase()] = value;
		_headers_len++;
	}

	self.removeHeader = function(name)
	{
		if ( _headers_len == 0 ) {
			return;
		}

		delete _headers[name.toLowerCase()];
		_headers_len--;
	}

	self.addFile = function(filename, contentType)
	{
		if ( ! fso.FileExists(filename) ) {
			throw new Error(filename + ' not found');
		}

		if ( ! contentType ) {
			var ext = fso.GetExtensionName(filename);
			contentType = MHTML.mimeTypes[ext] || 'application/octet-stream';
		}

		if ( ! _postFiles.hasOwnProperty(contentType) ) {
			_postFiles[contentType] = [];
		}

		_postFiles[contentType].push(filename);
		_postFiles_len++;
	}

	self.addBody = function(body)
	{
		_body = body;
	}

	function readFile(filename)
	{
		var f, h, s;
		f = fso.GetFile(filename);
		h = f.OpenAsTextStream(1, -2);
		s = h.ReadAll();
		h.Close();
		return s;
	}

	self.toString = function()
	{
		if ( _body.length == 0 && _postFiles_len == 0 ) {
			self.removeHeader('Content-Type');
		} else {
			_boundary = '__NextPart_' + (new Date()).getTime().toString(16);
			self.addHeader('Content-Type', 'multipart/related; boundary="' + _boundary + '"');
		}

		var hdr = '';
		for (var p in _headers) {
			var cname = p.toLowerCase().replace(/(^|-)(\w)/g, function($0, $1, $2)
			{
				return $1 + $2.toUpperCase();
			});
			hdr += cname + ': ' + _headers[p] + '\n';
		}
		if ( hdr.length != 0 ) {
			hdr += '\n';
		}

		if ( _body.length != 0 ) {
			_body += '\n\n';
		}

		var req = '';
		for (var p in _postFiles) {
			for (var i = 0; i < _postFiles[p].length; i++) {
				var filename = _postFiles[p][i];
				var content = readFile(filename);

				req += '--' + _boundary + '\n';
				req += 'Content-Location: ' + filename + '\n';
				req += 'Content-Location: ' + fso.GetBaseName(filename) + '\n';
				req += 'Content-Type: ' + p + '\n';

				req += 'Content-Transfer-Encoding: ';

				if ( p.match(/^text/i) ) {
					req += 'quoted-printable\n';
				} else {
					req += 'base64\n';
					content = content
						.base64()
						.replace(/.{64}/g, function($0)
						{
							return $0 + '\n';
						});
				}
				req += '\n' + content + '\n';
			}
		}
		if ( req.length != 0 ) {
			req += '--' + _boundary + '--\n';
		}

		return hdr + _body + req;
	}

}

MHTML.mimeTypes = {
	'gif': 'image/gif',
	'jpg': 'image/jpeg',
	'jpeg': 'image/jpeg',
	'png': 'image/png',

	'htm': 'text/html',
	'html': 'text/html',

	'txt': 'text/plain'};

