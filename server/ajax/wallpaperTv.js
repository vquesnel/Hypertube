var mdb = require('moviedb')('636a0fd883d33354fd2758594ce333d4');
var url = 'https://image.tmdb.org/t/p/original';
var Promise = require('promise');
var connection = require("../../config/db_config");

var wallpaperTv = function (req, res) {
	connection.query("SELECT title FROM tv_shows WHERE imdb_code = ?", [req.params.imdbid], function (err, title) {
		if (err) throw err;
		else {
			let getBackground = new Promise(function (resolve, reject) {
				mdb.searchTv({
					query: title[0].title
				}, function (err, response) {
					if (err) {
						reject(err);
					} else {
						resolve(url + response.results[0].backdrop_path);
					}

				});
			})
			getBackground.then(function (fromResolve) {
				res.end(fromResolve);
			}).catch(function (fromReject) {
				console.log(fromReject);
			})
		}
	})



}

module.exports = wallpaperTv;
