var connection = require('../../config/db_config');
var check = require("../../medias/tools");
var smtpTransport = require('../../config/mail');
var reset_request = function (req, res) {
	if (req.body.email) {
		connection.query("SELECT firstname,token,id FROM users WHERE email = ?", [req.body.email], function (err, rows) {
			if (err) throw err;
			else {
				if (rows.length) {
					var mail = {
						from: 'noreply@hypertube.com'
						, to: req.body.email
						, subject: 'Changing password'
						, html: '<p>Hello ' + rows[0].firstname + '</p><br><p>To change your password please click on the link below:</p><br><a href="https://localhost:4422/reset_password.html/' + rows[0].token + '/' + rows[0].id + '">Change password</a>'
					}
					smtpTransport.sendMail(mail, function (error, response) {
						if (error) {
							res.render('reset_request.html', {
								'message': 'A problem occurs : Sending email failed'
							})
						}
						else {
							res.render('reset_request.html', {
								'message': 'Email sended'
							})
						}
						smtpTransport.close();
					});
				}
				else {
					res.render('reset_request.html', {
						message: 'Email not registred'
					})
				}
			}
		})
	}
	else {
		res.render('reset_request.html', {
			message: 'Please type your email'
		})
	}
}
module.exports = reset_request;