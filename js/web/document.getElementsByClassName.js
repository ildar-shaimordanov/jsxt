//
// JavaScript unit
// DOM extensions
// document.getElementsByClassName
//
// Copyright (c) Daniel Glazman
// Copyright (c) Robert Nyman
// Copyright (c) Dustin Diaz
// Copyright (c) 2010 by Ildar Shaimordanov
//

if ( ! document.getElementsByClassName ) {

/**
 * Review of the most popular implementations
 *
 * @link	http://ejohn.org/blog/getelementsbyclassname-speed-comparison/
 */

if ( document.evaluate ) {

/**
 * XPath implementation
 *
 * @author	Daniel Glazman, http://daniel.glazman.free.fr/weblog/newarchive/2003_06_01_glazblogarc.html#s95320189
 */
document.getElementsByClassName = function(className, parent)
{
	var xpathResult = document.evaluate('//*[@class = className]', (parent || document), null, 0, null);

	var result = [];

	while ( ( result[result.length] = xpathResult.iterateNext() ) ) {
	}

	return result;
};

} else if ( document.createTreeWalker ) {

/**
 * DOM Tree Walker implementation
 *
 * @link	http://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#Traversal-TreeWalker
 * @author	Daniel Glazman, http://daniel.glazman.free.fr/weblog/newarchive/2003_06_01_glazblogarc.html#s95320189
 */
document.getElementsByClassName = function(className)
{
	function acceptNode(node)
	{
		if ( node.hasAttribute("class") ) {
			var c = " " + node.className + " ";
			if ( c.indexOf(" " + className + " ") != -1 ) {
				return NodeFilter.FILTER_ACCEPT;
			}
		}
		return NodeFilter.FILTER_SKIP;
	};

	var treeWalker = document.createTreeWalker(
		document.documentElement, 
		NodeFilter.SHOW_ELEMENT, 
		acceptNode, 
		true);

	var result = [];

	if (treeWalker) {
		var node = treeWalker.nextNode();
		while ( node ) {
			result.push(node);
			node = treeWalker.nextNode();
		}
	}

	return result;
};

} else {

/**
 * Pure DOM implementation
 *
 * @author	Robert Nyman, http://robertnyman.com/2005/11/07/the-ultimate-getelementsbyclassname/
 * @author	Dustin Diaz, http://www.dustindiaz.com/getelementsbyclass/
 */
document.getElementsByClassName = function(className, parent)
{
	var elements = (parent || document).getElementsByTagName('*');

	var tester = new RegExp('(^|\\s)' + className + '(\\s|$)');

	var result = [];

	for (var i = 0; i < elements.length; i++) {
		if ( ! tester.test(elements[i].className) ) {
			continue;
		}
		result.push(elements[i]);
	}

	return result;
};

}

}

