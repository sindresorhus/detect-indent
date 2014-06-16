'use strict';
var RE_MULTILINE_COMMENTS = /\/\*[\S\s]*?\*\//;
var RE_EMPTY_LINE = /^\s*$/;
var RE_LEADING_WHITESPACE = /^[ \t]+/;

function gcd(a, b) {
	return b ? gcd(b, a % b) : a;
}

module.exports = function (str) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	var lines = str.replace(RE_MULTILINE_COMMENTS, '').split(/\r?\n/);
	var tabs = 0;
	var spaces = [];

	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];

		if (RE_EMPTY_LINE.test(line)) {
			continue;
		}

		var matches = line.match(RE_LEADING_WHITESPACE);

		if (matches) {
			var whitespace = matches[0];
			var len = whitespace.length;

			if (whitespace.indexOf('\t') !== -1) {
				tabs++;
			}

			// convert odd numbers to even numbers
			if (len % 2 === 1) {
				len += 1;
			}

			if (whitespace.indexOf(' ') !== -1) {
				spaces.push(len);
			}
		}
	}

	if (tabs > spaces.length) {
		return '\t';
	}

	if (spaces.length === 0) {
		return null;
	}

	// greatest common divisor is most likely the indent size
	var indentSize = spaces.reduce(gcd);

	if (indentSize > 0) {
		return new Array(indentSize + 1).join(' ');
	}

	return null;
}
