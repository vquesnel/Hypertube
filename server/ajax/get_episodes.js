var connection = require("../../config/db_config");
var get_episodes = function (req, res) {
    if (!req.session.username) {
        res.send("/");
    } else {
        connection.query("SELECT tv_shows_torrents.season, tv_shows_torrents.episode,tv_shows_torrents.magnet, tv_shows_torrents.tvdb_id  FROM tv_shows_torrents JOIN tv_shows ON tv_shows_torrents.id_tv_show = tv_shows.id WHERE tv_shows.imdb_code = ? ORDER BY season ASC, episode ASC", [req.params.imdb_code], function (err, rows) {
            if (err) throw err;
            else {
                var itemProcessed = rows.length;
                rows.forEach(function (episode) {
                    connection.query("SELECT COUNT(*) as download FROM download WHERE imdb_code = ?", [episode.tvdb_id], function (err, result) {
                        itemProcessed--;

                        if (err) console.log(err);
                        else if (result[0].download > 0)
                            episode.download = true;
                        else
                            episode.download = false;
                        if (itemProcessed === 0)
                            res.send(rows);

                    })
                })
            }
        })
    }
}
module.exports = get_episodes;