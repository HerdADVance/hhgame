const path = require('path');
const express = require('express');
const io = require('socket.io')();

const app = express();

io.path('/socket.io');

app.get('/', (req, res) => {
	res.sendFile(path.resolve(
		__dirname,
		'socket-express-view.html'
	));
});

io.of('/').on('connection', (socket) => {
	socket.emit('welcome', "Hello from server.");
});

io.attach(app.listen(7777, () => {
	console.log('HTTP server and Socket.IO running on port 7777');
}));


