var connection = require("../../config/db_config");
var displayTvHistory = function (req, res) {
	if (!req.session.username) {
		res.send("/");
	}
	else {
		connection.query("select tv_shows.imdb_code, tv_shows.title, tv_shows.year, tv_shows.cover, tv_shows.rating, t2.date from tv_shows inner join (select DISTINCT history.imdbID , history.date from history WHERE history.context=? AND history.userID= ? ORDER By history.date DESC LIMIT 4) t2 on tv_shows.imdb_code= t2.imdbID ORDER By t2.date DESC", ["tv_show", req.query.id], function (err, rows) {
			if (err) console.log(err);
			else res.send(rows);
		})
	}
}
module.exports = displayTvHistory;