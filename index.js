'use strict';

var strip = require('strip-comments');

function gcd(a, b) {
	return b ? gcd(b, a % b) : a;
}

module.exports = function (str) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	// Strip multi-line comments, and normalize
	str = strip.block(str).replace(/\r/g, '');

	var re = /^([ \t]*)/;
	var result = [], t = 0, s = 0;

	str.split(/\n/g).forEach(function(line) {
		/^\t/.test(line) ? t++ : s++;

		var len = line.match(re)[0].length;

		// convert odd numbers to even numbers
		if (len % 2 === 1) {
			len += 1;
		}
		result.push(len || 0);
	});

	// greatest common divisor is most likely the indent size
	var indent = result.reduce(gcd) || 0;

	var amount = indent === 0 ? 0 : (s === t ? indent / 2 : (t >= s ? indent / 2 : indent));
	var type = indent === 0 ? null : (s >= t ? 'space' : 'tab');
	var actual = indent === 0 ? '' : (s >= t ? ' ' : '\t');

	if (amount > 0) {
		actual = new Array(amount + 1).join(actual);
	}

	return {amount: amount, type: type, indent: actual};
};
