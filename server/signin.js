var connection = require('../config/db_config');
var sha256 = require('sha256');
var check = require("../medias/tools");

function isValidUserInfos(user) {
	if (check.isValidUsername(check.protectfield(user.username)) && (check.protectfield(user.password))) {
		return (true);
	}
	return (false);
}
var signin = function (req, res) {
	if (isValidUserInfos(req.body)) {
		connection.query("SELECT * FROM users WHERE username = ? AND password = ?", [check.protectfield(req.body.username), sha256(check.protectfield(req.body.password))], function (err, rows) {
			if (err) throw err;
			if (rows[0]) {
				connection.query("SELECT * FROM users WHERE sessionID = ?", [req.sessionID], function (err, connect) {
					if (err) throw err;
					if (!connect[0]) {
						connection.query("UPDATE users SET sessionID = ? WHERE username = ?", [req.sessionID, check.protectfield(req.body.username)], function (err) {
							if (err) throw err;
						})
						req.session.username = rows[0].username;
						req.session.firstname = rows[0].firstname;
						req.session.lastname = rows[0].lastname;
						req.session.profil_pic = rows[0].profil_pic;
						req.session.email = rows[0].email;
						req.session.token = rows[0].token;
						res.redirect("/home.html");
					}
					else {
						req.session.username = connect[0].username;
						req.session.firstname = connect[0].firstname;
						req.session.lastname = connect[0].lastname;
						req.session.profil_pic = connect[0].profil_pic;
						req.session.email = connect[0].email;
						req.session.token = connect[0].token;
						res.redirect("/home.html");
					}
				})
			}
			else {
				res.render("index", {
					message: "User not register or wrong password"
				});
			}
		})
	}
	else {
		res.render("index", {
			message: "error on one or multiple fields"
		})
	}
}
module.exports = signin;