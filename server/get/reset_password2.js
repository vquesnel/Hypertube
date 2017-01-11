var reset_password = function (req, res) {
	console.log(req.session);
	if (req.session.guest) {
		res.render('reset_password.html')
	}
	else {
		res.redirect('/')
	}
}
module.exports = reset_password;