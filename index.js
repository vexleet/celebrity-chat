let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let users = {};

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    socket.broadcast.emit('connection');

    socket.on('disconnect', function () {
        io.emit('disconnect');
    });
    socket.on('chat message', function (msg, nickname) {
        socket.broadcast.emit('chat message', { nickname: nickname, text: msg });
    });
    socket.on('nickname', function (name) {
        if(users[name] == undefined){
            let socketId = socket.id;
            var userId = Object.keys(users).length + 100;
            users[socketId] = {
                id: userId,
                nickname: name,
            }
        }
        io.emit('nickname', users);
    });
    socket.on('is typing', function () {
        io.emit('is typing');
    });
    socket.on('is not typing', function () {
        io.emit('is not typing');
    });
});

http.listen(3000, function () {
    console.log('listening on http://localhost:3000');
});