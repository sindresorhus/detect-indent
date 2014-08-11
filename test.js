'use strict';
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var detectIndent = require('./');

function getFile(file) {
	return fs.readFileSync(path.join(__dirname, file), 'utf8');
}

it('should detect the indent of a file with space indent', function () {
	assert.equal(detectIndent(getFile('fixture/space.js')), '    ');
});

it('should return indentation stats for spaces', function () {
	var indent = detectIndent.stats(getFile('fixture/space.js'));
	assert.deepEqual(indent, { amount: 4, actual: ' ', type: 'space' });
});

it('should detect the indent of a file with tab indent', function () {
	assert.equal(detectIndent(getFile('fixture/tab.js')), '\t');
});

it('should return indentation stats for tabs', function () {
	var indent = detectIndent.stats(getFile('fixture/tab.js'));
	assert.deepEqual(indent, { amount: 1, actual: '\t', type: 'tab' });
});

it('should detect the indent of a file with equal tabs and spaces', function () {
	assert.equal(detectIndent(getFile('fixture/mixed-tab.js')), '\t');
});

it('should return indentation stats for equal tabs and spaces', function () {
	var indent = detectIndent.stats(getFile('fixture/mixed-tab.js'));
	assert.deepEqual(indent, { amount: 1, actual: '\t', type: 'tab' });
});

it('should detect the indent of a file with mostly spaces', function () {
	assert.equal(detectIndent(getFile('fixture/mixed-space.js')), '    ');
});

it('should return indentation stats for mostly spaces', function () {
	var indent = detectIndent.stats(getFile('fixture/mixed-space.js'));
	assert.deepEqual(indent, { amount: 4, actual: ' ', type: 'space' });
});

it('should detect the indent of a weirdly indented vendor prefixed CSS', function () {
	assert.equal(detectIndent(getFile('fixture/vendor-prefixed-css.css')), '    ');
});

it('should return indentation stats for mostly spaces', function () {
	var indent = detectIndent.stats(getFile('fixture/vendor-prefixed-css.css'));
	assert.deepEqual(indent, { amount: 4, actual: ' ', type: 'space' });
});

it('should return `0` when there is no indentation', function () {
	assert.equal(detectIndent('<ul></ul>'), 0);
});

it('should return indentation stats for mostly spaces', function () {
	var indent = detectIndent.stats('<ul></ul>');
	assert.deepEqual(indent, { amount: 0, actual: '', type: 'none' });
});
