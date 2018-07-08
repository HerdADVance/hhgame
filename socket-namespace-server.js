const http = require('http');
const fs = require('fs');
const path = require('path');
const io = require('socket.io')();

const app = http.createServer((req, res) => {
	if(req.url === '/'){
		fs.readFile(
			path.resolve(__dirname, 'socket-namespace-client.html'),
			(err, data) => {
				if(err){
					res.writeHead(500);
					return void red.end();
				}
				res.writeHead(200);
				res.end(data);
			}
		)
	} else{
		res.writeHead(403);
		res.end();
	}
});

io.path('/socket.io');

io.of('/en').on('connection', (socket) => {
	socket.on('getData', () => {
		socket.emit('data', {
			title: 'English page',
			msg: 'Welcome to the site.'
		});
	});
});

io.of('/es').on('connection', (socket) => {
	socket.on('getData', () => {
		socket.emit('data', {
			title: 'Spanish page',
			msg: 'Bienvenido a la sitio.'
		});
	});
});

io.attach(app.listen(7777, () => {
	console.log('HTTP server and Socket.IO running on port 7777');
}));