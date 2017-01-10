var https = require('https');
var fs = require('fs');
var connection = require('./config/db_config');
var bodyParser = require('body-parser');
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
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views/');
app.use(express.static('public'));
app.use(session(sess));
app.use(bodyParser.urlencoded({
	extended: true
}));
//================GET=======================
var index = require('./server/index');
create_account = require('./server/create_account');
home = require('./server/home');
//================POST======================
var signin = require("./server/signin");
addNewUser = require("./server/addNewUser");
//
// GET 
//
app.get("/", index);
app.get("/create_account.html", create_account);
app.get("/home.html", home);
//
// POST
//
app.post("/", signin);
app.post("/create_account.html", addNewUser);
//
// SERVER PORT
// 
var httpsServer = https.createServer(options, app, function (req, res) {
	res.writeHead(200);
});
httpsServer.listen(4422);
console.log("server listenning to port 4422");