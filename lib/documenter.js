"use strict";

var documenter = {};

var docs = {},
	path = require('path'),
	os = require('os');

documenter.push = function(hook, file, line) {
	file = path.normalize(file).replace(/\\/g, '/');
	docs[file] = docs[file] || [];
	docs[file].push({
		hook: hook,
		line: line
	});
};

documenter.write = function() {
	var MD = '';

	for (var file in docs) {
		if (docs.hasOwnProperty(file)) {
			MD += os.EOL + os.EOL + '## ' + file.replace('src/', '').replace('.js', '') + os.EOL;
			docs[file].forEach(function(obj) {
				var hook = obj.hook,
					line = obj.line;

				MD += os.EOL + '[' + hook + ']' + '(https://github.com/NodeBB/NodeBB/blob/master/' + file + '#L' + line + ')';
			});
		}
	}

	console.log(MD);
};

module.exports = documenter;