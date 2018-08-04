let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let fs = require("fs");
let celebrities = JSON.parse(fs.readFileSync('celebrities.json', 'utf8'));
let users = {};

app.get('/', function (req, res) {
    app.use('/public', express.static(__dirname + '/public'));

    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    let randCeleb = celebrities[Math.floor(Math.random() * celebrities.length)];
    if (users[randCeleb] === undefined) {
        let socketId = socket.id;
        let userId = Object.keys(users).length + 100;
        users[socketId] = {
            id: userId,
            nickname: randCeleb,
        };
    }

    socket.broadcast.emit('connection', randCeleb, users);
    socket.emit('connection', 'false', users);

    socket.on('disconnect', function () {
        if (users[socket.id]) {
            let username = users[socket.id].nickname;
            delete users[socket.id];
            io.emit('disconnect', username, users);
        }
        else {
            io.emit('disconnect');
        }
    });

    socket.on('chat message', function (msg, nickname) {
        socket.broadcast.emit('chat message', {nickname: nickname, text: msg});
    });

    socket.on('is typing', function (nickname, className) {
        socket.broadcast.emit('is typing', nickname, className);
    });

    socket.on('is not typing', function (nickname) {
        io.emit('is not typing', nickname);
    });
});

http.listen(3000, function () {
    console.log('listening on http://localhost:3000');
});