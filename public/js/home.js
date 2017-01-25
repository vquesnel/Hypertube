(function ($) {
	var limit = 50;
	$.ajax({
		url: "https://localhost:4422/autoload/" + limit
		, method: "GET"
		, success: function (data) {
			console.log(data[0].id);
		}
	})
	limit += 50;
})(jQuery)