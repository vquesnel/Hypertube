var mdb = require('moviedb')('636a0fd883d33354fd2758594ce333d4');
var url = 'https://image.tmdb.org/t/p/original';
var Promise = require('promise');
var connection = require("../../config/db_config");
var wallpaper = function (req, res) {
    if (!req.session.username) {
        res.send("/");
    } else {
        connection.query("SELECT background_img from movies WHERE imdb_code = ?", [req.params.imdbid], function (err, rows) {
            if (err) {
                res.send({
                    picture: false
                })
            } else if (rows[0]) {
                if (rows[0].background_img !== "N/A") {
                    res.send({
                        picture: rows[0].background_img
                    });
                } else {
                    let getBackgroun = new Promise(function (resolve, reject) {
                        mdb.movieInfo({
                            id: req.params.imdbid
                        }, function (err, response) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(url + response.backdrop_path);
                            }
                        });
                    })
                    getBackgroun.then(function (fromResolve) {
                        connection.query("UPDATE movies SET background_img = ? WHERE imdb_code = ? ", [fromResolve, req.params.imdbid], function (err, result) {
                            if (err) console.log(err);
                            else {
                                res.send({
                                    picture: fromResolve
                                });

                            }
                        })
                    }).catch(function (fromReject) {
                        console.log(fromReject);
                        //404 not found
                        res.send({
                            picture: false
                        })
                    })
                }
            } else {
                res.send('404')
            }

        })
    }
}
module.exports = wallpaper;