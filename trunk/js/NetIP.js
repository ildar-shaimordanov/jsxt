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

if ( ! NetIP ) {

function NetIP()
{

	// {{{ properties

	/**
	 * Reference to the NetIP object
	 *
	 * @var
	 * @access	private
	 */
	var self = this;

	/**
	 * Map of bitmasks to networks
	 *
	 * @var
	 * @access	private
	 */
	var netmaskMap = [
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
	 * IP address
	 *
	 * @var
	 * @access	private
	 */
	var address = 0;

	/**
	 * Bitmask of network
	 *
	 * @var
	 * @access	private
	 */
	var bitmask = 24;

	/**
	 * Network address
	 *
	 * @var
	 * @access	private
	 */
	var network;

	// }}}
	// {{{ methods

	/**
	 * Checks the address is in this network.
	 * The address may be a NetIP object, a CIDR string or an array
	 *
	 * @param	Mixed	value
	 * @return	Boolean
	 * @access	public
	 */
	self.contains = function(value)
	{
		var ip = new NetIP(value);
		return ip.getAddress() >= self.getNetwork() && ip.getAddress() <= self.getBroadcast();
	};

	/**
	 * Checks that the value is equal to this address.
	 * The value may be a NetIP object, a CIDR string or an array
	 *
	 * @param	Mixed	value
	 * @return	Boolean
	 * @access	public
	 */
	self.equals = function(value)
	{
		var ip = new NetIP(value);
		return ip.getAddress() == self.getAddress();
	};

	/**
	 * Returns the address
	 *
	 * @param	void
	 * @return	Integer
	 * @access	public
	 */
	self.getAddress = function()
	{
		return address;
	};

	/**
	 * Returns the bitmask for this network
	 *
	 * @param	void
	 * @return	Integer
	 * @access	public
	 */
	self.getBitmask = function()
	{
		return bitmask;
	};

	/**
	 * Returns the broadcast address
	 *
	 * @param	void
	 * @return	Integer
	 * @access	public
	 */
	self.getBroadcast = function()
	{
		return self.getNetwork() + self.getNetmask(true);
	};

	/**
	 * Returns the first address for this network
	 *
	 * @param	void
	 * @return	Integer
	 * @access	public
	 */
	self.getFirstAddress = function()
	{
		return self.getNetwork() + 1;
	};

	/**
	 * Returns the last address for this network
	 *
	 * @param	void
	 * @return	Integer
	 * @access	public
	 */
	self.getLastAddress = function()
	{
		return self.getBroadcast() - 1;
	};

	/**
	 * Returns the netmask (direct or inverse)
	 *
	 * @param	Boolean
	 * @return	Integer
	 * @access	public
	 */
	self.getNetmask = function(inverse)
	{
		var mask = netmaskMap[self.getBitmask()];
		return inverse ? mask ^ 0xffffffff : mask;
	};

	/**
	 * Returns the address of this network
	 *
	 * @param	void
	 * @return	Integer
	 * @access	public
	 */
	self.getNetwork = function()
	{
		return network;
	};

	/**
	 * Returns the length of this network
	 *
	 * @param	void
	 * @return	Integer
	 * @access	public
	 */
	self.length = function()
	{
		var count = self.getBroadcast() - self.getFirstAddress();
		return count < 0 ? 0 : count;
	};

	/**
	 * Sets the address
	 *
	 * @param	Integer, String
	 * @return	void
	 * @access	public
	 */
	self.setAddress = function(value)
	{
		if ( NetIP.isIP(value) ) {
			value = NetIP.atoi(value);
		}
		address = Number(value);
		setNetwork();
	};

	/**
	 * Sets the bitmask
	 *
	 * @param	Integer, String
	 * @return	void
	 * @access	public
	 */
	self.setBitmask = function(value)
	{
		if ( String(value).match(/^\/\d+$/) ) {
			value = value.substr(1);
		}

		if ( ! NetIP.isBitmask(value) ) {
			return;
		}

		bitmask = Number(value);
		setNetwork();
	};

	/**
	 * Sets the netmask
	 *
	 * @param	Integer, String
	 * @return	void
	 * @access	public
	 */
	self.setNetmask = function(value)
	{
		if ( NetIP.isIP(value) ) {
			value = NetIP.atoi(value);
		}
		if ( value < netmaskMap[1] ) {
			value ^= 0xffffffff;
		}
		if ( value < 0 ) {
			value += 0x100000000;
		}

//		var i = netmaskMap.lastIndexOf(Number(value));

		var i = netmaskMap.length - 1;
		while ( i && netmaskMap[i] != value ) {
			i--;
		}

		self.setBitmask(i);
	};

	/**
	 * Sets the address of this network
	 *
	 * @param	void
	 * @return	void
	 * @access	private
	 */
	function setNetwork()
	{
		network = self.getAddress() & self.getNetmask();
		if ( network < 0 ) {
			network += 0x100000000;
		}
	};

	/**
	 * Converts the NetIP object to the string and returns it.
	 * The resulting string might be in the format 
	 * as address/bitmask or address/netmask.
	 *
	 * @param	Boolean
	 * @return	String
	 * @access	public
	 */
	self.toString = function(netmask)
	{
		return NetIP.itoa(self.getAddress()) + '/' + ( netmask ? NetIP.itoa(self.getNetmask()) : self.getBitmask() );
	};

	// }}}
	// {{{ constructor

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
		addr = arguments[0] || address;
		mask = arguments[1] || bitmask;
	}

	self.setAddress(addr);
	if ( NetIP.isBitmask(mask) ) {
		self.setBitmask(mask);
	} else {
		self.setNetmask(mask);
	}

	// }}}

};

}

