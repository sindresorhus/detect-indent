import test from 'ava';
import fs from 'fs';
import path from 'path';
import detectIndent from './';

function getFile(file) {
	return fs.readFileSync(path.join(__dirname, file), 'utf8');
}

test('detect the indent of a file with space indent', t => {
	t.is(detectIndent(getFile('fixture/space.js')).indent, '    ');
	t.end();
});

test('return indentation stats for spaces', t => {
	const stats = detectIndent(getFile('fixture/space.js'));
	t.same(stats, {
		amount: 4,
		indent: '    ',
		type: 'space'
	});
	t.end();
});

test('return indentation stats for tabs', t => {
	const stats = detectIndent(getFile('fixture/tab-four.js'));
	t.same(stats, {
		amount: 4,
		indent: '\t\t\t\t',
		type: 'tab'
	});
	t.end();
});

test('detect the indent of a file with tab indent', t => {
	t.is(detectIndent(getFile('fixture/tab.js')).indent, '\t');
	t.end();
});

test('return indentation stats for tabs', t => {
	const stats = detectIndent(getFile('fixture/tab.js'));
	t.same(stats, {
		amount: 1,
		indent: '\t',
		type: 'tab'
	});
	t.end();
});

test('detect the indent of a file with equal tabs and spaces', t => {
	t.is(detectIndent(getFile('fixture/mixed-tab.js')).indent, '\t');
	t.end();
});

test('return indentation stats for equal tabs and spaces', t => {
	const indent = detectIndent(getFile('fixture/mixed-tab.js'));
	t.same(indent, {
		amount: 1,
		indent: '\t',
		type: 'tab'
	});
	t.end();
});

test('detect the indent of a file with mostly spaces', t => {
	const stats = detectIndent(getFile('fixture/mixed-space.js'));
	t.is(stats.indent, '    ');
	t.end();
});

test('return indentation stats for mostly spaces', t => {
	const stats = detectIndent(getFile('fixture/mixed-space.js'));
	t.same(stats, {
		amount: 4,
		indent: '    ',
		type: 'space'
	});
	t.end();
});

test('detect the indent of a weirdly indented vendor prefixed CSS', t => {
	const stats = detectIndent(getFile('fixture/vendor-prefixed-css.css'));
	t.is(stats.indent, '    ');
	t.end();
});

test('return indentation stats for mostly spaces', t => {
	const stats = detectIndent(getFile('fixture/vendor-prefixed-css.css'));
	t.same(stats, {
		amount: 4,
		indent: '    ',
		type: 'space'
	});
	t.end();
});

test('return `0` when there is no indentation', t => {
	t.is(detectIndent('<ul></ul>').amount, 0);
	t.end();
});

test('return indentation stats for no indentation', t => {
	const stats = detectIndent('<ul></ul>');
	t.same(stats, {
		amount: 0,
		indent: '',
		type: null
	});
	t.end();
});
