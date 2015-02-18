"use strict";

var sys = require('sys'),
	exec = require('child_process').exec,
	child,
	async = require('async'),
	nconf = require('nconf');

function setup() {
	nconf
		.argv()
		.env()
		.file({
			file: 'config.json'
		});
}

function run(command, next) {
	child = exec(command, function (error, stdout, stderr) {
		sys.print('stdout: ' + stdout);
		sys.print('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}

		next();
	});
}


function generateDocs(cb) {
	var curr = __dirname;

	var commands = [
		'cd ' + nconf.get('path') + ' && git pull',
		'cd ' + nconf.get('docs') + ' && git pull',
		'node main.js',
		'cd ' + nconf.get('docs') + ' && git commit -am "automatic doc generation" && git push',
	];

	async.eachSeries(commands, run, cb);
}

setup();

var express = require('express');
var app = express();

app.post('/push', function (req, res) {
	generateDocs(function(err) {
		res.json({status: 200, error: err});
	});
});

var server = app.listen(5000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Service listening at http://%s:%s', host, port);
});
