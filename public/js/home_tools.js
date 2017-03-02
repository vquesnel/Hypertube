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
                data.forEach(function (pic) {
                    slider.push({
                        src: pic.background_img
                    });
                })

                $('.site-content').vegas({
                    align: 'center',
                    animation: 'kenburns',
                    transition: 'blur2',
                    loop: true,
                    slides: slider
                })
            }
        })
    }

})(jQuery);