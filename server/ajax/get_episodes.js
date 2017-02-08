var connection = require("../../config/db_config");
var get_episodes = function (req, res) {
	connection.query("SELECT tv_shows_torrents.season, tv_shows_torrents.episode,tv_shows_torrents.magnet  FROM tv_shows_torrents JOIN tv_shows ON tv_shows_torrents.id_tv_show = tv_shows.id WHERE tv_shows.imdb_code = ? ORDER BY season ASC, episode ASC", [req.params.imdb_code], function (err, rows) {
		if (err) throw err;
		else {
			res.send(rows);
		}
	})
}
module.exports = get_episodes;
