var connection = require("../../config/db_config");
var indicators = function (req, res) {
    if (!req.session.username) {
        res.send("/");
    } else {
        var data = {};
        connection.query("SELECT * FROM comment WHERE imdbID = ?", [req.params.imdbID], function (err, rows) {
            if (err) {
                data.comments = 0;
                data.watchs = 0;
                res.send(data);
            }
            else {
                data.comments = rows.length;
                connection.query("SELECT * FROM history WHERE imdbID = ?", [req.params.imdbID], function (err, watchs) {
                    if (err) throw err;
                    else {
                        data.watchs = watchs.length;
                        res.send(data);
                    }
                })
            }
        })

    }
}
module.exports = indicators;