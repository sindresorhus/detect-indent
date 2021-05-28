import fs from 'fs';
import path from 'path';
import test from 'ava';
import detectIndent from '.';

const getFile = file => fs.readFileSync(path.join(__dirname, file), 'utf8');

test('detect the indent of a file with space indent', t => {
	t.is(detectIndent(getFile('fixture/space.js')).indent, '    ');
});

test('return indentation stats for spaces', t => {
	const stats = detectIndent(getFile('fixture/space.js'));
	t.deepEqual(stats, {
		amount: 4,
		indent: '    ',
		type: 'space'
	});
});

test('return indentation stats for multiple tabs', t => {
	const stats = detectIndent(getFile('fixture/tab-four.js'));
	t.deepEqual(stats, {
		amount: 4,
		indent: '\t\t\t\t',
		type: 'tab'
	});
});

test('detect the indent of a file with tab indent', t => {
	t.is(detectIndent(getFile('fixture/tab.js')).indent, '\t');
});

test('return indentation stats for tabs', t => {
	const stats = detectIndent(getFile('fixture/tab.js'));
	t.deepEqual(stats, {
		amount: 1,
		indent: '\t',
		type: 'tab'
	});
});

test('detect the indent of a file with equal tabs and spaces', t => {
	t.is(detectIndent(getFile('fixture/mixed-tab.js')).indent, '\t');
});

test('return indentation stats for equal tabs and spaces', t => {
	const indent = detectIndent(getFile('fixture/mixed-tab.js'));
	t.deepEqual(indent, {
		amount: 1,
		indent: '\t',
		type: 'tab'
	});
});

test('detect the indent of a file with mostly spaces', t => {
	const stats = detectIndent(getFile('fixture/mixed-space.js'));
	t.is(stats.indent, '    ');
});

test('return indentation stats for mostly spaces', t => {
	const stats = detectIndent(getFile('fixture/mixed-space.js'));
	t.deepEqual(stats, {
		amount: 4,
		indent: '    ',
		type: 'space'
	});
});

test('detect the indent of a weirdly indented vendor prefixed CSS', t => {
	const stats = detectIndent(getFile('fixture/vendor-prefixed-css.css'));
	t.is(stats.indent, '    ');
});

test('return indentation stats for various spaces', t => {
	const stats = detectIndent(getFile('fixture/vendor-prefixed-css.css'));
	t.deepEqual(stats, {
		amount: 4,
		indent: '    ',
		type: 'space'
	});
});

test('return `0` when there is no indentation', t => {
	t.is(detectIndent('<ul></ul>').amount, 0);
});

test('return indentation stats for no indentation', t => {
	const stats = detectIndent('<ul></ul>');
	t.deepEqual(stats, {
		amount: 0,
		indent: '',
		type: undefined
	});
});

test('return indentation stats for fifty-fifty indented files with spaces first', t => {
	const stats = detectIndent(getFile('fixture/fifty-fifty-space-first.js'));
	t.deepEqual(stats, {
		amount: 4,
		indent: '    ',
		type: 'space'
	});
});

test('return indentation stats for fifty-fifty indented files with tabs first', t => {
	const stats = detectIndent(getFile('fixture/fifty-fifty-tab-first.js'));
	t.deepEqual(stats, {
		amount: 1,
		indent: '	',
		type: 'tab'
	});
});

test('return indentation stats for indented files with spaces and tabs last', t => {
	const stats = detectIndent(getFile('fixture/space-tab-last.js'));
	t.deepEqual(stats, {
		amount: 1,
		indent: '	',
		type: 'tab'
	});
});

test('detect the indent of a file with single line comments', t => {
	const stats = detectIndent(getFile('fixture/single-space-ignore.js'));
	t.deepEqual(stats, {
		amount: 4,
		indent: '    ',
		type: 'space'
	});
});

test('return indentations status for indented files with single spaces only', t => {
	const stats = detectIndent(getFile('fixture/single-space-only.js'));
	t.deepEqual(stats, {
		amount: 1,
		indent: ' ',
		type: 'space'
	});
});
