var profile = function (req, res) {
	var messagephoto = req.session.messagephoto;
	var messagereset = req.session.messagereset;
	var messageprofil = req.session.messageprofil;
	if (req.session.username) {
		res.render('profile2', {
			infos: req.session
		})
	}
	else {
		res.redirect("/");
	}
}
module.exports = profile;