//
// Stream.js
// Extension for Scripting.FileSystemObject and ADODB.Stream
//
// Copyright (c) 2009, 2010 by Ildar Shaimordanov
//

/*

ADODB.Stream

http://devguru.com/technologies/ado/8705.asp
http://www.w3schools.com/ado/ado_ref_stream.asp

Scripting.FileSystemObject

*/

function Stream()
{
};

Stream.initDriver = function(driver)
{
	Stream.driver = new Stream[driver || 'Adodb']();
	return Stream.driver;
};

Stream.read = function(filename, options)
{
	options = options || {};

	var driver = Stream.driver || Stream.initDriver();
	driver.open(
		filename, 
		options.iomode, 
		options.overwrite, 
		options.encoding);
	var result = driver.read();
	driver.close();

	return result;
};

Stream.write = function(filename, value, options)
{
	options = options || {};

	var driver = Stream.driver || Stream.initDriver();
	driver.open(
		filename, 
		options.iomode, 
		options.overwrite, 
		options.encoding);
	driver.write(value);
	driver.close();
};

Stream.Adodb = function()
{
	this.filename = null;
	this.modified = false;
	this.overwrite = false;
	this.iomode = 0;

	this.stream = null;

	this.stream = new ActiveXObject('ADODB.Stream');
	this.stream.Type = 2;
	this.stream.Mode = 3;
};

Stream.Adodb.prototype.open = function(filename, iomode, overwrite, encoding)
{
	this.filename = filename;
	this.modified = 0;
	this.overwrite = Boolean(overwrite);

	// 0 - read
	// 1 - write
	// 2 - append
	this.iomode = Number(iomode) || 0;

	this.stream.Charset = encoding || 'Windows-1252';

	this.stream.Open();

	var e;
	try {
		if ( this.iomode == 0 || this.iomode == 2 ) {
			this.stream.LoadFromFile(filename);
		}
		this.stream.Position = this.iomode == 2 ? this.stream.Size : 0;
	} catch (e) {
	}
};

Stream.Adodb.prototype.close = function()
{
	if ( this.iomode && this.modified ) {
		this.stream.SaveToFile(this.filename, this.overwrite ? 2 : 1);
	}

	this.stream.Close();

	this.filename = null;
	this.modified = false;
	this.overwrite = false;
	this.iomode = 0;
};

Stream.Adodb.prototype.EOF = function()
{
	return this.stream.EOS;
};

Stream.Adodb.prototype.read = function()
{
	return this.stream.ReadText(-1);
};

Stream.Adodb.prototype.readLine = function()
{
	return this.stream.ReadText(-2);
};

Stream.Adodb.prototype.skipLine = function()
{
	return this.stream.SkipLine();
};

Stream.Adodb.prototype.write = function(value)
{
	this.stream.WriteText(value, 0);
	this.modified = true;
};

Stream.Adodb.prototype.writeBlankLines = function(count)
{
	var eoln = this.stream.LineSeparator < 0 ? '\x0d\x0a' : this.stream.LineSeparator;
	var n = Number(count) + 1 || 0;
	var lines = (new Array(n)).join(eoln);
	this.write(lines);
};

Stream.Adodb.prototype.writeLine = function(value)
{
	this.stream.WriteText(value, 1);
	this.modified = true;
};

Stream.Text = function()
{
	this.filename = null;
	this.modified = false;
	this.overwrite = false;
	this.iomode = 0;

	this.fso = new ActiveXObject('Scripting.FileSystemObject');
	this.stream = null;
};

Stream.Text.prototype.open = function(filename, iomode, overwrite, encoding)
{
	this.filename = filename;

	this.modified = false;
	this.overwrite = Boolean(overwrite);

	// 0 - read
	// 1 - write
	// 2 - append
	this.iomode = Number(iomode) || 0;

	this.stream = this.fso.OpenTextFile(
		filename, 
		[1, 2, 8][this.iomode], 
		this.overwrite, 
		Number(encoding) || -2);
};

Stream.Text.prototype.close = function()
{
	this.stream.Close();

	this.filename = null;
	this.modified = false;
	this.overwrite = false;
	this.iomode = 0;
};

Stream.Text.prototype.EOF = function()
{
	return this.stream.AtEndOfStream;
};

Stream.Text.prototype.read = function()
{
	return this.stream.ReadAll();
};

Stream.Text.prototype.readLine = function()
{
	return this.stream.ReadLine();
};

Stream.Text.prototype.skipLine = function()
{
	return this.stream.SkipLine();
};

Stream.Text.prototype.write = function(value)
{
	this.stream.Write(value);
	this.modified = true;
};

Stream.Text.prototype.writeBlankLines = function(count)
{
	this.stream.WriteBlankLines(count);
	this.modified = true;
};

Stream.Text.prototype.writeLine = function(value)
{
	this.stream.WriteLine(value);
	this.modified = true;
};

