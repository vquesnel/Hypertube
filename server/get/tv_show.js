var connection = require("../../config/db_config")
var tv_show = function (req, res) {
    if (!req.session.username) {
        res.redirect('/');
    } else {
        connection.query("SELECT * FROM tv_shows WHERE imdb_code = ?", [req.params.imdb_code], function (err, movie) {
            if (err) throw err;
            else {
                connection.query("SELECT * FROM tv_shows_torrents WHERE id_tv_show = ? ORDER BY quality DESC", [movie[0].id], function (err, torrents) {
                    if (err) throw err;
                    else {
                        if (movie[0].actors !== "N/A") movie[0].actors = JSON.parse(movie[0].actors);
                        if (movie[0].genres !== "N/A") movie[0].genres = JSON.parse(movie[0].genres);
                        for (var k in torrents) torrents[k].imdb_code = movie[0].imdb_code;
                        res.render("tv_show", {
                            torrent: '/watchmovie.html/' + movie[0].imdb_code + '/' + torrents[0].magnet + '/' + torrents[0].quality,
                            display_one_movie: {
                                infos: movie
                            },
                            userID: req.session.id_user,
                            display_tv_torrents: {
                                data: torrents,
                            }
                        });
                    }
                })
            }
        })
    }
}
module.exports = tv_show;