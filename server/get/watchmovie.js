var torrentStream = require('torrent-stream');
var connection = require("../../config/db_config");
var fs = require('fs');
var path = '';
var max_byte = "";
var currentTorrent = '';
var promise = require("promise");
var watchmovie = function (req, res) {
	let engineGo = function () {
		return new Promise(function (resolve, reject) {
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
				engine.files.forEach(function (file) {
					console.log(file.name);
					var checker = file.name.split(".");
					if (checker[checker.length - 1] === "mp4" || checker[checker.length - 1] === "mkv" || checker[checker.length - 1] === "avi") {
						file.select();
						resolve(file);
						engine.on('download', function () {
							console.log((engine.swarm.downloaded / file.length) * 100 + "%")
						});
						engine.on('idle', function () {
							console.log(file.name + "is downloaded".green);
						})
					}
				});
			});
		});
	}
	engineGo().then(function (file) {
		var total = file.length;
		var checker = file.name.split('.');
		if (checker[checker.length - 1] === "mp4" || checker[checker.length - 1] === "mkv") {
			if (req.headers.range) {
				var range = req.headers.range;
				var parts = range.replace(/bytes=/, "").split("-");
				var partialstart = parts[0];
				var partialend = parts[1];
				var start = parseInt(partialstart, 10);
				var end = partialend ? parseInt(partialend, 10) : total - 1;
				var chunksize = (end - start) + 1;
				console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);
				res.writeHead(206, {
					"Content-Range": "bytes " + start + "-" + end + "/" + total
					, "Accept-Ranges": "bytes"
					, "Content-Length": chunksize
					, "Content-Type": "video/mp4"
				});
				file.createReadStream({
					start: start
					, end: end
				}).pipe(res);
			}
			else {
				console.log('ALL: ' + total);
				res.writeHead(200, {
					'Content-Length': total
					, 'Content-Type': 'video/mp4'
				});
				file.createReadStream({
					start: start
					, end: end
				}).pipe(res);
			}
		}
		else {
			console.log("avi");
			//FFMPEG CONVERT EN MP4 OU MKV 
		}
	}).catch(function (error) {
		console.log(error);
	});
}
module.exports = watchmovie;