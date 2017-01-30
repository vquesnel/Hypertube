var connection = require("../../config/db_config");
var handler = function (req, res) {
    var initialNum = req.params.itemsNum - 47;
    var param = req.params.context.split('@');
    var context = param[0];
    var itemsNum = param[1];
    var initialNum = itemsNum - 47;
    var condition = '%' + context + '%'

    connection.query("SELECT * FROM movies WHERE genre LIKE ?  BETWEEN ? AND ? ", [context, initialNum, itemsNum], function (err, list) {
        if (err) throw err;
        else {
            res.send(list);
        }
    });
}
module.exports = handler;