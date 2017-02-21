var mdb = require('moviedb')('636a0fd883d33354fd2758594ce333d4');
var url = 'https://image.tmdb.org/t/p/original';
var Promise = require('promise');
var connection = require("../../config/db_config");
var wallpaperTv = function (req, res) {
	if (!req.session.username) {
		res.send("/");
	}
	else {
		connection.query("SELECT title FROM tv_shows WHERE imdb_code = ?", [req.params.imdbid], function (err, title) {
			if (err) throw err;
			else if (title[0]) {
				let getBackground = new Promise(function (resolve, reject) {
					mdb.searchTv({
						query: title[0].title
					}, function (err, response) {
						if (err) {
							reject(err);
						}
						else {
							resolve(url + response.results[0].backdrop_path);
						}
					});
				})
				getBackground.then(function (fromResolve) {
					res.send({
						picture: fromResolve
					});
				}).catch(function (fromReject) {
					console.log(fromReject);
				})
			}
			else {
				//return 404 not found
				res.send("error")
			}
		})
	}
}
module.exports = wallpaperTv;