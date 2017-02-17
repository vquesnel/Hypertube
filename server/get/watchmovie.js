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
			var dataResolve = {};
			engine.on('torrent', function (torrent) {
				console.log(torrent);
			})
			engine.on('ready', function () {
				//console.log(engine);
				engine.files.forEach(function (file) {
					if (file.length < 100000000) {
						file.deselect();
						return;
					}
					const mimetype = mime.lookup(file.path);
					var checker = mimetype.split("/")[0];
					if (checker === "video") {
						file.select();
						dataResolve.file = file;
						dataResolve.mimetype = mimetype;
						resolve(dataResolve);
					}
					else {
						file.deselect();
						return;
					}
					engine.on('download', function (index) {
						if (index % 30 === 0) {
							var dataToFront = {};
							const percent = parseInt(engine.swarm.downloaded / file.length * 10000) / 100
							const eta = moment().to(moment(moment() + parseInt(((new Date() - start)) / ((engine.swarm.downloaded - lastSize)) * (file.length - engine.swarm.downloaded))))
							const speed = parseInt((engine.swarm.downloaded - lastSize) / (new Date() - start)) / 1000
							console.log(`${file.name} [ ${req.params.quality} ]: ${percent} % | ETA: ${eta} | ${speed} Mo/s`)
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
	engineGo().then(function (dataResolve) {
		var file = dataResolve.file;
		var mimetype = dataResolve.mimetype;
		var total = file.length;
		console.log(mimetype);
		if (mimetype === "video/x-matroska" || mimetype === "video/ogg" || mimetype === "video/mp4") {
			console.log("video supported by html5 player");
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
			console.log("video not supported by html5 player ---> convert it ");
			var new_path = "public/movies/" + file.path + '.mp4';
			if (req.headers.range) {
				var range = req.headers.range;
				var parts = range.replace(/bytes=/, "").split("-");
				var partialstart = parts[0];
				var partialend = parts[1];
				var start = parseInt(partialstart, 10);
				var end = partialend ? parseInt(partialend, 10) : total - 1;
				var chunksize = (end - start) + 1;
				res.writeHead(206, {
					//                    "Content-Range": "bytes " + start + "-" + end + "/" + total,
					//                    "Accept-Ranges": "bytes",
					//                    "Content-Length": chunksize,
					"Content-Type": "video/mp4"
				});
				var downloader = file.createReadStream({
						start: start
						, end: end
					})
					//				var filetoread = fs.createReadStream("public/movies/" + file.path)
				var test = new Transcoder(downloader)
				test.videoCodec('h264').audioCodec('aac').format('mp4');
				test.stream().on('error', function (error) {
					console.log(error);
				}).on('end', () => {
					console.log("finish convert");
				}).on('data', function (data) {
					//	console.log(data);
				}).pipe(fs.createWriteStream(new_path));
				var readStream = fs.createReadStream(new_path);
				readStream.on("open", function () {
					readStream.pipe(res);
				});
				readStream.on('error', function (err) {
					console.log(err);
					res.end(err);
				});
				//				var test2 = new Transcoder(downloader)
				//				test2.videoCodec('h264').audioCodec('aac').format('mp4');
				//				var args = test2._compileArguments();
				//				console.log(args);
				//				args = ['-i', '-'].concat(args);
				//				args.push('pipe:1');
				//				console.log(args);
				//				test2.stream().pipe(res);
			}
			else {
				console.log("NO ------------------------->REQ.HEADERS");
				res.writeHead(200, {
					'Content-Length': total
					, 'Content-Type': 'video/mp4'
				});
				var downloader = file.createReadStream({
					start: start
					, end: end
				})
				var test = new Transcoder(downloader)
				test.videoCodec('h264').audioCodec('aac').format('mp4');
				test.stream().on('error', function (error) {
					console.log(error);
				}).on('data', function (data) {}).on('end', () => {
					console.log("finish convert");
				}).pipe(fs.createWriteStream(new_path))
			}
		}
	}).catch(function (error) {
		console.log(error);
	});
}
module.exports = watchmovie;