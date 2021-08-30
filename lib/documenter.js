"use strict";

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

	console.log(`done. total hooks: ${docs.hookCount}`);

	var output = templates.parse(fs.readFileSync('templates/hooks.tpl').toString(), docs);
	fs.writeFileSync('output/Hooks.md', output);
	fs.writeFileSync('output.json', JSON.stringify(docs));
};

module.exports = documenter;