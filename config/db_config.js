var launch = function (connection) {
	connection.query("CREATE DATABASE IF NOT EXISTS hypertube CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin;");
	connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`users` ( `id` INT(5) NOT NULL AUTO_INCREMENT , `firstname` VARCHAR(255) NOT NULL , `lastname` VARCHAR(255) NOT NULL , `username` VARCHAR(255) NOT NULL, `email` VARCHAR(255) NOT NULL , `password` VARCHAR(255) NOT NULL, `token` VARCHAR(255) NOT NULL ,`profil_pic` LONGTEXT DEFAULT NULL, `languague` VARCHAR(255) NOT NULL DEFAULT 'english', `fb_id` VARCHAR(255) DEFAULT NULL,`42_id` VARCHAR(255) DEFAULT NULL,`github_id` VARCHAR(255) DEFAULT NULL, `google_id` VARCHAR(255) DEFAULT NULL, `sessionID` VARCHAR(255) DEFAULT NULL, `socket_id` VARCHAR(255) DEFAULT NULL, PRIMARY KEY (`id`)) ENGINE = InnoDB CHARSET=utf8mb4  COLLATE utf8mb4_bin;");
	connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`movies` ( `id` INT(5) NOT NULL AUTO_INCREMENT, `imdbid` VARCHAR(255) NOT NULL, `path` VARCHAR(255) NOT NULL,  PRIMARY KEY (`id`)) ENGINE = InnoDB CHARSET=utf8mb4 COLLATE utf8mb4_bin;");
	connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`history` ( `id_film` INT(5) NOT NULL , `last_watch` DATE NOT NULL) ENGINE = InnoDB CHARSET=utf8mb4 COLLATE utf8mb4_bin;");
	connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`comment` ( `id_film` INT(5) NOT NULL , `id_users` INT(5) NOT NULL , `content` LONGTEXT NOT NULL, `when` DATE NOT NULL) ENGINE = InnoDB CHARSET=utf8mb4 COLLATE utf8mb4_bin;");
	connection.query("CREATE TABLE IF NOT EXISTS `hypertube`.`subtitles` ( `id_film` INT(5) NOT NULL , `language` VARCHAR(255) NOT NULL ) ENGINE = InnoDB CHARSET=utf8mb4 COLLATE utf8mb4_bin;");
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
launch(connection);
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