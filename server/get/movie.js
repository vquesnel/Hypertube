var connection = require("../../config/db_config");
var imdb = require('omdbapi')
var movie = function (req, res) {
	if (!req.session.username) {
		res.redirect('/');
	}
	else {
		connection.query("SELECT * FROM movies WHERE imdb_code = ?", [req.params.imdb_code], function (err, movie) {
			if (err) throw err;
			else {
				imdb.get({
					id: movie[0].imdb_code
				}).then(function (data) {
					if (err) {
						console.log("movie by id");
					}
					else {
						if (data.director) {
							movie[0].director = '';
							movie[0].director += Object.values(data.director);
						}
						if (data.actors) {
							movie[0].actors = '';
							movie[0].actors += Object.values(data.actors);
						}
						if (data.writer) {
							movie[0].writers = '';
							movie[0].writers += Object.values(data.writer);
							movie[0].writers = movie[0].writers.replace(/\(.*?\)/g, '');
						}
						connection.query("SELECT * FROM movies_torrents WHERE id_film = ? ORDER BY quality DESC", [movie[0].id], function (err, torrents) {
							if (err) throw err;
							else {
								for (var k in torrents) torrents[k].imdb_code = movie[0].imdb_code;
								res.render("movie", {
									torrent: '/watchmovie.html/' + movie[0].imdb_code + '/' + torrents[0].magnet + '/' + torrents[0].quality
									, display_one_movie: {
										infos: movie
									}
									, userID: req.session.id_user
									, display_torrents: {
										data: torrents
									}
								});
							}
						})
					}
				}).catch(function (err) {
					console.log("BUG OMDBP");
					console.log(err);
				})
			}
		})
	}
}
module.exports = movie;