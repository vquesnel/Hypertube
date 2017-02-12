(function ($) {

    var docweighttmp;
    var itemsNum = 48;
    var indexClass = 0;
    var libHeight = 0;
    var mask = 0;
    var genre = '';
    var context = 'movies';

	$('#movies').css('color', '#61AEFF');

    function addScore(score, domElement) {
        $("<br><span class='stars-container'>")
            .addClass("stars-" + score.toString())
            .text("★★★★★")
            .appendTo(domElement);
    }

    function debounce(fn, duration) {
        var timer;
        return function () {
            clearTimeout(timer);
            timer = setTimeout(fn, duration)
        }
    }

    function getDocHeight() {
        var D = document;
        return Math.max(
            D.body.scrollHeight, D.documentElement.scrollHeight,
            D.body.offsetHeight, D.documentElement.offsetHeight,
            D.body.clientHeight, D.documentElement.clientHeight
        );
    }

    function displayLibrary(data) {
        for (var k in data) {
            $('<div class="block ' + indexClass + '"></div>').appendTo('.library');
            $('<a class="link" href="/movie.html/' + data[k].imdb_code + '"> <img src=' + data[k].cover + '> </a>').appendTo('.' + indexClass + '');
            $('<div class="infos infos' + indexClass + '" align="left"></div>').appendTo('.' + indexClass + '');
            $('<div class="title">' + data[k].title + '</div>').appendTo('.infos' + indexClass + '');
            $('<div class="year">' + data[k].year + '</div>').appendTo('.infos' + indexClass + '');
            addScore(Math.round(data[k].rating) * 10, $('.infos' + indexClass + ''));
            indexClass++;
        }
    }


    function launchLibrary(mode, extra) {
        $('.library').empty();
$(window).scrollTop(0);
        $.ajax({
            url: 'https://localhost:4422/movies.html/' + itemsNum + '@' + mode + '@' + extra,
            method: 'GET',
            success: function (data) {
                displayLibrary(data);
                libHeight = libHeight + 4440;
            }
			})
        itemsNum = itemsNum + 48;
    }

    $('#search-bar').keyup(debounce(function () {
        $('.library').empty();
        var toFind = $('#search-bar').val().trim();
        var lenFind = toFind.length;

        if (toFind != '') {
            $.ajax({
                url: 'https://localhost:4422/search/' + toFind + '@' + lenFind + '@' + context,
                method: 'GET',
                success: function (data) {
                    displayLibrary(data);
                    if (!data[0]) {
                        $('<div class="no-match">No Movies Found :(</div>').appendTo('.library');
                    }
                    mask = 666;
                }
            })
        }
        if ($('#search-bar').val() === '') {
            mask = 0;
            launchLibrary(0, '');
        }
    }, 200))



    $(document).ready(function () {
        launchLibrary(0, '');
    docweighttmp = getDocHeight();

    })



    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() == getDocHeight() && mask >= 0 && mask < 666) {
            $.ajax({
                url: 'https://localhost:4422/movies.html/' + itemsNum + '@' + mask + '@' + genre,
                method: 'GET',
                success: function (data) {
                    displayLibrary(data);
                    libHeight = libHeight + 4440;
                }

            })
            $(window).scrollTop(libHeight);
            itemsNum = itemsNum + 48;
        }
    });



    $('.az').click(function () {
 $(window).height(docweighttmp);
        libHeight = 0;
        $(window).scrollTop(0);

        itemsNum = 48;
        mask = 1;
        launchLibrary(1, '');
    })
    $('.imdb-filter').click(function () {
 $(window).height(docweighttmp);
        libHeight = 0;
        $(window).scrollTop(0);

        itemsNum = 48;
        mask = 2;
        launchLibrary(2, '');
    })
    $('#genres').change(function () {
 $(window).height(docweighttmp);
        libHeight = 0;
        $(window).scrollTop(0);

        itemsNum = 48;
        mask = 3;
        genre = $(this).val();
        launchLibrary(3, $(this).val());
    })

    $('.close').click(function () {
 $('#search-bar').val('');
        $('.options').fadeOut();
        $('.search').fadeOut();
        $('.opt-show').fadeIn();
    })

    $('.filter-btn').click(function () {
        $('.options').fadeIn();
        $('.opt-show').fadeOut();
    })
    $('.search-btn').click(function () {
        $('.search').fadeIn();
        $('.opt-show').fadeOut();
    })



})(jQuery)
