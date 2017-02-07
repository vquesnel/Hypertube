"use strict";
var request = require('request');
var baseUrl = 'https://eztvapi.ml/';
var doRequest = function (url, options, callback) {
	function run() {
		request({
			url: url
		}, function (err, res, body) {
			if (!err && res.statusCode === 200) {
				if (body[0] !== '[') {
					setTimeout(run, 10);
					return false;
				}
				console.log(options);
				//				console.log("---------------------------------------------------------------------------------------");
				var json = JSON.parse(body);
				callback(null, json);
			}
			else {
				setTimeout(run, 10);
				return false;
			}
		});
	}
	run();
};
exports.listTVshows = function (options, callback) {
	doRequest(baseUrl + "shows/" + options.page, options, callback);
};
exports.showDetails = function (options, callback) {
	doRequest(baseUrl + "show/" + options.imdb_code, options, callback);
};