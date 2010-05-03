//
// JavaScript unit
// DOM extensions
// document.insertAfter
//
// Copyright (c) 2010 by Ildar Shaimordanov
//

if ( ! document.insertAfter ) {

/**
 * insertAfter inserts a newChild node into the list of children 
 * of the current node after the refChild node. 
 *
 * @syntax
 * var elem = document.createElement("IMG");
 * document.body.insertAfter(elem, document.body.firstChild);
 * alert(document.body.firstChild.tagName);
 *
 * // Workaround for MSIE
 * var elem = document.createElement("IMG");
 * document.insertAfter.call(document.body, elem, document.body.firstChild);
 * alert(document.body.firstChild.tagName);
 *
 * @param	Node
 * @param	Node
 * @return	Node
 */
document.insertAfter = function(newChild, refChild)
{
	return ( refChild = refChild.nextSibling ) 
		? this.insertBefore(newChild, refChild) 
		: this.appendChild(newChild);
};

if ( this.Node ) {

Node.prototype.insertAfter = document.insertAfter;

}

}

