const download = require('download');
var srt2vtt = require('srt-to-vtt')
var fs = require('fs')
const OS = require('../../medias/opensubtitles-api/index');
const OpenSubtitles = new OS('kw221292');
var index = 0;
var get_movie_sub = function (req, res) {
	if (!req.session.username) {
		res.send("/");
	}
	else {
		if (req.query.season && req.query.episode) {
			var opts = {
				sublanguageid: [req.session.language, 'ENg'].join()
				, limit: 10, // Can be an array.join, 'all', or be omitted. 
				imdbid: req.params.imdb_code
				, season: req.query.season
				, episode: req.query.episode
			}
			var path = req.params.imdb_code + '-S' + req.query.season + '-E' + req.query.episode;
		}
		else {
			var opts = {
				sublanguageid: [req.session.language, 'eng'].join()
				, limit: 10, // Can be an array.join, 'all', or be omitted. 
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
								}
								else {
									bestSubs[lang] = subtitles[lang][k];
								}
							}
						}
					}(lang));
				}
				for (var j in bestSubs) {
					parsed[index] = {
						language: bestSubs[j].langName
						, url: bestSubs[j].url
						, code: j
						, imdb_code: req.params.imdb_code
					}
					index++;
				}
				var itemsProcessed = parsed.length;
				if (itemsProcessed) {
					parsed.forEach(function (sub) {
						if (!fs.existsSync('public/uploads/' + path + "-" + sub.language + '.vtt')) {
							let splited = sub.url.split("/");
							let file = splited[splited.length - 1];
							download(sub.url, 'public/uploads/').then(function () {
								fs.createReadStream('public/uploads/' + file).pipe(srt2vtt()).pipe(fs.createWriteStream('public/uploads/' + path + "-" + sub.language + '.vtt').on("finish", function () {
									itemsProcessed--;
									fs.unlinkSync('public/uploads/' + file);
									sub.path = '/uploads/' + path + "-" + sub.language + '.vtt';
									ajax_return.push(sub);
									if (itemsProcessed === 0) {
										res.send(ajax_return);
									}
								}));
							}).catch(function (err) {
								console.log(err);
							});
						}
						else {
							itemsProcessed--;
							sub.path = '/uploads/' + path + "-" + sub.language + '.vtt';
							ajax_return.push(sub);
							if (itemsProcessed === 0) {
								res.send(ajax_return);
							}
						}
					})
				}
				else {
					//return 404 not found
					res.send("error")
				}
			}).catch(err => {
				if (count < 10) {
					run();
				}
				else res.send(ajax_return);
			});
		}
		run();
	}
}
module.exports = get_movie_sub;