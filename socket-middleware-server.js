const http = require('http');
const fs = require('fs');
const path = require('path');
const io = require('socket.io')();

const app = http.createServer((req, res) => {
	if(req.url === '/'){
		fs.readFile(
			path.resolve(__dirname, 'socket-middleware-client.html'),
			(err, data) => {
				if(err){
					res.writeHead(500);
					return void res.end();
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

const users = [
	{username: 'alex', password: 'abc'},
	{username: 'ben', password: 'def'},
	{username: 'cody', password: 'ghi'}
];

const userMatch = (username, password) => {
	//console.log(username);
	//console.log(password);
	var x = users.find(user => (
		user.username === username &&
		user.password === password
	));
	return x;

};

const isUserLoggedIn = (socket, next) => {
	const {session} = socket.request;
	if(session && session.isLogged){
		next();
	}
};

const namespace = {
	home: io.of('/home').use(isUserLoggedIn),
	login: io.of('/login')
};

namespace.login.on('connection', socket => {
	socket.use((packet, next) => {
		const [evtName, data] = packet;
		const user = data;
		if(evtName === 'tryLogin' && user.username === 'alex'){
			socket.emit('loginError', {
				message: 'Banned user.'
			})
		} else{
			//next();
		}
	});
	socket.on('tryLogin', userData => {
		const {username, password} = userData;

		const request = socket.request;
		console.log(userMatch(username, password));
		if(userMatch(username, password)){
			request.session = {
				isLogged: true,
				username
			}
			socket.emit('loginSuccess');
		} else{
			socket.emit('loginError', {
				message: 'Invalid credentials.'
			})
		}
	});
});

io.attach(app.listen(7777, () => {
	console.log('HTTP server and Socket.IO running on port 7777');
}));


