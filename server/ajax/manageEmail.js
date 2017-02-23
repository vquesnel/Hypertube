var connection = require("../../config/db_config");
var smtpTransport = require('../../config/mail');

var manageEmail = function (req, res) {
	var mail = {
		from: 'noreply.mhypertube@gmail.com',
		to: req.session.email,
		subject: 'Changing password',
		html: '<p>Hello ' + req.session.firstname + '</p><br><p>To change your password please click on the link below:</p><br><a href="https://localhost:4422/reset_password.html/' + req.session.token + '/' + req.session.id_user + '">Change password</a>'
	}
	smtpTransport.sendMail(mail, function (error, response) {
		if (error) {
			res.send('Failed to send email confirmation, Please retry');
		} else {
			res.send('Email sended to : ' + req.session.email);
		}
		smtpTransport.close();
	});
}

module.exports = manageEmail;
