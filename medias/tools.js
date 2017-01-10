var tools = {
	protectfield: function (message) {
		message = message.replace(/&/g, '&amp;');
		message = message.replace(/</g, '&lt;');
		message = message.replace(/>/g, '&gt;');
		return (message);
	}
	, isValidName: function (name) {
		var regex = /^([a-zA-Z\-èêéàôîïùñç]{2,17})$/;
		return regex.test(name);
	}
	, isValidEmail: function (email) {
		var regex = /^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$/;
		return regex.test(email);
	}
	, isValidUsername: function (login) {
		var regex = /^([a-zA-Z\-0-9_]{4,17})$/;
		return regex.test(login);
	}
	, isValidPassword: function (password) {
		var regPass = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/;
		return regPass.test(password);
	}
	, hasValidExtension: function (file) {
		var allowedTypes = ['png', 'jpg', 'jpeg', 'gif']
			, fileType = file.name.split('.').pop().toLowerCase();
		if (allowedTypes.indexOf(fileType) !== -1) return (true);
		return (false);
	}
};
module.exports = tools