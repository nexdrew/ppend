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

var pre = 'pre', cut = 'cut', verbose = 'verbose';

var flags = {
	'p':  [pre],
	'x':  [cut],
	'v':  [verbose],
	'pv': [pre, verbose],
	'vp': [pre, verbose],
	'xv': [cut, verbose],
	'vx': [cut, verbose],
	'V':  [printVersion]
};

var alias = {
	'pre':     flags.p,
	'prepend': flags.p,
	'cut':     flags.x,
	'verbose': flags.v,
	'version': flags.V
};

function handleNormal(arg) {
	if(!text) text = arg;
	else filePatterns.push(arg);
}

function handleFlag(arg, slice, map) {
	var argSlice = arg.slice(slice);
	//console.log('handleFlag: "'+argSlice+'"');
	if(map[argSlice]) {
		map[argSlice].forEach(function(name) {
			if(typeof name === 'function') name();
			else opts[name] = true;
		});
		return;
	}
	handleNormal(arg);
}

function handleArg(arg) {
	if(arg.lastIndexOf('--', 0) === 0) handleFlag(arg, 2, alias);
	else if(arg.lastIndexOf('-', 0) === 0) handleFlag(arg, 1, flags);
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
	*/}));
	process.exit(1);
}

var ppend = require('./');
ppend(text, filePatterns, opts, function(err, errs) {
	if(err) {
		console.dir(errs);
		process.exit(err['errno'] || 2);
	}
	//console.log('success');
});
