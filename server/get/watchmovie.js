var torrentStream = require('torrent-stream');
var connection = require("../../config/db_config");
var fs = require('fs');
var path = '';
var max_byte = ""
var currentTorrent = '';
const download = require('download');
var srt2vtt = require('srt2vtt');
var mkdirp = require('mkdirp');
var uniqid = require('uniqid');
var path = 'public/uploads/';
var Promise = require('promise')
const OS = require('opensubtitles-api');
const OpenSubtitles = new OS('kw221292');
var getAllFilesFromFolder = function (dir) {
	var results = [];
	fs.readdirSync(dir).forEach(function (file) {
		file = dir + '/' + file;
		var stat = fs.statSync(file);
		if (stat && stat.isDirectory()) {
			results = results.concat(getAllFilesFromFolder(file))
		}
		else results.push(file);
	});
	return (results);
};
var prepareObject = function (object) {
	return new Promise(function (jobDone, jobFailure) {
		var parsed = [];
		var index = 0;
		for (var i in object) {
			parsed[index] = {
				language: object[i].langName
				, url: object[i].url
				, code: i
			}
			index++;
		}
		if (index = i) {
			jobDone(parsed);
		}
		else {
			jobFailure('JSON not Parsed');
		}
	});
}
var convertSubtitles = function (Object, imdbID) {
	return new Promise(function (allConverted, convertionFailure) {
		for (var z in Object) {
			var srtData = fs.readFileSync(Object[z].path);
			srt2vtt(srtData, function (err, vttData) {
				if (err) throw new Error(err);
				fs.writeFileSync(path + imdbID + '/' + Object[z].code + '/' + imdbID + '-' + Object[z].language + '.vtt', vttData);
			});
		}
		allConverted('Convertion Success');
	})
}
var prepareDirectories = function (object, imdbID) {
	return new Promise(function (dirOk, dirFailure) {
		var index = 0;
		for (var j in object) {
			mkdirp(path + imdbID + '/' + object[j].code, function (err) {
				if (err) {
					console.log(err);
				}
			})
			let urlSplit = object[j].url.split('/');
			let fileName = urlSplit[urlSplit.length - 1];
			object[j].path = path + imdbID + '/' + object[j].code + '/' + fileName;
		}
		if (index = j) {
			dirOk('All Directories Created');
		}
		else {
			dirFailure('Directories not Created');
		}
	});
}
var safeDownload = function (object, imdbID) {
	return new Promise(function (Downloaded, DownloadFailure) {
		var index = 0;
		for (var j in object) {
			download(object[j].url, path + imdbID + '/' + object[j].code + '/')
		}
		if (index = j) {
			Downloaded('All Files Downloaded');
		}
		else {
			DownloadFailure('Download Failure');
		}
	});
}
var getSub = function (req) {
	/*****************/
	/*--- PROMISE ---*/
	/*****************/
	let makeTheDir = new Promise(function (created, notCreated) {
		mkdirp(path + req.params.imdb_code, function (err) {
			if (err) {
				notCreated('"' + req.params.imdb_code + '" Diretory not created.');
			}
			else {
				created(path + req.params.imdb_code);
			}
		})
	})
	let getUrl = new Promise(function (object, notObject) {
			OpenSubtitles.search({
				imdbid: req.params.imdb_code
			}).then(function (subtitle) {
				object(subtitle);
			}).catch(function (empty) {
				notObject(empty);
			})
		})
		//    let getFileNames = new Promise(function (sources, sourcesFailure) {
		//        var dir = path + imdbID;
		//        var list = getAllFilesFromFolder(dir);
		//
		//        if (list.length > 0) {
		//            sources(list);
		//        } else {
		//            sourcesFailure('failure');
		//        }
		//    })
		/*****************/
		/*--- PROMISE ---*/
		/*****************/
	let preparator = function () {
		return new Promise(function (jobDone, jobFailure) {
			getUrl.then(function (OSJson) {
				makeTheDir.then(function (fromResolve) {
					prepareObject(OSJson).then(function (isOk) {
						prepareDirectories(isOk, req.params.imdb_code).then(function (dirCreated) {
							console.log(dirCreated);
							safeDownload(isOk, req.params.imdb_code).then(function (safedownloaded) {
								console.log(safedownloaded);
								jobDone(isOk);
							}).catch(function (safeDownloadFailure) {
								jobFailure('Not Safely Prepared');
							})
						}).catch(function (dirCreationFailure) {
							console.log(dirCreationFailure);
						})
					}).catch(function (isNotOk) {
						console.log(isNotOk);
					})
				}).catch(function (fromReject) {
					console.log(fromReject);
				})
			}).catch(function (emptyResponse) {
				console.log(emptyResponse);
			})
		})
	}
	preparator().then(function (prepared) {
		console.log('Files Prepared');
		//console.log(prepared);
		convertSubtitles(prepared, req.params.imdb_code).then(function (converted) {
			console.log(converted);
		}).catch(function (notConverted) {
			console.log(notConverted);
		})
	}).catch(function (notPrepared) {
		console.log(notPrepared);
	})
}
var watchmovie = function (req, res) {
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
			if (checker[checker.length - 1] === "mp4") {
				console.log(file.name + " Select");
				max_byte = file.length;
				file.select();
				res.writeHead(200, {
					'Content-Type': 'video/mp4'
				})
				currentTorrent = file.path;
				var stream = file.createReadStream();
				//getSub(req);
				stream.pipe(res);
			}
			else {
				file.deselect();
			}
		})
		engine.on('download', function () {
			console.log(engine.swarm.downloaded);
		});
		engine.on('idle', function () {
			console.log("done");
			//			engine.destroy();
		})
	});
}
module.exports = watchmovie;