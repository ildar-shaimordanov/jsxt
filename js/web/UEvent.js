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
UEvent.eventName = function(event)
{
	return (event || '').replace(/^on/i, '').toLowerCase();
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

UEvent.addEventListener = function(element, event, listener, flag)
{
	listener.self = function()
	{
		return listener.call(element, window.event);
	};
	element.attachEvent('on' + UEvent.eventName(event), listener.self);
};

} else if ( window.addEventListener ) {

UEvent.addEventListener = function(element, event, listener, flag)
{
	element.addEventListener(UEvent.eventName(event), listener, !! flag);
};

} else {

UEvent.addEventListener = function(element, event, listener, flag)
{
	event = 'on' + UEvent.eventName(event);

	if ( ! element[event] ) {
		element[event] = function(event)
		{
			for (var i = 0; i < arguments.callee.listeners.length; i++) {
				if ( i in arguments.callee.listeners ) {
					arguments.callee.listeners[i].call(this, event);
				}
			}
		};
		element[event].listeners = [];
	}

	element[event].listeners.push(listener);
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

UEvent.removeEventListener = function(element, event, listener, flag)
{
	element.detachEvent('on' + UEvent.eventName(event), listener.self);
};

} else if ( window.removeEventListener ) {

UEvent.removeEventListener = function(element, event, listener, flag)
{
	element.removeEventListener(UEvent.eventName(event), listener, !! flag);
};

} else {

UEvent.removeEventListener = function(element, event, listener, flag)
{
	event = 'on' + UEvent.eventName(event);

	if ( ! element[event] ) {
		return;
	}

	if ( ! element[event].listeners ) {
		return;
	}

	for (var i = 0; i < element[event].listeners.length; i++) {
		if ( element[event].listeners[i] == listener ) {
			delete element[event].listeners[i];
			return;
		}
	}
};

}
