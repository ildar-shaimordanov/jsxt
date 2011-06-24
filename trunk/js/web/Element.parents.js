//
// JavaScript unit
// DOM extensions
//
// Copyright (c) 2010 by Ildar Shaimordanov
//

if ( ! this.Element ) {

this.Element = {};

}

Element.getParentNodes = function(element)
{
	var result = [];
	while ( element = element.parentNode ) {
		result.push(element);
	}
	return result;
};

Element.getCommonParent = function(first, second)
{
	var f = Element.getParentNodes(first);
	var s = Element.getParentNodes(second);

	var fn = f.length;
	var sn = s.length;

	while ( f[--fn] && f[fn] === s[--sn] ) {
	}
	return f[++fn] || null;
};

