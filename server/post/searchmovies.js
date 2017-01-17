var yts = require('yts');
var piratebay = require('thepiratebay');
var Client = require('node-torrent');
var client = new Client({
	logLevel: 'DEBUG'
});
var searchmovies = function (req, res) {
	yts.movieSuggestions({
		movie_id: '10'
	}, function (err, json) {
		if (json.data.movies) {
			json.data.movies.forEach(function (movie) {
				console.log("WEEEEEEEEEEESH");
				console.log(movie);
				var torrent = client.addTorrent(movie.torrents[0].url);
				torrent.on('complete', function () {
					console.log('complete!');
					torrent.files.forEach(function (file) {
						var newPath = 'public/movies/' + file.path;
						fs.rename(file.path, newPath);
						//while still seeding need to make sure file.path points to the right place
						file.path = newPath;
					});
				});
			});
		}
		else {
			console.log(json.data.movie);
		}
	});
	//	piratebay.search('Game of Thrones', {
	//			category: 'video', // default - 'all' | 'all', 'audio', 'video', 'xxx','applications	, 'games', 'other'
	// You can also use the category number:
	//	 `/search/0/99/{category_number}`
	//			orderBy: 'seeds', // default - name, date, size, seeds, leeches
	//			sortBy: 'desc' // default - desc, asc
	//		}).then(function (result) {
	//			console.log(result);
	//		}).catch(function (err) {
	//			console.log(err);
	//		})
	//	piratebay.topTorrents('200').then(function (result) {
	//		var torrent = client.addTorrent(result[0].);
	//		torrent.on('complete', function (result) {
	//			console.log('complete!');
	//			torrent.files.forEach(function (result[k].) {
	//				var newPath = '/new/path/' + file.path;
	//				fs.rename(file.path, newPath);
	// while still seeding need to make sure file.path points to the right place
	//				file.path = newPath;
	//			});
	//});
	//	}).catch(function (err) {
	//		console.log(err);
	///	})
}
module.exports = searchmovies;