var connection = require("../../config/db_config");
var watchHistory = function (req, res) {
    if (!req.session.username) {
        res.send("/");
    } else {
        connection.query('INSERT INTO history (imdbID, userID, context, date)SELECT * FROM (SELECT ?, ?, ?, ?) AS tmp WHERE NOT EXISTS (SELECT imdbID FROM history WHERE imdbID = ? AND userID = ?) LIMIT 1', [req.params.imdbID, req.session.id_user, req.params.context, Date.now(), req.params.imdbID, req.session.id_user], function (err, rows) {
            if (err) {
                res.send({
                    result: "error"
                })

            } else {
                if (rows.insertId == 0) {
                    connection.query("UPDATE history set date = ? WHERE imdbID = ? and userID= ?", [Date.now(), req.params.imdbID, req.session.id_user], function (err) {
                        if (err) console.log(err);
                        else {
                            res.send({
                                result: "ok"
                            })
                        }
                    })
                } else {
                    res.send({
                        result: "ok"
                    })
                }
            }
        })
        connection.query("SELECT * FROM download WHERE imdb_code =?", [req.params.tvdb_id ? req.params.tvdb_id : req.params.imdbID], function (err, rows) {
            if (err) {
                res.send({
                    result: "error"
                })
            } else if (rows[0]) {
                connection.query("UPDATE download SET date = ? WHERE imdb_code = ?", [Date.now(), req.params.tvdb_id ? req.params.tvdb_id : req.params.imdbID], function (err) {
                    if (err) {
                        res.send({
                            result: "error"
                        })
                    }
                })
            }
        })
    }
}
module.exports = watchHistory;