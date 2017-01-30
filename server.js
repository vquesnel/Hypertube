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
    secret: 'keyboard cat',
    cookie: {},
    resave: false,
    saveUninitialized: false
}
var options = {
    key: fs.readFileSync('certificates/server.key'),
    cert: fs.readFileSync('certificates/server.crt'),
    ca: fs.readFileSync('certificates/server.csr'),
};

var socketsLauncher = require('./server/sockets');

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
movies = require('./server/get/movies');
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
wallpaper = require("./server/get/wallpaper");
username_checker = require("./server/get/username_checker");
email_checker = require("./server/get/email_checker");
handler = require("./server/get/handler");
tv_shows = require("./server/get/tv_shows")
    //================POST=======================\\
var signin = require("./server/post/signin");
addNewUser = require("./server/post/addNewUser");
reset_req = require("./server/post/reset_request");
reset_pw = require("./server/post/reset_password");
manage_profil = require("./server/post/manage_profil").manage_profil;
upload_picture = require("./server/post/manage_profil").upload_picture;
email_confirmation = require("./server/post/manage_profil").email_confirmation;
searchmovies = require("./server/post/searchmovies");
indicators = require("./server/ajax/indicators");
//			\\
// 	  GET 	\\
//			\\
app.get("/", index);
app.get("/create_account.html", create_account);
app.get("/profile.html", profile);
app.get("/movies.html/:itemsNum", movies);
app.get("/tv_shows.html/:itemsNum", tv_shows);
app.get('/home.html', function (req, res) {
    res.render('home.html');
})
app.get("/tv_shows.html", function (req, res) {
    res.render('tv_shows.html');
})
app.get("/movies.html", function (req, res) {
    res.render("movies.html");
})
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
app.get("/searchmovies", searchmovies);
app.get("/player.html", streamer);
app.get('/wallpaper/:imdbid', wallpaper);
app.get('/username_checker/:value', username_checker);
app.get('/email_checker/:value', email_checker);
app.get('handler/:context', handler);
app.get('/indicators/:imdbID', indicators);


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


////////||\\\\\\||
//				//
//	  Socket 	||
//				\\
////////||\\\\\\||



var io = require('socket.io').listen(httpsServer.listen(4422));
var cookieParser = require('cookie-parser');


io.on('connection', function (socket) {
    var cookies = cookieParser.signedCookies(cookie.parse(socket.handshake.headers.cookie), sess.secret);
    var sessionid = cookies['connect.sid'];
    connection.query("UPDATE users SET socket_id= ? WHERE sessionID = ?", [socket.id, sessionid], function (err) {
        if (err) throw err;
    });
    socket.on('check_message', function (imdbID) {
        var data = [];
        connection.query("SELECT comment.username,comment.imdb_id,comment.content,comment.date_message,users.username,users.profil_pic FROM comment LEFT JOIN users ON comment.username = users.id WHERE imdb_id = ? ORDER BY comment.id DESC", [imdbID], function (err, rows) {
            if (err) throw err;
            (function (callback) {
                for (i = 0; i < rows.length; i++) {
                    data.push(rows[i]);
                }
                callback(data);
            })(function (data) {
                socket.emit('old_message', data);
                console.log(data);
            })
        })
    });
    socket.on('new-message', function (data) {
        if (data.imdbID) {
            connection.query("INSERT INTO comment(username, imdb_id, content, date_message) VALUES(?,?,?,?)", [data.username, data.imdbID, data.value, data.date], function (err) {
                if (err) throw err;

            })
            connection.query("SELECT username, profil_pic FROM users WHERE id = ?", [data.username], function (err, user_pack) {
                if (err) throw err;
                else {
                    io.sockets.emit("new_message", {
                        value: data.value,
                        username: user_pack[0].username,
                        profil_pic: user_pack[0].profil_pic,
                        imdbID: data.imdbID,
                        date: data.date
                    });
                }
            })
        }

    })

})