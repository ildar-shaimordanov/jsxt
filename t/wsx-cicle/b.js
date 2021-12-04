console.log('b starting');
exports.done = false;
var a = require('./a.js');
console.log('in b, a.done = %s', a.done);
exports.done = true;
console.log('b done');
