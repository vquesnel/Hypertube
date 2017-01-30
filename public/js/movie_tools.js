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
            $('.cover').css("background-image", "linear-gradient( rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65) ), url(" + data + ")");
        }
    })
    socket.emit('check_message', imdbID);

    $('.submit-message').click(function () {
        var messageVal = $('.textarea').val().trim()
        $('.textarea').val('');
        if (messageVal != '') {
            socket.emit('new-message', {
                value: messageVal,
                username: username,
                imdbID: imdbID,
                date: currentDate
            });
        }

    });
    var j = 0;
    socket.on('old_message', function (data) {
        for (var k in data) {
            var style = k % 2 + 1;
            $('<div class="comment b' + style + ' ' + k + '"></div>').appendTo(".comments-container");
            $('<div class="user-pic"><img src="/img/cinema-2.png"></div>').appendTo('.' + k + '');
            $('<div class="username"></div>').text(data[k].username).appendTo('.' + k + '');
            $('<div class="date"></div>').text(data[k].date_message).appendTo('.' + k + '');
            $('<div class="comment-value"></div>').text(data[k].content).appendTo('.' + k + '');
            j = k;
        }

    })


    socket.on("new_message", function (data) {
        j++;

        if (data.imdbID === imdbID) {
            var style = j % 2 + 1;
            $('<div class="comment b' + style + ' ' + j + '"></div>').appendTo(".comments-container");
            $('<div class="user-pic"><img src="/img/cinema-2.png"></div>').appendTo('.' + j + '');
            $('<div class="username"></div>').text(data.username).appendTo('.' + j + '');
            $('<div class="date"></div>').text(data.date).appendTo('.' + j + '');
            $('<div class="comment-value"></div>').text(data.value).appendTo('.' + j + '');
            $('#msgtpl').animate({
                scrollTop: $('#msgtpl').prop('scrollHeight')
            }, 500);

        }
    });



})(jQuery);