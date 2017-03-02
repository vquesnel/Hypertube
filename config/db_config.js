var yts = require('../medias/yts');
var eztvml = require("../medias/eztvml");
var request = require('request');
var urlencode = require('urlencode');
var schedule = require('node-schedule');
var mysql = require('mysql');
var fs = require("fs");
var connection = mysql.createConnection({
    port: 3307,
    host: 'localhost',
    user: 'root',
    password: 'root'
});
connection.connect(function (err) {
    if (err) throw err;
});
var launchMovie = function () {
    console.log("launchMovie");
    for (var page = 1; page < 121; page++) {
        yts.listMovies({
            limit: 50,
            page: page
        }, function (err, json) {
            if (err) {
                console.log("error yts");
            } else {
                json.data.movies.forEach(function (movie) {
                    var genre = 'noGenres';
                    if (movie.genres) {
                        genre = '';
                        genre += movie.genres.join(",");
                    }
                    request({
                        url: movie.medium_cover_image
                    }, function (err, res, body) {
                        if (err) movie.medium_cover_image = "/img/noCoverAvailable.jpg"
                        if (!err && res.statusCode === 404) {
                            movie.medium_cover_image = "/img/noCoverAvailable.jpg"
                        }
                        connection.query("INSERT INTO `hypertube`.`movies`(title, cover, year, rating, imdb_code, runtime, genre, summary) VALUES(? ,? , ?, ? , ?, ?, ? ,?) ON DUPLICATE KEY UPDATE imdb_code = imdb_code", [movie.title, movie.medium_cover_image, movie.year, movie.rating, movie.imdb_code, movie.runtime, genre, movie.description_full, movie.title],
                            function (err, firstQuery) {
                                if (err) {
                                    throw err;
                                } else if (firstQuery.insertId != 0) {
                                    if (movie.torrents) {
                                        for (var k in movie.torrents) {
                                            if (movie.torrents[k].quality !== "3D") {
                                                var urlencoded = urlencode(movie.title_long + " [" + movie.torrents[k].quality + "] [YTS.AG]");
                                                connection.query("INSERT INTO `hypertube`.`movies_torrents`(id_film, quality, magnet, size_bytes) VALUES(?,?,?, ?)", [firstQuery.insertId, movie.torrents[k].quality, urlencode('magnet:?xt=urn:btih:' + movie.torrents[k].hash + '& dn=' + urlencoded), movie.torrents[k].size_bytes], function (err) {
                                                    if (err) {
                                                        console.log("tporrents");
                                                        console.log(err);
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }
                            })
                    });


                });
            }
        });
    }
}
var launchTv_show = function () {
    console.log("launchTVSHOW");
    for (var page = 1; page < 19; page++) {
        eztvml.listTVshows({
            page: page
        }, function (err, json) {
            if (err) console.log(err);
            else {
                json.forEach(function (show) {
                    eztvml.showDetails({
                        imdb_code: show.imdb_id
                    }, function (err, jsonEpisodes) {
                        if (err) console.log(err);
                        else {
                            for (var k in jsonEpisodes.genres) {
                                jsonEpisodes.genres[k] = jsonEpisodes.genres[k].capitalizeFirstLetter();
                            }
                            show.images.poster = show.images.poster.replace(/http:\/\//gi, "https://");
                            request({
                                url: show.images.poster
                            }, function (err, res, body) {
                                if (err) show.images.poster = "/img/noCoverAvailable.jpg"
                                if (!err && res.statusCode === 404) {
                                    show.images.poster = "/img/noCoverAvailable.jpg"
                                }
                                connection.query("INSERT INTO `hypertube`.`tv_shows`(title, runtime, season, genre,  summary, cover, imdb_code, rating, year) VALUES(?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE imdb_code = imdb_code", [show.title, jsonEpisodes.runtime, show.num_seasons ? show.num_seasons : "N/A", jsonEpisodes.genres.join(","), jsonEpisodes.synopsis ? jsonEpisodes.synopsis : "N/A", show.images.poster, show.imdb_id, Number(jsonEpisodes.rating.percentage) / 10, show.year], function (err, rows) {
                                    if (err) {
                                        throw err;
                                    } else if (rows.insertId != 0) {
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
                                            if (torrent.match(/magnet:\?xt=urn:btih:/)) {
                                                connection.query("INSERT INTO `hypertube`.`tv_shows_torrents`(id_tv_show, season,episode,magnet,quality, tvdb_id) VALUES(?,?,?,?,?, ?)", [rows.insertId, episode.season, episode.episode, urlencode(torrent), "480p", episode.tvdb_id], function (err) {
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                })
                            });
                        }
                    })

                })
            }
        })
    }
}
var update_db = function () {
    var date = Date.now();
    var checker = date - Number(2592000000);
    connection.query("SELECT * FROM download WHERE date < ?", [checker], function (err, rows) {
        if (err) console.log(err);
        else if (rows.length > 0) {
            rows.forEach(function (file) {
                fs.unlinkSync(file.path);
            });
            connection.query("DELETE FROM download WHERE date < ?", [checker], function (err, rows) {
                if (err) console.log(err);
            })
        }
    });
}
connection.query("CREATE DATABASE IF NOT EXISTS hypertube CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin;");
connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`users` ( `id` INT(5) NOT NULL AUTO_INCREMENT , `firstname` VARCHAR(255) NOT NULL , `lastname` VARCHAR(255) NOT NULL , `username` VARCHAR(255) NOT NULL, `email` VARCHAR(255) NOT NULL , `password` VARCHAR(255) NOT NULL, `token` VARCHAR(255) NOT NULL ,`profil_pic` VARCHAR(10000) DEFAULT '/img/no-photo.png', `language` VARCHAR(255) NOT NULL DEFAULT 'eng', `fb_id` VARCHAR(255) DEFAULT NULL,`42_id` VARCHAR(255) DEFAULT NULL,`github_id` VARCHAR(255) DEFAULT NULL, `google_id` VARCHAR(255) DEFAULT NULL, `sessionID` VARCHAR(255) DEFAULT NULL, `socket_id` VARCHAR(255) DEFAULT NULL, PRIMARY KEY (`id`)) ENGINE = InnoDB CHARSET=utf8mb4  COLLATE utf8mb4_bin;");
connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`history` ( `id` INT(5) NOT NULL AUTO_INCREMENT , `imdbID` VARCHAR(255) NOT NULL , `userID` INT(5) NOT NULL , `context` VARCHAR(255) NOT NULL, `date` BIGINT(10) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;");
connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`comment` (`id` int(5) NOT NULL AUTO_INCREMENT,`userID` int(5) NOT NULL,`imdbID` varchar(255) COLLATE utf8mb4_bin NOT NULL,`content` text COLLATE utf8mb4_bin NOT NULL,`date_message` varchar(255) COLLATE utf8mb4_bin NOT NULL,`messageID` varchar(255) COLLATE utf8mb4_bin NOT NULL,`context` varchar(255) COLLATE utf8mb4_bin NOT NULL, PRIMARY KEY(`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;");
connection.query("CREATE TABLE IF NOT EXISTS`hypertube`.`download` ( `id` INT(5) NOT NULL AUTO_INCREMENT , `imdb_code` VARCHAR(255) NOT NULL , `quality` VARCHAR(255) NULL DEFAULT NULL , `path` VARCHAR(600) NOT NULL , `date` BIGINT(10) NOT NULL , mimetype VARCHAR(255) NOT NULL,  PRIMARY KEY (`id`)) ENGINE = InnoDB;");
connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`movies` ( `id` INT(5) NOT NULL AUTO_INCREMENT , `title` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `director` TEXT  NULL, `writers` TEXT  NULL ,  `actors` TEXT  NULL , `cover` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `year` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `rating` DECIMAL(2,1) NULL DEFAULT NULL , `imdb_code` VARCHAR(10) NOT NULL , `runtime` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `genre` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `summary` TEXT NOT NULL,background_img VARCHAR(600) NOT NULL DEFAULT 'N/A',UNIQUE KEY `imdb_code` (`imdb_code`), PRIMARY KEY (`id`)) ENGINE = InnoDB  CHARSET=utf8mb4 COLLATE utf8mb4_bin;");
connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`tv_shows` ( `id` INT(5) NOT NULL AUTO_INCREMENT , `title` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `season` VARCHAR(5) NOT NULL DEFAULT 'N/A' , `genre` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `director` TEXT  NULL, `writers` TEXT  NULL, `actors` TEXT  NULL,`runtime` VARCHAR(255) NOT NULL DEFAULT 'N/A' ,  `summary` TEXT  NULL , `cover` VARCHAR(255) NOT NULL DEFAULT 'N/A' , `imdb_code` VARCHAR(10) NOT NULL UNIQUE , `rating` DECIMAL(2,1) DEFAULT NULL , `year` VARCHAR(255) NOT NULL DEFAULT 'N/A', `background_img` VARCHAR(600) NOT NULL DEFAULT 'N/A',  PRIMARY KEY (`id`)) ENGINE = InnoDB;");
connection.query("CREATE TABLE  IF NOT EXISTS `hypertube`.`tv_shows_torrents` ( `id` INT(5) NOT NULL AUTO_INCREMENT , `id_tv_show` INT(5) NOT NULL , `season` INT(2) NULL DEFAULT NULL , `episode` INT(2) NULL DEFAULT NULL ,`quality` VARCHAR(255)  NULL DEFAULT NULL , `magnet` TEXT NOT NULL, `tvdb_id` VARCHAR(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE = InnoDB;", function (err, result) {
    if (err) console.log(err);
    else if (result.warningCount === 0) {
        launchTv_show();
    }

});
connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`movies_torrents` ( `id` INT(5) NOT NULL AUTO_INCREMENT, `id_film` INT(5) NOT NULL , `quality` VARCHAR(255) NULL DEFAULT NULL , `magnet` TEXT NOT NULL , `size_bytes` BIGINT(20) NULL DEFAULT NULL, PRIMARY KEY (`id`) ) ENGINE = InnoDB CHARSET=utf8mb4 COLLATE utf8mb4_bin;", function (err, rows) {
    if (err) console.log(err);
    else if (rows.warningCount === 0) {
        launchMovie();
    }
});

String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
schedule.scheduleJob('0 0,6,23 * * *', function () {
    launchMovie();
    launchTv_show();
    console.log("Schedule to scrap torrents");
});
schedule.scheduleJob('* * * * *', function () {
    update_db();
})
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