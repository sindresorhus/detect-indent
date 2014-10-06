'use strict';

// detect either spaces or tabs but not both to properly handle tabs
// for indentation and spaces for alignment
var INDENT_RE = /^(?:( )+|\t+)/;

function strRepeat(str, n) {
	return new Array(n + 1).join(str);
}

module.exports = function (str) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	// used to if tabs or spaces are the most used
	var t = 0;
	var s = 0;

	// remember the indentation used for the previous line
	var last = 0;

	// remember how much a given indentation size was used
	var indents = {};

	str.split(/\n/g).forEach(function (line) {
		if (!line) {
			// ignore empty lines
			return;
		}

		var matches = line.match(INDENT_RE);

		if (!matches) {
			// no indent for this line
			last = 0;
			return;
		}

		if (matches[1]) {
			// spaces were used
			++s;
		} else {
			// tabs were used
			++t;
		}

		var indent = matches[0].length;
		var diff = Math.abs(indent - last);
		last = indent;

		if (diff) {
			// an indent or deindent has been detected
			indents[diff] = (indents[diff] || 0) + 1;
		}
	});

	// find most frequent indentation
	var amount = 0;
	var max = 0;
	var n;
	for (var diff in indents) {
		n = indents[diff];
		if (n > max) {
			max = n;
			amount = +diff;
		}
	}

	var type, actual;
	if (!amount) {
		type = null;
		actual = '';
	} else if (s >= t) {
		type = 'space';
		actual = strRepeat(' ', amount);
	} else {
		type = 'tab';
		actual = strRepeat('\t', amount);
	}

	return {
		amount: amount,
		type: type,
		indent: actual
	};
};
