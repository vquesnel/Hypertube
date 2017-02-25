"use strict";
var request = require('request');
var baseUrl = 'https://yts.ag/api/v2/';
var doRequest = function (url, options, callback) {
    function run() {
        request({
            url: url,
            qs: options
        }, function (err, res, body) {
            if (!err && res.statusCode === 200) {
                if (body[0] !== '[' && body[0] !== "{" || (body[body.length - 1] !== ']' && body[body.length - 1] !== '}')) {
                    run();
                    return;
                } else {
                    var json = JSON.parse(body);
                    callback(null, json);
                }
            } else {
                setTimeout(run, 10);
                return false;
            }
        });
    }
    run();
};
exports.listMovies = function (options, callback) {
    doRequest(baseUrl + "list_movies.json", options, callback);
};
exports.movieDetails = function (options, callback) {
    doRequest(baseUrl + "movie_details.json", options, callback);
};
exports.movieSuggestions = function (options, callback) {
    doRequest(baseUrl + "movie_suggestions.json", options, callback);
};
exports.movieComments = function (options, callback) {
    doRequest(baseUrl + "movie_comments.json", options, callback);
};
exports.movieReviews = function (options, callback) {
    doRequest(baseUrl + "movie_reviews.json", options, callback);
};
exports.movieParentalGuides = function (options, callback) {
    doRequest(baseUrl + "movie_parental_guides.json", options, callback);
};
exports.listUpcoming = function (options, callback) {
    doRequest(baseUrl + "list_upcoming.json", options, callback);
};