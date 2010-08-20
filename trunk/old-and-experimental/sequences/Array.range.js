
// Figurate numbers
// http://ru.wikipedia.org/wiki/%D0%A4%D0%B8%D0%B3%D1%83%D1%80%D0%BD%D1%8B%D0%B5_%D1%87%D0%B8%D1%81%D0%BB%D0%B0

'\ntriangular'.print();
Array.range(10, 1, function(a, i)
{
	i += 2;
	return i * (i + 1) / 2;
})
.join('\n')
.print();

'\ntetragonal'.print();
Array.range(10, 1, function(a, i)
{
	i += 2;
	return i * i;
})
.join('\n')
.print();

'\npentagonal'.print();
Array.range(10, 1, function(a, i)
{
	i += 2;
	return i * (3 * i - 1) / 2;
})
.join('\n')
.print();

'\nhexagonal'.print();
Array.range(10, 1, function(a, i)
{
	i += 2;
	return 2 * i * i - i;
})
.join('\n')
.print();


// Generatlized case of figurate numbers
for (var k = 3; k <= 7; k++) {
	('\n=== ' + k).print();
	Array.range(10, 1, function(a, i)
	{
		i += 2;
		return i * ((k - 2) * (i - 1) + 2) / 2;
	})
	.join('\n')
	.print();
}

