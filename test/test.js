/*global describe, it */
'use strict';
var isBrowser = typeof window !== 'undefined';
var readFileSync;

if (isBrowser) {
	var xhrSync = (function () {
		/*global XMLHttpRequest */
		var xhr = new XMLHttpRequest();
		return function(method, url, callback) {
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					callback(xhr.responseText);
				}
			};
			xhr.open(method, url, false);
			xhr.send();
		};
	})();

	readFileSync = function (file) {
		var ret;
		xhrSync('get', file, function (data) {
			ret = data;
		});
		return ret;
	}
} else {
	var fs = require('fs');
	var path = require('path');
	var assert = require('chai').assert;
	var detectIndent = require('../detect-indent');

	readFileSync = function (file) {
		return fs.readFileSync(path.join(__dirname, file), 'utf8');
	};
}

describe('detectIndent()', function () {
	it('should detect the indent of a file with space indent', function () {
		assert.equal(detectIndent(readFileSync('fixture/space.js')), '    ');
	});

	it('should detect the indent of a file with tab indent', function () {
		assert.equal(detectIndent(readFileSync('fixture/tab.js')), '\t');
	});

	it('should detect the indent of a file with mostly tabs', function () {
		assert.equal(detectIndent(readFileSync('fixture/mixed-tab.js')), '\t');
	});

	it('should detect the indent of a file with mostly spaces', function () {
		assert.equal(detectIndent(readFileSync('fixture/mixed-space.js')), '    ');
	});

	it('should detect the indent of a weirdly indented vendor prefixed CSS', function () {
		assert.equal(detectIndent(readFileSync('fixture/vendor-prefixed-css.css')), '    ');
	});
});
