var mdb = require('moviedb')('636a0fd883d33354fd2758594ce333d4');
var url = 'https://image.tmdb.org/t/p/original';
var Promise = require('promise');
var wallpaper = function (req, res) {
    let getBackgroun = new Promise(function (resolve, reject) {
        mdb.movieInfo({
            id: req.params.imdbid
        }, function (err, response) {
            if (err) {
                reject(err);
            } else {
                //                console.log(response);
                resolve(url + response.backdrop_path);
            }

        });
    })
    getBackgroun.then(function (fromResolve) {
        res.end(fromResolve);
    }).catch(function (fromReject) {
        console.log(fromReject);
    })

}

module.exports = wallpaper;