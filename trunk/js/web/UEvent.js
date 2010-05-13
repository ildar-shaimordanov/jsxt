//
// JavaScript unit
// UEvent - Universal event
//
// This is experimental unit
//
// Copyright (c) 2009 by Ildar Shaimordanov
//

/**
 * The universal object event
 *
 * @access	public
 */
var UEvent = {};

/**
 * Returns the event's name
 *
 * @param	String
 * @return	String
 * @access	static
 */
UEvent.eventName = function(e)
{
    return (e || '').replace(/^on/i, '').toLowerCase();
};

/**
 * Registers a new listener of an event for the specified node.
 *
 * @param	HTMLElement
 * @param	String
 * @param	Function
 * @param	Boolean
 * @access	static
 */
if ( window.attachEvent ) {

UEvent.addEventListener = function(el, e, listener, flag)
{
    el.attachEvent('on' + UEvent.eventName(e), listener);
};

} else if ( window.addEventListener ) {

UEvent.addEventListener = function(el, e, listener, flag)
{
    el.addEventListener(UEvent.eventName(e), listener, !! flag);
};

} else {

UEvent.addEventListener = function(el, e, listener, flag)
{
    throw new ReferenceError();
};

}

/**
 * Unregister a listener of events for the specified node.
 *
 * @param	HTMLElement
 * @param	String
 * @param	Function
 * @param	Boolean
 * @access	static
 */
if ( window.detachEvent ) {

UEvent.removeEventListener = function(el, e, listener, flag)
{
    el.detachEvent('on' + UEvent.eventName(e), listener);
};

} else if ( window.removeEventListener ) {

UEvent.removeEventListener = function(el, e, listener, flag)
{
    el.removeEventListener(UEvent.eventName(e), listener, !! flag);
};

} else {

UEvent.removeEventListener = function(el, e, listener, flag)
{
    throw new ReferenceError();
};

}
