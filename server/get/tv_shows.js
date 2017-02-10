var connection = require("../../config/db_config");
var tv_shows = function (req, res) {
	var initialNum = req.params.itemsNum.split('@')[0] - 48;
	var mask = req.params.itemsNum.split('@')[1];
	var genre = '%' + req.params.itemsNum.split('@')[2] + '%';
		if (initialNum < 0) {
		initialNum = 0;
	}
	if (mask == '0') {
		connection.query("SELECT * FROM tv_shows ORDER BY id LIMIT 48 OFFSET ? ", [initialNum], function (err, list) {
			if (err) throw err;
			else {
				res.send(list);
			}
		});
	}
	if (mask == '1') {
		connection.query("SELECT * FROM tv_shows ORDER BY title LIMIT 48 OFFSET ? ", [initialNum], function (err, list) {
			if (err) throw err;
			else {
				res.send(list);
			}
		});
	}
	if (mask == '2') {
		connection.query("SELECT * FROM tv_shows ORDER BY rating DESC LIMIT 48 OFFSET ? ", [initialNum], function (err, list) {
			if (err) throw err;
			else {
				res.send(list);
			}
		});
	}
	if (mask == '3') {
		connection.query("SELECT * FROM tv_shows WHERE genre LIKE ? ORDER BY rating DESC LIMIT 48 OFFSET ? ", [genre, initialNum], function (err, list) {
			if (err) throw err;
			else {
				res.send(list);
			}
		});
	}
}
module.exports = tv_shows;
