$(function() {
    console.log(false);
    let socket = io();
    let isWriting = false;
    let allUsers = {};

    $('.chat').submit(function () {
        let nickname = '';
        nickname = allUsers[socket.id].nickname;
        if($('#m').val().length >= 1) {
            socket.emit('chat message', $('#m').val(), nickname);
        }
        $('#m').val('');
        return false;
    });

    $('#m').keyup(function () {
        if ($('#m').val().length >= 1 && isWriting === false) {
            let nickname = '';
            nickname = allUsers[socket.id].nickname.split(' ');
            isWriting = true;
            console.log(isWriting);
            socket.emit('is typing', nickname, nickname[nickname.length - 1].toLowerCase());
        }
        if ($('#m').val().length === 0 && isWriting) {
            let nickname = '';
            nickname = allUsers[socket.id].nickname.split(' ');
            console.log(nickname);
            isWriting = false;
            socket.emit('is not typing', nickname[nickname.length - 1].toLowerCase());
        }
    });
    socket.on('connection', function (nickname, users) {
        allUsers = users;
        if(nickname !== 'false') {
            $('#messages').append($('<li>').text(`${nickname} connected`));
        }
        showOnlineUsers();
    });
    socket.on('disconnect', function (nickname, users) {
        if(nickname !== 'transport close') {
            $('#messages').append($('<li>').text(`${nickname} disconnected`));
            allUsers = users;
            console.log(allUsers);
            showOnlineUsers();
        }
    });
    socket.on('chat message', function (msg) {
        $('#messages').append($('<li>').text(`${msg.nickname}: ${msg.text}`));
    });
    socket.on('is typing', function (nickname, className) {
        $('#messages').append($('<li>').text(`${nickname.join(' ')} is typing`).addClass(className));
    });
    socket.on('is not typing', function (nickname) {
        $(`.${nickname}`).remove();
    });

    function showOnlineUsers(){
        console.log(true);
        $('#users').empty();
        $('#users').append($('<li>').text('Online Users'))
        for(let key in allUsers){
            $('#users').append($('<li>').text(allUsers[key].nickname))
        }
    }

});