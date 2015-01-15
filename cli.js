#!/usr/bin/env node
'use strict';

var minimist = require('minimist');
var multiline = require('multiline');

var argv = minimist(process.argv.slice(2), { 'boolean': ['p', 'pre', 'prepend', 'c', 'cut', 'v', 'verbose'] });

if(argv._.length < 2) {
	if(argv.V || argv['version']) {
		console.log(require('./package.json')['version']);
		process.exit(0);
	}
	console.log(multiline(function(){/*
usage: ppend [options] text filePattern [...]

Append text to filenames matching the given patterns.

Options:
   -p, --pre      Prepend the text to the filenames instead of appending it.
                  Mutually exlusive with the -c option.

   -c, --cut      Remove the text from the filenames instead of appending it.
                  Takes precedence over the -p option.

   -v, --verbose  Print pseudo mv commands to stdout.
	*/}));
	process.exit(1);
}

//-- args
var text = argv._[0];
var filePatterns = argv._.slice(1);

//-- opts
var pre = argv.p || argv.pre || argv['prepend'];
var cut = argv.c || argv.cut;
var verbose = argv.v || argv.verbose;

var ppend = require('./');
ppend(text, filePatterns, { cut: cut, pre: pre, verbose: verbose }, function(err, errs) {
	if(err) {
		//console.log(JSON.stringify(errs, null, '\t'));
		console.dir(errs);
		process.exit(err['errno']);
	}
	//console.log('success');
});
