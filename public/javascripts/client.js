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
    $('.nickname').submit(function () {
        $('.nickname').css('display', 'none');
        $('.chat').css('display', 'block');
        socket.emit('nickname', $('#nickname').val());
        $('#nickname').val();
        return false;
    });
    $('#m').keyup(function () {
        if ($('#m').val().length >= 1 && isWriting === false) {
            let nickname = '';
            nickname = allUsers[socket.id].nickname;
            isWriting = true;
            console.log(isWriting);
            socket.emit('is typing', nickname);
        }
        if ($('#m').val().length === 0 && isWriting) {
            let nickname = '';
            nickname = allUsers[socket.id].nickname;
            isWriting = false;
            socket.emit('is not typing', nickname);
        }
    });
    socket.on('connection', function (nickname) {
        $('#messages').append($('<li>').text(`${nickname} connected`));
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
    socket.on('is typing', function (nickname) {
        $('#messages').append($('<li>').text(`${nickname} is typing`).addClass(`${nickname}`));
    });
    socket.on('is not typing', function (nickname) {
        $(`.${nickname}`).remove();
    });
    socket.on('nickname', function (users) {
        allUsers = users;
        showOnlineUsers();
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