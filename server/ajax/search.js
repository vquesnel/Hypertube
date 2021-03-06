var connection = require("../../config/db_config");
var search = function (req, res) {
	if (!req.session.username) {
		res.send("/");
	}
	else {
		if (Number(req.query.lenFind) <= 3) {
			connection.query("SELECT * FROM ??  WHERE substr(LOWER(title), 1," + req.query.lenFind + ") = LOWER(?)  LIMIT 100 ", [req.query.context, req.query.toFind], function (err, list) {
				if (err) {
                    var error = [];
                    res.send(error)
                }
				else {
					var itemsprocessed = list.length;
					if (itemsprocessed > 0) {
						list.forEach(function (element) {
							connection.query("SELECT ( SELECT COUNT(*) FROM history WHere history.imdbID= ? and history.userID= ? ) AS viewed, ( SELECT COUNT(*)  FROM download WHERE download.imdb_code=?) AS download FROM dual", [element.imdb_code, req.session.id_user, element.imdb_code], function (err, result) {
								itemsprocessed--;
								if (err) {
                    var error = [];
                    res.send(error)
                }
								if (result[0].viewed > 0) {
									element.viewed = true;
								}
								else {
									element.viewed = false;
								}
								if (result[0].download > 0) {
									element.download = true
								}
								else {
									element.download = false;
								}
								if (itemsprocessed === 0) res.send(list);
							})
						})
					}
					else {
						res.send(list);
					}
				}
			});
		}
		else {
			connection.query("SELECT * FROM ??  WHERE substr(LOWER(title), 1," + req.query.lenFind + ") = LOWER(?) ", [req.query.context, req.query.toFind], function (err, list) {
                if (err) {
                    var error = [];
                    res.send(error)
                }
				else {
					var itemsprocessed = list.length;
					if (itemsprocessed > 0) {
						list.forEach(function (element) {
							connection.query("SELECT ( SELECT COUNT(*) FROM history WHere history.imdbID= ? and history.userID= ? ) AS viewed, ( SELECT COUNT(*)  FROM download WHERE download.imdb_code=?) AS download FROM dual", [element.imdb_code, req.session.id_user, element.imdb_code], function (err, result) {
								itemsprocessed--;
								if (err) {
                    var error = [];
                    res.send(error)
                }
								if (result[0].viewed > 0) {
									element.viewed = true;
								}
								else {
									element.viewed = false;
								}
								if (result[0].download > 0) {
									element.download = true
								}
								else {
									element.download = false;
								}
								if (itemsprocessed === 0) res.send(list);
							})
						})
					}
					else {
						res.send(list);
					}
				}
			});
		}
	}
}
module.exports = search;