function previewFile() {
	console.log('sdfsdfsdfsfsfsdfssfsdf')
	var preview = document.getElementById('photodisplay');
	var file = document.querySelector('input[type=file]').files[0];
	console.log(file);
	var reader = new FileReader();
	reader.addEventListener("load", function () {
		preview.src = reader.result;
	}, false);
	if (file) {
		reader.readAsDataURL(file);
	}
}