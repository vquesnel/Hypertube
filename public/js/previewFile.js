function previewFile() {
	var preview = document.getElementById('photodisplay');
	var file = document.querySelector('input[type=file]').files[0];
	var reader = new FileReader();
	reader.addEventListener("load", function () {
		preview.src = reader.result;
	}, false);
	if (file) {
		reader.readAsDataURL(file);
	}
}

function Changeprofile_pic() {
	var pic = document.getElementById('photodisplay');
	console.log(pic);
	var socket = io.connect('https://localhost:4422');
	socket.emit("changeprofile_pic", {
		picture: pic.src
	});
	var usr_pic = document.getElementById("profil_pic");
	var src = document.getElementById("profil_pic").src;
	usr_pic.src = pic.src;
}