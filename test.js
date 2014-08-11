'use strict';
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var detectIndent = require('./');

function getFile(file) {
	return fs.readFileSync(path.join(__dirname, file), 'utf8');
}

it('should detect the indent of a file with space indent', function () {
	assert.equal(detectIndent(getFile('fixture/space.js')), '\u0020\u0020\u0020\u0020');
});

it('should detect the indent of a file with tab indent', function () {
	assert.equal(detectIndent(getFile('fixture/tab.js')), '\t');
});

it('should detect the indent of a file with mostly tabs', function () {
	assert.equal(detectIndent(getFile('fixture/mixed-tab.js')), '\u0020\u0020');
});

it('should detect the indent of a file with mostly spaces', function () {
	assert.equal(detectIndent(getFile('fixture/mixed-space.js')), '\u0020\u0020\u0020\u0020');
});

it('should detect the indent of a weirdly indented vendor prefixed CSS', function () {
	assert.equal(detectIndent(getFile('fixture/vendor-prefixed-css.css')), '\u0020\u0020\u0020\u0020');
});

it('should return `null` when there are no indentation', function () {
	assert.equal(detectIndent('<ul></ul>'), 0);
});
