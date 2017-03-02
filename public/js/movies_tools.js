(function ($) {
    var docweighttmp;
    var itemsNum = 48;
    var indexClass = 0;
    var libHeight = 0;
    var mask = 0;
    var values;
    var genre = '';
    var tmpmask = 0;
    var context = 'movies';
    $('#movies').css('color', '#61AEFF');

    function addScore(score, domElement) {
        $("<br><span class='stars-container'>").addClass("stars-" + score.toString()).text("★★★★★").appendTo(domElement);
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
        return Math.max(D.body.scrollHeight, D.documentElement.scrollHeight, D.body.offsetHeight, D.documentElement.offsetHeight, D.body.clientHeight, D.documentElement.clientHeight);
    }

    function displayLibrary(data) {
        data.forEach(function (movie) {
            $('<div class="block ' + indexClass + '"></div>').appendTo('.library');
            $('<a class="link" href="/movie.html/' + movie.imdb_code + '"> <img src=' + movie.cover + '> </a>').appendTo('.' + indexClass + '');
            $('<div class="infos infos' + indexClass + '" align="left"></div>').appendTo('.' + indexClass + '');
            if (movie.download) {
                $('<div class="title">' + movie.title + ' &#9889</div>').appendTo('.infos' + indexClass + '');
            } else {
                $('<div class="title">' + movie.title + '</div>').appendTo('.infos' + indexClass + '');
            }
            if (movie.viewed) $('<div class="viewed"></div>').appendTo('.infos' + indexClass + '');
            $('<div class="year">' + movie.year + '</div>').appendTo('.infos' + indexClass + '');
            addScore(Math.round(movie.rating) * 10, $('.infos' + indexClass + ''));
            indexClass++;
        })
    }

    function launchLibrary(mode, extra) {
        $(window).scrollTop(0);
        $.ajax({
            url: 'https://localhost:4422/movies',
            method: 'GET',
            data: {
                itemsNum: itemsNum,
                mask: mode,
                genre: extra,
                year: values
            },
            success: function (data) {
                if (typeof data == 'string') window.location = data
                else {
                    if (!data[0]) {
                        $('<div class="no-match">No Movies Found :(</div>').appendTo('.library');
                    } else {
                        displayLibrary(data);
                        libHeight += getDocHeight();
                        itemsNum += 48;
                    }
                }
            }
        })
    }
    $('#search-bar').keyup(debounce(function () {
        var toFind = $('#search-bar').val().trim();
        var lenFind = toFind.length;
        $(window).height(docweighttmp);
        libHeight = 0;
        $(window).scrollTop(0);
        if (lenFind > 0) {
            $.ajax({
                url: 'https://localhost:4422/search',
                method: 'GET',
                data: {
                    toFind: toFind,
                    lenFind: lenFind,
                    context: context,
                    mask: mask
                },
                success: function (data) {
                    if (typeof data == 'string') window.location = data
                    else {
                        $('.library').empty();
                        if (!data[0]) {
                            $('<div class="no-match">No Movies Found :(</div>').appendTo('.library');
                        } else {
                            indexClass = 0;
                            tmpmask = 666;
                            displayLibrary(data);
                        }
                    }
                }
            })
        } else {
            itemsNum = 0;
            $('.library').empty();
            launchLibrary(mask, '');
        }
    }, 200))
    $(document).ready(function () {
        launchLibrary(0, '');
        docweighttmp = getDocHeight();
    })
    $(window).data('ajaxready', true);
    $(window).scroll(function () {
        if ($(window).data('ajaxready') == false) return;
        else if ($(window).scrollTop() + $(window).height() === $(document).height() /*> getDocHeight() - 1*/ && mask >= 0 && tmpmask !== 666 && libHeight !== 0) {
            $(window).data('ajaxready', false);
            $.ajax({
                url: 'https://localhost:4422/movies',
                method: 'GET',
                data: {
                    itemsNum: itemsNum,
                    mask: mask,
                    genre: genre,
                    year: values
                },
                success: function (data) {
                    if (typeof data == 'string') window.location = data
                    else {
                        displayLibrary(data);
                        libHeight += getDocHeight();
                        itemsNum += 48;
                        $(window).data('ajaxready', true);
                    }
                }
            })
            $(window).scrollTop(libHeight);
        }
    });
    var $range = $("#date");

    $range.ionRangeSlider({
        hide_min_max: true,
        keyboard: true,
        min: 1918,
        max: 2017,
        from: 1918,
        to: 2017,
        type: 'double',
        step: 1,
        grid: true,
        onFinish: function (data) {
            $('#genres').prop('selectedIndex', 0);
            values = [data.from, data.to];
            indexClass = 0
            $('.library').empty();
            $(window).height(docweighttmp);
            libHeight = 0;
            itemsNum = 48;
            mask = 4;
            launchLibrary(mask, '');
        }
    });
    var slider = $range.data("ionRangeSlider");
    $('.az').click(function () {
        $('#genres').prop('selectedIndex', 0);
        slider.reset();
        indexClass = 0
        $('.library').empty();
        libHeight = 0;
        $(window).height(docweighttmp);
        itemsNum = 48;
        mask = 1;
        launchLibrary(mask, '');
    })
    $('.imdb-filter').click(function () {
        $('#genres').prop('selectedIndex', 0);
        slider.reset();
        indexClass = 0
        $('.library').empty();
        libHeight = 0;
        $(window).height(docweighttmp);
        itemsNum = 48;
        mask = 2;
        launchLibrary(mask, '');
    })
    $('#genres').change(function () {
        slider.reset();
        indexClass = 0
        $('.library').empty();
        $(window).height(docweighttmp);
        libHeight = 0;
        itemsNum = 48;
        mask = 3;
        genre = $(this).val();
        launchLibrary(mask, $(this).val());
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