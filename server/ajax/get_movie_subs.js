const download = require('download');
var srt2vtt = require('srt-to-vtt')
var fs = require('fs')
const OS = require('../../medias/opensubtitles-api/index');
const OpenSubtitles = new OS('kw221292');
var index = 0;
var get_movie_sub = function (req, res) {
    if (req.query.season) {
        var opts = {
            sublanguageid: [req.session.language, 'ENg'].join(),
            limit: 10, // Can be an array.join, 'all', or be omitted. 
            imdbid: req.params.imdb_code,
            season: req.query.season,
            episode: req.query.episode
        }
        var path = req.params.imdb_code + req.query.season + req.query.episode;
    } else {
        var opts = {
            sublanguageid: [req.session.language, 'eng'].join(),
            limit: 10, // Can be an array.join, 'all', or be omitted. 
            imdbid: req.params.imdb_code
        }
        var path = req.params.imdb_code;
    }
    var count = 0;

    function run() {
        ++count;
        var ajax_return = [];

        OpenSubtitles.search(opts).then(function (subtitles) {
            var index = 0;
            var parsed = [];
            var bestSubs = {};
            for (var lang in subtitles) {
                (function (lang) {
                    for (var k in subtitles[lang]) {

                        if (subtitles[lang][k].SumCD === "1") {
                            if (bestSubs[lang] && bestSubs[lang].score < subtitles[lang][k].score) {
                                bestSubs[lang] = subtitles[lang][k]
                            } else {
                                bestSubs[lang] = subtitles[lang][k];
                            }
                        }
                    }
                }(lang));
            }
            for (var j in bestSubs) {
                parsed[index] = {
                    language: bestSubs[j].langName,
                    url: bestSubs[j].url,
                    code: lang,
                    imdb_code: req.params.imdb_code
                }
                index++;
            }


            console.log(parsed);
            if (parsed.length > 0) {
                for (var k in parsed) {
                    let splited = parsed[k].url.split("/");
                    let file = splited[splited.length - 1];
                    (function (k, callback) {
                        download(parsed[k].url, 'public/uploads/' + path + parsed[k].language).then(function () {
                            fs.createReadStream('public/uploads/' + path + parsed[k].language + '/' + file).pipe(srt2vtt()).pipe(fs.createWriteStream('public/uploads/' + path + parsed[k].language + '.vtt').on("finish", function () {
                                parsed[k].path = '/uploads/' + path + parsed[k].language + '.vtt';
                                ajax_return.push(parsed[k]);
                            }));

                            if (!parsed[Number(k) + 1]) {
                                callback(ajax_return);
                            }
                        }).catch(function (err) {
                            console.log(err);
                        });

                    }(k, function (result) {
                        console.log(result)
                        res.send(result);
                    }));



                }
            } else {
                res.send(ajax_return);
            }
        }).catch(err => {
            console.log("opensub error");
            console.log(err);
            console.log("_________________________________________________");
            if (count < 10) {
                run();
            } else res.send(ajax_return);
        });
    }
    run();
}
module.exports = get_movie_sub;