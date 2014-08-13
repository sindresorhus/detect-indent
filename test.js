'use strict';
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var detectIndent = require('./');

function getFile(file) {
	return fs.readFileSync(path.join(__dirname, file), 'utf8');
}

it('should detect the indent of a file with space indent', function () {
	assert.equal(detectIndent(getFile('fixture/space.js')).indent, '    ');
});

it('should return indentation stats for spaces', function () {
	var stats = detectIndent(getFile('fixture/space.js'));
	assert.deepEqual(stats, { amount: 4, indent: '    ', type: 'space' });
});

it('should detect the indent of a file with tab indent', function () {
	assert.equal(detectIndent(getFile('fixture/tab.js')).indent, '\t');
});

it('should return indentation stats for tabs', function () {
	var stats = detectIndent(getFile('fixture/tab.js'));
	assert.deepEqual(stats, { amount: 1, indent: '\t', type: 'tab' });
});

it('should detect the indent of a file with equal tabs and spaces', function () {
	assert.equal(detectIndent(getFile('fixture/mixed-tab.js')).indent, '\t');
});

it('should return indentation stats for equal tabs and spaces', function () {
	var indent = detectIndent(getFile('fixture/mixed-tab.js'));
	assert.deepEqual(indent, { amount: 1, indent: '\t', type: 'tab' });
});

it('should detect the indent of a file with mostly spaces', function () {
	var stats = detectIndent(getFile('fixture/mixed-space.js'));
	assert.equal(stats.indent, '    ');
});

it('should return indentation stats for mostly spaces', function () {
	var stats = detectIndent(getFile('fixture/mixed-space.js'));
	assert.deepEqual(stats, { amount: 4, indent: '    ', type: 'space' });
});

it('should detect the indent of a weirdly indented vendor prefixed CSS', function () {
	var stats = detectIndent(getFile('fixture/vendor-prefixed-css.css'));
	assert.equal(stats.indent, '    ');
});

it('should return indentation stats for mostly spaces', function () {
	var stats = detectIndent(getFile('fixture/vendor-prefixed-css.css'));
	assert.deepEqual(stats, { amount: 4, indent: '    ', type: 'space' });
});

it('should return `0` when there is no indentation', function () {
	assert.equal(detectIndent('<ul></ul>').amount, 0);
});

it('should return indentation stats for mostly spaces', function () {
	var stats = detectIndent('<ul></ul>');
	assert.deepEqual(stats, { amount: 0, indent: '', type: null });
});
