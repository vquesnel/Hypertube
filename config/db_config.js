var yts = require('../medias/yts');
var eztv = require('../medias/eztv');
var imdb = require("imdb-api")
var omdb = require('omdb');
var urlencode = require('urlencode');
var launch = function (connection, callback) {
	connection.query("CREATE DATABASE IF NOT EXISTS hypertube CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin;");
	connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`users` ( `id` INT(5) NOT NULL AUTO_INCREMENT , `firstname` VARCHAR(255) NOT NULL , `lastname` VARCHAR(255) NOT NULL , `username` VARCHAR(255) NOT NULL, `email` VARCHAR(255) NOT NULL , `password` VARCHAR(255) NOT NULL, `token` VARCHAR(255) NOT NULL ,`profil_pic` LONGTEXT DEFAULT NULL, `language` VARCHAR(255) NOT NULL DEFAULT 'EN', `fb_id` VARCHAR(255) DEFAULT NULL,`42_id` VARCHAR(255) DEFAULT NULL,`github_id` VARCHAR(255) DEFAULT NULL, `google_id` VARCHAR(255) DEFAULT NULL, `sessionID` VARCHAR(255) DEFAULT NULL, `socket_id` VARCHAR(255) DEFAULT NULL, PRIMARY KEY (`id`)) ENGINE = InnoDB CHARSET=utf8mb4  COLLATE utf8mb4_bin;");
	connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`history` ( `id_film` INT(5) NOT NULL , `last_watch` DATE NOT NULL) ENGINE = InnoDB CHARSET=utf8mb4 COLLATE utf8mb4_bin;");
	connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`comment` ( `id_film` INT(5) NOT NULL , `id_users` INT(5) NOT NULL , `content` LONGTEXT NOT NULL, `when` DATE NOT NULL) ENGINE = InnoDB CHARSET=utf8mb4 COLLATE utf8mb4_bin;");
	connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`subtitles` ( `id_film` INT(5) NOT NULL , `language` VARCHAR(255) NOT NULL, `path` VARCHAR(255) NOT NULL ) ENGINE = InnoDB CHARSET=utf8mb4 COLLATE utf8mb4_bin;");
	connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`movies` ( `id` INT(5) NOT NULL AUTO_INCREMENT , `title` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `cover` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `year` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `rating` DECIMAL(2,1) NULL DEFAULT NULL , `imdb_code` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `runtime` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `genre` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `summary` TEXT NOT NULL,background_img VARCHAR(600) NOT NULL DEFAULT 'N/A',  PRIMARY KEY (`id`)) ENGINE = InnoDB  CHARSET=utf8mb4 COLLATE utf8mb4_bin;");
	connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`tv_shows` ( `id` INT(5) NOT NULL AUTO_INCREMENT , `title` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `season` VARCHAR(5) NOT NULL DEFAULT 'N/A' , `genres` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `director` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `writors` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `actors` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `summary` TEXT NOT NULL , `cover` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `imdb_code` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `rating` DECIMAL(2,1) NOT NULL , `start` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `end` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `eztv_id` INT(5) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;");
	connection.query("CREATE TABLE  IF NOT EXISTS `hypertube`.`tv_shows_torrents` ( `id` INT(5) NOT NULL AUTO_INCREMENT , `id_tv_show` INT(5) NOT NULL , `quality` VARCHAR(255)  NULL DEFAULT NULL , `magnet` VARCHAR(400) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;");
	connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`movies_torrents` ( `id` INT(5) NOT NULL AUTO_INCREMENT, `id_film` INT(5) NOT NULL , `quality` VARCHAR(255) NULL DEFAULT NULL , `magnet` VARCHAR(400) NULL DEFAULT NULL , `size_bytes` INT(10) NULL DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE = InnoDB CHARSET=utf8mb4 COLLATE utf8mb4_bin;", function (err) {
		if (err) throw err;
		else callback();
	})
}
var mysql = require('mysql');
var connection = mysql.createConnection({
	port: 3307
	, host: 'localhost'
	, user: 'root'
	, password: 'root'
});
connection.connect(function (err) {
	if (err) throw err;
});
launch(connection, function () {
	for (var page = 0; page < 121; page++) {
		yts.listMovies({
			limit: 50
			, page: page
			, sort_by: 'seeds'
		}, function (err, json) {
			json.data.movies.forEach(function (movie) {
				var genre = '';
				if (movie.genres) {
					for (var k in movie.genres) {
						genre += " " + movie.genres[k];
					}
				}
				connection.query("SELECT COUNT(*) as verif FROM `hypertube`.`movies` WHERE imdb_code = ?", [movie.imdb_code], function (err, result) {
					if (err) throw err;
					else if (!result[0].verif) {
						connection.query("INSERT INTO `hypertube`.`movies`(title, cover, year, rating, imdb_code, runtime, genre, summary) VALUES(?,? ,?,?,?,?,?,?)", [movie.title, movie.medium_cover_image, movie.year, movie.rating, movie.imdb_code, movie.runtime, genre, movie.description_full], function (err, firstQuery) {
							if (err) throw err;
							if (movie.torrents) {
								for (var k in movie.torrents) {
									var urlencoded = urlencode(movie.title_long + " [" + movie.torrents[k].quality + "] [YTS.AG]");
									connection.query("INSERT INTO `hypertube`.`movies_torrents`(id_film, quality, magnet, size_bytes) VALUES(?,?,?, ?)", [firstQuery.insertId, movie.torrents[k].quality, urlencode('magnet:?xt=urn:btih:' + movie.torrents[k].hash + '& dn=' + urlencoded), movie.torrents[k].size_bytes]);
								}
							}
						})
					}
				});
			});
		});
	}
	eztv.getShows({}, function (error, results) {
		results.forEach(function (element) {
			omdb.search({
				terms: element.title
				, type: "series"
			}, function (err, movies) {
				if (err) {}
				if (!movies) {
					//console.log('No movies were found!');
				}
				else {
					console.log(movies);
					connection.query("SELECT COUNT(*) as verif FROM `hypertube`.`tv_shows` WHERE imdb_code = ?", [movies.imdb.id], function (err, result) {
						if (err) throw err;
						else if (!result[0].verif) {
							var genre = '';
							if (movies.genres) {
								for (var k in movies.genres) {
									genre += " " + movies.genres[k];
								}
							}
							var actors = '';
							if (movies.actors) {
								for (var k in movies.actors) {
									actors += " " + movies.actors[k];
								}
							}
							if (movies.imdb.rating === 'N/A') movies.imdb.rating = null;
							connection.query("INSERT INTO `hypertube`.`tv_shows`(title, season, genres, director, actors, summary, cover, imdb_code, rating, start, end, eztv_id) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)", [movies.title, movies.season, genre, movies.director, actors, movies.plot, movies.poster, movies.imdb.id, movies.imdb.rating ? movies.imdb.rating : null, movies.year.from ? movies.year.from : movies.year, movies.year.to ? movies.year.to : null, element.id], function (err, rows) {
								if (err) throw err;
							})
						}
					});
				}
			});
		});
	});
	omdb.search({
		terms: "Breaking Bad"
			//, type: "episode"
	}, function (err, movi) {
		if (err) {
			return console.error(err);
		}
		if (movi.length < 1) {
			return console.log('No movies were found!');
		}
		movi.forEach(function (movie) {
			console.log(movie);
		});
	})
});
connection = mysql.createPool({
	connectionLimit: 100
	, port: 3307
	, host: 'localhost'
	, user: 'root'
	, password: 'root'
	, database: 'hypertube'
	, charset: 'utf8mb4'
});
module.exports = connection