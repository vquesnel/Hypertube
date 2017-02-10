var connection = require("../../config/db_config");
var watchHistory = function (req, res) {
    connection.query('INSERT INTO history(imdbID, id_user) VALUES(?,?)', [req.params.imdbID, req.session.id_user], function (err, rows) {
        if (err) throw err;
    })
}
module.exports = watchHistory;