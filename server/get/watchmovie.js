var torrentStream = require('torrent-stream');
var connection = require("../../config/db_config");
var fs = require('fs');
var path = '/goinfre/';
//var path = "public/movies/";
var mime = require('mime');
var max_byte = "";
var moment = require("moment");
var currentTorrent = '';
var Transcoder = require("stream-transcoder");
var promise = require("promise");
var urlencode = require('urlencode')
var watchmovie = function (req, res) {
    if (!req.session.username) {
        res.redirect("/");
    } else {
        connection.query("SELECT * FROM download where imdb_code = ?", [req.params.tvdb_id ? req.params.tvdb_id : req.params.imdb_code], function (err, rows) {
            if (err) console.log(err)
            else if (rows[0]) {
                var stats = fs.statSync(rows[0].path)
                var total = stats["size"];
                if (req.headers.range) {
                    var range = req.headers.range;
                    var parts = range.replace(/bytes=/, "").split("-");
                    var partialstart = parts[0];
                    var partialend = parts[1];
                    var start = parseInt(partialstart, 10);
                    var end = partialend ? parseInt(partialend, 10) : total - 1;
                    var chunksize = (end - start) + 1;
                    res.writeHead(206, {
                        "Content-Range": "bytes " + start + "-" + end + "/" + total,
                        "Accept-Ranges": "bytes",
                        "Content-Length": chunksize,
                        "Content-Type": rows[0].mimetype,
                        'Connection': 'keep-alive'
                    });
                    fs.createReadStream(rows[0].path, {
                        start: start,
                        end: end
                    }).pipe(res);
                } else {
                    res.writeHead(200, {
                        'Content-Length': total,
                        'Connection': 'keep-alive',
                        'Content-Type': rows[0].mimetype
                    });
                    fs.createReadStream(rows[0].path, {
                        start: start,
                        end: end
                    }).pipe(res);
                }
            } else {
                if (!req.params.tvdb_id) req.params.tvdb_id = 'movie';
                connection.query("select movies_torrents.magnet, movies_torrents.quality, movies.imdb_code, 'movie' as tvdb_id from movies_torrents join movies on movies.id= movies_torrents.id_film where movies_torrents.magnet= ? UNION ALL SELECT tv_shows_torrents.magnet, tv_shows_torrents.quality,  tv_shows.imdb_code , tv_shows_torrents.tvdb_id from tv_shows_torrents join tv_shows on tv_shows.id= tv_shows_torrents.id_tv_show where tv_shows_torrents.magnet= ?", [urlencode(req.params.magnet), urlencode(req.params.magnet)], function (err, rows) {
                    if (err) console.log(err);
                    else if (rows[0] && (rows[0].imdb_code === req.params.imdb_code && rows[0].quality === req.params.quality && rows[0].tvdb_id === req.params.tvdb_id)) {
                        let engineGo = function () {
                            return new Promise(function (resolve, reject) {
                                var engine = torrentStream(req.params.magnet, {
                                    connections: 1000, // Max amount of peers to be connected to. 
                                    uploads: 15, // Number of upload slots. 		
                                    tmp: path, // Root folder for the files storage. 
                                    // Defaults to '/tmp' or temp folder specific to your OS. 
                                    // Each torrent will be placed into a separate folder under /tmp/torrent-stream/{infoHash} 
                                    path: path,
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
                                let lastSize = 0
                                let start = new Date();
                                var dataResolve = {};
                                engine.on('ready', function () {
                                    engine.files.forEach(function (file) {
                                        if (file.length < 100000000) {
                                            file.deselect();
                                            return;
                                        }
                                        const mimetype = mime.lookup(file.path);
                                        var checker = mimetype.split("/")[0];
                                        if (checker === "video" && !file.isDownloading) {
                                            file.isDownloading = true;
                                            file.select();
                                            dataResolve.file = file;
                                            dataResolve.mimetype = mimetype;
                                            dataResolve.type = "torrent";
                                            resolve(dataResolve);
                                            console.log("Return dans le chcekcoeut ")
                                        }
                                        engine.once('idle', function () {
                                            resolve(dataResolve);
                                            if (mimetype === "video/x-matroska" || mimetype === "video/ogg" || mimetype === "video/mp4") {
                                                file.isDownloading = false;
                                                var date = Date.now();
                                                var code;
                                                if (req.params.tvdb_id === "movie") code = req.params.imdb_code;
                                                else code = req.params.tvdb_id;
                                                connection.query("INSERT INTO download (imdb_code, quality, path, date,  mimetype)SELECT * FROM (SELECT ?, ?, ?, ?, ?) AS tmp WHERE NOT EXISTS (SELECT imdb_code FROM download WHERE imdb_code = ?) LIMIT 1", [code, req.params.quality, path + file.path, date, mimetype, code], function (err) {
                                                    if (err) console.log(err);
                                                })
                                            }
                                            //engine.removeAllListeners();
                                            //engine.destroy();
                                            console.log(`${file.name} is downloaded`);
                                        })
                                    });
                                });
                            });
                        }
                        engineGo().then(function (dataResolve) {
                            var file = dataResolve.file;
                            var mimetype = dataResolve.mimetype;
                            var total = file.length;
                            if (mimetype === "video/x-matroska" || mimetype === "video/ogg" || mimetype === "video/mp4") {
                                if (req.headers.range) {
                                    var range = req.headers.range;
                                    var parts = range.replace(/bytes=/, "").split("-");
                                    var partialstart = parts[0];
                                    var partialend = parts[1];
                                    var start = parseInt(partialstart, 10);
                                    var end = partialend ? parseInt(partialend, 10) : total - 1;
                                    var chunksize = (end - start) + 1;
                                    res.writeHead(206, {
                                        "Content-Range": "bytes " + start + "-" + end + "/" + total,
                                        "Accept-Ranges": "bytes",
                                        "Content-Length": chunksize,
                                        "Content-Type": mimetype,
                                        'Connection': 'keep-alive'
                                    });
                                    console.log("pipe le mp4")
                                    file.createReadStream({
                                        start: start,
                                        end: end
                                    }).pipe(res);
                                } else {
                                    res.writeHead(200, {
                                        'Content-Length': total,
                                        'Content-Type': mimetype
                                    });
                                    file.createReadStream({
                                        start: start,
                                        end: end
                                    }).pipe(res);
                                }
                            } else {
                                res.writeHead(200, {
                                    'Content-Type': 'video/mp4',
                                    'Connection': 'keep-alive'
                                })
                                var new_path = path + file.path + '.mp4';
                                var downloader = file.createReadStream({
                                    start: 0,
                                    end: file.length
                                });
                                var fileConvertToMp4 = fs.createWriteStream(new_path)
                                var test = new Transcoder(downloader)
                                test.videoCodec('h264').audioCodec('aac').format('mp4');
                                test.stream().on('error', function (error) {
                                    console.log(error);
                                }).on('data', function (data) {
                                    fileConvertToMp4.write(data);
                                }).once('end', () => {
                                    console.log("finish convert");
                                    var date = Date.now();
                                    var code;
                                    if (req.params.tvdb_id === "movie") code = req.params.imdb_code;
                                    else code = req.params.tvdb_id;
                                    connection.query("INSERT INTO download (imdb_code, quality, path, date,  mimetype)SELECT * FROM (SELECT ?, ?, ?, ?, ?) AS tmp WHERE NOT EXISTS (SELECT imdb_code FROM download WHERE imdb_code = ?) LIMIT 1", [code, req.params.quality, new_path, date, "video/mp4", code], function (err) {
                                        if (err) console.log(err);
                                        fs.unlinkSync(path + file.path);
                                    })
                                }).pipe(res, {
                                    end: true
                                });
                            }
                        }).catch(function (error) {
                            console.log(error);
                        });
                    } else {
                        //404 not found
                        res.send("Error")
                    }
                })
            }
        })
    }
}
module.exports = watchmovie;