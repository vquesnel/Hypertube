var connection = require("../../config/db_config");
var home = function (req, res) {
    connection.query("SELECT * FROM movies LIMIT 40", function (err, list) {
        res.render("home", {
            display_movies: {
                infos: list
            }
        });
    });
}
module.exports = home;