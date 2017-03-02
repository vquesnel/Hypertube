var connection = require("../../config/db_config");
var profilManager = function (req, res) {
    if (req.params.lang === req.session.language) {
        res.send({
            status: "same",
            message: "It's Your Current Default Language"
        });
    } else if (req.params.lang.length > 2) {
        connection.query("UPDATE users SET language = ? WHERE id = ?", [req.params.lang, req.session.id_user], function (err) {
            if (err) {res.send({
                status: false,
                message: 'An error with the database occurs'
            })
                     }
            else {
                req.session.language = req.params.lang;
                res.send({
                    status: "modify",
                    message: 'Language Updated'
                });
            }
        })
    } else {
        res.send({
            status: false,
            message: "No Languague Selected"
        });
    }
}
module.exports = profilManager;