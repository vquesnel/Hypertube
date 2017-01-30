(function ($) {
	var emailRegEx = /^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$/;
	var namesRegEx = /^([a-zA-Z\-èêéàôîïùñç]{2,30})$/;
	var passRegEx = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/;



	$('#fname').keyup(function () {
		if ($('#fname').val().match(namesRegEx)) {
			$('#fnameReturn').text('Valid First Name');
			$('#fnameReturn').css('color', 'green');
		} else {
			$('#fnameReturn').text('Invalid : No special Chars, 2 minimum');
			$('#fnameReturn').css('color', 'red');
		}
		if ($('#fname').val() === '') {
			$('#fnameReturn').text('');
		}
	})

	$('#lname').keyup(function () {
		if ($('#lname').val().match(namesRegEx)) {
			$('#lnameReturn').text('Valid Last Name');
			$('#lnameReturn').css('color', 'green');
		} else {
			$('#lnameReturn').text('Invalid : No special Chars, 2 minimum');
			$('#lnameReturn').css('color', 'red');
		}
		if ($('#lname').val() === '') {
			$('#lnameReturn').text('');
		}
	})


	$('#user').keyup(function () {
		if ($('#user').val().length > 3) {
			$.ajax({
				url: 'https://localhost:4422/username_checker/' + $('#user').val(),
				method: 'GET',
				success: function (data) {
					if (data === 'Username Available') {
						$('#userReturn').text(data);
						$('#userReturn').css('color', 'green');
					}
					if (data === 'Username Already Registred') {
						$('#userReturn').text(data);
						$('#userReturn').css('color', 'red');
					}
				}
			})
		} else {
			$('#userReturn').text('Username too short (4 min)');
			$('#userReturn').css('color', 'red');
		}
		if ($('#user').val() === '') {
			$('#userReturn').text('');
		}
	})
	$('#email').keyup(function () {
		if ($('#email').val().match(emailRegEx)) {
			$.ajax({
				url: 'https://localhost:4422/email_checker/' + $('#email').val(),
				method: 'GET',
				success: function (data) {
					if (data === 'Email Available') {
						$('#emailReturn').text(data);
						$('#emailReturn').css('color', 'green');
					}
					if (data === 'Email Already Registred') {
						$('#emailReturn').text(data);
						$('#emailReturn').css('color', 'red');
					}
				}
			})
		}
		if ($('#email').val() === '') {
			$('#emailReturn').text('');
		}
	})

	$('#passwd').keyup(function () {
		if ($('#passwd').val().match(passRegEx)) {
			$('#passwdReturn').text('Valid Password');
			$('#passwdReturn').css('color', 'green');
		} else {
			$('#passwdReturn').text('Need 6 char min a Low and Upper Case');
			$('#passwdReturn').css('color', 'red');
		}
		if ($('#passwd').val() === '') {
			$('#passwdReturn').text('');
		}
	})

	$('#conf').keyup(function () {
		if ($('#conf').val().length >= $('#passwd').val().length) {
			if ($('#conf').val() == $('#passwd').val()) {
				$('#confReturn').text('Confirmation Ok');
				$('#confReturn').css('color', 'green');
			} else {
				$('#confReturn').text('Confirmation Doesn\'t match with Password');
				$('#confReturn').css('color', 'red');
			}
			if ($('#conf').val() === '') {
				$('#confReturn').text('');
			}
		}
	})


})(jQuery);
