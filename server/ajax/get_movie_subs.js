const download = require('download');
var srt2vtt = require('srt-to-vtt')
var fs = require('fs')
const OS = require('../../medias/opensubtitles-api/index');
const OpenSubtitles = new OS('kw221292');
var index = 0;
var get_movie_sub = function (req, res) {
	function run() {
		OpenSubtitles.search({
			sublanguageid: ['fre', 'eng'].join()
			, limit: 10, // Can be an array.join, 'all', or be omitted. 
			imdbid: req.params.imdb_code, // 'tt528809' is fine too. 
		}).then(function (subtitles) {
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
			console.log(parsed);
			if (parsed.length > 0) {
				console.log("OTOTOT");
				for (var k in parsed) {
					let splited = parsed[k].url.split("/");
					let file = splited[splited.length - 1];
					(function (k) {
						download(parsed[k].url, 'public/uploads/' + req.params.imdb_code + parsed[k].language).then(function () {
							fs.createReadStream('public/uploads/' + req.params.imdb_code + parsed[k].language + '/' + file).pipe(srt2vtt()).pipe(fs.createWriteStream('public/uploads/' + req.params.imdb_code + parsed[k].language + '.vtt'));
							parsed[k].path = '/uploads/' + req.params.imdb_code + parsed[k].language + '.vtt';
							ajax_return.push(parsed[k]);
							if (!parsed[Number(k) + 1]) {
								console.log(ajax_return);
								res.send(ajax_return);
							}
						}).catch(function () {});
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