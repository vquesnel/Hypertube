var connection = require("../../config/db_config");




var home = function (req, res) {
    if (!req.session.username) {
        res.redirect("/");
    } else
        res.render('home.html');
}
module.exports = home;