var connection = require("../../config/db_config");
var mdb = require('moviedb')('636a0fd883d33354fd2758594ce333d4');
var urlmovie = 'https://image.tmdb.org/t/p/original';
var Promise = require('promise');
var urltv = 'https://image.tmdb.org/t/p/original';

var homeRequest = function (req, res) {
    var data = [];

    connection.query("SELECT background_img FROM movies WHERE background_img <> 'N/A' ORDER BY RAND() LIMIT 5", function (err, result) {
        if (err) {
            res.send({
                picture: false
            })
        } else {
            result.forEach(function (movie) {
                data.push(movie);
            })
            if (result.length < 5) {
                var offset = 5 - result.length;
                connection.query("SELECT imdb_code, background_img FROM movies WHERE background_img  = 'N/A' ORDER BY RAND() LIMIT ?", [offset], function (err, rows) {
                    if (err) {
                        res.send({
                            picture: false
                        })
                    } else {
                        var itemsprocessed = rows.length
                        rows.forEach(function (row) {
                            let getBackgroun = new Promise(function (resolve, reject) {
                                mdb.movieInfo({
                                    id: row.imdb_code
                                }, function (err, response) {
                                    if (err) {
                                        reject(err);
                                    } else {

                                        resolve(urlmovie + response.backdrop_path);
                                    }
                                });
                            })
                            getBackgroun.then(function (fromResolve) {
                                connection.query("UPDATE movies SET background_img = ? WHERE imdb_code = ? ", [fromResolve, row.imdb_code], function (err, result) {
                                    if (err) {
                                        res.send({
                                            picture: false
                                        })
                                    } else {
                                        itemsprocessed--;
                                        row.background_img = fromResolve;
                                        data.push(row);
                                        if (itemsprocessed === 0) {
                                            connection.query("SELECT background_img FROM tv_shows WHERE background_img <> 'N/A' ORDER BY RAND() LIMIT 5", function (err, tv_shows) {
                                                if (err) {
                                                    res.send({
                                                        picture: false
                                                    })
                                                } else {
                                                    tv_shows.forEach(function (tv_show) {
                                                        data.push(tv_show);
                                                    })
                                                    if (tv_shows.length < 5) {
                                                        var offset = 5 - tv_shows.length;

                                                        connection.query("SELECT  title,  background_img FROM tv_shows WHERE background_img = 'N/A' ORDER BY RAND() LIMIT ?", [offset], function (err, final) {
                                                            if (err) {
                                                                res.send({
                                                                    picture: false
                                                                })
                                                            } else {

                                                                var itemprocessedtv = final.length;
                                                                final.forEach(function (tv) {
                                                                    let getBackground = new Promise(function (resolve, reject) {
                                                                        mdb.searchTv({
                                                                            query: tv.title
                                                                        }, function (err, response) {
                                                                            if (err) {
                                                                                reject(err);
                                                                            } else {
                                                                                if (response.results) {
                                                                                    resolve(urltv + response.results[0].backdrop_path);
                                                                                } else {
                                                                                    reject("no backdrop_path");
                                                                                }
                                                                            }
                                                                        });
                                                                    })
                                                                    getBackground.then(function (fromResolve) {


                                                                        connection.query("UPDATE tv_shows set background_img = ? WHERE title = ? ", [fromResolve, tv.title], function (err, rows) {
                                                                            if (err) {
                                                                                res.send({
                                                                                    picture: false
                                                                                })
                                                                            } else {
                                                                                itemprocessedtv--;
                                                                                tv.background_img = fromResolve;
                                                                                data.push(tv);
                                                                                if (itemprocessedtv === 0)
                                                                                    res.send(data);
                                                                            }
                                                                        })
                                                                    }).catch(function (fromReject) {
                                                                        res.send(data)
                                                                    })



                                                                })
                                                            }
                                                        })
                                                    } else {
                                                        res.send(data);
                                                    }

                                                }
                                            })
                                        }


                                    }
                                })
                            }).catch(function (fromReject) {
                                res.send(data);
                            })

                        })

                    }
                })
            } else {
                connection.query("SELECT background_img FROM tv_shows WHERE background_img <> 'N/A' ORDER BY RAND() LIMIT 5", function (err, tv_shows) {
                    if (err) {
                        res.send({
                            picture: false
                        })
                    } else {
                        tv_shows.forEach(function (tv_show) {
                            data.push(tv_show);
                        })
                        if (tv_shows.length < 5) {
                            var offset = 5 - tv_shows.length;

                            connection.query("SELECT  title,  background_img FROM tv_shows WHERE background_img = 'N/A' ORDER BY RAND() LIMIT ?", [offset], function (err, final) {
                                if (err) {
                                    res.send({
                                        picture: false
                                    })
                                } else {

                                    var itemprocessedtv = final.length;
                                    final.forEach(function (tv) {
                                        let getBackground = new Promise(function (resolve, reject) {
                                            mdb.searchTv({
                                                query: tv.title
                                            }, function (err, response) {
                                                if (err) {
                                                    reject(err);
                                                } else {
                                                    if (response.results) {
                                                        resolve(urltv + response.results[0].backdrop_path);
                                                    } else {
                                                        reject("no backdrop_path");
                                                    }
                                                }
                                            });
                                        })
                                        getBackground.then(function (fromResolve) {


                                            connection.query("UPDATE tv_shows set background_img = ? WHERE title = ? ", [fromResolve, tv.title], function (err, rows) {
                                                if (err) {
                                                    res.send({
                                                        picture: false
                                                    })
                                                } else {
                                                    itemprocessedtv--;
                                                    tv.background_img = fromResolve;
                                                    data.push(tv);
                                                    if (itemprocessedtv === 0)
                                                        res.send(data);
                                                }
                                            })
                                        }).catch(function (fromReject) {
                                            res.send(data)
                                        })



                                    })
                                }
                            })
                        } else {
                            res.send(data);
                        }

                    }
                })


            }
        }
    })

}
module.exports = homeRequest;