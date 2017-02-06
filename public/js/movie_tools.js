(function ($) {
	$(document).ready(function () {
		var watcher = $('video');
		var watcher2 = $('#video_player')
		var switcher = $('.onoffswitch-label');
		var q720 = $('.quality720p').text();
		var q1080 = $('.quality1080p').text();
		var switcher720p = $('.onoffswitch-inner:before');
		var switcher1080p = $('.onoffswitch-inner:after');
		var index = 1;
		var imdbID = document.location.pathname.split('/')[2];
		var current = q720;
		var socket = io.connect('https://localhost:4422');
		var username = $('.user').text();
		var fullDate = new Date();
		var twoDigitMonth = ((fullDate.getMonth().length + 1) === 1) ? (fullDate.getMonth() + 1) : '0' + (fullDate.getMonth() + 1);
		var currentDate = fullDate.getDate() + "/" + twoDigitMonth + "/" + fullDate.getFullYear();
		var rate = $('.rate-imdb').text();
		switcher720p.css('content', '720p');
		if (!q720) {
			switcher720p.css('content', '1080p');
		}
		switcher1080p.css('content', '1080p');
		if (!q1080) {
			switcher1080p.css('content', '720p');
		}

		function addScore(score, domElement) {
			$("<span class='stars-container'>").addClass("stars-" + score.toString()).text("★★★★★").appendTo(domElement);
		}
		addScore(Math.round(rate) * 10, $('.imdb'));

		function getDocHeight() {
			var D = document;
			return Math.max(D.body.scrollHeight, D.documentElement.scrollHeight, D.body.offsetHeight, D.documentElement.offsetHeight, D.body.clientHeight, D.documentElement.clientHeight);
		}

		function updateIndicators() {
			$.ajax({
				url: 'https://localhost:4422/indicators/' + imdbID
				, method: 'GET'
				, success: function (data) {
					$('.comments-indicator').text(data);
					$('<img src="/img/comments.png">').appendTo('.comments-indicator');
				}
			})
		}
		$('.actors').text($('.actors').text().replace(/\,/g, ' '));
		$('.genres').text($('.genres').text().replace(/\,/g, ' '));
		updateIndicators();
		switcher.click(function () {
			if (current == q720) {
				if (q1080) {
					watcher2.attr('src', q1080);
					watcher.attr('src', q1080);
					current = q1080;
					return;
				}
			}
			if (current == q1080) {
				if (q720) {
					watcher2.attr('src', q720);
					watcher.attr('src', q720);
					current = q720;
					return;
				}
			};
		});
		$.ajax({
			url: 'https://localhost:4422/wallpaper/' + imdbID
			, type: 'GET'
			, success: function (data) {
				$('.cover').css("background-image", "-webkit-linear-gradient(left, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.5) ), url(" + data + ")");
			}
		})
		socket.emit('check_message', imdbID);
		$('.sender').click(function () {
			if ($('#message-area').val() != '') {
				var messageVal = $('#message-area').val().trim()
				$('.textarea').val('');
				if (messageVal != '') {
					socket.emit('new-message', {
						value: messageVal
						, username: username
						, imdbID: imdbID
						, date: currentDate
					});
				}
				$('#message-area').val('');
			}
		});
		var j = 0;
		socket.on('old_message', function (data) {
			for (var k in data) {
				$('<div class="comment comment' + k + '"></div>').appendTo(".comments-display");
				$('<div class="comment-infos cmt-nfo' + k + '"></div>').appendTo('.comment' + k + '');
				$('<img class="comment-img" src="' + data[k].profil_pic + '">').appendTo('.cmt-nfo' + k + '');
				$('<div class="comment-user"></div>').text(data[k].username).appendTo('.cmt-nfo' + k + '');
				$('<div class="comment-date"></div>').text(data[k].date_message).appendTo('.cmt-nfo' + k + '');
				$('<div class="comment-value"></div>').text(data[k].content).appendTo('.comment' + k + '');
				j = k;
			}
			updateIndicators();
		})
		$('#watch').click(function () {
			$.ajax({
				url: 'https://localhost:4422/get_movie_sub.html/' + imdbID
				, type: 'GET'
				, success: (function (data) {
					var track = [];
					for (var k in data) {
						track[k] = {
							src: data[k].path
							, kind: "captions"
							, srclang: data[k].code
							, label: data[k].language
							, default: true
						}
					}
					$.getScript("/js/video.js", function () {
						videojs('my_video_1', {
							tracks: track
						});
					})
				})
			})
			$('.watch-bar').fadeOut('slow');
			$('#comment').fadeOut(2000, function () {
				$('.video-container').fadeIn(2000);
				$('.return').fadeIn(2000);
				$('html,body').animate({
					scrollTop: getDocHeight()
				}, 2000);
			});
		});
		$('.return').click(function () {
			$('.watch-bar').fadeIn('slow');
			$('.return').fadeOut('slow', function () {
				$('.video-container').fadeOut('slow', function () {
					$('#comment').fadeIn(2000);
					$('html,body').animate({
						scrollTop: 0
					}, 2000);
				});
			});
		})
		socket.on("new_message", function (data) {
			j++;
			var first = 0;
			if (data.imdbID === imdbID) {
				$('<div class="comment comment' + j + '"></div>').prependTo(".comments-display");
				$('<div class="comment-infos cmt-nfo' + j + '"></div>').appendTo('.comment' + j + '');
				$('<img src="' + data.profil_pic + '">').appendTo('.cmt-nfo' + j + '');
				$('<div class="comment-user"></div>').text(data.username).appendTo('.cmt-nfo' + j + '');
				$('<div class="comment-date"></div>').text(data.date).appendTo('.cmt-nfo' + j + '');
				$('<div class="comment-value"></div>').text(data.value).appendTo('.comment' + j + '');
				$('.comments-display').animate({
					scrollTop: $('#msgtpl').prop('scrollHeight')
				}, 500);
			}
			updateIndicators();
		});
	});
})(jQuery);