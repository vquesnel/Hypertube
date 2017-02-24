var profile = function (req, res) {
	if (req.session.username) {
		res.render('profile2.html', {
			infos: req.session,
			id_user: req.session.id_user
		})
	}
	else {
		res.redirect("/");
	}
}
module.exports = profile;