var connection = require("../../config/db_config");
var reset_password = function (req, res) {
	if (!req.params.token || !req.params.id) res.redirect('/');
	else {
		connection.query("SELECT token FROM users WHERE id = ?", [req.params.id], function (err, rows) {
			if (err) throw err;
			if (rows.length && rows[0].token === req.params.token) {
				req.session.guest = req.params.id;
				res.redirect('/reset_password.html')
			}
			else if (req.session.username) {
				res.redirect('/profile2.html')
			}
			else {
				res.redirect('/')
			}
		})
	}
}
module.exports = reset_password;