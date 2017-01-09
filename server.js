var https = require('https');
var fs = require('fs');
var mysql = require('mysql');
connection = mysql.createPool({
	connectionLimit: 100
	, port: 3307
	, host: 'localhost'
	, user: 'root'
	, password: 'root'
	, database: 'matcha'
	, charset: 'utf8mb4'
});
var sql = require('./medias/sql_functions');
var express = require('express');
var options = {
	key: fs.readFileSync('certificates/server.key')
	, cert: fs.readFileSync('certificates/server.crt')
	, ca: fs.readFileSync('certificates/server.csr')
, };
var bodyParser = require('body-parser');
var app = express();
var mustacheExpress = require('mustache-express');
var session = require('express-session');
var sess = {
	secret: 'keyboard cat'
	, cookie: {}
	, resave: false
	, saveUninitialized: false
}
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views/');
app.use(express.static('public'));
app.use(session(sess));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.get("/", function (req, res) {
	sql.select(connection, 'users', 1, function (err, data) {
		if (err) {
			// error handling code goes here
			console.log("ERROR : ", err);
		}
		else {
			var body = data;
			// code to execute on data retrieval
			res.status(200).send(body);
			//			res.status(200).send("result from db is : ", data);
		}
	});
})
var httpsServer = https.createServer(options, app, function (req, res) {
	res.writeHead(200);
})
httpsServer.listen(4422);