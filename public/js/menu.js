function hide() {
	var body = document.body;
	if (body.className.match(/(?:^|\s)width--sidebar(?!\S)/)) {
		body.className = '';
	}
	else {
		body.className = 'width--sidebar';
	}
}
document.querySelector("html").classList.add('js');
var fileInput = document.querySelector(".input-file")
	, button = document.querySelector(".input-file-trigger")
	, the_return = document.querySelector(".file-return");
button.addEventListener("keydown", function (event) {
	if (event.keyCode == 13 || event.keyCode == 32) {
		fileInput.focus();
	}
});
button.addEventListener("click", function (event) {
	fileInput.focus();
	return false;
});
fileInput.addEventListener("change", function (event) {
	the_return.innerHTML = this.value;
});
(function ($) {
	var emailRegEx = /^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$/;
	var namesRegEx = /^([a-zA-Z\-èêéàôîïùñç]{2,30})$/;
	var passRegEx = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/;
	$(document).on('click', '#menu-settings', function () {
		$('.settigns-manager').fadeIn();
		console.log('Fade In FDP');
	})
	$('#close-manager').click(function () {
		$('.settigns-manager').fadeOut();
	})
	$('#fname').keyup(function () {
		if ($('#fname').val().match(namesRegEx)) {
			$('#fname').css('border-color', 'green');
		}
		else {
			$('#fname').css('border-color', 'red');
		}
		if ($('#fname').val() === '') {
			$('#fname').css('border-color', '#fff');
		}
	})
	$('#lname').keyup(function () {
		if ($('#lname').val().match(namesRegEx)) {
			$('#lname').css('border-color', 'green');
		}
		else {
			$('#lname').css('border-color', 'red');
		}
		if ($('#lname').val() === '') {
			$('#lname').css('border-color', '#fff');
		}
	})
	$('#user').keyup(function () {
		if ($('#user').val().length > 3) {
			$.ajax({
				url: 'https://localhost:4422/username_checker/' + $('#user').val()
				, method: 'GET'
				, success: function (data) {
					if (data === 'Username Available') {
						$('#user').css('border-color', 'green');
					}
					if (data === 'Username Already Registred') {
						$('#user').css('border-color', 'red');
					}
				}
			})
		}
		else {
			$('#user').css('border-color', 'red');
		}
		if ($('#user').val() === '') {
			$('#userReturn').css('border-color', '#fff');
		}
	})
	$('#email').keyup(function () {
		if ($('#email').val().match(emailRegEx)) {
			$.ajax({
				url: 'https://localhost:4422/email_checker/' + $('#email').val()
				, method: 'GET'
				, success: function (data) {
					if (data === 'Email Available') {
						$('#email').css('border-color', 'green');
					}
					if (data === 'Email Already Registred') {
						$('#email').css('border-color', 'red');
					}
				}
			})
		}
		if ($('#email').val() === '') {
			$('#email').css('border-color', '#fff');
		}
	})
})(jQuery)