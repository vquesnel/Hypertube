var connection = require("../../config/db_config");
var displayTvHistory = function (req, res) {
	if (!req.session.username) {
		res.send("/");
	}
	else {
		connection.query("SELECT DISTINCT * FROM history WHERE userID = ? AND context = ? ORDER BY id DESC LIMIT 4", [req.session.id_user, 'tv_show'], function (err, row) {
			if (err) throw err;
			else {
				var k = 3;
				var top = ['', '', '', ''];
				row.forEach(function (tops) {
					top[k] = tops.imdbID
					k--;
				})
				connection.query("SELECT * FROM tv_shows WHERE imdb_code = ? OR imdb_code = ? OR imdb_code = ? OR imdb_code = ?", [top[0], top[1], top[2], top[3]], function (err, data) {
					if (err) throw err;
					else {
						res.send(data);
					}
				})
			}
		})
	}
}
module.exports = displayTvHistory;