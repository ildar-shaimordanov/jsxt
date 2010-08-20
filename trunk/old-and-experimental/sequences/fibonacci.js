function LucasSequence(u, p, sign)
{

	var self = this;

	if ( ! p || p.length == 0 ) {
		p = [];
		for (var i = 0; i < u.length; i++) {
			p[i] = 1;
		}
	}

	if ( ! sign ) {
		sign = function(n)
		{
			return n % 2 ? -1 : +1;
		}
	}

	function evaluate(n)
	{
		if ( n < u.length ) {
			return u[n];
		}

		var result = 0;
		var L = n - u.length;
		for (var i = 0; i < u.length; i++) {
			result += p[i] * evaluate(L + i);
		}
		return result;
	}

	self.eval = function(n)
	{
		if ( n < 0 ) {
			return sign(n) * evaluate(-n);
		}

		return evaluate(n);
	}

}

/**
 * Jacobsthal-Lucas numbers
 * L[0] = 2
 * L[1] = 1
 * L[n] = L[n - 1] + L[n - 2], n > 1
 *
 * L[n] = fi^n + (1 - fi)^n = fi^n + (-fi)^-n
 */
function Lucas()
{

	LucasSequence.call(this, 
		[2, 1]);

}

/**
 * Fibonacci numbers
 * F[0] = 0
 * F[1] = 1
 * F[n] = F[n - 1] + F[n - 2], n > 1
 *
 * F[n] = (fi^n - (1 - fi)^n) / sqrt5
 */
function Fibonacci()
{

	LucasSequence.call(this, 
		[0, 1], 
		[], 
		function(n)
		{
			return n % 2 ? +1 : -1;
		});

}

function Tribonacci()
{

	LucasSequence.call(this, 
		[0, 0, 1], 
		[], 
		function(n)
		{
			return 0;
		});

}

function NumeratorSeq()
{

	LucasSequence.call(this, 
		[1, 3], 
		[1, 2]);

}

/**
 * Pell numbers
 * P[0] = 0
 * P[1] = 1
 * P[n] = 2P[n - 1] + P[n - 2], n > 1
 *
 * P[n] = ((1 + sqrt2)^n - (1 - sqrt2)^n) / 2sqrt2
 */
function Pell()
{

	LucasSequence.call(this, 
		[0, 1], 
		[1, 2]);

}

/**
 * Pell-Lucas numbers
 * P[0] = 2
 * P[1] = 2
 * P[n] = 2P[n - 1] + P[n - 2], n > 1
 *
 * P[n] = (1 + sqrt2)^n + (1 - sqrt2)^n
 */
function PellLucas()
{

	LucasSequence.call(this, 
		[2, 2], 
		[1, 2]);

}

/**
 * Jacobsthal numbers
 * J[0] = 0
 * J[1] = 1
 * J[n] = J[n - 1] + 2J[n - 2], n > 1
 *
 * J[n + 1] = 2J[n] + (-1)^n
 * J[n] = (2^n - (-1)^n) / 3
 */
function Jacobsthal()
{

	LucasSequence.call(this, 
		[0, 1], 
		[2, 1]);

}

/**
 * Jacobsthal-Lucas numbers
 * L[0] = 2
 * L[1] = 1
 * L[n] = L[n - 1] + 2L[n - 2], n > 1
 *
 * L[n + 1] = 2L[n] - 3(-1)^n
 * L[n] = 2^n + (-1)^n
 */
function JacobsthalLucas()
{

	LucasSequence.call(this, 
		[2, 1], 
		[2, 1]);

}
