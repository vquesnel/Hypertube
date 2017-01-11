var connection = require('../../config/db_config');
var check = require("../../medias/tools");
var sha256 = require("sha256");
var uniqid = require("uniqid");

function isValidUserInfos(user) {
	if (check.isValidUsername(check.protectfield(user.username)) && check.isValidPassword(check.protectfield(user.password)) && check.isValidPassword(check.protectfield(user.confirmpassword)) && check.isValidEmail(check.protectfield(user.email)) && check.isValidName(check.protectfield(user.firstname)) && check.isValidName(check.protectfield(user.lastname)) && user.password === user.confirmpassword) {
		return (true);
	}
	return (false);
}
var addNewUser = function (req, res) {
	if (isValidUserInfos(req.body)) {
		connection.query("SELECT COUNT(*) as people FROM users WHERE username = ? OR email = ?", [check.protectfield(req.body.username), check.protectfield(req.body.email)], function (err, data) {
			if (err) throw err;
			else if (data[0].people) {
				let ret = "username or email already used";
				res.render("create_account", {
					'message': ret
				});
				console.log("user exists");
			}
			else {
				connection.query("INSERT INTO users(firstname, lastname, username, email, password, token) VALUES (?,?,?,?,?,?)", [check.protectfield(req.body.firstname), check.protectfield(req.body.lastname), check.protectfield(req.body.username), check.protectfield(req.body.email), sha256(check.protectfield(req.body.password)), uniqid()], function (err) {
					if (err) throw err;
					let ret = "account created";
					res.render("create_account", {
						'message': ret
					});
					console.log("user added");
				})
			}
		})
	}
	else {
		let ret = "error on one or multiple fields";
		res.render("create_account", {
			'message': ret
		});
		console.log("error on one or multiple fields");
	}
};
module.exports = addNewUser;