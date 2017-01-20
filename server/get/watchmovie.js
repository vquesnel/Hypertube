var torrentStream = require('torrent-stream');
var connection = require("../../config/db_config");
var fs = require('fs');
var path = '';
var currentTorrent = '';
var watchmovie = function (req, res) {
	connection.query("SELECT * FROM movies WHERE imdbid = ? AND quality = ?", [req.params.imdb_code, req.params.quality], function (err, rows) {
		if (err) throw err;
		if (!rows[0]) {
			var engine = torrentStream(req.params.magnet, {
				connections: 1000, // Max amount of peers to be connected to. 
				uploads: 10, // Number of upload slots. 
				tmp: 'public/movies/', // Root folder for the files storage. 
				// Defaults to '/tmp' or temp folder specific to your OS. 
				// Each torrent will be placed into a separate folder under /tmp/torrent-stream/{infoHash} 
				path: 'public/movies'
				, trackers: [
				'udp://glotorrents.pw:6969/announce'
, 'udp://tracker.opentrackr.org:1337/announce'
, 'udp://torrent.gresille.org:80/announce'
, 'udp://tracker.openbittorrent.com:80'
, 'udp://tracker.coppersurfer.tk:6969'
, 'udp://tracker.leechers-paradise.org:6969'
, 'udp://p4p.arenabg.ch:1337'
, 'udp://tracker.internetwarriors.net:1337'
			]
			});
			engine.on('ready', function () {
				for (var k in engine.files) {
					let checker = engine.files[k].name.split(".");
					let verif = checker[checker.length - 1];
					if (verif === "mp4" || verif === "avi") {
						currentTorrent = engine.files[k].name;
						path = engine.files[k].path.split(engine.files[k].name)[0];
						res.writeHead(200, {
							'Content-Type': 'video/mp4'
						});
						res.render("player.html", {
							path: engine.files[k].path
						})
					}
				}
			});
			engine.on('torrent', function () {
				console.log('meta');
			})
			engine.on('idle', function () {
				console.log("done");
				console.log(req.params);
				console.log(path);
				connection.query("INSERT INTO movies (path, imdbid, quality) VALUES(?,?,?)", [path + currentTorrent, req.params.imdb_code, req.params.quality], function (err) {
					if (err) throw err;
				})
			})
		}
		else {
			res.render("player.html", {
				path: rows[0].path
			})
		}
	})
}
module.exports = watchmovie;