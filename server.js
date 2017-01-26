var https = require('https');
var passport = require("./config/passport")
var fs = require('fs');
var connection = require('./config/db_config');
var bodyParser = require('body-parser');
var cookie = require('cookie')
var cookieParser = require('cookie-parser');
var express = require('express');
var app = express();
var mustacheExpress = require('mustache-express');
var session = require('express-session');
var sess = {
	secret: 'keyboard cat'
	, cookie: {}
	, resave: false
	, saveUninitialized: false
}
var options = {
	key: fs.readFileSync('certificates/server.key')
	, cert: fs.readFileSync('certificates/server.crt')
	, ca: fs.readFileSync('certificates/server.csr')
, };
app.use(passport.initialize());
app.use(passport.session());
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views/');
app.use(express.static('public'));
app.use(session(sess));
app.use(bodyParser.urlencoded({
	extended: true
}));
//================GET=======================\\
var index = require('./server/get/index');
create_account = require('./server/get/create_account');
profile = require('./server/get/profile');
home = require('./server/get/home');
logout = require('./server/get/logout');
reset_request = require('./server/get/reset_request');
reset_password = require("./server/get/reset_password");
reset_password2 = require("./server/get/reset_password2");
passportfb = require("./server/get/passport").fb;
passportschool = require("./server/get/passport").school;
passportgithub = require("./server/get/passport").github;
passportgoogle = require("./server/get/passport").google;
movie = require("./server/get/movie");
watchmovie = require("./server/get/watchmovie");
streamer = require("./server/get/streamer");
tvShows = require("./server/get/tvShows");
//================POST=======================\\
var signin = require("./server/post/signin");
addNewUser = require("./server/post/addNewUser");
reset_req = require("./server/post/reset_request");
reset_pw = require("./server/post/reset_password");
manage_profil = require("./server/post/manage_profil").manage_profil;
upload_picture = require("./server/post/manage_profil").upload_picture;
email_confirmation = require("./server/post/manage_profil").email_confirmation;
searchmovies = require("./server/post/searchmovies");
//			\\
// 	  GET 	\\
//			\\
//connection.query("SELECT COUNT(*) AS NBR_DOUBLES, id_film FROM movies_torrents GROUP  BY magnet HAVING COUNT(*) > 1", function (err, rows) {
//	console.log(rows);
//})
//connection.query("SELECT COUNT(*) AS NBR_DOUBLES, id FROM movies GROUP  BY year HAVING COUNT(*) > 1", function (err, rows) {
//	console.log(rows);
//})
app.get("/", index);
app.get("/create_account.html", create_account);
app.get("/profile.html", profile);
app.get("/home.html", home);
app.get("/tvShows.html", tvShows);
app.get("/movie.html/:imdb_code", movie);
app.get("/watchmovie.html/:imdb_code/:magnet/:quality", watchmovie);
app.get("/logout.html", logout);
app.get("/reset_request.html", reset_request);
app.get("/reset_password.html/:token/:id", reset_password);
app.get("/reset_password.html", reset_password2);
app.get('/login/facebook', passport.authenticate('facebook', {
	scope: ['email']
}));
app.get('/login/facebook/return', passport.authenticate('facebook', {
	failureRedirect: '/'
}), passportfb);
app.get('/login/42/', passport.authenticate('42'));
app.get('/login/42/return', passport.authenticate('42', {
	failureRedirect: '/'
}), passportschool);
app.get('/login/github/', passport.authenticate('github'));
app.get('/login/github/return', passport.authenticate('github', {
	failureRedirect: '/'
}), passportgithub);
app.get('/login/google', passport.authenticate('google', {
	scope: ['https://www.googleapis.com/auth/plus.login'
      , 'https://www.googleapis.com/auth/plus.profile.emails.read']
}));
app.get('/login/google/return', passport.authenticate('google', {
	failureRedirect: '/'
}), passportgoogle);
app.get("/search.html", function (req, res) {
	res.render('search.html');
});
app.get("/autoload/:limit", function (req, res) {
	//	connection.query("SELECT * FROM movies", [req.params.limit], function (err, rows) {
	//		if (err) throw err;
	//		res.send(rows);
	//	})
})
app.get("/searchmovies", searchmovies);
app.get("/player.html", streamer);
//			\\
// 	 POST	\\
//			\\
app.post("/", signin);
app.post("/create_account.html", addNewUser);
app.post("/reset_request.html", reset_req);
app.post("/reset_password.html", reset_pw);
app.post("/profile.html", manage_profil);
app.post("/email_confirmation", email_confirmation);
app.post("/upload", upload_picture);
//				\\
//  SERVER PORT	\\
// 				\\
var httpsServer = https.createServer(options, app, function (req, res) {
	res.writeHead(200);
});
httpsServer.listen(4422);
console.log("server listenning to port 4422");
//				\\
//		Socket	\\
//				\\
var io = require('socket.io').listen(httpsServer.listen(4422));
io.on('connection', function (socket) {
	var cookies = cookieParser.signedCookies(cookie.parse(socket.handshake.headers.cookie), sess.secret);
	var sessionid = cookies['connect.sid'];
	connection.query("UPDATE users SET socket_id= ? WHERE sessionID = ?", [socket.id, sessionid], function (err) {
		if (err) throw err;
	});
});