var connection = require("../../config/db_config");
var displayMoviesHistory = function (req, res) {
	if (!req.session.username) {
		res.send("/");
	}
	else {
	connection.query("select movies.imdb_code, movies.title, movies.year, movies.cover, movies.rating, t2.date from movies inner join (select DISTINCT history.imdbID , history.date from history WHERE history.context=? AND history.userID= ? ORDER By history.date DESC LIMIT 4) t2 on movies.imdb_code= t2.imdbID ORDER By t2.date DESC", ["movie", req.query.id],function(err, rows){
		if (err) {
        var error= [];
        res.send(error)}
		else{
			res.send(rows);
		}
	});
	}
}
module.exports = displayMoviesHistory;