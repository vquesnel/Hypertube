(function ($) {
	var docweighttmp;
	var itemsNum = 48;
	var indexClass = 0;
	var libHeight = 0;
	var mask = 0;
	var tmpmask = 0;
	var genre = '';
	var values;
	var context = 'tv_shows';
	$('#tvshows').css('color', '#61AEFF');

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
		data.forEach(function (tv_show) {
			$('<div class="block ' + indexClass + '"></div>').appendTo('.library');
			$('<a class="link" href="/tv_show.html/' + tv_show.imdb_code + '"> <img src=' + tv_show.cover + '> </a>').appendTo('.' + indexClass + '');
			$('<div class="infos infos' + indexClass + '" align="left"></div>').appendTo('.' + indexClass + '');
			if (tv_show.download) {
				$('<div class="title">' + tv_show.title + ' &#9889</div>').appendTo('.infos' + indexClass + '');
			}
			else {
				$('<div class="title">' + tv_show.title + '</div>').appendTo('.infos' + indexClass + '');
			}
			if (tv_show.viewed) $('<div class="viewed"></div>').appendTo('.infos' + indexClass + '');
			$('<div class="year">' + tv_show.year + '</div>').appendTo('.infos' + indexClass + '');
			addScore(Math.round(tv_show.rating) * 10, $('.infos' + indexClass + ''));
			indexClass++;
		})
	}

	function launchLibrary(mode, extra) {
		$(window).scrollTop(0);
		$.ajax({
			url: 'https://localhost:4422/tv_shows'
			, data: {
				itemsNum: itemsNum
				, mask: mask
				, genre: genre
				, year: values
			}
			, method: 'GET'
			, success: function (data) {
				if (typeof data == 'string') window.location = data
				else {
					if (!data[0]) {
						$('<div class="no-match">No Tv Shows Found :(</div>').appendTo('.library');
					}
					else {
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
				url: 'https://localhost:4422/search'
				, data: {
					toFind: toFind
					, lenFind: lenFind
					, context: context
					, mask: mask
				}
				, method: 'GET'
				, success: function (data) {
					if (typeof data == 'string') window.location = data
					else {
						$('.library').empty();
						if (!data[0]) {
							$('<div class="no-match">No Tv Shows Found :(</div>').appendTo('.library');
						}
						else {
							indexClass = 0;
							tmpmask = 666;
							displayLibrary(data);
						}
					}
				}
			})
		}
		else {
			itemsNum = 0;
			$('.library').empty();
			launchLibrary(mask, '');
		}
	}, 200))
	$(document).ready(function () {
		docweighttmp = getDocHeight();
		launchLibrary(0, '');
	})
	$(window).data('ajaxready', true);
	$(window).scroll(function () {
		if ($(window).data('ajaxready') == false) return;
		if ($(window).scrollTop() + $(window).height() > getDocHeight() - 1 && mask >= 0 && tmpmask !== 666 && libHeight !== 0) {
			$(window).data('ajaxready', false);
			$.ajax({
				url: 'https://localhost:4422/tv_shows'
				, data: {
					itemsNum: itemsNum
					, mask: mask
					, genre: genre
					, year: values
				}
				, method: 'GET'
				, success: function (data) {
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
	$('.az').click(function () {
		indexClass = 0
		$('.library').empty();
		libHeight = 0;
		$(window).height(docweighttmp);
		itemsNum = 48;
		mask = 1;
		launchLibrary(mask, '');
	})
	$('.imdb-filter').click(function () {
		indexClass = 0
		$('.library').empty();
		$(window).height(docweighttmp);
		libHeight = 0;
		itemsNum = 48;
		mask = 2;
		launchLibrary(mask, '');
	})
	$("#date").ionRangeSlider({
	    hide_min_max: true,
	    keyboard: true,
	    min: 1969,
	    max: 2017,
	    from: 1969,
	    to: 2017,
	    type: 'double',
	    step: 1,
	    grid: true,
	    onFinish: function (data) {
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
	$('#genres').change(function () {
		indexClass = 0
		$('.library').empty();
		$(window).height(docweighttmp);
		libHeight = 0;
		itemsNum = 48;
		mask = 3;
		genre = $(this).val();
		launchLibrary(mask, $(this).val());
	});
	$('.close').click(function () {
		$('#search-bar').val('');
		$('.options').fadeOut();
		$('.search').fadeOut();
		$('.opt-show').fadeIn();
	});
	$('.filter-btn').click(function () {
		$('.options').fadeIn();
		$('.opt-show').fadeOut();
	});
	$('.search-btn').click(function () {
		$('.search').fadeIn();
		$('.opt-show').fadeOut();
	});
	$('.filter-btn').click(function () {
		$('.options').fadeIn();
		$('.opt-show').fadeOut();
	});
	$('.search-btn').click(function () {
		$('.search').fadeIn();
		$('.opt-show').fadeOut();
	})
})(jQuery)