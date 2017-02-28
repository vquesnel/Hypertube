var connection = require("../../config/db_config");
var profilOther = function (req, res) {
	if (!req.session.username) {
		res.redirect("/");
	}
	else if (req.params.ID == req.session.id_user) {
		res.redirect('/profile.html')
	}
	else {
		connection.query("SELECT * FROM users WHERE id = ?", [req.params.ID], function (err, rows) {
			if (err) throw err;
			else {
				
				res.render('profile.html', {
					infos: rows[0]
					, id_user: rows[0].id
				})
			}
		})
	}
}
module.exports = profilOther;