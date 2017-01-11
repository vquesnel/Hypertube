var manage_profil = function (req, res) {
	if (req.session.username) res.render("manage_profil")
	else res.redirect("/");
}
module.exports = manage_profil