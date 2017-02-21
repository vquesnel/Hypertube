(function ($) {

	var indexClass = 0;

	function addScore(score, domElement) {
		$("<br><span class='stars-container'>")
			.addClass("stars-" + score.toString())
			.text("★★★★★")
			.appendTo(domElement);
	}


	function displayLibrary(data, node, context) {

		for (var k in data) {
			$('<div class="block ' + indexClass + '"></div>').appendTo('.' + node);
			$('<a class="link" href="/' + context + '.html/' + data[k].imdb_code + '"> <img src=' + data[k].cover + '> </a>').appendTo('.' + indexClass + '');
			$('<div class="infos infos' + indexClass + '" align="left"></div>').appendTo('.' + indexClass + '');
			$('<div class="title">' + data[k].title + '</div>').appendTo('.infos' + indexClass + '');
			$('<div class="year">' + data[k].year + '</div>').appendTo('.infos' + indexClass + '');
			addScore(Math.round(data[k].rating) * 10, $('.infos' + indexClass + ''));
			indexClass++;
		}
	}

	function displayComments(data, node) {
		var clicker = 0;
		for (var k in data) {
			if (data[k].context == 'movie') {
				$('<div class="block ' + indexClass + ' com"></div>').appendTo('.' + node);
				$('<a class="link" href="/' + data[k].context + '.html/' + data[k].imdbID + '"> <img src=' + data[k].movieCover + '> </a>').appendTo('.' + indexClass + '');
				$('<div class="infos infos' + indexClass + '" align="left"></div>').appendTo('.' + indexClass + '');
				$('<div class="title">' + data[k].movieTitle + '</div>').appendTo('.infos' + indexClass + '');
				$('<div class="year">' + data[k].movieYear + '</div>').appendTo('.infos' + indexClass + '');
				addScore(Math.round(data[k].movieRating) * 10, $('.infos' + indexClass + ''));
				$('<div class="messageID">' + data[k].messageID + '</div>').appendTo('.' + indexClass + '');
			}
			if (data[k].context == 'tv_show') {
				$('<div class="block ' + indexClass + ' com"></div>').appendTo('.' + node);
				$('<a class="link" href="/' + data[k].context + '.html/' + data[k].imdbID + '"> <img src=' + data[k].tvCover + '> </a>').appendTo('.' + indexClass + '');
				$('<div class="infos infos' + indexClass + '" align="left"></div>').appendTo('.' + indexClass + '');
				$('<div class="title">' + data[k].tvTitle + '</div>').appendTo('.infos' + indexClass + '');
				$('<div class="year">' + data[k].tvYear + '</div>').appendTo('.infos' + indexClass + '');
				addScore(Math.round(data[k].tvRating) * 10, $('.infos' + indexClass + ''));
				$('<div class="messageID">' + data[k].messageID + '</div>').appendTo('.' + indexClass + '');
			}
			indexClass++;
		}
	}
	$(document).on('click', '.com', function () {
		localStorage.setItem('comment', $(this).find('.messageID').text());
	})

	$(document).ready(function () {
		$.ajax({
			url: 'https://localhost:4422/displayMoviesHistory',
			method: 'GET',
			success: function (movies) {
				if (typeof movies == 'string') window.location = movies
					else {

				displayLibrary(movies, 'last-movies', 'movie');
					}
			}
		})
		$.ajax({
			url: 'https://localhost:4422/displayTvHistory',
			method: 'GET',
			success: function (tv) {
				//console.log(tv);
				if (typeof tv == 'string') window.location = tv;
					else {tv
				displayLibrary(tv, 'last-tv', 'tv_show');
					}
			}
		})
		$.ajax({
			url: 'https://localhost:4422/displayCommentsHistory',
			method: 'GET',
			success: function (data) {
				if (typeof data == 'string') window.location = data
					else {
				displayComments(data, 'last-com');
					}

			}
		})
	})


})(jQuery);
