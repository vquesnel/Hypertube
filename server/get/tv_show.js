var connection = require("../../config/db_config")
var imdb = require('omdbapi')
var tv_show = function (req, res) {
    if (!req.session.username) {
        res.redirect('/');
    } else {
        connection.query("SELECT * FROM tv_shows WHERE imdb_code = ?", [req.params.imdb_code], function (err, movie) {
            if (err) throw err;
            else {
                imdb.get({
                    id: movie[0].imdb_code
                }).then(function (data) {
                    if (err) {
                        console.log("movie by id");
                    } else {
                        movie[0].director = 'N/A';
                        movie[0].actors = 'N/A';
                        movie[0].writers = 'N/A';
                        if (data.director) {
                            movie[0].director = '';
                            for (var k in data.director) {
                                movie[0].director += data.director[k] + " ,"
                            }
                            if (movie[0].director === "null ,")
                                movie[0].director = "N/A"
                        }
                        if (data.actors) {
                            movie[0].actors = '';

                            for (var k in data.actors) {
                                movie[0].actors += data.actors[k] + " ,"
                            }
                        }
                        if (data.writer) {
                            console.log(data.writer);
                            movie[0].writers = '';
                            for (var k in data.writer) {
                                if (data.writer[k] !== null)
                                    movie[0].writers += data.writer[k].replace(/\(.*?\)/g, '') + " ,"
                            }
                        }
                        connection.query("SELECT * FROM tv_shows_torrents WHERE id_tv_show = ? ORDER BY quality DESC", [movie[0].id], function (err, torrents) {
                            if (err) throw err;
                            else {
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
                }).catch(function (err) {
                    console.log("BUG OMDBP");
                    console.log(err);
                })
            }
        })
    }
}
module.exports = tv_show;