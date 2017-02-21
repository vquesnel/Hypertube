var connection = require("../../config/db_config");
var displayCommentsHistory = function (req, res) {
	connection.query("SELECT comment.id AS 'commentID',comment.imdbID AS 'imdbID',comment.messageID AS 'messageID',comment.context AS 'context',movies.title AS 'movieTitle',movies.year AS 'movieYear',movies.rating AS 'movieRating',movies.cover AS 'movieCover',tv_shows.title AS 'tvTitle',tv_shows.year AS 'tvYear',tv_shows.rating AS 'tvRating',tv_shows.cover AS 'tvCover'FROM comment LEFT JOIN movies ON comment.imdbID = movies.imdb_code LEFT JOIN tv_shows ON comment.imdbID = tv_shows.imdb_code WHERE comment.userID = ? ORDER BY comment.id DESC LIMIT 4", [req.session.id_user], function (err, rows) {
		if (err) throw err;
		else {
			res.send(rows);
		}
	})
}
module.exports = displayCommentsHistory;