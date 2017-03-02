var connection = require("../../config/db_config");
var imdb = require('omdbapi');
var translate = require("../../medias/google-translate-api/index");
var movie = function (req, res) {
    if (!req.session.username) {
        res.redirect('/');
    } else {
        connection.query("SELECT * FROM movies WHERE imdb_code = ?", [req.params.imdb_code], function (err, movie) {
            if (err) throw err;
            else if (movie[0]) {
                console.log(movie[0]);
                if (!movie[0].director && !movie[0].writers && !movie[0].actors) {
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
                                if (movie[0].director === "null ,") movie[0].director = "N/A"
                            }
                            if (data.actors) {
                                movie[0].actors = '';
                                for (var k in data.actors) {
                                    movie[0].actors += data.actors[k] + " ,"
                                }
                            }
                            if (data.writer) {
                                movie[0].writers = '';
                                for (var k in data.writer) {
                                    if (data.writer[k] !== null) movie[0].writers += data.writer[k].replace(/\(.*?\)/g, '') + " ,"
                                }
                                if (movie[0].writers === '')
                                    movie[0].writers = 'N/A';
                            }
                            connection.query("UPDATE movies SET director = ?, writers = ?, actors =? WHERE imdb_code = ?", [movie[0].director, movie[0].writers, movie[0].actors, req.params.imdb_code], function (err) {
                                if (err) console.log(err);
                            })
                            connection.query("SELECT * FROM movies_torrents WHERE id_film = ? ORDER BY quality DESC", [movie[0].id], function (err, torrents) {
                                if (err) throw err;
                                else {
                                    for (var k in torrents) torrents[k].imdb_code = movie[0].imdb_code;
                                    translate(movie[0].summary, {
                                        to: req.session.language
                                    }).then(translation => {
                                        movie[0].summary = translation.text;
                                        res.render("movie", {
                                            display_one_movie: {
                                                infos: movie
                                            },
                                            userID: req.session.id_user,
                                            display_tv_torrents: {
                                                data: torrents,
                                            }
                                        });
                                    }).catch(err => {
                                        res.render("movie", {
                                            display_one_movie: {
                                                infos: movie
                                            },
                                            userID: req.session.id_user,
                                            display_tv_torrents: {
                                                data: torrents,
                                            }
                                        });
                                    })
                                }
                            })
                        }
                    }).catch(function (err) {
                        console.log("BUG OMDBP");
                        console.log(err);
                    })

                } else {
                    connection.query("SELECT * FROM movies_torrents WHERE id_film = ? ORDER BY quality DESC", [movie[0].id], function (err, torrents) {
                        if (err) throw err;
                        else {
                            for (var k in torrents) torrents[k].imdb_code = torrents[k].tvdb_id;
                            translate(movie[0].summary, {
                                to: req.session.language
                            }).then(translation => {
                                movie[0].summary = translation.text;
                                res.render("tv_show", {
                                    display_one_movie: {
                                        infos: movie
                                    },
                                    userID: req.session.id_user,
                                    display_tv_torrents: {
                                        data: torrents,
                                    }
                                });
                            }).catch(err => {
                                res.render("tv_show", {
                                    display_one_movie: {
                                        infos: movie
                                    },
                                    userID: req.session.id_user,
                                    display_tv_torrents: {
                                        data: torrents,
                                    }
                                });
                            })
                        }
                    })

                }
            } else {
                //404 not found
                console.log("SDfgsdfgsdfg");
                res.send("error")
            }
        })
    }
}
module.exports = movie;