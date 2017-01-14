var connection = require("../../config/db_config");
var uniqid = require("uniqid");
var check = require("../../medias/tools");
var smtpTransport = require('../../config/mail');
var multer = require('multer');
var fs = require('fs');
var storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './public/profil_pic');
	}
	, filename: function (req, file, callback) {
		callback(null, req.session.user_id + '-' + uniqid());
	}
});
var upload = multer({
	storage: storage
	, fileFilter: function (req, file, cb) {
		if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpeg') {
			req.fileValidationError = 'goes wrong on the mimetype';
			return cb(null, false, new Error('goes wrong on the mimetype'));
		}
		cb(null, true);
	}
}).single('file');
var sharp = require('sharp');
var new_email = function (req, callback) {
	if (req.body.new_email) {
		if (check.protectfield(req.body.new_email)) {
			if (!check.isValidEmail(req.body.new_email)) {
				callback('Invalid email format ');
			}
			else {
				(function (coolback) {
					connection.query("SELECT COUNT(*) as verif FROM users WHERE email = ?", [req.body.new_email], function (err, rows) {
						if (err) throw err;
						if (rows[0].verif) {
							coolback('This email is already use ');
						}
						else {
							connection.query("UPDATE users SET email = ? WHERE id = ?", [req.body.new_email, req.session.id_user], function (err) {
								if (err) throw err;
							});
							req.session.email = req.body.new_email;
							coolback('Email updated');
						}
					})
				})(function (infos) {
					callback(infos);
				})
			}
		}
	}
	else {
		callback(null);
	}
}
var new_username = function (req, callback) {
	if (req.body.new_username) {
		if (check.protectfield(req.body.new_username)) {
			if (!check.isValidUsername(req.body.new_username)) {
				callback('Invalid username format');
			}
			else {
				(function (coolback) {
					connection.query("SELECT COUNT(*) as verif FROM users WHERE username = ?", [req.body.new_username], function (err, rows) {
						if (err) throw err;
						if (rows[0].verif) {
							coolback('This username is already use');
						}
						else {
							connection.query("UPDATE users SET username = ? WHERE id = ?", [req.body.new_username, req.session.id_user], function (err) {
								if (err) throw err;
							});
							req.session.username = req.body.new_username;
							coolback('Username updated');
						}
					})
				})(function (infos) {
					callback(infos);
				})
			}
		}
	}
	else {
		callback(null);
	}
}
var new_firstname = function (req, callback) {
	if (req.body.new_firstname) {
		if (check.protectfield(req.body.new_firstname)) {
			if (!check.isValidName(req.body.new_firstname)) {
				callback('Invalid firstname format ');
			}
			else {
				connection.query("UPDATE users SET firstname = ? WHERE id = ?", [req.body.new_firstname, req.session.id_user], function (err) {
					if (err) throw err;
				});
				req.session.firstname = req.body.new_firstname;
				callback('Firstname updated')
			}
		}
	}
	else {
		callback(null);
	}
}
var new_lastname = function (req, callback) {
	if (req.body.new_lastname) {
		if (check.protectfield(req.body.new_lastname)) {
			if (!check.isValidUsername(req.body.new_lastname)) {
				callback('Invalid lastname format ');
			}
			else {
				connection.query("UPDATE users SET lastname = ? WHERE id = ?", [req.body.new_lastname, req.session.id_user], function (err) {
					if (err) throw err;
				});
				req.session.lastname = req.body.new_lastname;
				callback('Lastname updated')
			}
		}
	}
	else {
		callback(null);
	}
}
var manage_profil = function (req, res) {
	var result = '';
	new_email(req, function (infos) {
		if (infos) {
			result = infos;
		}
		new_username(req, function (infos1) {
			if (infos1) {
				result += infos1;
			}
			new_lastname(req, function (infos2) {
				if (infos2) {
					result += infos2;
				}
				new_firstname(req, function (infos3) {
					if (infos3) {
						result += infos3;
					}
					res.render('profile', {
						infos: req.session
						, messageprofil: result
					});
				})
			})
		})
	})
}
var upload_picture = function (req, res) {
	var infos = {};
	(function (callback) {
		upload(req, res, function (err) {
			var cropped = 'profil_pic/' + req.session.id_user + '-' + uniqid() + '.png';
			if (req.fileValidationError) {
				infos.messagephoto = 'Wrong file type : File not uploaded';
				callback(infos);
			}
			else if (req.file) {
				if (err) {
					infos.messagephoto = 'A problem occurs : File not uploaded';
					callback(infos);
				}
				else {
					sharp(req.file.path).resize(500, 500).toFile('public/' + cropped, function (err) {
						if (err) {
							infos.messagephoto = "Unsupported image format";
							callback(infos);
						}
						else {
							fs.unlinkSync(req.file.path);
							connection.query("UPDATE users SET profil_pic = ? WHERE id = ?", [cropped, req.session.id_user], function (err) {
								if (err) throw err;
							})
							req.session.profil_pic = cropped;
							callback(infos);
						}
					});
				}
			}
			else {
				infos.messagephoto = "You haven't select a picture";
				callback(infos);
			}
		})
	})(function (infos) {
		res.render('profile', {
			infos: req.session
			, messagephoto: infos.messagephoto
		});
	})
}
var email_confirmation = function (req, res) {
	if (req.body.Sendmail) {
		var mail = {
			from: 'noreply.mhypertube@gmail.com'
			, to: req.session.email
			, subject: 'Changing password'
			, html: '<p>Hello ' + req.session.firstname + '</p><br><p>To change your password please click on the link below:</p><br><a href="https://localhost:4422/reset_password.html/' + req.session.token + '/' + req.session.id_user + '">Change password</a>'
		}
		smtpTransport.sendMail(mail, function (error, response) {
			if (error) {
				res.render('profile', {
					infos: req.session
					, messagereset: 'An error occured please try again'
				})
			}
			else {
				res.render('profile', {
					infos: req.session
					, messagereset: 'Email sended'
				})
			}
			smtpTransport.close();
		});
	}
}
module.exports = {
	manage_profil: manage_profil
	, upload_picture: upload_picture
	, email_confirmation: email_confirmation
}