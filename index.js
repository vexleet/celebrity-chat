let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let users = {};

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {

    socket.on('disconnect', function () {
        if(users[socket.id]) {
            let username = users[socket.id].nickname;
            delete users[socket.id];
            io.emit('disconnect',username, users);
        }
        else{
            io.emit('disconnect');
        }
    });
    socket.on('chat message', function (msg, nickname) {
        io.emit('chat message', { nickname: nickname, text: msg });
    });
    socket.on('nickname', function (nickname) {
        if(users[nickname] == undefined){
            let socketId = socket.id;
            var userId = Object.keys(users).length + 100;
            users[socketId] = {
                id: userId,
                nickname: nickname,
            };
        }
        io.emit('nickname', users)
        socket.broadcast.emit('connection', nickname);
    });
    socket.on('is typing', function (nickname) {
        io.emit('is typing', nickname);
    });
    socket.on('is not typing', function (nickname) {
        io.emit('is not typing', nickname);
    });
});

http.listen(3000, function () {
    console.log('listening on http://localhost:3000');
});