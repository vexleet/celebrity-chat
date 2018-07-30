let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let celebrities = [
    'Floyd Mayweather',
    'George Clooney',
    'Kylie Jenner',
    'Judy Sheindlin',
    'Dwayne Johnson',
    'Coldplay',
    'Lionel Messi',
    'Ed Sheeran',
    'Cristiano Ronaldo',
    'Bruno Mars',
    'Conor McGregor',
    'Neymar',
    'Howard Stern',
    'Ellen DeGeneres',
    'LeBron James',
    'Rush Limbaugh',
    'Katy Perry',
    'Robert Downey Jr.',
    'Taylor Swift',
    'Dr. Phil McGraw',
    'Roger Federer',
    'Stephen Curry',
    'Jay-Z',
    'Ryan Seacrest',
    'Roger Waters',
    'Matt Ryan',
    'Kim Kardashian West',
    'Chris Hemsworth',
    'Sean Combs',
    'David Copperfield',
    'Gordon Ramsay',
    'Beyoncé Knowles',
    'Matthew Stafford',
    'Kendrick Lamar',
    'Jerry Seinfeld',
    'Kevin Hart',
    'The Weeknd',
    'J.K. Rowling',
    'Kevin Durant',
    'Luke Bryan',
    'Pink',
    'Jimmy Buffett',
    'Lewis Hamilton',
    'Lady Gaga',
    'Calvin Harris',
    'Paul McCartney',
    'Russell Westbrook',
    'Drake',
    'Jennifer Lopez',
    'James Harden',
    'Elton John',
    'Jackie Chan',
    'Steve Harvey',
    'Tiger Woods',
    'Drew Brees',
    'Sofía Vergara',
    'Will Smith',
    'Rafael Nadal',
    'Rihanna',
    'Kenny Chesney'
];

let users = {};

app.get('/', function (req, res) {
    app.use('/public', express.static(__dirname + '/public'));

    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    let randCeleb = celebrities[Math.floor(Math.random() * celebrities.length)];
    if(users[randCeleb] === undefined){
        let socketId = socket.id;
        let userId = Object.keys(users).length + 100;
        users[socketId] = {
            id: userId,
            nickname: randCeleb,
        };
    }
    console.log(randCeleb);

    socket.broadcast.emit('connection', randCeleb, users);
    socket.emit('connection', 'false', users);

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
    socket.on('is typing', function (nickname, className) {
        socket.broadcast.emit('is typing', nickname, className);
    });
    socket.on('is not typing', function (nickname) {
        console.log(nickname);
        io.emit('is not typing', nickname);
    });
});

http.listen(3000, function () {
    console.log('listening on http://localhost:3000');
});