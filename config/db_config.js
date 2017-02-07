var yts = require('../medias/yts');
var eztv = require('../medias/eztv');
var eztvml = require("../medias/eztvml");
//var imdb = require('node-movie')
var urlencode = require('urlencode');
var launch = function (connection, callback) {
	connection.query("CREATE DATABASE IF NOT EXISTS hypertube CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin;");
	connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`users` ( `id` INT(5) NOT NULL AUTO_INCREMENT , `firstname` VARCHAR(255) NOT NULL , `lastname` VARCHAR(255) NOT NULL , `username` VARCHAR(255) NOT NULL, `email` VARCHAR(255) NOT NULL , `password` VARCHAR(255) NOT NULL, `token` VARCHAR(255) NOT NULL ,`profil_pic` LONGTEXT DEFAULT NULL, `language` VARCHAR(255) NOT NULL DEFAULT 'EN', `fb_id` VARCHAR(255) DEFAULT NULL,`42_id` VARCHAR(255) DEFAULT NULL,`github_id` VARCHAR(255) DEFAULT NULL, `google_id` VARCHAR(255) DEFAULT NULL, `sessionID` VARCHAR(255) DEFAULT NULL, `socket_id` VARCHAR(255) DEFAULT NULL, PRIMARY KEY (`id`)) ENGINE = InnoDB CHARSET=utf8mb4  COLLATE utf8mb4_bin;");
	connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`history` ( `id_film` INT(5) NOT NULL , `last_watch` DATE NOT NULL) ENGINE = InnoDB CHARSET=utf8mb4 COLLATE utf8mb4_bin;");
	connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`comment` ( `id` INT(5) NOT NULL AUTO_INCREMENT , `username` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL , `imdb_id` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL , `content` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL , `date_message` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;");
	connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`subtitles` ( `id_film` INT(5) NOT NULL , `language` VARCHAR(255) NOT NULL, `path` VARCHAR(255) NOT NULL ) ENGINE = InnoDB CHARSET=utf8mb4 COLLATE utf8mb4_bin;");
	connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`movies` ( `id` INT(5) NOT NULL AUTO_INCREMENT , `title` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `director` TEXT NOT NULL, `writers` TEXT NOT NULL ,  `actors` TEXT NOT NULL , `cover` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `year` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `rating` DECIMAL(2,1) NULL DEFAULT NULL , `imdb_code` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `runtime` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `genre` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `summary` TEXT NOT NULL,background_img VARCHAR(600) NOT NULL DEFAULT 'N/A',  PRIMARY KEY (`id`)) ENGINE = InnoDB  CHARSET=utf8mb4 COLLATE utf8mb4_bin;");
	connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`tv_shows` ( `id` INT(5) NOT NULL AUTO_INCREMENT , `title` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `season` VARCHAR(5) NOT NULL DEFAULT 'N/A' , `genre` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `director` TEXT NOT NULL, `writers` TEXT NOT NULL, `actors` TEXT NOT NULL,`runtime` VARCHAR(255) NOT NULL DEFAULT 'N/A' ,  `summary` TEXT NOT NULL , `cover` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `imdb_code` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `rating` DECIMAL(2,1) DEFAULT NULL , `year` VARCHAR(255) NOT NULL DEFAULT 'N/A', PRIMARY KEY (`id`)) ENGINE = InnoDB;");
	connection.query("CREATE TABLE  IF NOT EXISTS `hypertube`.`tv_shows_torrents` ( `id` INT(5) NOT NULL AUTO_INCREMENT , `id_tv_show` INT(5) NOT NULL , `season` INT(2) NULL DEFAULT NULL , `episode` INT(2) NULL DEFAULT NULL ,`quality` VARCHAR(255)  NULL DEFAULT NULL , `magnet` TEXT NOT NULL, `tvdb_id` VARCHAR(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE = InnoDB;");
	connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`movies_torrents` ( `id` INT(5) NOT NULL AUTO_INCREMENT, `id_film` INT(5) NOT NULL , `quality` VARCHAR(255) NULL DEFAULT NULL , `magnet` TEXT NOT NULL , `size_bytes` INT(10) NULL DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE = InnoDB CHARSET=utf8mb4 COLLATE utf8mb4_bin;", function (err) {
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
var verif = function (imdb_code, callback) {
	connection.query("SELECT COUNT(*) as verif FROM `hypertube`.`movies` WHERE imdb_code = ?", [imdb_code], function (err, result) {
		if (err) throw err;
		callback(result[0]);
	});
}
var verifTV = function (imdb_code, callback) {
	connection.query("SELECT COUNT(*) as verif FROM `hypertube`.`tv_shows` WHERE imdb_code = ?", [imdb_code], function (err, result) {
		if (err) throw err;
		callback(result[0]);
	});
}
launch(connection, function () {
	for (var page = 1; page < 121; page++) {
		yts.listMovies({
			limit: 50
			, page: page
		}, function (err, json) {
			if (err) {
				console.log("error yts");
			}
			else {
				json.data.movies.forEach(function (movie) {
					verif(movie.imdb_code, function (result) {
						if (!result.verif) {
							var director = 'N/A';
							var writers = 'N/A';
							var actors = 'N/A';
							var genre = 'N/A';
							if (movie.genres) {
								genre = '';
								genre += movie.genres.join(",");
							}
							connection.query("INSERT INTO `hypertube`.`movies`(title, cover, director, writers, actors, year, rating, imdb_code, runtime, genre, summary) VALUES(?,?,?,?,?,?,?,?,?,?,?)", [movie.title, movie.medium_cover_image, director, writers, actors, movie.year, movie.rating, movie.imdb_code, movie.runtime, genre, movie.description_full], function (err, firstQuery) {
								if (err) {
									console.log(err);
								}
								else if (movie.torrents) {
									for (var k in movie.torrents) {
										if (movie.torrents[k].quality !== "3D") {
											var urlencoded = urlencode(movie.title_long + " [" + movie.torrents[k].quality + "] [YTS.AG]");
											connection.query("INSERT INTO `hypertube`.`movies_torrents`(id_film, quality, magnet, size_bytes) VALUES(?,?,?, ?)", [firstQuery.insertId, movie.torrents[k].quality, urlencode('magnet:?xt=urn:btih:' + movie.torrents[k].hash + '& dn=' + urlencoded), movie.torrents[k].size_bytes]);
										}
									}
								}
							})
						}
					})
				});
			}
		});
	}
	for (var page = 1; page < 19; page++) {
		eztvml.listTVshows({
			page: page
		}, function (err, json) {
			if (err) console.log(err);
			else {
				json.forEach(function (show) {
					verifTV(show.imdb_id, function (result) {
						if (!result.verif) {
							eztvml.showDetails({
								imdb_code: show.imdb_id
							}, function (err, jsonEpisodes) {
								if (err) console.log(err);
								else {
									connection.query("INSERT INTO `hypertube`.`tv_shows`(title, runtime, season, genres, director, writers, actors, summary, cover, imdb_code, rating, year) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)", [show.title, jsonEpisodes.runtime, show.num_seasons ? show.num_seasons : "N/A", jsonEpisodes.genres.join(","), "N/A", "N/A", "N/A", jsonEpisodes.synopsis ? jsonEpisodes.synopsis : "N/A", show.images.poster, show.imdb_id, Number(jsonEpisodes.rating.percentage) / 10, show.year], function (err, rows) {
										if (err) {
											console.log(show.title);
											console.log(jsonEpisodes.synopsis);
											console.log("--------------------------");
										}
										else {
											jsonEpisodes.episodes.forEach(function (episode) {
												var torrent = '';
												if (episode.torrents) {
													if (episode.torrents['480p']) torrent = episode.torrents["480p"].url;
													else {
														if (episode.torrents["720p"]) torrent = episode.torrents["720p"].url;
														else if (episode.torrents["1080p"]) torrent = episode.torrents["1080p"].url;
														else console.log(episode.torrents);
													}
												}
												else console.log(episode);
												connection.query("INSERT INTO `hypertube`.`tv_shows_torrents`(id_tv_show, season,episode,magnet,quality, tvdb_id) VALUES(?,?,?,?,?, ?)", [rows.insertId, episode.season, episode.episode, urlencode(torrent), "480p", episode.tvdb_id], function (err) {
													if (err) {
														console.log(episode.torrents);
													}
												});
											});
										}
									})
								}
							})
						}
					})
				})
			}
		})
	}
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