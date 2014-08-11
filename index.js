'use strict';

var strip = require('strip-comments');

function gcd(a, b) {
	return b ? gcd(b, a % b) : a;
}

var detect = module.exports = function (str) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	var indent = detect.stats(str);
	if (indent.amount > 0) {
		return new Array(indent.amount + 1).join(indent.actual);
	}

	return 0;
};


detect.stats = function (str) {
	// Strip multi-line comments, and normalize
  str = strip.block(str).replace(/\r/g, '');

  var re = /^([\u0020\t]*)/;
  var result = [], t = 0, s = 0;

  str.split(/\n/g).forEach(function(line) {
    /^\t/.test(line) ? t++ : s++;

    var len = line.match(re)[0].length;

    // convert odd numbers to even numbers
		if (len % 2 === 1) {
			len += 1;
		}

    if (len >= 2) {
      result.push(len || 0);
    }
  });

  // greatest common divisor is most likely the indent size
  var indent = gcd.apply(gcd, result) || 0;

  return {
    amount: indent === 0 ? 0 : (s === t ? indent / 2 : (t >= s ? indent / 2 : indent)),
    actual: indent === 0 ? '' : (s >= t ? '\u0020' : '\t'),
    type: indent === 0 ? 'none' : (s >= t ? 'space' : 'tab')
  };
};
