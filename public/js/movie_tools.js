(function ($) {
    var watcher = $('#watch');
    var switcher = $('.onoffswitch-label');
    var q720 = $('.quality720p').text();
    var q1080 = $('.quality1080p').text();
    var index = 1;
    var imdbID = document.location.pathname.split('/')[2];
    var current = q720;
    var socket = io.connect('https://localhost:4422');
    var username = $('.user').text();
    var fullDate = new Date();
    var twoDigitMonth = ((fullDate.getMonth().length + 1) === 1) ? (fullDate.getMonth() + 1) : '0' + (fullDate.getMonth() + 1);
    var currentDate = fullDate.getDate() + "/" + twoDigitMonth + "/" + fullDate.getFullYear();
    var rate = $('.rate-imdb').text().split(':');



    function addScore(score, domElement) {
        $("<span class='stars-container'>")
            .addClass("stars-" + score.toString())
            .text("★★★★★")
            .appendTo(domElement);

    }

    addScore(Math.round(rate) * 10, $('.imdb'));


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
    $('.actors').text($('.actors').text().replace(/\,/g, ' '));
    $('.genres').text($('.genres').text().replace(/\,/g, ' '));
    updateIndicators();

    switcher.click(function () {
        if (current == q720) {
            watcher.attr('href', q1080);
            current = q1080;
            return;
        }
        if (current == q1080) {
            watcher.attr('href', q720);
            current = q720;
            return;
        };

    });

    $.ajax({
        url: 'https://localhost:4422/wallpaper/' + imdbID,
        type: 'GET',
        success: function (data) {
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
        console.log(data);
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


    socket.on("new_message", function (data) {
        j++;
        console.log(data);
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



})(jQuery);