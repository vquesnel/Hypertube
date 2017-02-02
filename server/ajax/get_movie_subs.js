const download = require('download');
var srt2vtt = require('srt-to-vtt')
var fs = require('fs')
const OS = require('opensubtitles-api');
const OpenSubtitles = new OS('kw221292');
var index = 0;
var get_movie_sub = function (req, res) {
	function run() {
		OpenSubtitles.search({
			sublanguageid: ['fre', 'eng'].join(), // Can be an array.join, 'all', or be omitted. 
			imdbid: req.params.imdb_code, // 'tt528809' is fine too. 
		}).then(function (subtitles) {
			var index = 0;
			var parsed = [];
			var ajax_return = [];
			for (var lang in subtitles) {
				parsed[index] = {
					language: subtitles[lang].langName
					, url: subtitles[lang].url
					, code: lang
					, imdb_code: req.params.imdb_code
				}
				index++;
			}
			for (var k in parsed) {
				let splited = parsed[k].url.split("/");
				let file = splited[splited.length - 1];
				(function (k) {
					download(parsed[k].url, 'public/uploads/' + req.params.imdb_code + parsed[k].language).then(function () {
						fs.createReadStream('public/uploads/' + req.params.imdb_code + parsed[k].language + '/' + file).pipe(srt2vtt()).pipe(fs.createWriteStream('public/uploads/' + req.params.imdb_code + parsed[k].language + '.vtt'));
						parsed[k].path = '/uploads/' + req.params.imdb_code + parsed[k].language + '.vtt';
						ajax_return.push(parsed[k]);
						if (ajax_return[1]) res.send(ajax_return);
						k++;
					}).catch(function () {
						console.log("Coucou");
					});
				}(k));
				//				download(parsed[k].url).pipe(srt2vtt()).pipe(fs.createWriteStream('public/uploads/' + req.params.imdb_code + parsed[k].language + '.vtt'));
				//				parsed[k].path = '/uploads/' + req.params.imdb_code + parsed[k].language + '.vtt';
				//				ajax_return.push(parsed[k]);
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