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


setup();
var curr = __dirname;

var commands = [
	'cd ' + nconf.get('path') + ' && git pull',
	'cd ' + nconf.get('docs') + ' && git pull',
	'node main.js',
	'cd ' + nconf.get('docs') + ' && git commit -am "automatic doc generation" && git push',
];

async.eachSeries(commands, run);