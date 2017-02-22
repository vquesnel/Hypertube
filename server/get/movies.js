var connection = require("../../config/db_config");
var movies = function (req, res) {
	if (!req.session.username) {
		res.send("/");
	}
	else {
		var initialNum = req.params.itemsNum.split('@')[0] - 48;
		var mask = req.params.itemsNum.split('@')[1];
		var genre = '%' + req.params.itemsNum.split('@')[2] + '%';
		if (mask == '0') {
			connection.query("SELECT * FROM movies ORDER BY id LIMIT 48 OFFSET ? ", [initialNum], function (err, list) {
				if (err) throw err;
				else {
					res.send(list);
				}
			});
		}
		else if (mask == '1') {
			connection.query("SELECT * FROM movies ORDER BY title LIMIT 48 OFFSET ? ", [initialNum], function (err, list) {
				if (err) throw err;
				else {
					res.send(list);
				}
			});
		}
		else if (mask == '2') {
			connection.query("SELECT * FROM movies ORDER BY rating DESC LIMIT 48 OFFSET ? ", [initialNum], function (err, list) {
				if (err) throw err;
				else {
					res.send(list);
				}
			});
		}
		else if (mask == '3') {
			if (genre.length > 2) {
				connection.query("SELECT * FROM movies WHERE genre LIKE ? ORDER BY rating DESC LIMIT 48 OFFSET ? ", [genre, initialNum], function (err, list) {
					if (err) throw err;
					else {
						res.send(list);
					}
				});
			}
			else {
				connection.query("SELECT * FROM movies ORDER BY id LIMIT 48 OFFSET ? ", [initialNum], function (err, list) {
					if (err) throw err;
					else {
						res.send(list);
					}
				});
			}
		}
		else {
			// return  404 not found
			res.send("Error")
		}
	}
}
module.exports = movies;