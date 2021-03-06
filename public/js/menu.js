function hide() {
    var body = document.body;
    if (body.className.match(/(?:^|\s)width--sidebar(?!\S)/)) {
        body.className = '';
    } else {
        body.className = 'width--sidebar';
    }
}
document.querySelector("html").classList.add('js');
var fileInput = document.querySelector(".input-file"),
    button = document.querySelector(".input-file-trigger"),
    the_return = document.querySelector(".file-return");
button.addEventListener("keydown", function (event) {
    if (event.keyCode == 13 || event.keyCode == 32) {
        fileInput.focus();
    }
});
button.addEventListener("click", function (event) {
    fileInput.focus();
    return false;
});
(function ($) {
    var emailRegEx = /^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$/;
    var namesRegEx = /^([a-zA-Z\-èêéàôîïùñç]{2,30})$/;
    var passRegEx = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/;
    var fnameValid = '';
    var lnameValid = '';
    var userValid = '';
    var emailValid = '';
    var ret = '';
    var ids = document.location.pathname.split('/');
    var id = ids[ids.length - 1];
    var page = ids[ids.length - 2];
    $(document).on('click', '#menu-settings', function () {
        $('.settigns-manager').fadeIn(1000);
        $('.big-container').css('filter', 'blur(40px)');
    })
    $('#close-manager').click(function () {
        $('.return').text('');
        $('.settigns-manager').fadeOut();
        $('.big-container').css('filter', 'blur(0px)');
    })
    $('#fname').keyup(function () {
        if ($('#fname').val().match(namesRegEx)) {
            $('#fname').css('background', 'rgba(124, 211, 127, 0.2)');
            fnameValid = 'Valid';
        } else {
            $('#fname').css('background', 'rgba(250, 70, 70, 0.31)');
            fnameValid = 'Not valid';
        }
        if ($('#fname').val() === '') {
            $('#fname').css('background', 'rgba(255, 255, 255, 0.12)');
            fnameValid = 'Not valid';
        }
    })
    $('#lname').keyup(function () {
        if ($('#lname').val().match(namesRegEx)) {
            $('#lname').css('background', 'rgba(124, 211, 127, 0.2)');
            lnameValid = 'Valid';
        } else {
            $('#lname').css('background', 'rgba(250, 70, 70, 0.31)');
            lnameValid = 'Not valid';
        }
        if ($('#lname').val() === '') {
            $('#lname').css('background', 'rgba(255, 255, 255, 0.12)');
            lnameValid = 'Not valid';
        }
    })
    $('#user').keyup(function () {
        if ($('#user').val().length > 3) {
            $.ajax({
                url: 'https://localhost:4422/username_checker/' + $('#user').val(),
                method: 'GET',
                success: function (data) {
                    if (data === 'Username Available') {
                        $('#user').css('background', 'rgba(124, 211, 127, 0.2)');
                        userValid = 'Valid';
                    }
                    if (data === 'Username Already Registred') {
                        $('#user').css('background', 'red');
                        userValid = 'Not valid';
                    }
                }
            })
        } else {
            $('#user').css('background', 'rgba(250, 70, 70, 0.31)');
            userValid = 'Not valid';
        }
        if ($('#user').val() === '') {
            $('#userReturn').css('background', 'rgba(255, 255, 255, 0.12)');
            userValid = 'Not valid';
        }
    })
    $('#email').keyup(function () {
        if ($('#email').val().match(emailRegEx)) {
            $.ajax({
                url: 'https://localhost:4422/email_checker/' + $('#email').val(),
                method: 'GET',
                success: function (data) {
                    if (data === 'Email Available') {
                        $('#email').css('background', 'rgba(124, 211, 127, 0.2)');
                        emailValid = 'Valid';
                    }
                    if (data === 'Email Already Registred') {
                        $('#email').css('background', 'rgba(250, 70, 70, 0.31)');
                        emailValid = 'Not valid';
                    }
                }
            })
        } else {
            $('#email').css('background', 'rgba(250, 70, 70, 0.31)');
            emailValid = 'Not valid';
        }
        if ($('#email').val() === '') {
            $('#email').css('background', 'rgba(255, 255, 255, 0.12)');
            emailValid = 'Not valid';
        }
    })
    $('#country-club').change(function () {
        var countryCode = $(this).val();
        $.ajax({
            url: 'https://localhost:4422/manageLanguage/' + countryCode,
            method: 'GET',
            success: function (data) {
                $('.return').css('color', '#82fc78');
                if (!data.status) {
                    $('.return').css('color', '#e04343');
                    $('.return').text(data.message);
                } else {
                    if (data.status === "modify") {
                        $('.return').text(data.message + ' (' + $('#country-club :selected').text() + ')');
                        if (id === "profile.html") {
                            $('.profil-lang').text(countryCode);
                        }
                        if (page === "tv_show.html" || page === "movie.html") {
                            var imdbID = id;
                            $.ajax({
                                url: "https://localhost:4422/changeSyno",
                                method: 'GET',
                                data: {
                                    imdb_code: imdbID
                                },
                                success: function (data) {
                                    if (hudFilm) {
                                        hudFilm.replace(/<div class="sum-txt">(.*?)<\/div>/, function (match, p1) {
                                            hudFilm = hudFilm.replace(p1, data);
                                        });
                                    }
                                    $(".sum-txt").text(data);
                                }
                            })
                        }
                        if (page === "movie.html") {
                            if (!videoJs.paused()) {
                                var oldTracks = videoJs.remoteTextTracks();
                                var i = oldTracks.length;
                                while (i--) {
                                    videoJs.removeRemoteTextTrack(oldTracks[i]);
                                }
                                $.ajax({
                                    url: 'https://localhost:4422/get_movie_sub.html/' + imdbID,
                                    type: 'GET',
                                    success: (function (data) {
                                        if (typeof data == 'string') window.location = data
                                        else {
                                            var track = [];
                                            data.forEach(function (sub) {
                                                sub = {
                                                    src: sub.path,
                                                    kind: "captions",
                                                    srclang: sub.code,
                                                    label: sub.language,
                                                }
                                                videoJs.addRemoteTextTrack(sub)
                                            })
                                        }
                                    })
                                })
                            }
                        }
                        if (page === "tv_show.html") {
                            if (!videoJs.paused()) {
                                var oldTracks = videoJs.remoteTextTracks();
                                var i = oldTracks.length;
                                while (i--) {
                                    videoJs.removeRemoteTextTrack(oldTracks[i]);
                                }
                                $.ajax({
                                    url: 'https://localhost:4422/get_movie_sub.html/' + imdbID,
                                    type: 'GET',
                                    data: {
                                        season: season,
                                        episode: episode,
                                        name: name
                                    },
                                    success: (function (data) {
                                        if (typeof data == 'string') window.location = data
                                        else {
                                            var track = [];
                                            data.forEach(function (sub) {
                                                sub = {
                                                    src: sub.path,
                                                    kind: "captions",
                                                    srclang: sub.code,
                                                    label: sub.language,
                                                }
                                                videoJs.addRemoteTextTrack(sub)
                                            })
                                        }
                                    })
                                })
                            }
                        }
                    } else {
                        $('.return').text(data.message);
                    }
                }
            }
        })
    })
    $('#reset').click(function () {
        $.ajax({
            url: 'https://localhost:4422/manageEmail',
            method: 'GET',
            success: function (data) {
                if (data === 'Failed to send email confirmation, Please retry') {
                    $('.return').css('color', '#e04343');
                    $('.return').text(data);
                } else {
                    $('.return').css('color', '#82fc78');
                    $('.return').text(data);
                }
            }
        })
    })
    $('#upload').click(function () {
        var $form = $('.picture-manager');
        var formdata = (window.FormData) ? new FormData($form[0]) : null;
        var data = (formdata !== null) ? formdata : $form.serialize();
        $.ajax({
            url: 'https://localhost:4422/upload',
            method: 'POST',
            contentType: false,
            processData: false,
            data: data,
            success: function (ret) {
                if (ret.message === 'Your profil picture has been updated') {
                    $('.return').css('color', '#82fc78');
                    $('.return').text(ret.message);
                    if (id === "profile.html") {
                        $('#profil-pic').attr('src', ret.img);
                    }
                } else {
                    $('.return').css('color', '#e04343');
                    $('.return').text(ret.message);
                }
            }
        })
    })
    $('#change').click(function () {
        var request = {
            fname: '',
            lname: '',
            user: '',
            email: ''
        };
        if (fnameValid === 'Valid') {
            request.fname = $('#fname').val();
        }
        if (lnameValid === 'Valid') {
            request.lname = $('#lname').val();
        }
        if (userValid === 'Valid') {
            request.user = $('#user').val();
        }
        if (emailValid === 'Valid') {
            request.email = $('#email').val();
        }
        if (fnameValid === 'Valid' || lnameValid === 'Valid' || userValid === 'Valid' || emailValid === 'Valid') {
            $.ajax({
                url: 'https://localhost:4422/manageProfil',
                method: 'GET',
                data: request,
                success: function (data) {
                    $('.return').css('color', '#82fc78');
                    $('.return').text(data);
                    if (id === "profile.html") {
                        if (fnameValid) {
                            $('.fname').text($('#fname').val());
                        }
                        if (lnameValid) {
                            $('.lname').text($('#lname').val());
                        }
                        if (userValid) {
                            $('.profil-username').html($('#user').val() + ' <div class="profil-lang">' + $('.profil-lang').text() + '</div>');
                        }
                    }

                }
            })
        } else {
            $('.return').css('color', '#e04343');
            $('.return').text('Empty field(s) or wrong input');
        }
    })
})(jQuery)