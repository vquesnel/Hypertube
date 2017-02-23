var connection = require("../../config/db_config");
var search = function (req, res) {
	if (!req.session.username) {
		res.send("/");
	}
	else {
		if (Number(req.query.lenFind) <= 3) {
			connection.query("SELECT * FROM ??  WHERE substr(LOWER(title), 1," + req.query.lenFind + ") = LOWER(?)  LIMIT 100 ", [req.query.context, req.query.toFind], function (err, finded) {
				if (err) throw err;
				else {
					res.send(finded);
				}
			})
		}
		else {
			connection.query("SELECT * FROM ??  WHERE substr(LOWER(title), 1," + req.query.lenFind + ") = LOWER(?) ", [req.query.context,  req.query.toFind], function (err, finded) {
				if (err) throw err;
				else {
					res.send(finded);
				}
			})
		}
	}
}
module.exports = search;