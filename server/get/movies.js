var connection = require("../../config/db_config");
var movies = function (req, res) {
    if (!req.session.username) {
        res.send("/");
    } else {
        var initialNum = req.query.itemsNum - 48;
        var mask = req.query.mask;
        var genre = '%' + req.query.genre + '%';
        if (req.query.year) {
            var start = req.query.year[0];
            var end = req.query.year[1];
        }
        if (initialNum < 0) {
            initialNum = 0;
        }
        if (mask == '0') {
            connection.query("SELECT * FROM movies ORDER BY id LIMIT 48 OFFSET ? ", [initialNum], function (err, list) {
                if (err) {
                    var error = [];
                    res.send(error);
                } else {
                    var itemsprocessed = list.length;
                    if (itemsprocessed > 0) {
                        list.forEach(function (element) {

                            connection.query("SELECT(SELECT COUNT( * ) FROM history WHere history.imdbID = ? and history.userID = ? ) AS viewed, (SELECT COUNT( * ) FROM download WHERE download.imdb_code = ? ) AS download FROM dual ", [element.imdb_code, req.session.id_user, element.imdb_code], function (err, result) {
                                itemsprocessed--;
                                if (err) {
                                    var error = [];
                                    res.send(error);
                                }

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
                    } else {
                        res.send(list);
                    }

                }
            });
        } else if (mask == '1') {
            connection.query("SELECT * FROM movies ORDER BY title LIMIT 48 OFFSET ? ", [initialNum], function (err, list) {
                if (err) {
                    var error = [];
                    res.send(error);
                } else {
                    var itemsprocessed = list.length;
                    if (itemsprocessed > 0) {
                        list.forEach(function (element) {
                            connection.query("SELECT ( SELECT COUNT(*) FROM history WHere history.imdbID= ? and history.userID= ? ) AS viewed, ( SELECT COUNT(*)  FROM download WHERE download.imdb_code=?) AS download FROM dual", [element.imdb_code, req.session.id_user, element.imdb_code], function (err, result) {
                                itemsprocessed--;
                                if (err) {
                                    var error = [];
                                    res.send(error);
                                }

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
                    } else {
                        res.send(list);
                    }

                }
            });
        } else if (mask == '2') {
            connection.query("SELECT * FROM movies ORDER BY rating DESC LIMIT 48 OFFSET ? ", [initialNum], function (err, list) {
                if (err) {
                    var error = [];
                    res.send(error);
                } else {
                    var itemsprocessed = list.length;
                    if (itemsprocessed > 0) {
                        list.forEach(function (element) {
                            connection.query("SELECT ( SELECT COUNT(*) FROM history WHere history.imdbID= ? and history.userID= ? ) AS viewed, ( SELECT COUNT(*)  FROM download WHERE download.imdb_code=?) AS download FROM dual", [element.imdb_code, req.session.id_user, element.imdb_code], function (err, result) {
                                itemsprocessed--;
                                if (err) {
                                    var error = [];
                                    res.send(error);
                                }

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
                    } else {
                        res.send(list);
                    }

                }
            });
        } else if (mask == '3') {
            if (genre.length > 2) {
                connection.query("SELECT * FROM movies WHERE genre LIKE ? ORDER BY rating DESC LIMIT 48 OFFSET ? ", [genre, initialNum], function (err, list) {
                    if (err) {
                        var error = [];
                        res.send(error);
                    } else {
                        var itemsprocessed = list.length;
                        if (itemsprocessed > 0) {
                            list.forEach(function (element) {
                                connection.query("SELECT ( SELECT COUNT(*) FROM history WHere history.imdbID= ? and history.userID= ? ) AS viewed, ( SELECT COUNT(*)  FROM download WHERE download.imdb_code=?) AS download FROM dual", [element.imdb_code, req.session.id_user, element.imdb_code], function (err, result) {
                                    itemsprocessed--;
                                    if (err) {
                                        var error = [];
                                        res.send(error);
                                    }

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
                        } else {
                            res.send(list);
                        }

                    }
                });
            } else {
                connection.query("SELECT * FROM movies ORDER BY id LIMIT 48 OFFSET ? ", [initialNum], function (err, list) {
                    if (err) {
                        var error = [];
                        res.send(error);
                    } else {
                        var itemsprocessed = list.length;
                        if (itemsprocessed > 0) {
                            list.forEach(function (element) {
                                connection.query("SELECT ( SELECT COUNT(*) FROM history WHere history.imdbID= ? and history.userID= ? ) AS viewed, ( SELECT COUNT(*)  FROM download WHERE download.imdb_code=?) AS download FROM dual", [element.imdb_code, req.session.id_user, element.imdb_code], function (err, result) {
                                    itemsprocessed--;
                                    if (err) {
                                        var error = [];
                                        res.send(error);
                                    }

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
                        } else {
                            res.send(list);
                        }

                    }
                });
            }
        } else if (mask == 4) {
            connection.query("SELECT * FROM movies WHERE year BETWEEN ? AND ? ORDER BY year ASC LIMIT 48 OFFSET ?", [start, end, initialNum], function (err, list) {
                if (err) {
                    var error = [];
                    res.send(error);
                } else {
                    var itemsprocessed = list.length;
                    if (itemsprocessed > 0) {
                        list.forEach(function (element) {
                            connection.query("SELECT ( SELECT COUNT(*) FROM history WHere history.imdbID= ? and history.userID= ? ) AS viewed, ( SELECT COUNT(*)  FROM download WHERE download.imdb_code=?) AS download FROM dual", [element.imdb_code, req.session.id_user, element.imdb_code], function (err, result) {

                                itemsprocessed--;
                                if (err) {
                                    var error = [];
                                    res.send(error);
                                }
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
                    } else {
                        res.send(list);
                    }
                }
            })
        } else {
            // return  404 not found
            res.send("404")
        }
    }
}
module.exports = movies;