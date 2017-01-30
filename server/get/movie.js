var connection = require("../../config/db_config")
var movie = function (req, res) {
    connection.query("SELECT * FROM movies WHERE imdb_code = ?", [req.params.imdb_code], function (err, movie) {
        if (err) throw err;
        else {
            connection.query("SELECT * FROM movies_torrents WHERE id_film = ? ORDER BY quality DESC", [movie[0].id], function (err, torrents) {
                if (err) throw err;
                else {
                    if (movie[0].actors !== "N/A")
                        movie[0].actors = JSON.parse(movie[0].actors);
                    if (movie[0].genre !== "N/A")
                        movie[0].genre = JSON.parse(movie[0].genre);

                    res.render("movie", {
                        torrent: '/watchmovie.html/' + movie[0].id + '/' + torrents[0].magnet + '/' + torrents[0].quality,
                        display_one_movie: {
                            infos: movie
                        },
                        username: req.session.username,
                        display_torrents: {
                            data: torrents
                        }
                    });
                }
            })
        }
    })
}
module.exports = movie;