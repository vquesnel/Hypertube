var logout = function (req, res) {
	if (!req.session.username) {
		res.redirect("/");
	}
	else {
		req.session.destroy();
		res.redirect("/");
	}
}
module.exports = logout;