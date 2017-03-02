var mdb = require('moviedb')('636a0fd883d33354fd2758594ce333d4');
var url = 'https://image.tmdb.org/t/p/original';
var Promise = require('promise');
var connection = require("../../config/db_config");
var wallpaperTv = function (req, res) {
    if (!req.session.username) {
        res.send("/");
    } else {
        connection.query("SELECT title, background_img FROM tv_shows WHERE imdb_code = ?", [req.params.imdbid], function (err, title) {
            if (err) res.send({
                picture: false
            })
            else if (title[0]) {
                if (title[0].background_img !== "N/A") {
                    res.send({
                        picture: title[0].background_img
                    });
                } else {
                    let getBackground = new Promise(function (resolve, reject) {
                        mdb.searchTv({
                            query: title[0].title
                        }, function (err, response) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(url + response.results[0].backdrop_path);
                            }
                        });
                    })
                    getBackground.then(function (fromResolve) {
                        connection.query("UPDATE tv_shows set background_img = ? WHERE imdb_code = ? ", [fromResolve, req.params.imdbid], function (err, rows) {
                            if (err) throw err;
                            res.send({
                                picture: fromResolve
                            });
                        })

                    }).catch(function (fromReject) {
                        console.log(fromReject);
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
module.exports = wallpaperTv;