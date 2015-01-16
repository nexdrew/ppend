#!/usr/bin/env node
'use strict';

var text;
var filePatterns = [];
var opts = {};

function printVersion() {
	if(text && filePatterns.length > 0) return;
	console.log(require('./package.json')['version']);
	process.exit(0);
}

var flags = {
	'p':  'pre',
	'x':  'cut',
	'v':  'verbose',
	'n':  'dryRun',
	'V':  printVersion
};

var alias = {
	'pre':     flags.p,
	'prepend': flags.p,
	'cut':     flags.x,
	'verbose': flags.v,
	'version': flags.V,
	'dry-run': flags.n
};

function handleNormal(arg) {
	if(!text) text = arg;
	else filePatterns.push(arg);
}

function handleOpt(opt) {
	if(typeof opt === 'function') opt();
	else opts[opt] = true;
}

function handleFlag(arg) {
	var argSlice = arg.slice(1);

	//-- first check for non-flag char
	for(var i=0; i<argSlice.length; i++) {
		if(!flags[argSlice.charAt(i)]) {
			handleNormal(arg);
			return;
		}
	}

	//-- otherwise resolve all flags
	for(var j=0; j<argSlice.length; j++) {
		handleOpt(flags[argSlice.charAt(j)]);
	}
}

function handleAlias(arg) {
	var argSlice = arg.slice(2);
	var opt = alias[argSlice];
	if(opt) {
		handleOpt(opt);
		return;
	}
	handleNormal(arg);
}

function handleArg(arg) {
	if(arg.lastIndexOf('--', 0) === 0) handleAlias(arg);
	else if(arg.lastIndexOf('-', 0) === 0) handleFlag(arg);
	else handleNormal(arg);
}

process.argv.slice(2).forEach(handleArg);

if(!(text && filePatterns.length > 0)) {
	console.log(require('multiline')(function(){/*
Usage: ppend [options] text filePattern [...]

Append text to filenames matching the given patterns.

Options:
   -p, --pre      Prepend the text to the filenames instead of appending it.
                  Mutually exlusive with the -x option.

   -x, --cut      Remove the text from the filenames instead of appending it.
                  Takes precedence over the -p option.
                  Cuts the first occurrence only.

   -v, --verbose  Print pseudo mv commands to stdout.

   -n, --dry-run  Print pseudo mv commands without renaming anything (no-op).
	*/}));
	process.exit(1);
}

var ppend = require('./');
ppend(text, filePatterns, opts, function(err, errs) {
	if(err) {
		console.dir(errs);
		process.exit(err['errno'] || 2);
	}
	// console.log('success');
});
