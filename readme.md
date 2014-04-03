# detect-indent [![Build Status](https://travis-ci.org/sindresorhus/detect-indent.svg?branch=master)](https://travis-ci.org/sindresorhus/detect-indent)

> Detect the indentation of code

Pass in a string of any kind of text and get the indentation.


## Use cases

- Persisting the indentation when modifying a file.
- Have new content match the existing indentation.
- Setting the right indentation in your editor.


## Install

Download [manually](https://github.com/sindresorhus/detect-indent/releases) or with a package-manager.

```bash
$ npm install --save detect-indent
```

```bash
$ bower install --save detect-indent
```

```bash
$ component install sindresorhus/detect-indent
```


## API

Accepts a string and returns the indentation or `null` if it can't be detected.


## Usage

Modify a JSON file while persisting the indentation in Node.js.

```js
var fs = require('fs');
var detectIndent = require('detect-indent');
/*
{
    "ilove": "pizza"
}
*/
var file = fs.readFileSync('foo.json', 'utf8');
// tries to detect the indentation and falls back to a default if it can't
var indent = detectIndent(file) || '    ';
var json = JSON.parse(file);

json.ilove = 'unicorns';

fs.writeFileSync('foo.json', JSON.stringify(json, null, indent));
/*
{
    "ilove": "unicorns"
}
*/
```


## License

[MIT](http://opensource.org/licenses/MIT) © [Sindre Sorhus](http://sindresorhus.com)
