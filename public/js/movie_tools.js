var videoJs;
var hudFilm;
(function ($) {
    $('#movies').css('color', '#61AEFF');
    $(document).ready(function () {
        if (!videoJs) {
            console.log("sdfsadfasfasdfasf");
            //            videoJs.dispose();
            videoJs = videojs("my_video_1");
        } else {
            console.log("already");
            videoJs.dispose();
            videoJs = null;
            videoJs = videoks("my_video_1");
        }
        var switcher = $('.onoffswitch-label');
        var q720 = $('.quality720p').clone().children().remove().end().text();
        var q1080 = $('.quality1080p').clone().children().remove().end().text();
        var switcher720p = $('.onoffswitch-inner:before');
        var switcher1080p = $('.onoffswitch-inner:after');
        var index = 1;
        var current;
        var imdbID = document.location.pathname.split('/')[2];
        var socket = io.connect('https://localhost:4422');
        var username = $('.user').text();
        var fullDate = new Date();
        var twoDigitMonth = ((fullDate.getMonth().length + 1) === 1) ? (fullDate.getMonth() + 1) : '0' + (fullDate.getMonth() + 1);
        var currentDate = fullDate.getDate() + "/" + twoDigitMonth + "/" + fullDate.getFullYear();
        var rate = $('.rate-imdb').text();
        var messageFocus = localStorage.getItem('comment');
        localStorage.removeItem('comment');
        if ($('.link-block').length < 2) {
            current = $('.link-block').children().clone().children().remove().end().text();
            $('.onoffswitch').empty();
        } else current = q720;

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
        $('.writer').text($('.writer').text().replace(/\,/g, ' '));
        $('.director').text($('.director').text().replace(/\,/g, ' '));
        $('.actors').text($('.actors').text().replace(/\,/g, ' '));
        $('.genres').text($('.genres').text().replace(/\,/g, ' '));
        switcher.click(function () {
            if (current === q720) {
                current = q1080;
            } else if (current === q1080) {
                current = q720;
            }
        });
        $(document).on('click', '.switchor', function () {
            if (!videoJs.paused()) videoJs.pause();
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
        $(document).on('click', '.watch-btn', function () {
            if (current !== videojs.currentSrc()) {
                if (!videoJs.paused()) videoJs.pause();
                var oldTracks = videoJs.remoteTextTracks();
                var i = oldTracks.length;
                while (i--) {
                    videoJs.removeRemoteTextTrack(oldTracks[i]);
                }
                videoJs.src([{
                    type: "video/mp4",
                    src: current
            }])
                $.ajax({
                    url: 'https://localhost:4422/get_movie_sub.html/' + imdbID,
                    type: 'GET',
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
                $('#comment').fadeOut(2000, function () {
                    $('.video-container').fadeIn(2000);
                    $('.switchor').fadeIn(2000);
                    $('html,body').animate({
                        scrollTop: getDocHeight()
                    }, 2000, function () {
                        videoJs.play();
                    });
                });
            }
        });
        updateIndicators();
        $.ajax({
            url: 'https://localhost:4422/wallpaper/' + imdbID,
            type: 'GET',
            success: function (data) {
                if (typeof data == 'string') window.location = data
                else if (data.picture) {
                    $('.cover').css("background", "-webkit-linear-gradient(left, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.5) ), url(" + data.picture + ")");
                }
            }
        })
        $(document).on('click', '.vjs-big-play-button', function () {
            $.ajax({
                url: 'https://localhost:4422/watchHistory/' + imdbID + '/movie',
                method: 'GET',
                success: function (data) {
                    if (typeof data == 'string') window.location = data;
                }
            })
        });
        videoJs.ready(function () {
            videoJs.on("loadedmetadata", function (data) {
                videoJs.toggleClass('vjs-live', function () {
                    if (videoJs.duration() < 60 || videoJs.duration() == Infinity) {
                        return true;
                    } else return false;
                });
            })
        })
        socket.emit('check_message', imdbID);
        $('.sender').click(function () {
            if ($('#message-area').val() != '') {
                var messageVal = $('#message-area').val().trim()
                $('.textarea').val('');
                if (messageVal != '') {
                    var messageID = Math.random() + '';
                    socket.emit('new-message', {
                        value: messageVal,
                        username: username,
                        imdbID: imdbID,
                        date: currentDate,
                        messageID: 'zd' + messageID.split('.')[1],
                        context: 'movie'
                    });
                }
                $('#message-area').val('');
            }
        });
        var j = 0;
        socket.on('old_message', function (data) {
            for (var k in data) {
                $('<div id="' + data[k].messageID + '" class="comment comment' + k + '"></div>').appendTo(".comments-display");
                $('<div class="comment-infos cmt-nfo' + k + '"></div>').appendTo('.comment' + k + '');
                $('<img class="comment-img" src="' + data[k].profil_pic + '">').appendTo('.cmt-nfo' + k + '');
                $('<a href="/profile/' + data[k].userID + '" class="comment-user"></a>').text(data[k].username).appendTo('.cmt-nfo' + k + '');
                $('<div class="comment-date"></div>').text(data[k].date_message).appendTo('.cmt-nfo' + k + '');
                $('<div class="comment-value"></div>').text(data[k].content).appendTo('.comment' + k + '');
                j = k;
            }
            if (messageFocus) {
                var offsetMessage = $('#' + messageFocus).offset().top;
                $('#' + messageFocus).find('.comment-value').css('color', '#5787E8');
                $('html,body').animate({
                    scrollTop: offsetMessage - $('#' + messageFocus).height()
                }, 2000);
                messageFocus = '';
            }
            updateIndicators();
        });
        socket.on("new_message", function (data) {
            j++;
            var first = 0;
            if (data.imdbID === imdbID) {
                $('<div id="' + data.messageID + '" class="comment comment' + j + '"></div>').prependTo(".comments-display");
                $('<div class="comment-infos cmt-nfo' + j + '"></div>').appendTo('.comment' + j + '');
                $('<img src="' + data.profil_pic + '">').appendTo('.cmt-nfo' + j + '');
                $('<a href="/profile/' + data.userID + '" class="comment-user"></a>').text(data.username).appendTo('.cmt-nfo' + j + '');
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