var connection = require("../../config/db_config");
var mdb = require('moviedb')('636a0fd883d33354fd2758594ce333d4');
var urlmovie = 'https://image.tmdb.org/t/p/original';
var Promise = require('promise');
//var mdb = require('moviedb')('636a0fd883d33354fd2758594ce333d4');
var urltv = 'https://image.tmdb.org/t/p/original';


var getBackgroundTv = function (req, res) {
    //
    //    let getBackground = new Promise(function (resolve, reject) {
    //        mdb.searchTv({
    //            query: title
    //        }, function (err, response) {
    //            if (err) {
    //                reject(err);
    //            } else {
    //                resolve(urltv + response.results[0].backdrop_path);
    //            }
    //        });
    //    })
    //    getBackground.then(function (fromResolve) {
    //        connection.query("UPDATE tv_shows set background_img = ? WHERE title = ? ", [fromResolve, title], function (err, rows) {
    //            if (err) throw err;
    //            else
    //                return fromResolve
    //        })
    //    }).catch(function (fromReject) {
    //        return false
    //    })
    //}
    //var data = {};
    //var homeRequest = function (req, res) {
    //
    //    connection.query("SELECT imdb_code, title, rating, background_img FROM movies  ORDER BY RAND() LIMIT 5", function (err, rows) {
    //        if (err) throw err;
    //        else {
    //            //            var k = 0;
    //            data.film = [];
    //            var itemsprocessed = rows.length
    //            rows.forEach(function (row) {
    //                    if (row.background_img === 'N/A') {
    //                        let getBackgroun = new Promise(function (resolve, reject) {
    //                            mdb.movieInfo({
    //                                id: row.imdb_code
    //                            }, function (err, response) {
    //                                if (err) {
    //                                    reject(err);
    //                                } else {
    //                                    resolve(urlmovie + response.backdrop_path);
    //                                }
    //                            });
    //                        })
    //                        getBackgroun.then(function (fromResolve) {
    //
    //                            connection.query("UPDATE movies SET background_img = ? WHERE imdb_code = ? ", [fromResolve, row.imdb_code], function (err, result) {
    //                                if (err) console.log(err);
    //                                else {
    //                                    itemsprocessed--;
    //                                    row.background_img = fromResolve;
    //                                    data.film.push(row);
    //                                    console.log("premiere promesse " + itemsprocessed);
    //                                    if (itemsprocessed === 0) {
    //                                        connection.query("SELECT imdb_code, title, rating, background_img FROM tv_shows  ORDER BY RAND() LIMIT 5", function (err, final) {
    //                                            if (err) throw err;
    //                                            else {
    //                                                data.tv = [];
    //                                                var itemprocessedtv = final.length;
    //                                                final.forEach(function (tv) {
    //
    //                                                    if (tv.background_img === 'N/A') {
    //                                                        let getBackground = new Promise(function (resolve, reject) {
    //                                                            mdb.searchTv({
    //                                                                query: tv.title
    //                                                            }, function (err, response) {
    //                                                                if (err) {
    //                                                                    reject(err);
    //                                                                } else {
    //                                                                    resolve(urltv + response.results[0].backdrop_path);
    //                                                                }
    //                                                            });
    //                                                        })
    //                                                        getBackground.then(function (fromResolve) {
    //
    //
    //                                                            connection.query("UPDATE tv_shows set background_img = ? WHERE title = ? ", [fromResolve, tv.title], function (err, rows) {
    //                                                                if (err) throw err;
    //                                                                else {
    //                                                                    itemprocessedtv--;
    //                                                                    console.log(itemprocessedtv);
    //                                                                    tv.background_img = fromResolve;
    //                                                                    data.tv.push(tv);
    //                                                                    if (itemprocessedtv === 0)
    //                                                                        res.send(data);
    //                                                                }
    //                                                            })
    //                                                        }).catch(function (fromReject) {
    //                                                            console.log(fromReject)
    //                                                        })
    //
    //
    //                                                        //                        j++;
    //                                                    } else {
    //                                                        data.tv.push(tv);
    //                                                        itemprocessedtv--;
    //                                                        if (itemprocessedtv === 0)
    //                                                            res.send(data);
    //                                                    }
    //                                                })
    //                                            }
    //                                        })
    //                                    }
    //
    //
    //                                }
    //                            })
    //                        }).catch(function (fromReject) {
    //                            console.log(fromReject);
    //                        })
    //                    } else {
    //                        data.film.push(row);
    //                        itemsprocessed--;
    //                    }
    //                })
    //console.log(data);
    //            connection.query("SELECT imdb_code, title, rating, background_img FROM tv_shows  ORDER BY RAND() LIMIT 10", function (err, final) {
    //                if (err) throw err;
    //                else {
    //                    var itemprocessed = final.length;
    //                    for (var j in final) {
    //
    //                        if (final[j].background_img === 'N/A')
    //                            final[j].background_img = getBackgroundTv(final[j].title);
    //                        --itemprocessed
    //                        data.tv[j] = final[j];
    //                        if (itemprocessed === 0)
    //                            res.send(data);
    //                        //                        j++;
    //                    }
    //                }
    //            })
    //        }
    //    })

    var data = [];
    connection.query("SELECT imdb_code, title, rating, background_img FROM movies WHERE background_img <> 'N/A' ORDER BY RAND() LIMIT 5", function (err, rows) {
        if (err) throw err;

        else {
            data[0] = rows[0];
            data[1] = rows[1];
            data[2] = rows[2];
            data[3] = rows[3];
            data[4] = rows[4];
            connection.query("SELECT imdb_code, title, rating, background_img FROM tv_shows WHERE background_img <> 'N/A' ORDER BY RAND() LIMIT 5", function (err, final) {
                if (err) throw err;
                else {
                    data[5] = final[0];
                    data[6] = final[1];
                    data[7] = final[2];
                    data[8] = final[3];
                    data[9] = final[4];
                    console.log(data);
                    res.send(data);
                }
            })
        }
    })


}
module.exports = getBackgroundTv;