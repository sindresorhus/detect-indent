import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import test from 'ava';
import detectIndent from './index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const getFile = file => fs.readFileSync(path.join(__dirname, file), 'utf8');

test('return indentation stats for spaces', t => {
	const stats = detectIndent(getFile('fixture/space.js'));
	t.deepEqual(stats, {
		amount: 4,
		indent: '    ',
		type: 'space',
	});
});

test('return indentation stats for multiple tabs', t => {
	const stats = detectIndent(getFile('fixture/tab-four.js'));
	t.deepEqual(stats, {
		amount: 4,
		indent: '\t\t\t\t',
		type: 'tab',
	});
});

test('return indentation stats for tabs', t => {
	const stats = detectIndent(getFile('fixture/tab.js'));
	t.deepEqual(stats, {
		amount: 1,
		indent: '\t',
		type: 'tab',
	});
});

test('return indentation stats for equal tabs and spaces', t => {
	const indent = detectIndent(getFile('fixture/mixed-tab.js'));
	t.deepEqual(indent, {
		amount: 1,
		indent: '\t',
		type: 'tab',
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
		type: 'space',
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
		type: 'space',
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
		type: undefined,
	});
});

test('return indentation stats for fifty-fifty indented files with spaces first', t => {
	const stats = detectIndent(getFile('fixture/fifty-fifty-space-first.js'));
	t.deepEqual(stats, {
		amount: 4,
		indent: '    ',
		type: 'space',
	});
});

test('return indentation stats for fifty-fifty indented files with tabs first', t => {
	const stats = detectIndent(getFile('fixture/fifty-fifty-tab-first.js'));
	t.deepEqual(stats, {
		amount: 1,
		indent: '	',
		type: 'tab',
	});
});

test('return indentation stats for indented files with spaces and tabs last', t => {
	const stats = detectIndent(getFile('fixture/space-tab-last.js'));
	t.deepEqual(stats, {
		amount: 1,
		indent: '	',
		type: 'tab',
	});
});

test('detect the indent of a file with single line comments', t => {
	const stats = detectIndent(getFile('fixture/single-space-ignore.js'));
	t.deepEqual(stats, {
		amount: 4,
		indent: '    ',
		type: 'space',
	});
});

test('return indentations status for indented files with single spaces only', t => {
	const stats = detectIndent(getFile('fixture/single-space-only.js'));
	t.deepEqual(stats, {
		amount: 1,
		indent: ' ',
		type: 'space',
	});
});

test('detect the indent of a file with many repeats after a single indent', t => {
	const stats = detectIndent(getFile('fixture/long-repeat.js'));
	t.is(stats.amount, 4);
});

test('multi-line comments should not affect indent detection', t => {
	const originalCode = `interface Test {
    a: boolean
    b: boolean
    c: boolean
    d: boolean
    e: boolean
    f: boolean
}`;

	const codeWithComments = `interface Test {
    // a
    a: boolean
    // b
    b: boolean
    // c
    c: boolean
    // d
    d: boolean
    // d
    e: boolean
    /**
     * multi-line comment
     */
    f: boolean
}`;

	const originalIndent = detectIndent(originalCode);
	const commentIndent = detectIndent(codeWithComments);

	t.is(originalIndent.amount, 4);
	t.is(commentIndent.amount, 4);
	t.is(originalIndent.type, commentIndent.type);
});

test('aligned JSDoc comments should not affect indent detection', t => {
	const code = `/**
 * JSDoc comment
 * @param {string} param
 * @returns {boolean}
 */
function test() {
    return true;
}`;

	const result = detectIndent(code);
	t.is(result.amount, 4);
	t.is(result.type, 'space');
});

test('single-space alignment in comments should be ignored', t => {
	const code = `function test() {
    const obj = {
        // Comment aligned
         key: 'value', // Single space alignment
        other: 'value'
    };
}`;

	const result = detectIndent(code);
	t.is(result.amount, 4);
	t.is(result.type, 'space');
});

test('mixed tabs and spaces with single-space alignment should detect tabs', t => {
	const code = `{
	key: value,
	 other: value, // single space + content
	nested: {
		deep: true
	}
}`;

	const result = detectIndent(code);
	t.is(result.amount, 1);
	t.is(result.type, 'tab');
});

test('handle empty string', t => {
	const stats = detectIndent('');
	t.deepEqual(stats, {
		amount: 0,
		indent: '',
		type: undefined,
	});
});

test('detect 2-space indentation', t => {
	const code = `module.exports = {
  name: 'test',
  nested: {
    deep: {
      a: 1,
      b: 2,
    },
  },
};`;

	const result = detectIndent(code);
	t.is(result.amount, 2);
	t.is(result.type, 'space');
});

test('handle CRLF line endings', t => {
	const code = 'function test() {\r\n    return true;\r\n}\r\n';
	const result = detectIndent(code);
	t.is(result.amount, 4);
	t.is(result.type, 'space');
});

test('detect indent in deeply nested code', t => {
	const code = `if (a) {
    if (b) {
        if (c) {
            if (d) {
                if (e) {
                    deep();
                }
            }
        }
    }
}`;

	const result = detectIndent(code);
	t.is(result.amount, 4);
	t.is(result.type, 'space');
});

test('detect indent with sparse indentation', t => {
	const code = `#ifndef HEADER_H
#define HEADER_H

typedef struct {
    int x;
    int y;
} Point;

#define MAX 100
#define MIN 0

extern void init();
extern void cleanup();

#endif`;

	const result = detectIndent(code);
	t.is(result.amount, 4);
	t.is(result.type, 'space');
});

test('continuation/alignment lines should not override real indent when outnumbered', t => {
	const code = `function test(argumentOne,
               argumentTwo) {
    const a = 1;
    const b = 2;
    const c = 3;
    if (a) {
        return b;
    }
    return c;
}`;

	const result = detectIndent(code);
	t.is(result.amount, 4);
	t.is(result.type, 'space');
});

test('detect 3-space indentation', t => {
	const code = `function test() {
   if (condition) {
      doSomething();
      if (nested) {
         deepCall();
      }
   }
}`;

	const result = detectIndent(code);
	t.is(result.amount, 3);
	t.is(result.type, 'space');
});

test('handle minimal signal with only one indent transition', t => {
	const code = `if (true) {
    return 1;
}`;

	const result = detectIndent(code);
	t.is(result.amount, 4);
	t.is(result.type, 'space');
});

test('handle whitespace-only lines', t => {
	const stats = detectIndent('    \n    \n    \n');
	t.deepEqual(stats, {
		amount: 4,
		indent: '    ',
		type: 'space',
	});
});

test('handle file starting already indented', t => {
	const code = `    function inner() {
        return true;
    }`;

	const result = detectIndent(code);
	t.is(result.amount, 4);
	t.is(result.type, 'space');
});
