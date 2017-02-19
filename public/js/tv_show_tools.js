(function ($) {
    $('#tvshows').css('color', '#61AEFF');
    $(document).ready(function () {
        var watcher = $('video');
        var watcher2 = $('#video_player')
        var index = 1;
        var imdbID = document.location.pathname.split('/')[2];
        var socket = io.connect('https://localhost:4422');
        var username = $('.user').text();
        var fullDate = new Date();
        var twoDigitMonth = ((fullDate.getMonth().length + 1) === 1) ? (fullDate.getMonth() + 1) : '0' + (fullDate.getMonth() + 1);
        var currentDate = fullDate.getDate() + "/" + twoDigitMonth + "/" + fullDate.getFullYear();
        var rate = $('.rate-imdb').text();
        var hudFilm = $('.hud-film').html();
        var episodeFix = '0';
        var seasonFix = '0';
        var titleShow = $('.title').text();
        var videoJs = videojs("my_video_1");

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
                url: 'https://localhost:4422/indicators/' + imdbID,
                method: 'GET',
                success: function (data) {
                    $('.comments-indicator').text(data);
                    $('<img src="/img/comments.png">').appendTo('.comments-indicator');
                }
            })
        }
        $('.director').text($('.director').text().replace(/\,/g, ' '));
        $('.writer').text($('.writer').text().replace(/\,/g, ' '));
        $('.actors').text($('.actors').text().replace(/\,/g, ' '));
        $('.genres').text($('.genres').text().replace(/\,/g, ' '));
        updateIndicators();
        $.ajax({
            url: 'https://localhost:4422/wallpaperTv/' + imdbID,
            type: 'GET',
            success: function (data) {
                $('.cover').css("background-image", "-webkit-linear-gradient(left, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.5) ), url(" + data + ")");
            }
        })
         $(document).on('click', '.switchor', function () {
            if (!videoJs.pause()) videoJs.pause();

            $('.watch-bar').fadeIn('slow');
            $('.switchor').fadeOut('slow', function () {
                $('.video-container').fadeOut('slow', function () {
                    $('#comment').fadeIn(2000);
                    $('html,body').animate({
                        scrollTop: 0
                    }, 2000);
                });
            });
        });
        $(document).on('click', '.episode-link', function () {
            var oldTracks = videoJs.remoteTextTracks();
            var i = oldTracks.length;
            while (i--) {
                videoJs.removeRemoteTextTrack(oldTracks[i]);
            }
            videoJs.src([{
                type: "video/mp4",
                src: $(this).children().text()
            }])
            var regex = $(this).clone().children().remove().end().text().match(/\d+/g);
            $.ajax({
                url: 'https://localhost:4422/get_movie_sub.html/' + imdbID,
                type: 'GET',
                data: {
                    season: regex[0],
                    episode: regex[1]
                },
                success: (function (data) {
                    var track = [];
                    data.forEach(function (sub) {
                        sub = {
                            src: sub.path,
                            kind: "captions",
                            srclang: sub.code,
                            label: sub.language,
                        }
                        videoJs.addRemoteTextTrack(sub)
                    })
                })
            })
            $('.watch-bar').fadeOut('slow');
            $('#comment').fadeOut(1200, function () {
                $('.video-container').fadeIn(1200);
                $('.switchor').fadeIn(1200);
                $('html,body').animate({
                    scrollTop: getDocHeight()
                }, 2000);
            });
        });
       
        socket.emit('check_message', imdbID);
        $('.sender').click(function () {
            if ($('#message-area').val() != '') {
                var messageVal = $('#message-area').val().trim()
                $('.textarea').val('');
                if (messageVal != '') {
                    socket.emit('new-message', {
                        value: messageVal,
                        username: username,
                        imdbID: imdbID,
                        date: currentDate
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
            //		$('#watch').click(function () {
            //			$('.watch-bar').fadeOut('slow');
            //			$('#comment').fadeOut(2000, function () {
            //				$('.video-container').fadeIn(2000);
            //				$('.return').fadeIn(2000);
            //				$('html,body').animate({
            //					scrollTop: getDocHeight()
            //				}, 2000);
            //			});
            //		})
        $(document).on('click', '#show', function () {
            $.ajax({
                url: 'https://localhost:4422/getEpisodes/' + imdbID,
                method: 'GET',
                success: function (data) {
                    $('.hud-film').fadeOut(2000, function () {
                        $('.hud-film').empty();
                        $(window).scrollTop(0);
                        $('<div class="normalize"></div>').appendTo('.hud-film');
                        if (data[0]) {
                            $('<div class="title-show">' + titleShow + '</div>').appendTo('.hud-film');
                            var currentSeason = data[0].season;
                            for (var k in data) {
                                if (currentSeason == data[k].season) {
                                    $('<div class="season season' + currentSeason + '">Season' + currentSeason + '</div>').appendTo('.hud-film');
                                    $('<div class="season-content content-' + currentSeason + '"></div>').appendTo('.season' + currentSeason);
                                    currentSeason++;
                                }
                                data[k].season = data[k].season.toString();
                                data[k].episode = data[k].episode.toString();
                                if (data[k].season.length === 1 && data[k].episode.length === 1) {
                                    $('<div class="episode-link episode' + k + '">S0' + data[k].season + 'E0' + data[k].episode + '</div>').appendTo('.content-' + (currentSeason - 1));
                                    $('<div class="episode-link-hide" >/watchmovie.html/' + imdbID + '/' + data[k].magnet + '/480p</div>').appendTo('.episode' + k);
                                } else if (data[k].season.length === 2 && data[k].episode.length === 1) {
                                    $('<div class="episode-link episode' + k + '">S' + data[k].season + 'E0' + data[k].episode + '</div>').appendTo('.content-' + (currentSeason - 1));
                                    $('<div class="episode-link-hide" >/watchmovie.html/' + imdbID + '/' + data[k].magnet + '/480p</div>').appendTo('.episode' + k);
                                } else if (data[k].season.length === 1 && data[k].episode.length === 2) {
                                    $('<div class="episode-link episode' + k + '">S0' + data[k].season + 'E' + data[k].episode + '</div>').appendTo('.content-' + (currentSeason - 1));
                                    $('<div class="episode-link-hide" >/watchmovie.html/' + imdbID + '/' + data[k].magnet + '/480p</div>').appendTo('.episode' + k);
                                } else if (data[k].season.length === 2 && data[k].episode.length === 2) {
                                    $('<div class="episode-link episode' + k + '">S' + data[k].season + 'E' + data[k].episode + '</div>').appendTo('.content-' + (currentSeason - 1));
                                    $('<div class="episode-link-hide" >/watchmovie.html/' + imdbID + '/' + data[k].magnet + '/480p</div>').appendTo('.episode' + k);
                                }
                            }
                        } else {
                            $('<div class="title-show">No Episodes links available </div>').appendTo('.hud-film');
                        }
                        $('.hud-film').addClass('overflow');
                        $('.hud-film').fadeIn();

                    })

                }
            })
        })
        $(document).on('click', '.normalize', function () {
            $('.hud-film').fadeOut(2000, function () {
                $('.hud-film').empty();
                $('.hud-film').html(hudFilm);
                $('.hud-film').fadeIn(2000, function () {})
            })
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
        });
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