//
// JavaScript unit
//
// Class to provide IPv4 calculations
//
// Provides methods for validating IP addresses, calculating netmasks,
// broadcast addresses, network addresses, conversion routines, etc.
//
// Copyright (c) 2007 by Ildar Shaimordanov
//

function NetIP()
{
	var privates = {
		// IP address
		address: 0, 

		// Bitmask of network
		bitmask: 24, 

		// Network address
		network: 0
	};

	this.getPrivates = function()
	{
		return privates;
	};

	var ip = arguments[0];
	var pos;

	var addr;
	var mask;

	if ( ip && ip.constructor == NetIP ) {
		// new NetIP(netip)
		addr = ip.getAddress();
		mask = ip.getBitmask();
	} else if ( ip && ip.constructor == Array ) {
		// new NetIP([addr, mask])
		addr = ip[0];
		mask = ip[1];
	} else if ( ip && ip.constructor == String && ( pos = ip.indexOf('/') ) != -1 ) {
		// new NetIP('addr/mask')
		addr = ip.substr(0, pos);
		mask = ip.substr(pos + 1);
	} else {
		// new NetIP(addr, mask)
		// new NetIP(addr)
		// new NetIP()
		addr = arguments[0] || privates.address;
		mask = arguments[1] || privates.bitmask;
	}

	this.setAddress(addr);
	if ( NetIP.isBitmask(mask) ) {
		this.setBitmask(mask);
	} else {
		this.setNetmask(mask);
	}
};

/**
 * Map of bitmasks to networks
 *
 * @var
 * @access	private
 */
NetIP.netmaskMap = [
	0x00000000,

	0x80000000,
	0xC0000000,
	0xE0000000,
	0xF0000000,
	0xF8000000,
	0xFC000000,
	0xFE000000,

	// class A
	0xFF000000,
	0xFF800000,
	0xFFC00000,
	0xFFE00000,
	0xFFF00000,
	0xFFF80000,
	0xFFFC0000,
	0xFFFE0000,

	// class B
	0xFFFF0000,
	0xFFFF8000,
	0xFFFFC000,
	0xFFFFE000,
	0xFFFFF000,
	0xFFFFF800,
	0xFFFFFC00,
	0xFFFFFE00,

	// class C
	0xFFFFFF00,
	0xFFFFFF80,
	0xFFFFFFC0,
	0xFFFFFFE0,
	0xFFFFFFF0,
	0xFFFFFFF8,
	0xFFFFFFFC,

	0xFFFFFFFE,
	0xFFFFFFFF];

/**
 * Converts an address in dot notation to integer
 *
 * @param	String
 * @return	Integer
 * @access	static
 */
NetIP.atoi = function(value)
{
	var bytes = String(value).split('.');
	var result = 0;

	for (var i = 0; i < bytes.length; i++) {
		result = result * 0x100 + Number(bytes[i]);
	}

	return result;
};

/**
 * Validate a value as bitmask in range 1 to 32
 *
 * @param	String
 * @return	Boolean
 * @access	static
 */
NetIP.isBitmask = function(value)
{
	var bitmask = parseInt(value);
	return bitmask == value && bitmask >= 1 && bitmask <= 32;
};

/**
 * Validate a value as address in dot notation
 *
 * @param	String
 * @return	Boolean
 * @access	static
 */
NetIP.isIP = function(value)
{
	return !! String(value).match(/^\s*(?:([01]?\d\d?|2[0-4]\d|25[0-5])\.)(?:([01]?\d\d?|2[0-4]\d|25[0-5])\.)(?:([01]?\d\d?|2[0-4]\d|25[0-5])\.)([01]?\d\d?|2[0-4]\d|25[0-5])\s*$/);
};

/**
 * Validate a value as netmask (both direct and inverse)
 *
 * @param	String
 * @return	Boolean
 * @access	static
 */
NetIP.isNetmask = function(value)
{
	if ( ! NetIP.isIP(value) ) {
		return false;
	}

	if ( typeof value == 'string' ) {
		value = NetIP.atoi(value);
	}

	var ip = new NetIP();
	ip.setNetmask(value);

	return value == ip.getNetmask() || value == ip.getNetmask(true);
};

/**
 * Converts an integer value to address in dot notation
 *
 * @param	Integer	value
 * @param	Integer	radix
 * @return	String
 * @access	static
 */
NetIP.itoa = function(value, radix)
{
	var padding;
	switch ( radix ) {
	case 2:
		padding = "00000000";
		break;
	case 8:
		padding = "000";
		break;
	case 16:
		padding = "00";
		break;
	default:
		padding = "";
		radix = 10;
	}
	value = Number(value);

	var bytes = [
		((value >>> 0x18) & 0xff),
		((value >>> 0x10) & 0xff),
		((value >>> 0x08) & 0xff),
		(value & 0xff)];

	for (var i = 0; i < bytes.length; i++) {
		bytes[i] = (padding + bytes[i].toString(radix).toUpperCase()).slice(-padding.length);
	}

	return bytes.join('.');
};

/**
 * object.contains(value)
 *
 * Checks the address is in this network.
 * The address may be a NetIP object, a CIDR string or an array
 *
 * @param	NetIP	object
 * @param	Mixed	value
 * @return	Boolean
 * @access	public
 */
