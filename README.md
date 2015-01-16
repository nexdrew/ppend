# ppend

Simple CLI to rename files by appending, prepending, or cutting (removing) portions of filenames.

A better alternative to calling `mv` several times or having to memorize some funky `find . -exec` syntax.
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

Remove from file names instead of append. Mutually exclusive with `-p`. If both options are given, `-x` will take precedence. Cuts the first occurrence only.

`-v, --verbose`

Print all attempted pseudo `mv` commands to stdout.

`-V, --version`

Print current version of `ppend` instead. If actual arguments are given, this option will be ignored.

### Examples

```sh
$ echo 'setup some arbitrary files'
$ mkdir files
$ touch file1.txt file2.log file3 files/file4.sh
$ ls -Alh *
-rw-r--r--  1 user  group     0B Jan 16 13:43 file1.txt
-rw-r--r--  1 user  group     0B Jan 16 13:43 file2.log
-rw-r--r--  1 user  group     0B Jan 16 13:43 file3

files:
total 0
-rw-r--r--  1 user  group     0B Jan 16 13:43 file4.sh
$
$ echo 'append "-OLD" to each file and dir name'
$ ppend -OLD file* **/file*
$
$ ls -Alh *
-rw-r--r--  1 user  group     0B Jan 16 13:43 file1-OLD.txt
-rw-r--r--  1 user  group     0B Jan 16 13:43 file2-OLD.log
-rw-r--r--  1 user  group     0B Jan 16 13:43 file3-OLD

files-OLD:
total 0
-rw-r--r--  1 user  group     0B Jan 16 13:43 file4-OLD.sh
$
$ echo 'prepend "new-" to dir name'
$ ppend -p new- files-OLD/
$
$ ls -Alh
-rw-r--r--   1 user  group     0B Jan 16 13:43 file1-OLD.txt
-rw-r--r--   1 user  group     0B Jan 16 13:43 file2-OLD.log
-rw-r--r--   1 user  group     0B Jan 16 13:43 file3-OLD
drwxr-xr-x   3 user  group   102B Jan 16 13:52 new-files-OLD
$
$ echo 'cut "-OLD" from file names'
$ ppend -x -OLD file* **/file*
$
$ ls -Alh *
-rw-r--r--  1 user  group     0B Jan 16 13:43 file1.txt
-rw-r--r--  1 user  group     0B Jan 16 13:43 file2.log
-rw-r--r--  1 user  group     0B Jan 16 13:43 file3

new-files-OLD:
total 0
-rw-r--r--  1 user  group     0B Jan 16 13:43 file4.sh
$
$ echo 'cut "new-" and "-OLD" from dir name'
$ ppend -x new- new* && ppend -x -OLD *-OLD
$
$ ls -Alh
-rw-r--r--   1 user  group     0B Jan 16 13:43 file1.txt
-rw-r--r--   1 user  group     0B Jan 16 13:43 file2.log
-rw-r--r--   1 user  group     0B Jan 16 13:43 file3
drwxr-xr-x   3 user  group   102B Jan 16 14:04 files
$
$ echo 'prepend "new-" to files with extensions'
$ ppend -p new- file*.* **/file*.*
$
$ ls -Alh *
-rw-r--r--  1 user  group     0B Jan 16 13:43 file3
-rw-r--r--  1 user  group     0B Jan 16 13:43 new-file1.txt
-rw-r--r--  1 user  group     0B Jan 16 13:43 new-file2.log

files:
total 0
-rw-r--r--  1 user  group     0B Jan 16 13:43 new-file4.sh
```

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

	cut: true || false, //Cut (remove) from file name instead of append,
	                    //first occurrence only

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

## Roadmap

### 0.4.0

- Add option for "dry run"

### 0.4.x

- Add tests

### 1.0.0

- Tests are stable (100% code coverage)
- No issues found/reported for 1+ weeks

## License

MIT, &copy; 2015 [Andrew Goode](https://www.npmjs.com/~abg)
