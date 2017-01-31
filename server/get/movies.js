var connection = require("../../config/db_config");
var movies = function (req, res) {
	var initialNum = req.params.itemsNum.split('@')[0] - 48;
	var mask = req.params.itemsNum.split('@')[1];
	console.log(initialNum);
	console.log(mask);
	if (mask == '1') {
		connection.query("SELECT * FROM movies ORDER BY title LIMIT 48 OFFSET ? ", [initialNum, ], function (err, list) {
			if (err) throw err;
			else {
				res.send(list);
			}
		});
	}
	if (mask == '2') {
		connection.query("SELECT * FROM movies ORDER BY rating DESC LIMIT 48 OFFSET ? ", [initialNum, ], function (err, list) {
			if (err) throw err;
			else {
				res.send(list);
			}
		});
	}
}
module.exports = movies;
