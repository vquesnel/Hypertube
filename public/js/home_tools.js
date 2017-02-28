(function ($) {


    //	function displayHome(obj) {
    //		$('<div class="data-title">' + obj[0].title.trim() + '</div>').appendTo('.hud-film');
    //		$.ajax({
    //			url: 'https://localhost:4422/wallpaper/' + obj[0].imdb_code,
    //			type: 'GET',
    //			success: function (data) {
    //				if (typeof data == 'string') window.location = data
    //				else {
    //					$('.cover').css("background-image", "-webkit-linear-gradient(left, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.5) ), url(" + data.picture + ")");
    //				}
    //			}
    //		})
    //	}
    $(document).ready(function () {
        initHome();
    })

    var slider = [];

    function initHome() {
        var counter = 0;
        $.ajax({
            url: 'https://localhost:4422/randomContent',
            method: 'GET',
            success: function (data) {
                console.log(data);
                data.film.forEach(function (film) {
                    slider.push({
                        src: film.background_img
                    });
                })
                data.tv.forEach(function (tv) {
                    slider.push({
                        src: tv.background_img
                    });
                })

                $('.cover').vegas({
                    align: 'center',
                    animation: 'kenburns',
                    transition: 'blur2',
                    loop: true,
                    slides: slider
                })
                $('.cover').on('vegaswalk', function () {
                    $(".data-title").remove();

                    if (counter < 5) {
                        $('<div class="data-title">' + data.film[counter].title.trim() + '</div>').appendTo('.hud-film');

                    } else {
                        $('<div class="data-title">' + data.tv[counter - 5].title.trim() + '</div>').appendTo('.hud-film');
                    }
                    counter++;

                })
            }
        })
    }
    //    setInterval(initHome(), 2000);
    //    $('.cover').on('vegasend', function () {
    //        location.reload();
    //    })

})(jQuery);