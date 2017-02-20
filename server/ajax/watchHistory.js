var connection = require("../../config/db_config");
var watchHistory = function (req, res) {
	connection.query('INSERT INTO history(imdbID, id_user) VALUES(?,?)', [req.params.imdbID, req.session.id_user], function (err, rows) {
		if (err) throw err;
		else {
			res.end()
		}
	})
	connection.query("SELECT * FROM download WHERE imdb_code =?", [req.params.tvdb_id ? req.params.tvdb_id : req.params.imdbID], function (err, rows) {
		if (err) console.log(err);
		else if (rows[0]) {
			connection.query("UPDATE download SET date = ? WHERE imdb_code = ?", [Date.now(), req.params.tvdb_id ? req.params.tvdb_id : req.params.imdbID], function (err) {
				if (err) console.log(err);
			})
		}
	})
}
module.exports = watchHistory;