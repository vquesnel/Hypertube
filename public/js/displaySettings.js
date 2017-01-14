function displaySettings() {
	var checksettings = document.getElementById("settings").getAttribute("style");
	var checkinfos = document.getElementById("infos").getAttribute("style");
	if (checksettings === "display:none") {
		document.getElementById("settings").setAttribute('style', 'display:block');
		document.getElementById("infos").setAttribute('style', 'display:none');
	}
	else if (checkinfos === "display:none") {
		document.getElementById("settings").setAttribute('style', 'display:none');
		document.getElementById("infos").setAttribute('style', 'display:block');
	}
}