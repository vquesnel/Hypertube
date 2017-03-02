var connection = require("../../config/db_config");
var email_checker = function (req, res) {
	connection.query("SELECT * FROM users WHERE email = ?", req.params.value, function (err, rows) {
		 if (err) res.send('An Error Occurs');
		if (rows[0]) {
			res.send('Email Already Registred');
		}
		if (!rows[0]) {
			res.send('Email Available');
		}
	})
}

module.exports = email_checker;
