var connection = require("../../config/db_config");
var profilOther = function (req, res) {
    if (!req.session.username) {
        res.redirect("/");
    } else if (req.params.ID == req.session.id_user) {
        res.redirect('/profile.html')
    } else {
        if (!isNaN(req.params.ID)) {
            connection.query("SELECT * FROM users WHERE id = ?", [req.params.ID], function (err, rows) {
                if (err) res.send('404');
                else {

                    res.render('profile.html', {
                        infos: rows[0],
                        id_user: rows[0].id
                    })
                }
            })
        } else {
            res.redirect("/404");
        }
    }
}
module.exports = profilOther;