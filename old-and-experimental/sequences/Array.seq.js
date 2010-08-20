
/**
 * Constructs an iterative semi-abstract sequence
 * It should be overwritten by inherited classes
 *
 * @param	Number	The first value of a sequence
 * @param	Number	The definitive value to declare next values of sequences
 * @param	Fucntion	The callback function to declare the n-th value
 * @param	Fucntion	The callback function to declare previous values
 * @param	Fucntion	The callback function to declare next values
 */
Array.seq = function(a, d, item, prev, next)
{
	var self = this;

	var i = 0;
	var curr = a;

	self.d = function()
	{
		return d;
	};

	self.first = function()
	{
		return a;
	};

	self.item = function(n)
	{
		n = n || 0;

		Array.seq.throwRangeError(n);

		return item(self, n);
	};

	self.curr = function(n)
	{
		if ( Array.seq.isN0(n) ) {
			i = n;
			curr = self.item(n);
		}
		return curr;
	};

	self.prev = function()
	{
		if ( i ) {
			i--;
			curr = prev(self);
		}
		return curr;
	};

	self.next = function()
	{
		i++;
		curr = next(self);
		return curr;
	};
};

/**
 * Validates that the number is natural number greater 0
 *
 * @param	Number
 * @return	Boolean
 * @access	static
 */
Array.seq.isN = function(n)
{
	return Array.seq.isN0(n) && n != 0;
};

/**
 * Validates that the number is natural number greater or equal to 0
 *
 * @param	Number
 * @return	Boolean
 * @access	static
 */
Array.seq.isN0 = function(n)
{
	return Math.abs(Math.floor(n)) == n;
};

/**
 * Throws the RangeError exception if the argument is not a natural number or zero
 */
Array.seq.throwRangeError = function(n)
{
	if ( ! Array.seq.isN0(n)) {
		throw new RangeError();
	}
};


/**
 * Constructs the arithmetic sequence
 *
 * @param	Number	The first value of a sequence
 * @param	Number	The common difference of successive members
 */
Array.seqA = function(first, diff)
{
	Array.seq.call(this, 
		first, 
		diff, 
		function(p, n)
		{
			return first + diff * n;
		}, 
		function(p)
		{
			return p.curr() - diff;
		}, 
		function(p)
		{
			return p.curr() + diff;
		});

	this.diff = this.d;
};

Array.seqA.prototype.sum = function(n, k)
{
	k = k || 0;

	Array.seq.throwRangeError(n);
	Array.seq.throwRangeError(k);

	return n / 2 * (2 * this.first() + this.diff() * (2 * k + n - 1));
};


/**
 * Constructs the geometric sequence
 *
 * @param	Number	The first value of a sequence
 * @param	Number	The common ratio of successive members
 */
Array.seqG = function(first, ratio)
{
	Array.seq.call(this, 
		first, 
		ratio, 
		function(p, n)
		{
			return first * Math.pow(ratio, n);
		}, 
		function(p)
		{
			return p.curr() / ratio;
		}, 
		function(p)
		{
			return p.curr() * ratio;
		});

	this.ratio = this.d;
};

Array.seqG.prototype.sum = function(n, k)
{
	k = k || 0;

	Array.seq.throwRangeError(n);
	Array.seq.throwRangeError(k);

	if ( this.ratio() == 1 ) {
		return n * this.first();
	}

//	return this.item(k) / (this.ratio() - 1) * (Math.pow(this.ratio(), n) - 1);

	var qk = k == 0 
		? 1 
		: Math.pow(this.ratio(), k);

	return this.first() / (this.ratio() - 1) * (Math.pow(this.ratio(), n + k) - qk);
};


var b = new Array.seqG(1, 2);
var n = 10;
var k = 0;

var s = 0;
for (var i = k; i < n + k; i++) {
	s += b.item(i);
	[i, b.item(i)].print();
};

'==='.print();
b.curr().print();
b.next().print();
b.next().print();
b.prev().print();
b.prev().print();
b.prev().print();

'==='.print();
s.print();
b.sum(n, k).print();

//exit();

'==='.print();

var a = new Array.seqA(3, 3);

var n = 10;
var k = 0;

var s = 0;

for (var i = k; i < n + k; i++) {
	s += a.item(i);
	[i, a.item(i)].print();
}

'==='.print();
s.print();
a.sum(n, k).print();

