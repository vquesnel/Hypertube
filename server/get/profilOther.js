var connection = require("../../config/db_config");

var profilOther = function (req, res) {
    if (!req.session.username) {
        res.redirect("/");
    }
    if (req.params.ID === req.session.id_user) {
        res.redirect('/profile2.html')
    } else {
        connection.query("SELECT * FROM users WHERE id = ?", [req.params.ID], function (err, rows) {
            if (err) throw err;
            else {
                res.render('profile2.html', {
                    infos: rows[0]
                })
            }
        })
    }
}
module.exports = profilOther;