var translate = require("../../medias/google-translate-api/index");
var connection = require("../../config/db_config");
var changeSyno = function (req, res) {
    connection.query("SELECT ( SELECT movies.summary FROM movies WHere movies.imdb_code= ?) AS movies, ( SELECT tv_shows.summary FROM tv_shows WHERE tv_shows.imdb_code= ?) AS tv_shows FROM dual", [req.query.imdb_code, req.query.imdb_code], function (err, result) {
        if (err) {
            var error = {};
            res.send(error);
        }
        else if (result[0].movies) {
            translate(result[0].movies, {
                to: req.session.language
            }).then(translation => {
                res.send(translation.text);
            }).catch(err => {
                res.send(result[0].movies);
            });
        } else {
            translate(result[0].tv_shows, {
                to: req.session.language
            }).then(translation => {
                res.send(translation.text);
            }).catch(err => {
                res.send(result[0].tv_shows);
            });

        }
    })

}
module.exports = changeSyno