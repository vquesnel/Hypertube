(function ($) {
    var watcher = $('#watch');
    var switcher = $('.onoffswitch-label');
    var q720 = $('.quality720p').text();
    var q1080 = $('.quality1080p').text();
    var index = 1;
    var current = q720;



    switcher.click(function () {
        if (current == q720) {
            watcher.attr('href', q1080);
            current = q1080;
            console.log(current);
            return;
        }
        if (current == q1080) {
            watcher.attr('href', q720);
            current = q720;
            console.log(current);
            return;
        };

    });



})(jQuery);
