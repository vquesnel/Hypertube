var passport = require("../../config/passport");
var uniqid = require("uniqid");
var sha256 = require("sha256");
var connection = require("../../config/db_config");
var fb = function (req, res) {
	connection.query("SELECT * FROM users WHERE fb_id = ? OR email = ?", [req.user._json.id, req.user._json.email], function (err, rows) {
		if (err) throw err;
		if (rows[0]) {
			connection.query("UPDATE users SET sessionID = ? WHERE id = ?", [req.sessionID, rows[0].id], function (err) {
				if (err) throw err;
			})
			req.session.id_user = rows[0].id;
			req.session.profil_pic = rows[0].profil_pic;
			req.session.firstname = rows[0].firstname;
			req.session.lastname = rows[0].lastname;
			req.session.username = rows[0].username;
			req.session.language = rows[0].language;
			req.session.email = rows[0].email;
			req.session.token = rows[0].token;
			res.redirect('/profile2.html');
		}
		else {
			var token = uniqid();
			if (!req.user._json.email) {
				req.user._json.email = req.user._json.id + '@facebook.com';
			}
			connection.query("INSERT INTO users(firstname, lastname, username, email,password, token, fb_id, profil_pic, sessionID) VALUES (?,?,?,?,?,?,?,?,?)", [req.user._json.first_name, req.user._json.last_name, req.user._json.first_name + "." + req.user._json.last_name, req.user._json.email, sha256(uniqid()), token, req.user._json.id, req.user._json.picture.data.url, req.sessionID], function (err, rows) {
				if (err) throw err;
				else {
					req.session.id_user = rows.insertId;
					req.session.profil_pic = req.user._json.picture.data.url;
					req.session.firstname = req.user._json.first_name;
					req.session.lastname = req.user._json.last_name;
					req.session.username = req.user._json.first_name + "." + req.user._json.last_name;
					req.session.email = req.user._json.email;
					req.session.token = token;
					req.session.language = "eng";
					res.redirect('/profile2.html');
				}
			})
		}
	})
};
var school = function (req, res) {
	connection.query("SELECT * FROM users WHERE 42_id = ? OR email = ?", [req.user._json.id, req.user._json.email], function (err, rows) {
		if (err) throw err;
		if (rows[0]) {
			connection.query("UPDATE users SET sessionID = ? WHERE id =?", [req.sessionID, rows[0].id], function (err) {
				if (err) throw err;
			})
			req.session.id_user = rows[0].id;
			req.session.profil_pic = rows[0].profil_pic;
			req.session.firstname = rows[0].firstname;
			req.session.lastname = rows[0].lastname;
			req.session.username = rows[0].username;
			req.session.email = rows[0].email;
			req.session.token = rows[0].token;
			req.session.language = rows[0].language;
			res.redirect('/profile2.html');
		}
		else {
			var token = uniqid();
			connection.query("INSERT INTO users(firstname, lastname, username, email,password, token, 42_id, profil_pic, sessionID) VALUES (?,?,?,?,?,?,?,?,?)", [req.user._json.first_name, req.user._json.last_name, req.user._json.login, req.user._json.email, sha256(uniqid()), token, req.user._json.id, req.user._json.image_url, req.sessionID], function (err, rows) {
				if (err) throw err;
				else {
					req.session.id_user = rows.insertId;
					req.session.profil_pic = req.user._json.image_url;
					req.session.firstname = req.user._json.first_name;
					req.session.lastname = req.user._json.last_name;
					req.session.username = req.user._json.login;
					req.session.email = req.user._json.email;
					req.session.language = "eng";
					req.session.token = token;
					res.redirect('/profile2.html');
				}
			})
		}
	})
}
var github = function (req, res) {
	connection.query("SELECT * FROM users WHERE github_id = ? OR email = ?", [req.user._json.id, req.user._json.email], function (err, rows) {
		if (err) throw err;
		if (rows[0]) {
			connection.query("UPDATE users SET sessionID = ? WHERE id =?", [req.sessionID, rows[0].id], function (err) {
				if (err) throw err;
			})
			req.session.id_user = rows[0].id;
			req.session.profil_pic = rows[0].profil_pic;
			req.session.firstname = rows[0].firstname;
			req.session.lastname = rows[0].lastname;
			req.session.username = rows[0].username;
			req.session.email = rows[0].email;
			req.session.language = rows[0].language;
			req.session.token = rows[0].token;
			res.redirect('/profile2.html');
		}
		else {
			var token = uniqid();
			var first_name = req.user._json.name.split(" ")[0];
			var last_name = req.user._json.name.split(" ")[1];
			connection.query("INSERT INTO users(firstname, lastname, username, email,password, token, github_id, profil_pic, sessionID) VALUES (?,?,?,?,?,?,?,?,?)", [first_name, last_name, req.user._json.login, req.user._json.email, sha256(uniqid()), token, req.user._json.id, req.user._json.avatar_url, req.sessionID], function (err, rows) {
				if (err) throw err;
				else {
					req.session.id_user = rows.insertId;
					req.session.profil_pic = req.user._json.avatar_url;
					req.session.firstname = first_name;
					req.session.lastname = last_name;
					req.session.username = req.user._json.login;
					req.session.email = req.user._json.email;
					req.session.language = "eng";
					req.session.token = token;
					res.redirect('/profile2.html');
				}
			})
		}
	})
}
var google = function (req, res) {
	connection.query("SELECT * FROM users WHERE google_id = ? OR email = ?", [req.user._json.id, req.user._json.emails[0].value], function (err, rows) {
		if (err) throw err;
		if (rows[0]) {
			connection.query("UPDATE users SET sessionID = ? WHERE id =?", [req.sessionID, rows[0].id], function (err) {
				if (err) throw err;
			})
			req.session.id_user = rows[0].id;
			req.session.profil_pic = rows[0].profil_pic;
			req.session.firstname = rows[0].firstname;
			req.session.lastname = rows[0].lastname;
			req.session.username = rows[0].username;
			req.session.language = rows[0].language;
			req.session.email = rows[0].email;
			req.session.token = rows[0].token;
			res.redirect('/profile2.html');
		}
		else {
			var token = uniqid();
			if (!req.user._json.name.familyName) {
				req.user._json.name.familyName = "N/A";
			}
			if (!req.user._json.name.givenName) {
				req.user._json.name.givenName = "N/A";
			}
			connection.query("INSERT INTO users(firstname, lastname, username, email,password, token, google_id, profil_pic, sessionID, language) VALUES (?,?,?,?,?,?,?,?,?, ?)", [req.user._json.name.givenName, req.user._json.name.familyName, req.user._json.name.givenName + req.user._json.name.familyName, req.user._json.emails[0].value, sha256(uniqid()), token, req.user._json.id, req.user._json.image.url, req.sessionID, req.user._json.language], function (err, rows) {
				if (err) throw err;
				else {
					req.session.id_user = rows.insertId;
					req.session.profil_pic = req.user._json.image.url;
					req.session.firstname = req.user._json.name.givenName;
					req.session.lastname = req.user._json.name.familyName;
					req.session.username = req.user._json.name.givenName + req.user._json.name.familyName;
					req.session.email = req.user._json.emails.value;
					req.session.token = token;
					req.session.language = "eng";
					res.redirect('/profile2.html');
				}
			})
		}
	})
}
module.exports = {
	fb: fb
	, school: school
	, github: github
	, google: google
}