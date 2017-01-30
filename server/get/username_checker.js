var connection = require("../../config/db_config");
var username_checker = function (req, res) {
	connection.query("SELECT * FROM users WHERE username = ?", req.params.value, function (err, rows) {
		if (err) throw errr;
		if (rows[0]) {
			res.send('Username Already Registred');
		}
		if (!rows[0]) {
			res.send('Username Available');
		}
	})
}

module.exports = username_checker;
