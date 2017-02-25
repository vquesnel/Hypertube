var connection = require("../../config/db_config");
var tv_shows = function (req, res) {
    if (!req.session.username) {
        res.send("/");
    } else {
        var initialNum = req.query.itemsNum - 48;
        var mask = req.query.mask
        var genre = '%' + req.query.genre + '%';
        if (initialNum < 0) {
            initialNum = 0;
        }
        if (mask == '0') {
            connection.query("SELECT * FROM tv_shows ORDER BY id LIMIT 48 OFFSET ? ", [initialNum], function (err, list) {
                if (err) throw err;
                else {
                    var itemsprocessed = list.length;
                    list.forEach(function (element) {
                        connection.query("SELECT ( SELECT COUNT(*) FROM history WHere history.imdbID= ? and history.userID= ? ) AS viewed, ( SELECT COUNT(*)  FROM download WHERE download.imdb_code=?) AS download FROM dual", [element.imdb_code, req.session.id_user, element.imdb_code], function (err, result) {
                            itemsprocessed--;
                            if (err) console.log(err);

                            if (result[0].viewed > 0) {
                                element.viewed = true;
                            } else {
                                element.viewed = false;
                            }
                            if (result[0].download > 0) {
                                element.download = true
                            } else {
                                element.download = false;
                            }
                            if (itemsprocessed === 0) res.send(list);
                        })
                    })

                }
            });
        } else if (mask == '1') {
            connection.query("SELECT * FROM tv_shows ORDER BY title LIMIT 48 OFFSET ? ", [initialNum], function (err, list) {
                if (err) throw err;
                else {
                    var itemsprocessed = list.length;
                    list.forEach(function (element) {
                        connection.query("SELECT ( SELECT COUNT(*) FROM history WHere history.imdbID= ? and history.userID= ? ) AS viewed, ( SELECT COUNT(*)  FROM download WHERE download.imdb_code=?) AS download FROM dual", [element.imdb_code, req.session.id_user, element.imdb_code], function (err, result) {
                            itemsprocessed--;
                            if (err) console.log(err);

                            if (result[0].viewed > 0) {
                                element.viewed = true;
                            } else {
                                element.viewed = false;
                            }
                            if (result[0].download > 0) {
                                element.download = true
                            } else {
                                element.download = false;
                            }
                            if (itemsprocessed === 0) res.send(list);
                        })
                    })

                }
            });
        } else if (mask == '2') {
            connection.query("SELECT * FROM tv_shows ORDER BY rating DESC LIMIT 48 OFFSET ? ", [initialNum], function (err, list) {
                if (err) throw err;
                else {
                    var itemsprocessed = list.length;
                    list.forEach(function (element) {
                        connection.query("SELECT ( SELECT COUNT(*) FROM history WHere history.imdbID= ? and history.userID= ? ) AS viewed, ( SELECT COUNT(*)  FROM download WHERE download.imdb_code=?) AS download FROM dual", [element.imdb_code, req.session.id_user, element.imdb_code], function (err, result) {
                            itemsprocessed--;
                            if (err) console.log(err);

                            if (result[0].viewed > 0) {
                                element.viewed = true;
                            } else {
                                element.viewed = false;
                            }
                            if (result[0].download > 0) {
                                element.download = true
                            } else {
                                element.download = false;
                            }
                            if (itemsprocessed === 0) res.send(list);
                        })
                    })

                }
            });
        } else if (mask == '3') {
            if (genre.length > 2) {
                connection.query("SELECT * FROM tv_shows WHERE genre LIKE ? ORDER BY rating DESC LIMIT 48 OFFSET ? ", [genre, initialNum], function (err, list) {
                    if (err) throw err;
                    else {
                        var itemsprocessed = list.length;
                        list.forEach(function (element) {
                            connection.query("SELECT ( SELECT COUNT(*) FROM history WHere history.imdbID= ? and history.userID= ? ) AS viewed, ( SELECT COUNT(*)  FROM download WHERE download.imdb_code=?) AS download FROM dual", [element.imdb_code, req.session.id_user, element.imdb_code], function (err, result) {
                                itemsprocessed--;
                                if (err) console.log(err);

                                if (result[0].viewed > 0) {
                                    element.viewed = true;
                                } else {
                                    element.viewed = false;
                                }
                                if (result[0].download > 0) {
                                    element.download = true
                                } else {
                                    element.download = false;
                                }
                                if (itemsprocessed === 0) res.send(list);
                            })
                        })

                    }
                });
            } else {
                connection.query("SELECT * FROM tv_shows ORDER BY id LIMIT 48 OFFSET ? ", [initialNum], function (err, list) {
                    if (err) throw err;
                    else {
                        var itemsprocessed = list.length;
                        list.forEach(function (element) {
                            connection.query("SELECT ( SELECT COUNT(*) FROM history WHere history.imdbID= ? and history.userID= ? ) AS viewed, ( SELECT COUNT(*)  FROM download WHERE download.imdb_code=?) AS download FROM dual", [element.imdb_code, req.session.id_user, element.imdb_code], function (err, result) {
                                itemsprocessed--;
                                if (err) console.log(err);

                                if (result[0].viewed > 0) {
                                    element.viewed = true;
                                } else {
                                    element.viewed = false;
                                }
                                if (result[0].download > 0) {
                                    element.download = true
                                } else {
                                    element.download = false;
                                }
                                if (itemsprocessed === 0) res.send(list);
                            })
                        })

                    }
                });
            }
        } else {
            //return sur un 404 not found 
            res.send("error");
        }
    }
}
module.exports = tv_shows;