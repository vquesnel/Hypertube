var yts = require('../medias/yts');
var eztv = require('../medias/eztv');
//var imdb = require("imdb-api")
//var omdb = require('imdb-api');
var imdb = require('node-movie')
var urlencode = require('urlencode');
var launch = function (connection, callback) {
    connection.query("CREATE DATABASE IF NOT EXISTS hypertube CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin;");
    connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`users` ( `id` INT(5) NOT NULL AUTO_INCREMENT , `firstname` VARCHAR(255) NOT NULL , `lastname` VARCHAR(255) NOT NULL , `username` VARCHAR(255) NOT NULL, `email` VARCHAR(255) NOT NULL , `password` VARCHAR(255) NOT NULL, `token` VARCHAR(255) NOT NULL ,`profil_pic` LONGTEXT DEFAULT NULL, `language` VARCHAR(255) NOT NULL DEFAULT 'EN', `fb_id` VARCHAR(255) DEFAULT NULL,`42_id` VARCHAR(255) DEFAULT NULL,`github_id` VARCHAR(255) DEFAULT NULL, `google_id` VARCHAR(255) DEFAULT NULL, `sessionID` VARCHAR(255) DEFAULT NULL, `socket_id` VARCHAR(255) DEFAULT NULL, PRIMARY KEY (`id`)) ENGINE = InnoDB CHARSET=utf8mb4  COLLATE utf8mb4_bin;");
    connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`history` ( `id_film` INT(5) NOT NULL , `last_watch` DATE NOT NULL) ENGINE = InnoDB CHARSET=utf8mb4 COLLATE utf8mb4_bin;");
    connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`comment` ( `id` INT(5) NOT NULL AUTO_INCREMENT , `username` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL , `imdb_id` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL , `content` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL , `date_message` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;");
    connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`subtitles` ( `id_film` INT(5) NOT NULL , `language` VARCHAR(255) NOT NULL, `path` VARCHAR(255) NOT NULL ) ENGINE = InnoDB CHARSET=utf8mb4 COLLATE utf8mb4_bin;");
    connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`movies` ( `id` INT(5) NOT NULL AUTO_INCREMENT , `title` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `director` VARCHAR(255) NOT NULL, `writers` VARCHAR(255) NOT NULL ,  `actors` VARCHAR(255) NOT NULL , `cover` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `year` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `rating` DECIMAL(2,1) NULL DEFAULT NULL , `imdb_code` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `runtime` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `genre` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `summary` TEXT NOT NULL,background_img VARCHAR(600) NOT NULL DEFAULT 'N/A',  PRIMARY KEY (`id`)) ENGINE = InnoDB  CHARSET=utf8mb4 COLLATE utf8mb4_bin;");
    connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`tv_shows` ( `id` INT(5) NOT NULL AUTO_INCREMENT , `title` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `season` VARCHAR(5) NOT NULL DEFAULT 'N/A' , `genres` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `director` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `writers` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `actors` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `summary` TEXT NOT NULL , `cover` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `imdb_code` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `rating` DECIMAL(2,1) DEFAULT NULL , `year` VARCHAR(255) NOT NULL DEFAULT 'N/A', `eztv_id` INT(5) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;");
    connection.query("CREATE TABLE  IF NOT EXISTS `hypertube`.`tv_shows_torrents` ( `id` INT(5) NOT NULL AUTO_INCREMENT , `id_tv_show` INT(5) NOT NULL , `season` INT(2) NULL DEFAULT NULL , `episode` INT(2) NULL DEFAULT NULL ,`quality` VARCHAR(255)  NULL DEFAULT NULL , `magnet` TEXT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;");
    connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`movies_torrents` ( `id` INT(5) NOT NULL AUTO_INCREMENT, `id_film` INT(5) NOT NULL , `quality` VARCHAR(255) NULL DEFAULT NULL , `magnet` TEXT NOT NULL , `size_bytes` INT(10) NULL DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE = InnoDB CHARSET=utf8mb4 COLLATE utf8mb4_bin;", function (err) {
        if (err) throw err;
        else callback();
    })
}
var mysql = require('mysql');
var connection = mysql.createConnection({
    port: 3307,
    host: 'localhost',
    user: 'root',
    password: 'root'
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
    //    console.log("launch");
    for (var page = 1; page < 121; page++) {
        yts.listMovies({
            limit: 50,
            page: page
        }, function (err, json) {
            if (err) {
                console.log("error yts");
            } else {
                json.data.movies.forEach(function (movie) {
                    imdb.getByID(
                        movie.imdb_code,
                        function (err, data) {
                            if (err) {
                                console.log("movie by id");
                            } else {
                                var director = (data.Director ? data.Director : "N/A");
                                var genres = "N/A"
                                if (data.Genre) {
                                    genres = JSON.stringify(data.Genre);
                                }
                                var actors = 'N/A';
                                if (data.Actors) {
                                    actors = JSON.stringify(data.Actors)
                                }
                                var writers = 'N/A'
                                if (data.Writer) {
                                    writers = JSON.stringify(data.Writer);
                                }

                                verif(movie.imdb_code, function (result) {
                                    if (!result.verif) {
                                        connection.query("INSERT INTO `hypertube`.`movies`(title, cover, director, writers, actors, year, rating, imdb_code, runtime, genre, summary) VALUES(?,?,?,?,?,?,?,?,?,?,?)", [movie.title, movie.medium_cover_image, director, writers, actors, movie.year, movie.rating, movie.imdb_code, movie.runtime, genres, movie.description_full], function (err, firstQuery) {
                                            if (err) throw err;
                                            if (movie.torrents) {
                                                for (var k in movie.torrents) {
                                                    if (movie.torrents[k].quality !== "3D") {
                                                        var urlencoded = urlencode(movie.title_long + " [" + movie.torrents[k].quality + "] [YTS.AG]");
                                                        connection.query("INSERT INTO `hypertube`.`movies_torrents`(id_film, quality, magnet, size_bytes) VALUES(?,?,?, ?)", [firstQuery.insertId, movie.torrents[k].quality, urlencode('magnet:?xt=urn:btih:' + movie.torrents[k].hash + '& dn=' + urlencoded), movie.torrents[k].size_bytes]);
                                                    }
                                                }
                                            }
                                        })
                                    }
                                });
                            }
                        })
                });
            }
        });
    }
    eztv.getShows({}, function (err, results) {
        if (err) console.log("error getshows"); //console.log(err);
        else {
            results.forEach(function (show) {
                    imdb(show.title, function (err, movie) {
                        if (err) console.log("Error imdb--> getshows");

                        if (!movie) console.log("NOT FIND :" + show.title);
                        else if (movie.Type === "series") {
                            var genres = "N/A"
                            if (movie.Genre) {
                                genres = JSON.stringify(movie.Genre);
                            }
                            var actors = 'N/A';
                            if (movie.Actors) {
                                actors = JSON.stringify(movie.Actors)
                            }
                            var writers = 'N/A'
                            if (movie.Writer) {
                                writers = JSON.stringify(movie.Writer);
                            }
                            if (movie.imdbRating === 'N/A') movie.imdbRating = "N/A";
                            verifTV(movie.imdbID, function (result) {
                                if (!result.verif && movie.imdbRating) {
                                    connection.query("INSERT INTO `hypertube`.`tv_shows`(title, season, genres, director, writers, actors, summary, cover, imdb_code, rating, year, eztv_id) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)", [movie.Title, movie.totalSeasons ? movie.totalSeasons : "N/A", genres, movie.Director ? movie.Director : "N/A", writers, actors, movie.Plot ? movie.Plot : "N/A", movie.Poster ? movie.Poster : "N/A", movie.imdbID, movie.imdbRating ? movie.imdbRating : null, movie.Year ? movie.Year : 'N/A', show.id], function (err, rows) {
                                        if (err) throw err;
                                        else {
                                            eztv.getShowEpisodes(show.id, function (err, torrents) {
                                                if (err) console.log("error get episodes");
                                                if (torrents) {
                                                    torrents.episodes.forEach(function (torrent) {
                                                        connection.query("INSERT INTO `hypertube`.`tv_shows_torrents`(id_tv_show, season,episode,magnet,quality) VALUES(?,?,?,?,?)", [rows.insertId, torrent.seasonNumber, torrent.episodeNumber, torrent.magnet, torrent.quality], function (err) {
                                                            if (err) {
                                                                console.log("----------------------------");
                                                                console.log(torrent)
                                                            }
                                                        })
                                                    });
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }


            )
        }

    });
});
//var addic7edApi = require('addic7ed-api');
//addic7edApi.search('South Park', 19, 6).then(function (subtitlesList) {
//	var subInfo = subtitlesList[0];
//	console.log(subtitlesList);
//	if (subInfo) {
//		console.log(subInfo.referer);
//	}
//});
connection = mysql.createPool({
    connectionLimit: 100,
    port: 3307,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'hypertube',
    charset: 'utf8mb4'
});
module.exports = connection