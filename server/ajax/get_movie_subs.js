const download = require('download');
var srt2vtt = require('srt-to-vtt')
var fs = require('fs')
const OS = require('../../medias/opensubtitles-api/index');
const OpenSubtitles = new OS('kw221292');
var index = 0;
var get_movie_sub = function (req, res) {
	if (req.query.season) {
		var opts = {
			sublanguageid: [req.session.language, 'ENG'].join()
			, limit: 10, // Can be an array.join, 'all', or be omitted. 
			imdbid: req.params.imdb_code
			, season: req.query.season
			, episode: req.query.episode
		}
		var path = req.params.imdb_code + req.query.season + req.query.episode;
	}
	else {
		var opts = {
			sublanguageid: [req.session.language, 'eng'].join()
			, limit: 10, // Can be an array.join, 'all', or be omitted. 
			imdbid: req.params.imdb_code
		}
		var path = req.params.imdb_code;
	}

	function run() {
		OpenSubtitles.search(opts).then(function (subtitles) {
			var index = 0;
			var parsed = [];
			var ajax_return = [];
			for (var lang in subtitles) {
				(function (lang) {
					for (var k in subtitles[lang]) {
						if (subtitles[lang][k].SumCD === "1") {
							parsed[index] = {
								language: subtitles[lang][k].langName
								, url: subtitles[lang][k].url
								, code: lang
								, imdb_code: req.params.imdb_code
							}
							index++;
							return;
						}
					}
				}(lang));
			}
			console.log(path);
			console.log(parsed);
			if (parsed.length > 0) {
				for (var k in parsed) {
					let splited = parsed[k].url.split("/");
					let file = splited[splited.length - 1];
					(function (k) {
						download(parsed[k].url, 'public/uploads/' + path +  parsed[k].language).then(function () {
							fs.createReadStream('public/uploads/' + path + parsed[k].language + '/' + file).pipe(srt2vtt()).pipe(fs.createWriteStream('public/uploads/' + path + parsed[k].language + '.vtt'));
							parsed[k].path = '/uploads/' + path + parsed[k].language + '.vtt';
							ajax_return.push(parsed[k]);
							if (!parsed[Number(k) + 1]) {
								console.log(ajax_return);
								res.send(ajax_return);
							}
						}).catch(function (err) {
							console.log(err);
						});
					}(k));
				}
			}
			else {
				res.send(ajax_return);
			}
		}).catch(err => {
			console.log("opensub error");
			console.log(err);
			console.log("_________________________________________________");
			run();
		});
	}
	run();
}
module.exports = get_movie_sub;