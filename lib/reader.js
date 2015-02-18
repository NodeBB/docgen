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
			if(hook = line.match(/.fireHook\(([? a-zA-Z'":\._0-9]*)/)) {
				var hook = hook[1].trim();

				var hooks = hook.match(/'[\s\S]*?\'/g);
				
				hooks.forEach(function(hook) {
					addHook(hook, file, linecount);
				});
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

function addHook(hook, file, linecount) {
	if (hook.charAt(hook.length - 2).match(/[:\.]/)) {
		hook = hook.slice(0, hook.length - 1) + '*' + hook.slice(hook.length - 1);
	}

	documenter.push(hook, file, linecount);
}

module.exports = reader;