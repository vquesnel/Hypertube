var profile = function (req, res) {
	if (req.session.username) {
		res.render('profile2', {
			infos: req.session,
			userId: req.session.id_user
		})
	} else {
		res.redirect("/");
	}
}
module.exports = profile;
