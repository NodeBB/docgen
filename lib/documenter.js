"use strict";

var documenter = {};

var docs = {
		server: {},
		client: {}
	},
	path = require('path'),
	os = require('os');

documenter.push = function(hook, file, line) {
	file = path.normalize(file).replace(/\\/g, '/');

	var doc = docs[file.match('public') ? 'client' : 'server'];

	doc[file] = doc[file] || [];
	doc[file].push({
		hook: hook,
		line: line
	});
};

documenter.write = function() {
	var server = generateDoc(docs.server),
		client = generateDoc(docs.client);

	write(server, client);
};

function generateDoc(files) {
	var doc = '';

	for (var file in files) {
		if (files.hasOwnProperty(file)) {
			doc += generateHeader(file);

			files[file].forEach(function(obj) {
				var hook = obj.hook,
					line = obj.line;

				doc += generateBody(hook, file, line);
			});
		}
	}

	return doc;
}

function generateHeader(file) {
	return os.EOL + os.EOL + '## ' + file.replace(/(public\/)?src\//, '').replace('.js', '') + os.EOL;
}

function generateBody(hook, file, line) {
	return os.EOL + '[' + hook + ']' + '(https://github.com/NodeBB/NodeBB/blob/master/' + file + '#L' + line + ')' + os.EOL;
}

function write(server, client) {
	require('fs').writeFileSync('output/hooks.md', '# Server Hooks' + os.EOL + os.EOL + server + os.EOL + os.EOL + '# Client Hooks' + os.EOL + os.EOL + client);
}

module.exports = documenter;