var connection = require("../../config/db_config");
var displayMoviesHistory = function (req, res) {

	connection.query("SELECT imdbID FROM history WHERE userID = ? AND context = ? ORDER BY id DESC LIMIT 4", [req.session.id_user, 'movie'], function (err, row) {
		if (err) throw err;
		else {
			var top = ['', '', '', ''];
			for (var k in row) {
				if (row[k].imdbID) {
					top[k] = row[k].imdbID;
				}
			}
			connection.query("SELECT * FROM movies WHERE imdb_code = ? OR imdb_code = ? OR imdb_code = ? OR imdb_code = ?", [top[0], top[1], top[2], top[3]], function (err, data) {
				if (err) throw err;
				else {
					res.send(data);
				}
			})
		}
	})
}
module.exports = displayMoviesHistory;
