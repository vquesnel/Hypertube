var connection = require('../../config/db_config');
var check = function (req, res, callback) {
    connection.query("SELECT * FROM users WHERE sessionID = ?", [req.sessionID], function (err, connect) {
        if (err) callback(err, connect);
        if (!connect[0]) {
            callback(null, null);
        } else {
            callback(null, connect);
        }
    })
};
var index = function (req, res) {
    check(req, res, function (err, data) {
        if (err) res.redirect('/404');
        else if (data) res.redirect("/profile.html");
        else res.render('index');
    });
}
module.exports = index;