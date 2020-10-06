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

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());
app.use(helmet());

// socket.io
io.on('connection', (socket) => {
	console.log('a user connected');
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});

// routes and controllers
app.get('/', (req, res) => {
	res.status(200).json({ message: `Server is listening at ${process.env.API_URL}:${PORT}` });
});
