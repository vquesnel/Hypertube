var connection = require("../../config/db_config")
var tv_show = function (req, res) {
	if (!req.session.username) {
		res.redirect('/');
	}
	else {
		connection.query("SELECT * FROM tv_shows WHERE imdb_code = ?", [req.params.imdb_code], function (err, movie) {
			if (err) throw err;
			else {
				if (movie[0].actors !== "N/A") movie[0].actors = JSON.parse(movie[0].actors);
				if (movie[0].genres !== "N/A") movie[0].genres = JSON.parse(movie[0].genres);
				res.render("movie", {
					display_one_movie: {
						infos: movie
					}
					, userID: req.session.id_user
				});
			}
		})
	}
}
module.exports = tv_show;