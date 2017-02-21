var connection = require("../../config/db_config");
var indicators = function (req, res) {
	if (!req.session.username) {
		res.send("/");
	}
	else {
		connection.query("SELECT * FROM comment WHERE imdbID = ?", [req.params.imdbID], function (err, rows) {
			if (err) throw err;
			else {
				res.send({
					indicator: rows.length + ''
				});
			}
		})
	}
}
module.exports = indicators;