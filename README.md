# ppend

Simple CLI to rename files by appending, prepending, or cutting (removing) portions of filenames.

A better alternative to calling `mv` several times.

## CLI

### Install

```sh
$ npm install -g ppend
```

### Usage

```sh
$ ppend [options] <text> <file-pattern> [file-pattern2 ... file-patternN]
```

Append `<text>` to names of files or directories matching the given `<file-pattern>`s, preserving file extensions.

### Options

`-p, --pre`

Prepend to file names instead of append. Mutually exclusive with `-x`.

`-x, --cut`

Remove from file names instead of append. Mutually exclusive with `-p`. If both options are given, `-x` will take precedence.

`-v, --verbose`

Print all attempted pseudo `mv` commands to stdout.

`-V, --version`

Print current version of `ppend` instead. If actual arguments are given, this option will be ignored.

## Module

### Install

```sh
$ npm install --save ppend
```

### API

```js
var ppend = require('ppend');

ppend(text, patterns, opts={}, callback);
```

`text`: Required - String of text to append/prepend/cut from matched file names.

`patterns`: Required - String or Array of strings defining [globby](https://www.npmjs.com/package/globby) patterns for files or directories that should be renamed.

`opts`: Optional - Object containing properties of desired options. See **Options** below.

`callback`: Optional - Function to call once all matched files or directories have been renamed. See **Callback** below.

### Options

```js
var opts = {

	pre: true || false, //Prepend to file name instead of append

	cut: true || false, //Cut (remove) from file name instead of append

	verbose: true || false //Print pseudo commands to stdout

};
```

### Callback

```js
var cb = function(err, errs) {
	// An error for each file is possible.
	//
	// err: Error object - the first error to occur.
	// errs: Array of Error objects - all errors that occurred.
	//
	// Both err and errs will be undefined on success.
	// If any error occurred, both args will be populated,
	// and the first element of errs will be err.

	if(err) {
		// at least one failure
	} else {
		// success!
	}
};
```

## License

MIT, &copy; 2015 Andrew Goode
