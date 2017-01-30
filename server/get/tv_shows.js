var connection = require("../../config/db_config");
var tv_shows = function (req, res) {
    var initialNum = req.params.itemsNum - 47;

    connection.query("SELECT * FROM tv_shows WHERE id BETWEEN ? AND ? ", [initialNum, req.params.itemsNum], function (err, list) {
        if (err) throw err;
        else {
            res.send(list);
        }
    });
}
module.exports = tv_shows;