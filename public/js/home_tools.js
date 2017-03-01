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
    //    $(document).ready(function () {
    //        initHome();
    //    })
    //
    //    var slider = [];
    //
    //    function initHome() {
    //        var counter = 0;
    //        $.ajax({
    //            url: 'https://localhost:4422/randomContent',
    //            method: 'GET',
    //            success: function (data) {
    //                console.log(data);
    //                data.film.forEach(function (film) {
    //                    slider.push({
    //                        src: film.background_img
    //                    });
    //                })
    //                data.tv.forEach(function (tv) {
    //                    slider.push({
    //                        src: tv.background_img
    //                    });
    //                })
    //
    //                $('.site-content').vegas({
    //                    align: 'center',
    //                    valign: 'center',
    //                    animation: 'kenburns',
    //                    transition: 'blur2',
    //                    loop: true,
    //                    slides: slider
    //                })
    //            }
    //        })
    //    }
    //    setInterval(initHome(), 2000);
    //    $('.cover').on('vegasend', function () {
    //        location.reload();
    //    })
    $(document).ready(function () {
        initHome();
    })

    function initHome() {
        var counter = 0;
        $.ajax({
            url: 'https://localhost:4422/randomContent',
            method: 'GET',
            success: function (data) {
                console.log(data);
                $('.site-content').vegas({
                    align: 'center',
                    animation: 'kenburns',
                    transition: 'blur2',
                    slides: [
                        {
                            src: data[0].background_img
                        },
                        {
                            src: data[1].background_img
                        },
                        {
                            src: data[3].background_img
                        },
                        {
                            src: data[4].background_img
                        },
                        {
                            src: data[5].background_img
                        },
                        {
                            src: data[6].background_img
                        }
                        , {
                            src: data[7].background_img
                        }
                        ,
                        {
                            src: data[8].background_img
                        },
                        {
                            src: data[9].background_img
                        }
                    ]
                })
            }
        })
    }
})(jQuery);