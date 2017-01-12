var home = function (req, res) {
	console.log(req.session);
	if (req.session.username) {
		res.render('profile');
	}
	else {
		res.redirect("/");
	}
}
module.exports = home;