var connection = require("../../config/db_config");
var check = require("../../medias/tools");
var smtpTransport = require('../../config/mail');
var reset_password = function (req, callback) {
	if (check.protectfield(req.body.email)) {
		var mail = {
			from: 'noreply.hypertube@gmail.com'
			, to: req.session.email
			, subject: 'Changing password'
			, html: '<p>Hello ' + req.session.firstname + '</p><br><p>To change your password please click on the link below:</p><br><a href="https://localhost:4422/reset_password.html/' + req.session.token + '/' + req.session.id_user + '">Change password</a>'
		}
		smtpTransport.sendMail(mail, function (error, response) {
			if (error) {
				callback('A problem occurs : Sending email failed ')
			}
			else {
				callback('Email sended to reset your password')
			}
			smtpTransport.close();
		});
	}
}
var new_email = function (req, callback) {
	if (check.protectfield(req.body.new_email)) {
		if (!check.isValidEmail(req.body.new_email)) {
			callback('Invalid email format ');
		}
		else {
			connection.query("SELECT COUNT(*) as verif FROM users WHERE email = ?", [req.body.new_email], function (err, rows) {
				if (err) throw err;
				if (rows[0].verif) {
					callback('This email is already use ');
				}
				else {
					connection.query("UPDATE users SET email = ? WHERE id = ?", [req.body.new_email, req.session.id_user], function (err) {
						if (err) throw err;
						else {
							req.session.email = req.body.new_email;
							callback('Email updated');
						}
					});
				}
			})
		}
	}
}
var new_username = function (req, callback) {
	if (check.protectfield(req.body.new_username)) {
		if (!check.isValidUsername(req.body.new_username)) {
			callback('Invalid username format');
		}
		else {
			connection.query("SELECT COUNT(*) as verif FROM users WHERE username = ?", [req.body.new_username], function (err, rows) {
				if (err) throw err;
				if (rows[0].verif) {
					callback('This username is already use');
				}
				else {
					connection.query("UPDATE users SET username = ? WHERE id = ?", [req.body.new_username, req.session.id_user], function (err) {
						if (err) throw err;
						else {
							req.session.username = req.body.new_username;
							callback('Username updated');
						}
					});
				}
			})
		}
	}
}
var new_firstname = function (req, callback) {
	if (check.protectfield(req.body.new_firstname)) {
		if (!check.isValidName(req.body.new_firstname)) {
			callback('Invalid firstname format ');
		}
		else {
			connection.query("UPDATE users SET firstname = ? WHERE id = ?", [req.body.new_firstname, req.session.id_user], function (err) {
				if (err) throw err;
				else {
					req.session.firstname = req.body.new_firstname;
					callback('Firstname updated')
				}
			});
		}
	}
}
var new_lastname = function (req, callback) {
	if (check.protectfield(req.body.new_lastname)) {
		if (!check.isValidUsername(req.body.new_lastname)) {
			callback('Invalid lastname format ');
		}
		else {
			connection.query("UPDATE users SET lastname = ? WHERE id = ?", [req.body.new_lastname, req.session.id_user], function (err) {
				if (err) throw err;
				else {
					req.session.lastname = req.body.new_lastname;
					callback('Lastname updated')
				}
			});
		}
	}
}
var manage_profil = function (req, res) {
	var result = {};
	(function (callback) {
		reset_password(req, function (infos) {
			result.resetPassword = infos;
			callback(result);
		})
		new_email(req, function (infos) {
			console.log("email");
			console.log(infos);
			result.newEmail = infos;
			callback(result);
		})
		new_username(req, function (infos) {
			console.log("username");
			console.log(infos);
			result.newUsername = infos;
			callback(result);
		})
		new_lastname(req, function (infos) {
			console.log("lastname");
			console.log(infos);
			result.newLastname = infos;
			callback(result);
		})
		new_firstname(req, function (infos) {
			console.log("firstname");
			console.log(infos);
			result.newFirstname = infos;
			callback(result);
		})
	})(function (infos) {
		console.log("enter the final callback")
		console.log(infos);
		//		res.render('manage_profil', {
		//			manage_profil: {
		//				infos: infos
		//			}
		//		})
	})
}
module.exports = manage_profil