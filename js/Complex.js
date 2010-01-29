/**
 * Constructor of the complex in the cartesian coordinates (x, y)
 * z = x + iy
 *
 */
function Complex()
{

	var self = this;

	// Cartesian notation
	// z = x + iy
	var x;
	var y;

	// Polar notation
	// z = r (cos(f) + i sin(f))
	// z = r exp(if)
	var r;
	var f;

	// Initialization
	x = Number(arguments[0]) || 0;
	y = Number(arguments[1]) || 0;

	if ( arguments.callee.caller == Complex.construct ) {
		r = Number(arguments[2]);
		f = Number(arguments[3]);
	} else {
		r = Math.sqrt(x * x + y * y);
		f = Math.atan2(y, x);
	}

	// Normalization within the left-opened interval (-pi +pi]
	if ( f > Math.PI || f <= -Math.PI ) {
		var pi2 = 2 * Math.PI;

		f += Math.PI;
		f -= Math.floor(f / pi2) * pi2;
		f -= Math.PI;
	}

	/**
	 * Comparison of complex
	 *
	 */
	self.equals = function(z)
	{
		return x == z.re() && y == z.im();
	};

	/**
	 * True if the complex is real
	 *
	 */
	self.isReal = function()
	{
		return y == 0;
	};

	/**
	 * Re(z) = x
	 *
	 */
	self.re = function()
	{
		return x;
	};

	/**
	 * Im(z) = y
	 *
	 */
	self.im = function()
	{
		return y;
	};

	/**
	 * Module (absolute value) of z
	 * |z| = sqrt(x^2 + y^2)
	 *
	 */
	self.abs = function()
	{
		return r;
	};

	/**
	 * Argument of z
	 * Arg(z) = arctg(y / x)
	 *
	 */
	self.arg = function()
	{
		return f;
	};

	/**
	 * Complex conjugate
	 * z  = x + iy
	 * z' = x - iy
	 *
	 */
	self.conj = function()
	{
		return Complex.construct(x, -y, r, -f);
	};

	/**
	 * Complex negative
	 *
	 */
	self.neg = function()
	{
		return Complex.construct(-x, -y, r, r ? f + Math.PI : 0);
	};

	/**
	 * Add
	 *
	 */
	self.add = function()
	{
		var x1 = x;
		var y1 = y;
		for (var i = 0; i < arguments.length; i++) {
			var z = arguments[i];
			x1 += z.re();
			y1 += z.im();
		}
		return new Complex(x1, y1);
	};

	/**
	 * Substract
	 *
	 */
	self.sub = function()
	{
		var x1 = x;
		var y1 = y;
		for (var i = 0; i < arguments.length; i++) {
			var z = arguments[i];
			x1 -= z.re();
			y1 -= z.im();
		}
		return new Complex(x1, y1);
	};

	/**
	 * Multiply
	 *
	 */
	self.mul = function()
	{
		var r1 = r;
		var f1 = f;
		for (var i = 0; i < arguments.length; i++) {
			var z = arguments[i];
			r1 *= z.abs();
			f1 += z.arg();
		}
		return Complex.fromPolar(r1, f1);
	};

	/**
	 * Divide
	 *
	 */
	self.div = function()
	{
		var r1 = r;
		var f1 = f;
		for (var i = 0; i < arguments.length; i++) {
			var z = arguments[i];
			r1 /= z.abs();
			f1 -= z.arg();
		}
		return Complex.fromPolar(r1, f1);
	};

	/**
	 * Degree z^n
	 *
	 */
	self.pow = function(n)
	{
		n = Number(n) || 0;
		return Complex.fromPolar(Math.pow(r, n), f * n);
	};

	/**
	 * Returns the list of n-th roots
	 *
	 */
	self.roots = function(n, toPolar)
	{
		n = Number(n);

		if ( n - Math.floor(n) ) {
			return Number.NaN;
		}

		var nr = Math.pow(r, 1 / n);
		var nf = [];

		var fi = f / n;
		var d = Math.PI * 2 / n;
	   
		n = Math.abs(n);
		var i = n;
		while ( i-- ) {
			nf.push(fi);
			fi += d;
		};

		if ( toPolar ) {
			nf.abs = nr;
			return nf;
		}

		var z = [];
		for (var i = 0; i < n; i++) {
			z.push(Complex.fromPolar(nr, nf[i]));
		}

		return z;
	};

	/**
	 * Square root of z
	 *
	 */
	self.sqrt = function()
	{
		return Complex.fromPolar(Math.sqrt(r), f / 2);
	};

	/**
	 * Exponential exp(z)
	 *
	 */
	self.exp = function()
	{
		return Complex.fromPolar(Math.exp(x), y);
	};

	/**
	 * Natural logarithm ln(z)
	 *
	 */
	self.log = function()
	{
		return new Complex(Math.log(r), f);
	};

	/**
	 * Creates a new complex from itself
	 *
	 */
	self.z = function()
	{
		return Complex.construct(this.re(), this.im(), this.abs(), this.arg());
	};

	var eps = function(x)
	{
		return Math.abs(x) <= Complex.ZERO_THRESHOLD ? 0 : x;
	};

	/**
	 * String presentation of the complex number
	 * If toPolar is true then this method returns the (r, f) pair
	 * Otherwise the (x, y) pair
	 *
	 */
	self.toString = function(toPolar)
	{
		if ( toPolar ) {
			return [eps(r), eps(f)].join(' ');
		}

		if ( ! eps(y) ) {
			return '' + eps(x);
		}

		return [eps(x), y].join('i');
	};

};

