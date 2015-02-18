"use strict";

var nconf = require('nconf'),
	fs = require('fs'),
	path = require('path'),
	liner = require('./liner'),
	documenter = require('./documenter');


var reader = {};

reader.read = function(file) {
	var source = fs.createReadStream(path.join(nconf.get('path'), file)),
		stream = liner.createStream(),
		linecount = 0;

	source.pipe(stream);
	stream.setMaxListeners(0);
	stream.on('readable', function() {
		var line,
			hook;

		while ((line = stream.read()) !== null) {
			if(hook = line.match(/.fireHook\(([\s\S]*?),/)) {
				documenter.push(hook[1], file, linecount);
			}

			linecount++;
		}
	})
	.on('warn', function(err) { 
		console.error('non-fatal error', err); 
		stream.destroy();
	})
	.on('error', function(err) {
		console.error('fatal error', err, file);
	})
};

module.exports = reader;