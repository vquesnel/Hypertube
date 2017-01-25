var request = require('request');
var cheerio = require('cheerio');
var S = require('string');
var urlRoot = "http://eztv.ch/";
//var urlRoot = "https://eztv-proxy.net/";
var self = module.exports;

function search(nameKey, myArray) {
	for (var i = 0; i < myArray.length; i++) {
		if (myArray[i].title === nameKey) {
			return myArray[i].title;
		}
	}
}
self.getShows = function (options, callback) {
	var list = [];

	function run() {
		request(urlRoot + "showlist/", function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				var $elements = $("table.forum_header_border tr[name=hover]");
				$elements.each(function (i, e) {
					var show = {};
					show.url = $(e).find("td").eq(0).find("a").attr("href");
					if (!show.url) {
						return;
					}
					var regex = show.url.match(/\/shows\/(\d+)\/([^\/]+)/);
					if (!regex) {
						setTimeout(run, 10);
						return false;
					}
					else {
						show.id = parseInt(regex[1]);
						show.slug = regex[2];
						var title = $(e).find("td").eq(0).text();
						if (S(title).endsWith(", The")) {
							title = "The " + S(title).chompRight(", The").s;
						}
						show.title = title.split("(")[0].trim();
						show.status = $(e).find("td").eq(1).find("font").attr("class");
						var votes = $(e).find("td").eq(2).find("span").text();
						var regexVotes = votes.match(/(\d+\,?\d*\,?\d*)/);
						if (!regexVotes) {
							console.log("No Votes: " + show.title);
						}
						show.votes = regexVotes[0];
						show.votes = show.votes.replace(/,/g, "");
						if (Number(show.votes) >= 100000) {
							var verif = search(show.title, list);
							if (!verif)
								if (options && options.query) {
									if (show.title.toLowerCase().search(options.query.toLowerCase()) >= 0) {
										list.push(show);
										console.log(list);
									}
								}
								else {
									list.push(show);
								}
						}
					}
				});
				if (callback) {
					callback(null, list);
				}
			}
			else {
				console.log("Error getting shows", error, response);
				if (callback) callback(new Error("Error getting shows"), null);
			}
		});
	}
	run();
};
self.getShowEpisodes = function (showId, callback) {
	request(urlRoot + "shows/" + showId + "/", function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var result = {
				id: showId
				, episodes: []
			};
			var $ = cheerio.load(body);
			result.title = $("td.section_post_header").eq(0).find("b").text();
			var $episodes = $("table.forum_header_noborder tr[name=hover]");
			$episodes.each(function (i, e) {
				var episode = {};
				episode.url = $(e).find("td").eq(1).find("a").attr("href");
				if (!episode.url) return;
				var urlRegex = episode.url.match(/\/ep\/(\d+)\/.*/);
				episode.id = parseInt(urlRegex[1]);
				episode.title = $(e).find("td").eq(1).find("a").text();
				var titleRegex = episode.title.match(/(.+) s?(\d+)[ex](\d+)(e(\d+))?(.*)/i);
				if (titleRegex) {
					episode.show = titleRegex[1];
					episode.seasonNumber = parseInt(titleRegex[2]);
					episode.episodeNumber = parseInt(titleRegex[3]);
					episode.episodeNumber2 = parseInt(titleRegex[5]);
					episode.extra = titleRegex[6].trim();
					episode.proper = episode.extra.toLowerCase().indexOf("proper") >= 0;
					episode.repack = episode.extra.toLowerCase().indexOf("repack") >= 0;
				}
				else {
					//console.log("unparsed episode: " + episode.title);
				}
				episode.magnet = $(e).find("td").eq(2).find("a.magnet").attr("href");
				episode.torrentURL = $(e).find("td").eq(2).find("a.download_1").attr("href");
				result.episodes.push(episode);
			});
			if (callback) callback(null, result);
		}
		else {
			if (callback) callback(new Error("Error getting show episodes"), null);
		}
	});
}