//var piratebay = require('thepiratebay');
var urlencode = require('urlencode');
var yts = require('../../medias/yts');
var home = function (req, res) {
    yts.listMovies({
        limit: 50,
        page: 3
    }, function (err, json) {
        res.render("home", {
            display_movies: {
                infos: json.data.movies
            }
        })
    });
}
module.exports = home;