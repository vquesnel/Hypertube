var home = function (req, res) {
	console.log(req.session);
	if (req.session.username) {
		res.render('home');
	}
	else {
		res.redirect("/");
	}
}
module.exports = home;