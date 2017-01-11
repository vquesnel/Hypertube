var mailer = require('nodemailer');
var smtpTransport = mailer.createTransport('SMTP', {
	service: 'Gmail'
	, auth: {
		user: 'noreply.matcha@gmail.com'
		, pass: 'zdpzdpzdp'
	}
});
module.exports = smtpTransport