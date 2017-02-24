var translate = require("../../medias/google-translate-api/index");
var changeSyno = function (req, res) {
	translate(req.query.syno, {
		to: req.session.language
	}).then(translation => {
		res.send(translation.text);
	}).catch(err => {
		res.send(req.query.syno)
	});
}
module.exports = changeSyno