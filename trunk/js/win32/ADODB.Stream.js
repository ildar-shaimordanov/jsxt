
if ( ! this.ADODB ) {

var ADODB = {};

}

if ( ! ADODB.Stream ) {

ADODB.Stream = {};

}

if ( ! ADODB.Stream.readFile ) {

ADODB.Stream.readFile = function(filename, encoding)
{
	var stream = new ActiveXObject('ADODB.Stream');
	stream.Type = 2;
	stream.Mode = 3;
	stream.Charset = encoding || 'Windows-1252';
	stream.Open();
	stream.Position = 0;

	stream.LoadFromFile(filename);
	var size = stream.Size;
	var image = stream.ReadText();

	stream.Close();

	return image;
};

}

if ( ! ADODB.Stream.writeFile ) {

ADODB.Stream.writeFile = function(filename, image, encoding)
{
	var stream = new ActiveXObject('ADODB.Stream');
	stream.Type = 2;
	stream.Mode = 3;
	stream.Charset = encoding || 'Windows-1252';
	stream.Open();
	stream.Position = 0;

	stream.WriteText(image);
	stream.SaveToFile(filename, 2);

	stream.Close();

	return true;
};

}

