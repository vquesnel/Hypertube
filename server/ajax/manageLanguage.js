var connection = require("../../config/db_config");
var profilManager = function (req, res) {
	connection.query("UPDATE users SET language = ? WHERE id = ?", [req.params.lang, req.session.id_user], function (err) {
		if (err) throw err;
		else {
			req.session.language = req.params.lang;
			res.send('Language Updated');
		}
	})
}
module.exports = profilManager;
