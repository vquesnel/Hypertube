var connection = require("../../config/db_config");
var tvShows = function (req, res) {
	connection.query("SELECT * FROM tv_shows", function (err, result) {
		for (var k in result) {
			if (result[k].cover === "N/A") {
				result[k].cover = "/img/award-1.png";
			}
		}
		res.render("home", {
			display_movies: {
				infos: result
			}
		});
	})
}
module.exports = tvShows