if ( ! NetIP.atoi ) {

/**
 * Converts an address in dot notation to integer
 *
 * @param	String
 * @return	Integer
 * @access	static
 */
NetIP.atoi = function(value)
{
//	return String(value)
//		.split('.')
//		.reduce(function(a, b)
//		{
//			return a * 0x100 + Number(b);
//		}, 0);

	var bytes = String(value).split('.');
	var result = 0;

	for (var i = 0; i < bytes.length; i++) {
		result = result * 0x100 + Number(bytes[i]);
	}

	return result;
};

}

if ( ! NetIP.isBitmask ) {

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

}

if ( ! NetIP.isIP ) {

/**
 * Validate a value as address in dot notation
 *
 * @param	String
 * @return	Boolean
 * @access	static
 */
NetIP.isIP = function(value)
{
	return String(value).match(/^\s*(?:([01]?\d\d?|2[0-4]\d|25[0-5])\.)(?:([01]?\d\d?|2[0-4]\d|25[0-5])\.)(?:([01]?\d\d?|2[0-4]\d|25[0-5])\.)([01]?\d\d?|2[0-4]\d|25[0-5])\s*$/);
};

}

if ( ! NetIP.isNetmask ) {

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
		value = value.atoi();
	}

	var ip = new NetIP();
	ip.setNetmask(value);
	return value === ip.getNetmask() || value === ip.getNetmask(true);
};

}

if ( ! NetIP.itoa ) {

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

//	var bytes = [
//		((value >>> 0x18) & 0xff)[radix](width, "0"),
//		((value >>> 0x10) & 0xff)[radix](width, "0"),
//		((value >>> 0x08) & 0xff)[radix](width, "0"),
//		(value & 0xff)[radix](width, "0")];

	return bytes.join('.');
};

}

if ( ! NetIP.win32IPConfig ) {

/**
 * Returns all network information as array of a [addr, mask] pair for Windows only.
 * This feature is experimental.
 *
 * @param	void
 * @return	Array
 * @access	Static
 */
NetIP.win32IPConfig = function()
{
	var WMI = GetObject('WinMgmts:');
	var sql = 'SELECT * FROM Win32_NetworkAdapterConfiguration';

	var query = WMI.ExecQuery(sql);
	var enumer = new Enumerator(query);

	var result = [];
	while ( ! enumer.atEnd() ) {
		var adapter = enumer.item();
		enumer.moveNext();

		if ( adapter.IPAddress === null || adapter.IPSubnet === null ) {
			continue;
		}

		var addr = (new VBArray(adapter.IPAddress)).toArray();
		var mask = (new VBArray(adapter.IPSubnet)).toArray();
		var len = Math.min(addr.length, mask.length);
		for (var i = 0; i < len; i++) {
			if ( ! addr[i] || ! mask[i] ) {
				continue;
			}
			result[result.length] = [addr[i], mask[i]];
		}
	}
	return result;
};

}

if ( ! Number.prototype.itoa ) {

/**
 * Wrapper for the NetIP.itoa()
 *
 * @param	Integer	radix
 * @return	String
 * @access	public
 */
Number.prototype.itoa = function(radix)
{
	return NetIP.itoa(this, radix);
};

}

if ( ! String.prototype.atoi ) {

/**
 * Wrapper for the NetIP.atoi()
 *
 * @param	void
 * @return	Integer
 * @access	public
 */
String.prototype.atoi = function()
{
	return NetIP.atoi(this);
};

}

if ( ! String.prototype.isIP ) {

/**
 * Wrapper for the NetIP.isIP()
 *
 * @param	void
 * @return	Boolean
 * @access	public
 */
String.prototype.isIP = function()
{
	return NetIP.isIP(this);
};

}

if ( ! String.prototype.isNetmask ) {

/**
 * Wrapper for the NetIP.isNetmask()
 *
 * @param	void
 * @return	Boolean
 * @access	public
 */
String.prototype.isNetmask = function()
{
	return NetIP.isNetmask(this);
};

}

