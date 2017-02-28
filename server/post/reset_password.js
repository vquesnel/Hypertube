var connection = require("../../config/db_config");
var sha256 = require("sha256");
var uniqid = require("uniqid");
var check = require("../../medias/tools")
var reset_password = function (req, res) {
	var ret = '';
	if (check.protectfield(req.body.newpassword) && check.protectfield(req.body.confirmation)) {
		if (req.body.newpassword === req.body.confirmation) {
			if (check.isValidPassword(req.body.newpassword)) {
				connection.query("UPDATE users SET password = ? WHERE id = ?", [sha256(req.body.confirmation), req.session.guest], function (err) {
					if (err) throw err;
					else {
						connection.query("UPDATE users SET token = ? WHERE id = ?", [uniqid(), req.session.guest], function (err) {
							if (err) throw err;
							req.session.destroy();
						})
					}
				})
				ret = 'Password Updated';
			}
			else {
				ret = 'Password too weak';
			}
		}
		else {
			ret = 'Passwords doesn\'t match';
		}
	}
	else {
		ret = 'Please fill all the fields';
	}
	res.render('reset_password.html', {
		message: ret
	})
}
module.exports = reset_password;