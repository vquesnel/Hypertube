var connection = require("../../config/db_config");
const download = require('download');
var srt2vtt = require('srt-to-vtt')
var fs = require('fs')
var mkdirp = require('mkdirp');
var uniqid = require('uniqid');
var Promise = require('promise');
const OS = require('opensubtitles-api');
const OpenSubtitles = new OS('kw221292');
var movie = function (req, res) {
    if (!req.session.username) {
        res.redirect('/');
    } else {

        function run() {
            OpenSubtitles.search({
                sublanguageid: ['fre', 'eng'].join(), // Can be an array.join, 'all', or be omitted. 
                imdbid: req.params.imdb_code, // 'tt528809' is fine too. 
            }).then(function (subtitles) {
                var index = 0;
                var parsed = [];
                for (var lang in subtitles) {
                    parsed[index] = {
                        language: subtitles[lang].langName,
                        url: subtitles[lang].url,
                        code: lang,
                        imdb_code: req.params.imdb_code
                    }
                    index++;
                }
                console.log(parsed);
                for (var k in parsed) {
                    download(parsed[k].url).pipe(srt2vtt()).pipe(fs.createWriteStream('public/uploads/' + req.params.imdb_code + parsed[k].language + '.vtt'));
                }
                connection.query("SELECT * FROM movies WHERE imdb_code = ?", [req.params.imdb_code], function (err, movie) {
                    if (err) throw err;
                    else {
                        connection.query("SELECT * FROM movies_torrents WHERE id_film = ? ORDER BY quality DESC", [movie[0].id], function (err, torrents) {
                            if (err) throw err;
                            else {
                                if (movie[0].actors !== "N/A") movie[0].actors = JSON.parse(movie[0].actors);
                                if (movie[0].genre !== "N/A") movie[0].genre = JSON.parse(movie[0].genre);
                                for (var k in torrents) torrents[k].imdb_code = movie[0].imdb_code;
                                res.render("movie", {
                                    torrent: '/watchmovie.html/' + movie[0].imdb_code + '/' + torrents[0].magnet + '/' + torrents[0].quality,
                                    track: {
                                        subs: parsed
                                    },
                                    display_one_movie: {
                                        infos: movie
                                    },
                                    userID: req.session.id_user,
                                    display_torrents: {
                                        data: torrents,
                                    }
                                });
                            }
                        })
                    }
                })
            }).catch(err => {
                console.log("opensub error");
                console.log(err);
                console.log("_________________________________________________");
                run();
            });
        }
        run();
    }
}

module.exports = movie;