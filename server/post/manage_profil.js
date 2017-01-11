var connection = require("../../config/db_config");
var check = require("../../medias/tools");
var smtpTransport = require('../../config/mail');
var manage_profil = function (req, res) {
	var message = '';
	if (check.protectfield(req.body.email)) {
		var mail = {
			from: 'noreply.hypertube@gmail.com'
			, to: req.session.email
			, subject: 'Changing password'
			, html: '<p>Hello ' + req.session.firstname + '</p><br><p>To change your password please click on the link below:</p><br><a href="https://localhost:4422/reset_password.html/' + req.session.token + '/' + req.session.id_user + '">Change password</a>'
		}
		smtpTransport.sendMail(mail, function (error, response) {
			if (error) {
				message = 'A problem occurs : Sending email failed '
			}
			smtpTransport.close();
		});
	}
	if (check.protectfield(req.body.new_email)) {
		if (!check.isValidEmail(req.body.new_email)) {
			message += 'Invalid email format '
		}
		else {
			connection.query("SELECT COUNT(*) as verif FROM users WHERE email = ?", [req.body.new_email], function (err, rows) {
				if (err) throw err;
				if (rows[0].verif) {
					console.log("this email is already use");
					message += 'This email is already use '
				}
				else {
					connection.query("UPDATE users SET email = ? WHERE id = ?", [req.body.new_email, req.session.id_user], function (err) {
						if (err) throw err;
					});
					req.session.email = req.body.new_email;
				}
			})
		}
	}
	if (check.protectfield(req.body.new_username)) {
		if (!check.isValidUsername(req.body.new_username)) {
			message += 'Invalid username format '
		}
		else {
			connection.query("SELECT COUNT(*) as verif FROM users WHERE username =?", [req.body.new_username], function (err, rows) {
				if (err) throw err;
				if (rows[0].verif) {
					message += ' This username is already use '
				}
				else {
					connection.query("UPDATE users SET username = ? WHERE id = ?", [req.body.new_username, req.session.id_user], function (err) {
						if (err) throw err;
					});
					req.session.username = req.body.new_username;
				}
			})
		}
	}
	if (check.protectfield(req.body.new_lastname)) {
		if (!check.isValidUsername(req.body.new_lastname)) {
			message += 'Invalid firstname format '
		}
		else {
			connection.query("UPDATE users SET lastname = ? WHERE id = ?", [req.body.new_lastname, req.session.id_user], function (err) {
				if (err) throw err;
			});
			req.session.lastname = req.body.new_lastname;
		}
	}
	if (check.protectfield(req.body.new_firstname)) {
		if (!check.isValidName(req.body.new_firstname)) {
			message += 'Invalid lastname format '
		}
		else {
			connection.query("UPDATE users SET firstname = ? WHERE id = ?", [req.body.new_firstname, req.session.id_user], function (err) {
				if (err) throw err;
			});
			req.session.firstname = req.body.new_firstname;
		}
	}
	if (!message) {
		res.render('manage_profil', {
			message: 'Profil updated if you wanted to reset your password check your inbox mail'
		})
	}
	else {
		res.render('manage_profil', {
			message: message
		})
	}
}
module.exports = manage_profil