NetIP.prototype.contains = function(value)
{
	var ip = new NetIP(value);
	return ip.getAddress() >= this.getNetwork() && ip.getAddress() <= this.getBroadcast();
};

/**
 * object.equals(value)
 *
 * Checks that the value is equal to this address.
 * The value may be a NetIP object, a CIDR string or an array
 *
 * @param	NetIP	object
 * @param	Mixed	value
 * @return	Boolean
 * @access	public
 */
NetIP.prototype.equals = function(value)
{
	var ip = new NetIP(value);
	return ip.getAddress() == this.getAddress();
};

/**
 * object.getAddress()
 *
 * Returns the address
 *
 * @param	NetIP	object
 * @param	void
 * @return	Integer
 * @access	public
 */
NetIP.prototype.getAddress = function()
{
	return this.getPrivates().address;
};

/**
 * object.getBitmask()
 *
 * Returns the bitmask for this network
 *
 * @param	NetIP	object
 * @param	void
 * @return	Integer
 * @access	public
 */
NetIP.prototype.getBitmask = function()
{
	return this.getPrivates().bitmask;
};

/**
 * object.getBroadcast()
 *
 * Returns the broadcast address
 *
 * @param	NetIP	object
 * @param	void
 * @return	Integer
 * @access	public
 */
NetIP.prototype.getBroadcast = function()
{
	return this.getNetwork() + this.getNetmask(true);
};

/**
 * object.getFirstAddress()
 *
 * Returns the first address for this network
 *
 * @param	NetIP	object
 * @param	void
 * @return	Integer
 * @access	public
 */
NetIP.prototype.getFirstAddress = function()
{
	return this.getNetwork() + 1;
};

/**
 * object.getLastAddress()
 *
 * Returns the last address for this network
 *
 * @param	NetIP	object
 * @param	void
 * @return	Integer
 * @access	public
 */
NetIP.prototype.getLastAddress = function()
{
	return this.getBroadcast() - 1;
};

/**
 * object.getNetmask(inverse)
 *
 * Returns the netmask (direct or inverse)
 *
 * @param	NetIP	object
 * @param	Boolean	inverse
 * @return	Integer
 * @access	public
 */
NetIP.prototype.getNetmask = function(inverse)
{
	var mask = NetIP.netmaskMap[this.getBitmask()];
	return inverse ? mask ^ 0xffffffff : mask;
};

/**
 * object.getNetwork()
 *
 * Returns the address of this network
 *
 * @param	NetIP	object
 * @param	void
 * @return	Integer
 * @access	public
 */
NetIP.prototype.getNetwork = function()
{
	return this.getPrivates().network;
};

/**
 * object.length()
 *
 * Returns the length of this network
 *
 * @param	NetIP	object
 * @param	void
 * @return	Integer
 * @access	public
 */
NetIP.prototype.length = function()
{
	var count = this.getBroadcast() - this.getFirstAddress();
	return count < 0 ? 0 : count;
};

(function()
{

/**
 * Sets the address of this network
 *
 * @param	void
 * @return	void
 * @access	private
 */
var adjustNetwork = function(ip)
{
	var p = ip.getPrivates();
	p.network = ip.getAddress() & ip.getNetmask();
	if ( p.network < 0 ) {
		p.network += 0x100000000;
	}
};

/**
 * object.setAddress(value)
 *
 * Sets the address
 *
 * @param	NetIP	object
 * @param	Integer, String
 * @return	void
 * @access	public
 */
NetIP.prototype.setAddress = function(value)
{
	if ( NetIP.isIP(value) ) {
		value = NetIP.atoi(value);
	}
	this.getPrivates().address = Number(value);
	adjustNetwork(this);
};

/**
 * object.setBitmask(value)
 *
 * Sets the bitmask
 *
 * @param	NetIP	object
 * @param	Integer, String
 * @return	void
 * @access	public
 */
NetIP.prototype.setBitmask = function(value)
{
	if ( String(value).match(/^\/\d+$/) ) {
		value = value.substr(1);
	}

	if ( ! NetIP.isBitmask(value) ) {
		return;
	}

	this.getPrivates().bitmask = Number(value);
	adjustNetwork(this);
};

})();

/**
 * object.setNetmask(value)
 *
 * Sets the netmask
 *
 * @param	NetIP	object
 * @param	Integer, String
 * @return	void
 * @access	public
 */
NetIP.prototype.setNetmask = function(value)
{
	if ( NetIP.isIP(value) ) {
		value = NetIP.atoi(value);
	}
	if ( value < NetIP.netmaskMap[1] ) {
		value ^= 0xffffffff;
	}
	if ( value < 0 ) {
		value += 0x100000000;
	}

//	var i = NetIP.netmaskMap.lastIndexOf(Number(value));

	var i = NetIP.netmaskMap.length - 1;
	while ( i && NetIP.netmaskMap[i] != value ) {
		i--;
	}

	this.setBitmask(i);
};

/**
 * object.toString(netmask)
 *
 * Converts the NetIP object to the string and returns it.
 * The resulting string might be in the format 
 * as address/bitmask or address/netmask.
 *
 * @param	NetIP	object
 * @param	Boolean
 * @return	String
 * @access	public
 */
NetIP.prototype.toString = function(netmask)
{
	return NetIP.itoa(this.getAddress()) + '/' + ( netmask ? NetIP.itoa(this.getNetmask()) : this.getBitmask() );
};
