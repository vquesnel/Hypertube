var connection = require("../../config/db_config");
var search = function (req, res) {
	var queries = req.params.toFind.split('@');
	console.log(req.params.toFind);
	console.log(queries);
	if (Number(queries[1]) < 3) {
		connection.query("SELECT * FROM movies  WHERE substr(LOWER(title), 1," + queries[1] + ") = LOWER(?) LIMIT 100", [queries[0]], function (err, finded) {
			if (err) throw err;
			else {
				res.send(finded);
			}
		})
	} else {
		connection.query("SELECT * FROM movies  WHERE substr(LOWER(title), 1," + queries[1] + ") = LOWER(?)", [queries[0]], function (err, finded) {
			if (err) throw err;
			else {
				res.send(finded);
			}
		})
	}
}
module.exports = search;