var connection = require("../../config/db_config");
var search = function (req, res) {
	var queries = req.params.toFind.split('@');
	queries[1].trim();
	if (Number(queries[1]) < 3) {
		connection.query("SELECT * FROM ??  WHERE substr(LOWER(title), 1," + queries[1] + ") = LOWER(?) LIMIT 100", [queries[2], queries[0]], function (err, finded) {
			if (err) throw err;
			else {
				res.send(finded);
			}
		})
	}
	else {
		connection.query("SELECT * FROM ??  WHERE substr(LOWER(title), 1," + queries[1] + ") = LOWER(?)", [queries[2], queries[0]], function (err, finded) {
			if (err) throw err;
			else {
				res.send(finded);
			}
		})
	}
}
module.exports = search;