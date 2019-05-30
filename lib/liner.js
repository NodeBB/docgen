"use strict";

var stream = require('stream'),
	liner = {};

liner.createStream = function() {
	var linerStream = new stream.Transform({
		objectMode: true
	});

	// modified from http://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/
	linerStream._transform = function (chunk, encoding, done) {
		var data = chunk.toString();
		if (this._lastLineData) {
			data = this._lastLineData + data;
		}

		var lines = data.split('\n');
		this._lastLineData = lines.splice(lines.length-1,1)[0];

		lines.forEach(this.push.bind(this));
		done();
	};

	linerStream._flush = function (done) {
		if (this._lastLineData) {
			this.push(this._lastLineData);
		}

		this._lastLineData = null;
		done();
	};

	return linerStream;
};

module.exports = liner;