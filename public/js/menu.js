function hide() {
    var body = document.body;

    if (body.className.match(/(?:^|\s)width--sidebar(?!\S)/)) {
        body.className = '';
    } else {
        body.className = 'width--sidebar';
    }
}
