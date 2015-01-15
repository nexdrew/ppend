'use strict';

var globby = require('globby');
var path = require('path');
var mv = require('mv');

function ppend(addThis, toThese, opts, cb) {
	//-- validate args
	addThis = addThis || '';
	toThese = toThese || [];
	if(typeof toThese === 'string') toThese = [toThese];
	if(typeof opts === 'function') {
		cb = opts;
		opts = {};
	}

	//-- check opts
	var isCut = opts && opts.cut; //-- remove from filename instead of append
	var isPre = opts && opts.pre; //-- prepend instead of append
	var isVerbose = opts && opts.verbose; //-- print pseudo commands

	//-- logic flow constructs
	var pathsTotal = 0, pathsCount = 0;
	
	var errs;
	var paths = globby.sync(toThese).reverse(); //-- reverse so that nested paths are renamed first
	pathsTotal += paths.length;
	paths.forEach(function perTarget(target, i, arr) {
		var ext = path.extname(target);
		var base = path.basename(target, ext);
		var newName = base;
		if(isCut) {
			newName = newName.replace(addThis, '');
		} else {
			newName = isPre ? addThis+newName : newName+addThis;
		}
		var dest = path.join(path.dirname(target), newName+ext);
		if(isVerbose) console.log('mv '+target+' '+dest);
		mv(target, dest, function onMv(err) {
			if(err) {
				if(!errs) errs = [];
				errs.push(err);
			}
			if(cb && (++pathsCount === pathsTotal)) {
				if(errs) cb(errs[0], errs);
				else cb();
			}
		});
	});
}

module.exports = ppend;
