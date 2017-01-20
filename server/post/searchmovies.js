var yts = require('../../medias/yts');
var urlencode = require('urlencode');
var fs = require('fs');
var torrentStream = require('torrent-stream');
var searchmovies = function (req, res) {
	(function (callback) {
		yts.listMovies({
			query_term: 'tt2488496'
		}, function (err, json) {
			if (json.data.movies) {
				json.data.movies.forEach(function (movie) {
					if (movie.torrents) {
						let urlencoded = urlencode(movie.title_long + " [" + movie.torrents[0].quality + "] [YTS.AG]");
						var magnet = 'magnet:?xt=urn:btih:' + movie.torrents[0].hash + '& dn =' + urlencoded;
						callback(magnet);
					}
				});
			}
		});
	})(function (magnet) {
		var engine = torrentStream('magnet:?xt=urn:btih:6BA528A60AB22E9F037611693356211BB9AA76E8& dn=Jack%20Reacher%3A%20Never%20Go%20Back%20(2016)%20%5B720p%5D%20%5BYTS.AG%5D', {
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
					var path = engine.files[k].path.split(engine.files[k].name)[0];
					res.writeHead(200, {
						'Content-Type': 'video/mp4'
					});
					var stream = engine.files[k].createReadStream();
					stream.pipe(res);
				}
			}
		});
	});
}
module.exports = searchmovies;