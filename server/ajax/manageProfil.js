var connection = require("../../config/db_config");
var profilManager = function (req, res) {
	if (req.query.fname) {
		req.session.firstname = req.query.fname;
		connection.query("UPDATE users SET firstname = ? WHERE id = ?", [req.query.fname, req.session.id_user], function (err) {
			if (err) console.log(err);
		})
	}
	if (req.query.lname) {
		req.session.lastname = req.query.lname;
		connection.query("UPDATE users SET lastname = ? WHERE id = ?", [req.query.lname, req.session.id_user], function (err) {
			if (err) console.log(err);
		})
	}
	if (req.query.user) {
		req.session.username = req.query.user;
		connection.query("UPDATE users SET username = ? WHERE id = ?", [req.query.user, req.session.id_user], function (err) {
			if (err) console.log(err);
		})
	}
	if (req.query.email) {
		req.session.email = req.query.email;
		connection.query("UPDATE users SET email = ? WHERE id = ?", [req.query.email, req.session.id_user], function (err) {
			if (err) console.log(err);
		})
	}
	res.send('Profil updated');
}
module.exports = profilManager;
