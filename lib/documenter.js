"use strict";

var nconf = require('nconf');
var documenter = {};

var docs = {
		server: {},
		client: {},
		hookCount: 0
	},
	fs = require('fs'),
	path = require('path'),
	os = require('os'),
	templates = require('templates.js');

documenter.push = function(hook, file, line) {
	file = path.normalize(file).replace(/\\/g, '/');

	var doc = docs[file.match('public') ? 'client' : 'server'],
		header = file.replace(/(public\/)?src\//, '').replace('.js', '');

	doc[header] = doc[header] || {};
	doc[header].slug = header.replace(/\/|\./g, '').toLowerCase();
	doc[header].hooks = doc[header].hooks || [];
	doc[header].hooks.push({
		hook: hook,
		line: line,
		file: file
	});

	docs.hookCount++;
};

documenter.write = function() {
	docs.date = (new Date()).toUTCString();

	var outputConfig = nconf.get('output'),
			output = templates.parse(fs.readFileSync('templates/hooks.tpl').toString(), docs),
			outputPath = require('path').join(
				outputConfig && outputConfig.path ? outputConfig.path : 'output/',
				outputConfig && outputConfig.filename ? outputConfig.filename : 'Hooks.md'
			);
	fs.writeFileSync(outputPath, output);
};

module.exports = documenter;