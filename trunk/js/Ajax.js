
if ( ! XMLHttpRequest ) {

function XMLHttpRequest()
{
	if ( ! ActiveXObject ) {
		return null;
	}

	var e;

	try {
		return new ActiveXObject("Msxml2.XMLHTTP");
	} catch (e) {
		try {
			return new ActiveXObject("Microsoft.XMLHTTP");
		} catch (e) {
		}
	}

	return null;
};

}

