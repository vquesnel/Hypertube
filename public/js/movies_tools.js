(function ($) {
    var itemsNum = 48;
    var indexClass = 0;
    var libHeight = 4400;

    function addScore(score, domElement) {
        $("<br><span class='stars-container'>")
            .addClass("stars-" + score.toString())
            .text("★★★★★")
            .appendTo(domElement);
    }

    function getDocHeight() {
        var D = document;
        return Math.max(
            D.body.scrollHeight, D.documentElement.scrollHeight,
            D.body.offsetHeight, D.documentElement.offsetHeight,
            D.body.clientHeight, D.documentElement.clientHeight
        );
    }

    $(document).ready(function () {
        $.ajax({
            url: 'https://localhost:4422/movies.html/' + itemsNum,
            method: 'GET',
            success: function (data) {
                for (let k in data) {
                    $('<div class="block ' + indexClass + '"></div>').appendTo('.library');
                    $('<a class="link" href="/movie.html/' + data[k].imdb_code + '"> <img src=' + data[k].cover + '> </a>').appendTo('.' + indexClass + '');
                    $('<div class="infos infos' + indexClass + '" align="left"></div>').appendTo('.' + indexClass + '');
                    $('<div class="title' + indexClass + '">' + data[k].title + '</div>').appendTo('.infos' + indexClass + '');
                    $('<div class="viewed"></div>').appendTo('.title' + indexClass + '');
                    $('<div class="year">' + data[k].year + '</div>').appendTo('.infos' + indexClass + '');
                    addScore(Math.round(data[k].rating) * 10, $('.infos' + indexClass + ''));

                    indexClass++;
                }
                libHeight = libHeight + 4440;
            }
        })
        $(window).scrollTop(libHeight);
        itemsNum = itemsNum + 48;
    })

    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() == getDocHeight()) {
            $.ajax({
                url: 'https://localhost:4422/movies.html/' + itemsNum,
                method: 'GET',
                success: function (data) {
                    for (let k in data) {
                        $('<div class="block ' + indexClass + '"></div>').appendTo('.library');
                        $('<a class="link" href="/movie.html/' + data[k].imdb_code + '"> <img src=' + data[k].cover + '> </a>').appendTo('.' + indexClass + '');
                        $('<div class="infos infos' + indexClass + '" align="left"></div>').appendTo('.' + indexClass + '');
                        $('<div class="title">' + data[k].title + '</div>').appendTo('.infos' + indexClass + '');
                        $('<div class="year">' + data[k].year + '</div>').appendTo('.infos' + indexClass + '');
                        addScore(Math.round(data[k].rating) * 10, $('.infos' + indexClass + ''));
                        indexClass++;
                    }
                    libHeight = libHeight + 4440;
                }
            })
            $(window).scrollTop(libHeight);
            itemsNum = itemsNum + 48;
        }
    });

    $('.opt-btn').click(function () {
        $.ajax({
            url: 'https://localhost:4422/handler/' + $(this) + '@' + itemsNum,
            method: 'GET',
            success: function (data) {
                for (let k in data) {
                    $('<div class="block ' + indexClass + '"></div>').appendTo('.library');
                    $('<a class="link" href="/movie.html/' + data[k].imdb_code + '"> <img src=' + data[k].cover + '> </a>').appendTo('.' + indexClass + '');
                    $('<div class="infos infos' + indexClass + '" align="left"></div>').appendTo('.' + indexClass + '');
                    $('<div class="title">' + data[k].title + '</div>').appendTo('.infos' + indexClass + '');
                    $('<div class="year">' + data[k].year + '</div>').appendTo('.infos' + indexClass + '');
                    indexClass++;
                }
                libHeight = libHeight + 4440;
            }
        })
        $(window).scrollTop(libHeight);
        itemsNum = itemsNum + 48;
    })
    $('.close').click(function () {
        $('.options').fadeOut();
        //        $('.library').css('-webkit-transform":"translate(100px,0)')
        $('.search').fadeOut();
        $('.opt-show').fadeIn();
    })

    $('.filter-btn').click(function () {
        $('.options').fadeIn();
        $('.opt-show').fadeOut();
    })
    $('.search-btn').click(function () {
        $('.options').fadeOut();
        $('.search').fadeIn();
    })


})(jQuery)