/**
 * Zero displaying threshold
 * ZERO_THRESHOLD = 1e-15
 */
Complex.ZERO_THRESHOLD = 1e-15;

/**
 * Internally used method
 *
 */
Complex.construct = function(x, y, r, f)
{
	return new Complex(x, y, r, f);
};

/**
 * Creates a complex from polar coordinates (r, f)
 * z = r (cos(f) + isin(f))
 * z = r exp(if)
 *
 */
Complex.fromPolar = function()
{
	var r = Number(arguments[0]) || 0;
	var f = Number(arguments[1]) || 0;

	var x = r * Math.cos(f);
	var y = r * Math.sin(f);

	return Complex.construct(x, y, r, f);
};

/**
 * Creates a complex from a real
 *
 */
Complex.re = function()
{
	if ( arguments[0] && arguments[0].constructor != Number ) {
		throw new TypeError();
	}

	var n = Number(arguments[0]) || 0;
	return n.z();
};

/**
 * Creates imaginary number
 *
 */
Complex.im = function()
{
	if ( arguments[0] && arguments[0].constructor != Number ) {
		throw new TypeError();
	}

	var y = Number(arguments[0]) || 1;
	var f = Math.PI / 2;
	return Complex.construct(0, y, Math.abs(y), y < 0 ? -f : f);
};

/**
 * Clones new complex without calculation of internal variables
 *
 */
Complex.z = function(x, y)
{
	return new Complex(x, y);
};

/**
 * The shortcuts for the most popular methods
 *
 */
var $Z  = Complex.z;
var $Re = Complex.re;
var $Im = Complex.im;

/**
 * Methods for compatibility of Number with Complex
 *
 */
Number.prototype.equals = function(z)
{
	return this == z.re() && z.im() == 0;
};

Number.prototype.isReal = function()
{
	return true;
};

Number.prototype.re = function()
{
	return this;
};

Number.prototype.im = function()
{
	return 0;
};

Number.prototype.abs = function()
{
	return Math.abs(this);
};

Number.prototype.arg = function()
{
	return this >= 0 ? 0 : Math.PI;
};

Number.prototype.conj = function()
{
	return this.z();
};

Number.prototype.neg = function()
{
	return (-this).z();
};

Number.prototype.add = function(z)
{
	return this.z().add.apply(this, arguments);
};

Number.prototype.sub = function(z)
{
	return this.z().sub.apply(this, arguments);
};

Number.prototype.mul = function(z)
{
	return this.z().mul.apply(this, arguments);
};

Number.prototype.div = function(z)
{
	return this.z().pow.apply(this, arguments);
};

Number.prototype.pow = function(n)
{
	return this.z().pow(n);
};

Number.prototype.roots = function(n, toPolar)
{
	return this.z().roots(n, toPolar);
};

Number.prototype.sqrt = function()
{
	return this.z().sqrt();
};

Number.prototype.exp = function()
{
	return Math.exp(this).z();
};

Number.prototype.log = function()
{
	return this.z().log();
};

Number.prototype.z = function()
{
	return Complex.construct(this.re(), this.im(), this.abs(), this.arg());
};

