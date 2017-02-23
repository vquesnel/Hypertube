var storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './public/profil_pic');
	},
	filename: function (req, file, callback) {
		callback(null, req.session.id_user + '-' + uniqid());
	}
});
var upload = multer({
	storage: storage,
	fileFilter: function (req, file, cb) {
		if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpeg') {
			req.fileValidationError = 'goes wrong on the mimetype';
			return cb(null, false, new Error('goes wrong on the mimetype'));
		}
		cb(null, true);
	}
}).single('file');
var sharp = require('sharp');
var connection = require("../../config/db_config");

var managePicture = function (req, res) {



	var infos = {};
	(function (callback) {
		upload(req, res, function (err) {
			var cropped = '/profil_pic/' + req.session.id_user + '-' + uniqid() + '.png';
			if (req.fileValidationError) {
				infos.messagephoto = 'Wrong file type : File not uploaded';
				callback(infos);
			} else if (req.file) {
				if (err) {
					infos.messagephoto = 'A problem occurs : File not uploaded';
					callback(infos);
				} else {
					sharp(req.file.path).resize(500, 500).toFile('public/' + cropped, function (err) {
						if (err) {
							infos.messagephoto = "Unsupported image format";
							callback(infos);
						} else {
							fs.unlinkSync(req.file.path);
							connection.query("UPDATE users SET profil_pic = ? WHERE id = ?", [cropped, req.session.id_user], function (err) {
								if (err) throw err;
							})
							infos.messagephoto = "Your profil picture has been updated"
							req.session.profil_pic = cropped;
							callback(infos);
						}
					});
				}
			} else {
				infos.messagephoto = "You haven't select a picture";
				callback(infos);
			}
		})
	})(function (infos) {
		req.session.messagephoto = infos.messagephoto;
		res.redirect("/profile.html");
	})



}
module.exports = managePicture;
