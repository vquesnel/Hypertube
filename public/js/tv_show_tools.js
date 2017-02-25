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
        var hudFilm;
        var episodeFix = '0';
        var seasonFix = '0';
        var titleShow = $('.title').text();
        var videoJs = videojs("my_video_1");
        var current;
        var messageFocus = localStorage.getItem('comment');
        localStorage.removeItem('comment');

        function addScore(score, domElement) {
            $("<span class='stars-container'>").addClass("stars-" + score.toString()).text("★★★★★").appendTo(domElement);
            hudFilm = $('.hud-film').html()
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
                    if (typeof data == 'string') window.location = data
                    else {
                        $('.comments-indicator').text(data.comments);
                        $('<img src="/img/comments.png">').appendTo('.comments-indicator');
                        $('.viewers-indicator').text(data.watchs);
                        $('<img src="/img/viewers.png">').appendTo('.viewers-indicator');
                    }
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
                if (typeof data == 'string') window.location = data
                else {
                    $('.cover').css("background-image", "-webkit-linear-gradient(left, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.5) ), url(" + data.picture + ")");
                }
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
            $('.episode-link').css('color', '#fff');
            $(this).css('color', '#3281ff');
            if (watcher.attr('src') !== $(this).children().text()) {
                if (!videoJs.pause()) videoJs.stop();
                var oldTracks = videoJs.remoteTextTracks();
                var i = oldTracks.length;
                while (i--) {
                    videoJs.removeRemoteTextTrack(oldTracks[i]);
                }
                videoJs.src('');
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
                        episode: regex[1],
                        name: $('.title-show').text()
                    },
                    success: (function (data) {
                        if (typeof data == 'string') window.location = data
                        else {
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
                        }
                    })
                })
                $('.watch-bar').fadeOut('slow');
                $('#comment').fadeOut(2000, function () {
                    $('.video-container').fadeIn(2000);
                    $('.switchor').fadeIn(2000);
                    $('html,body').animate({
                        scrollTop: getDocHeight()
                    }, 2000);
                });
            } else {
                $('.watch-bar').fadeOut('slow');
                $('#comment').fadeOut(1200, function () {
                    $('.video-container').fadeIn(1200);
                    $('.switchor').fadeIn(1200);
                    $('html,body').animate({
                        scrollTop: getDocHeight()
                    }, 2000);
                });
                videoJs.play();
            }
        });
        socket.emit('check_message', imdbID);
        $('.sender').click(function () {
            if ($('#message-area').val() != '') {
                var messageVal = $('#message-area').val().trim()
                $('.textarea').val('');
                if (messageVal != '') var messageID = Math.random() + '';
                socket.emit('new-message', {
                    value: messageVal,
                    username: username,
                    imdbID: imdbID,
                    date: currentDate,
                    messageID: 'zd' + messageID.split('.')[1],
                    context: 'tv_show'
                });
            }
            $('#message-area').val('');
        });
        var j = 0;
        socket.on('old_message', function (data) {
            for (var k in data) {
                $('<div id="' + data[k].messageID + '" class="comment comment' + k + '"></div>').appendTo(".comments-display");
                $('<div class="comment-infos cmt-nfo' + k + '"></div>').appendTo('.comment' + k + '');
                $('<img class="comment-img" src="' + data[k].profil_pic + '">').appendTo('.cmt-nfo' + k + '');
                $('<a href="/profile2/' + data[k].userID + '" class="comment-user"></a>').text(data[k].username).appendTo('.cmt-nfo' + k + '');
                $('<div class="comment-date"></div>').text(data[k].date_message).appendTo('.cmt-nfo' + k + '');
                $('<div class="comment-value"></div>').text(data[k].content).appendTo('.comment' + k + '');
                j = k;
            }
            if (messageFocus) {
                var offsetMessage = $('#' + messageFocus).offset().top;
                $('#' + messageFocus).find('.comment-value').css('color', 'green');
                $('html,body').animate({
                    scrollTop: offsetMessage - $('#' + messageFocus).height()
                }, 2000);
                messageFocus = '';
            }
            updateIndicators();
        });
        $(document).on('click', '#show', function () {
            $.ajax({
                url: 'https://localhost:4422/getEpisodes/' + imdbID,
                method: 'GET',
                success: function (data) {
                    if (typeof data == 'string') window.location = data
                    else {
                        $('.hud-film').fadeOut(2000, function () {
                            $('.hud-film').empty();
                            $(window).scrollTop(0);
                            $('<div class="normalize"></div>').appendTo('.hud-film');
                            if (data[0]) {
                                $('<div class="title-show">' + titleShow + '</div>').appendTo('.hud-film');
                                var k = 0;
                                data.forEach(function (link) {
                                    if ($('.season.season' + link.season).length === 0) {
                                        $('<div class="season season' + link.season + '">Season' + link.season + '</div>').appendTo('.hud-film');
                                        $('<div class="season-content content-' + link.season + '"></div>').appendTo('.season' + link.season);
                                    }
                                    link.season = link.season.toString();
                                    link.episode = link.episode.toString();
                                    if (link.season.length === 1 && link.episode.length === 1) {
                                        $('<div class="episode-link episode' + k + '">S0' + link.season + 'E0' + link.episode + '</div>').appendTo('.content-' + (link.season));
                                        $('<div class="episode-link-hide" >/watchmovie.html/' + imdbID + '/' + link.tvdb_id + '/' + link.magnet + '/480p</div>').appendTo('.episode' + k);
                                    } else if (link.season.length === 2 && link.episode.length === 1) {
                                        $('<div class="episode-link episode' + k + '">S' + link.season + 'E0' + link.episode + '</div>').appendTo('.content-' + (link.season));
                                        $('<div class="episode-link-hide" >/watchmovie.html/' + imdbID + '/' + link.tvdb_id + '/' + link.magnet + '/480p</div>').appendTo('.episode' + k);
                                    } else if (link.season.length === 1 && link.episode.length === 2) {
                                        $('<div class="episode-link episode' + k + '">S0' + link.season + 'E' + link.episode + '</div>').appendTo('.content-' + (link.season));
                                        $('<div class="episode-link-hide" >/watchmovie.html/' + imdbID + '/' + link.tvdb_id + '/' + link.magnet + '/480p</div>').appendTo('.episode' + k);
                                    } else if (link.season.length === 2 && link.episode.length === 2) {
                                        $('<div class="episode-link episode' + k + '">S' + link.season + 'E' + link.episode + '</div>').appendTo('.content-' + (link.season));
                                        $('<div class="episode-link-hide" >/watchmovie.html/' + imdbID + '/' + link.tvdb_id + '/' + link.magnet + '/480p</div>').appendTo('.episode' + k);
                                    }
                                    k++;
                                });
                            } else {
                                $('<div class="title-show">No Episodes links available </div>').appendTo('.hud-film');
                            }
                            $('.hud-film').addClass('overflow');
                            $('.hud-film').fadeIn();
                        })
                    }
                }
            })
        });
        $(document).on('click', '.vjs-big-play-button', function () {
            var tvdb_id = watcher.attr('src').split("/")[3];
            $.ajax({
                url: 'https://localhost:4422/watchHistory/' + imdbID + '/' + tvdb_id + '/tv_show',
                method: 'GET',
                success: function (data) {
                    if (typeof data == 'string') window.location = data
                }
            })
        });
        $(document).on('click', '.normalize', function () {
            $('.hud-film').fadeOut(2000, function () {
                $('.hud-film').empty();
                $('.hud-film').html(hudFilm);
                $('.hud-film').fadeIn(2000, function () {})
            })
        });
        $('.return').click(function () {
            if (!videoJs.pause()) videoJs.pause();
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
                $('<div d="' + data.messageID + '" class="comment comment' + j + '"></div>').prependTo(".comments-display");
                $('<div class="comment-infos cmt-nfo' + j + '"></div>').appendTo('.comment' + j + '');
                $('<img src="' + data.profil_pic + '">').appendTo('.cmt-nfo' + j + '');
                $('<a href="/profile2/' + data.userID + '" class="comment-user"></a>').text(data.username).appendTo('.cmt-nfo' + j + '');
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