var torrentStream = require('torrent-stream');
var connection = require("../../config/db_config");
var fs = require('fs');
var path = '';
var mime = require('mime');
var max_byte = "";
var moment = require("moment");
var currentTorrent = '';
var ffmpeg = require('fluent-ffmpeg');
var Transcoder = require("stream-transcoder");
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
				path: 'public/movies/'
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
			let lastSize = 0
			let start = new Date();
			engine.on('ready', function () {
				//console.log(engine);
				engine.files.forEach(function (file) {
					console.log(file.name);
					if (file.length < 100000000) {
						file.deselect();
						return;
					}
					const mimetype = mime.lookup(file.path);
					console.log(mimetype);
					var checker = file.name.split(".");
					if (checker[checker.length - 1] === "mp4" || checker[checker.length - 1] === "mkv" || checker[checker.length - 1] === "avi") {
						file.select();
						resolve(file);
						//						engine.on('torrent', function () {
						//						})
					}
					else {
						file.deselect();
						return;
					}
					engine.on('download', function (index) {
						if (index % 10 === 0) {
							var dataToFront = {};
							const percent = parseInt(engine.swarm.downloaded / file.length * 10000) / 100
							const eta = moment().to(moment(moment() + parseInt(((new Date() - start)) / ((engine.swarm.downloaded - lastSize)) * (file.length - engine.swarm.downloaded))))
							const speed = parseInt((engine.swarm.downloaded - lastSize) / (new Date() - start)) / 1000
								//console.log(`${file.name} [ ${req.params.quality} ]: ${percent} % | ETA: ${eta} | ${speed} Mo/s`)
							start = new Date()
							lastSize = engine.swarm.downloaded
							dataToFront.percent = percent
							dataToFront.eta = eta
							dataToFront.speed = speed
						}
					});
					engine.on('idle', function () {
						console.log(`${file.name} is downloaded`);
						//							engine.removeAllListeners();
						//							engine.destroy();
					})
				});
			});
		});
	}
	engineGo().then(function (file) {
		var total = file.length;
		var checker = file.name.split('.');
		if (checker[checker.length - 1] === "mp4" || checker[checker.length - 1] === "mkv") {
			const mimetype = mime.lookup(file.path);
			if (req.headers.range) {
				var range = req.headers.range;
				var parts = range.replace(/bytes=/, "").split("-");
				var partialstart = parts[0];
				var partialend = parts[1];
				var start = parseInt(partialstart, 10);
				var end = partialend ? parseInt(partialend, 10) : total - 1;
				var chunksize = (end - start) + 1;
				res.writeHead(206, {
					"Content-Range": "bytes " + start + "-" + end + "/" + total
					, "Accept-Ranges": "bytes"
					, "Content-Length": chunksize
					, "Content-Type": mimetype
				});
				file.createReadStream({
					start: start
					, end: end
				}).pipe(res);
			}
			else {
				res.writeHead(200, {
					'Content-Length': total
					, 'Content-Type': mimetype
				});
				file.createReadStream({
					start: start
					, end: end
				}).pipe(res);
			}
		}
		else {
			var new_path = file.path + '.mp4';
			if (req.headers.range) {
				var range = req.headers.range;
				var parts = range.replace(/bytes=/, "").split("-");
				var partialstart = parts[0];
				var partialend = parts[1];
				var start = parseInt(partialstart, 10);
				var end = partialend ? parseInt(partialend, 10) : total - 1;
				var chunksize = (end - start) + 1;
				res.writeHead(206, {
					"Content-Range": "bytes " + start + "-" + end + "/" + total
					, "Accept-Ranges": "bytes"
					, "Content-Length": chunksize
					, "Content-Type": 'video/mp4'
				});
				var downloader = file.createReadStream({
					start: start
					, end: end
				})
				const stream = fs.createReadStream("public/movies/" + file.path, {
					flags: 'r'
					, start: 0
					, end: file.length
				});
				var buffer;
				var test = new Transcoder(stream).videoCodec('h264').audioCodec('aac').format('mp4').stream() //.pipe(res);
				test.on('data', function (data) {
					//console.log(data);
					buffer = new Buffer(data).toString('hex');
					console.log(buffer);
				})
				test.on('end', () => {
					console.log("finish convert");
				})
			}
			else {
				res.writeHead(200, {
					'Content-Length': total
					, 'Content-Type': 'video/mp4'
				});
				var downloader = file.createReadStream({
					start: start
					, end: end
				})
			}
		}
	}).catch(function (error) {
		console.log(error);
	});
}
module.exports = watchmovie;
var opts = [
								'-i', 'pipe:0', //input stdin
								'pipe:1' //output stdout
							]