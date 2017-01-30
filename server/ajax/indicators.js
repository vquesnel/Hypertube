var connection = require("../../config/db_config");
var indicators = function (req, res) {

    connection.query("SELECT * FROM comment WHERE imdb_id = ?", [req.params.imdbID], function (err, rows) {
        if (err) throw err;
        else {
            res.end(rows.length + '');
        }
    })

}
module.exports = indicators;