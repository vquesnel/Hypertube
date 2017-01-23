var yts = require('../../medias/yts');
var urlencode = require('urlencode');
var movie = function (req, res) {

    yts.listMovies({
        query_term: req.params.imdb_code
    }, function (err, json) {
        if (json.data.movies) {
            json.data.movies.forEach(function (movie) {
                if (movie.torrents) {
                    for (var k in movie.torrents) {
                        var urlencoded = urlencode(movie.title_long + " [" + movie.torrents[k].quality + "] [YTS.AG]");
                        movie.torrents[k].magnet = urlencode('magnet:?xt=urn:btih:' + movie.torrents[k].hash + '& dn=' + urlencoded);
                    }
                }
            });
        }
        console.log(json.data.movies[0].torrents);
        res.render("movie", {
            torrent: '/watchmovie.html/' + json.data.movies[0].imdb_code + '/' + json.data.movies[0].torrents[0].magnet + '/' + json.data.movies[0].torrents[0].quality,
            display_one_movie: {
                infos: json.data.movies
            }
        });
    });
}
module.exports = movie;
