var torrentStream = require('torrent-stream');
var connection = require("../../config/db_config");
var fs = require('fs');
var path = '';
var max_byte = "";
var currentTorrent = '';
var urlencode = require("urlencode");


var watchmovie = function (req, res) {
    var engine = torrentStream(req.params.magnet, {
        connections: 1000, // Max amount of peers to be connected to. 
        uploads: 10, // Number of upload slots. 		
        tmp: 'public/movies/', // Root folder for the files storage. 
        // Defaults to '/tmp' or temp folder specific to your OS. 
        // Each torrent will be placed into a separate folder under /tmp/torrent-stream/{infoHash} 
        path: 'public/movies',
        trackers: [
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
            if (checker[checker.length - 1] === "mp4" || checker[checker.length - 1] === "mkv") {
                console.log(file.name + " Select");
                max_byte = file.length;
                console.log(max_byte);
                file.select();
                res.writeHead(200, {
                    'Content-Type': 'video/mp4'
                })
                currentTorrent = file.path;
                var stream = file.createReadStream();
                stream.pipe(res);

            } else if (checker[checker.lengt - 1] === "avi") {
                console.log("avi");
            } else {
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