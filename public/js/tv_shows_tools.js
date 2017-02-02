(function ($) {
	var itemsNum = 48;
	var indexClass = 0;
	var libHeight = 4400;
	var mask = 0;
	var genre = '';
	var context = 'tv_shows';

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
		for (let k in data) {
			$('<div class="block ' + indexClass + '"></div>').appendTo('.library');
			$('<a class="link" href="/tv_show.html/' + data[k].imdb_code + '"> <img src=' + data[k].cover + '> </a>').appendTo('.' + indexClass + '');
			$('<div class="infos infos' + indexClass + '" align="left"></div>').appendTo('.' + indexClass + '');
			$('<div class="title">' + data[k].title + '</div>').appendTo('.infos' + indexClass + '');
			$('<div class="year">' + data[k].year + '</div>').appendTo('.infos' + indexClass + '');
			addScore(Math.round(data[k].rating) * 10, $('.infos' + indexClass + ''));
			indexClass++;
		}
	}


	function launchLibrary(mode, extra) {
		$('.library').empty();
		$.ajax({
			url: 'https://localhost:4422/tv_shows.html/' + itemsNum + '@' + mode + '@' + extra,
			method: 'GET',
			success: function (data) {
				displayLibrary(data);
				libHeight = libHeight + 4440;
			}
		})
		$(window).scrollTop(libHeight);
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
				}
			})
		}
		if ($('#search-bar').val() === '') {
			launchLibrary(0, '');
		}
	}, 200))



	$(document).ready(function () {
		launchLibrary(0, '');
	})



	$(window).scroll(function () {
		if ($(window).scrollTop() + $(window).height() == getDocHeight()) {
			$.ajax({
				url: 'https://localhost:4422/tv_shows.html/' + itemsNum + '@' + mask + '@' + genre,
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
		itemsNum = 48;
		mask = 1;
		launchLibrary(1, '');
	})
	$('.imdb-filter').click(function () {
		itemsNum = 48;
		mask = 2;
		launchLibrary(2, '');
	})
	$('#genres').change(function () {
		itemsNum = 48;
		mask = 3;
		genre = $(this).val();
		launchLibrary(3, $(this).val());
	})

	$('.close').click(function () {
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
