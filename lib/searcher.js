"use strict";

var searcher = {};


var readdirp = require('readdirp'),
	path = require('path'),
	nconf = require('nconf'),
	es = require('event-stream');


searcher.init = function(cb) {
	var stream = readdirp(path.join(nconf.get('path')), {
		fileFilter: ['*.js'],
		directoryFilter: ['!.git', '!node_modules', '!vendor', '!test']
	});

	stream
		.on('warn', function(err) {
			console.error('non-fatal error', err);
			stream.destroy();
		})
		.on('error', function(err) {
			console.error('fatal error', err);
		})
		.pipe(es.mapSync(function(entry) {
			return entry.path;
		}))
		.on('data', cb);
};

module.exports = searcher;