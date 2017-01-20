var home = function (req, res) {
	var messagephoto = req.session.messagephoto;
	var messagereset = req.session.messagereset;
	var messageprofil = req.session.messageprofil;
	var settings = req.session.settings;
	var contents = req.session.contents;
	req.session.messagephoto = null;
	req.session.messageprofil = null;
	req.session.messagereset = null;
	req.session.settings = "none";
	req.session.contents = "block";
	//console.log(req.session);
	if (req.session.username) {
		res.render('profile', {
			infos: req.session
			, messageprofil: messageprofil
			, messagephoto: messagephoto
			, messagereset: messagereset
			, settings: settings
			, contents: contents
		})
	}
	else {
		res.redirect("/");
	}
}
module.exports = home;