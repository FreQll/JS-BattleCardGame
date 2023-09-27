//BEFORE STARTING SERVER
//(for windows)
//Get-Content db.sql | mysql -u root -p

const port = 3000;

const User = require('./models/user');
const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const gameRoom = require('./gameRoom');

const loginRouter = require('./loginRouter');
const gameRouter = require('./gameRouter');
const imageRouter = require('./imageRouter');
const mainRouter = require('./mainRouter');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const bodyParser = require('body-parser');
const e = require('express');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

session = require('express-session');
sessionMiddleware = session({
    secret: 'yousecretkey3',
    saveUninitialized: true,
    resave: true
});
app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);
app.use(loginRouter);
app.use(gameRouter);
app.use(imageRouter);
app.use(mainRouter);

//Game Socket Logic
const rooms = [[null, null], [null, null]];
const players = [];


io.on('connection', (socket) => {
    if (socket.request.session.data === undefined) {
        socket.disconnect();
        return;
    }
    for (let i = 0; i < players.length; i++) {
        if (players[i].request.session.data.login === socket.request.session.data.login) {
            socket.emit('err_second_window');
            return;
        }
    }
    players.push(socket);
    room_id = -1;
    player_id = -1;
    for (let i = 0; i < rooms.length; i++) {
        if (rooms[i][0] !== null && rooms[i][1] === null) {
            rooms[i][1] = socket;
            room_id = i;
            player_id = 1;
            break;
        }
    }
    if (room_id === -1) {
        for (let i = 0; i < rooms.length; i++) {
            if (rooms[i][0] === null) {
                rooms[i][0] = socket;
                room_id = i;
                player_id = 0;
                break;
            }
        }
    }
    if (room_id === -1) {
        rooms.push([socket, null]);
        room_id = rooms.length - 1;
        player_id = 0;
    }
    if (player_id === 1) {
        const myLogin = socket.request.session.data.login;
        const opLogin = rooms[room_id][0].request.session.data.login;
        socket.emit('opponent_connected', { myLogin: myLogin, opLogin: opLogin });
        rooms[room_id][0].emit('opponent_connected', { myLogin: opLogin, opLogin: myLogin });
        let timerT = setTimeout(() => {
            gameRoom(rooms[room_id][0], rooms[room_id][1]);
        }, 5000);
        socket.request.session.data.timerT = timerT;
    }
    else {
        socket.emit('waiting_for_opponent');
    }
    socket.on('disconnect', () => {
        let room_id = socket.request.session.data.room_id;
        let player_id = socket.request.session.data.player_id;
        if (rooms[room_id][1] !== null) {
            if (rooms[room_id][1].request.session.data.timerI !== undefined) {
                console.log('clearing interval');
                clearInterval(rooms[room_id][1].request.session.data.timerI);
                rooms[room_id][1].request.session.data.timerI = undefined;
            }
            if (rooms[room_id][1].request.session.data.timerT !== undefined) {
                console.log('clearing timeout');
                clearTimeout(rooms[room_id][1].request.session.data.timerT);
                rooms[room_id][1].request.session.data.timerT = undefined;
            }
        }
        players.splice(players.indexOf(socket), 1);
        let opponent_id = (player_id + 1) % 2;
        if (rooms[room_id][opponent_id] != null) {
            console.log(`sending opponent_disconnected to ${rooms[room_id][opponent_id].request.session.data.login}`);
            rooms[room_id][opponent_id].emit('opponent_disconnected');
        }
        rooms[room_id][0] = null;
        rooms[room_id][1] = null;
        console.log(`Disconnected: ${socket.request.session.data.login} Room: ${room_id} Player: ${player_id}`);
    });
    socket.request.session.data.room_id = room_id;
    socket.request.session.data.player_id = player_id;
    console.log(`New connection: ${socket.request.session.data.login} Room: ${room_id} Player: ${player_id}`);
});
// 1 Меню
// 2 logaut
// 3 отрисовка карт
// 4 механіка таймера