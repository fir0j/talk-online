require('dotenv').config();
const PORT = process.env.PORT || 8080;

const express = require('express');
const app = express();
const httpServer = app.listen(PORT, () => {
	// no need of http module for creating http server as shown in docs.
	console.log(`Server is listening at ${process.env.API_URL}:${PORT}`);
});
const io = require('socket.io')(httpServer);
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const { addUser, removeUser, getUser, getUsersOfRoom } = require('./user.controller');

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());
app.use(helmet());

// socket.io
// socket.io events like connection, chat message and so on informs what type of message the event is expected to carry.
// events and payload are transferred together always
io.on('connection', (socket) => {
	socket.on('join', ({ name, room }, callback) => {
		const result = addUser({ id: socket.id, name, room });
		if (!result.user) return callback(result.error);
		// informing the user
		const { user } = result;
		socket.emit('welcome', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` });
		// informing everyone of his room
		socket.broadcast.to(user.room).emit('welcome', { user: 'admin', text: `${user.name} has joined.` });
		socket.join(user.room); // what is happening here?
		io.to(user.room).emit('roomMembers', { room: user.room, users: getUsersOfRoom(user.room) });
	});

	// receiving chat message from a particular user(socket) and emitting that messages to all others users of a particular room
	socket.on('chat', (payload, callback) => {
		const user = getUser(socket.id);
		if (!user) {
			// used by io server to do something after the message is sent.
			callback({ serverError: 'error fetching user. received invalid user' });
		} else {
			io.to(user.room).emit('chat', { user: user.name, text: payload });
		}
	});

	socket.on('disconnect', () => {
		const user = removeUser(socket.id);
		if (user) {
			io.to(user.room).emit('byebye', {user:'admin', text: `${user.name} has left!!!` });
		}
		console.log('Disconnected');
	});
});

// routes and controllers
app.get('/', (req, res) => {
	res.status(200).json({ message: `Server is listening at ${process.env.API_URL}:${PORT}` });
});
