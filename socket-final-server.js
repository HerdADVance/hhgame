const path = require('path');
const express = require('express');
const io = require('socket.io')();
const expressSession = require('express-session');

const app = express();

io.path('/socket.io');

// Defines Express session middleware
const session = expressSession({
	secret: 'HH7',
	resave: true,
	saveUninitialized: true
});

// Defines Socket.io namespace middleware that uses above middleware to generate session object
const ioSession = (socket, next) => {
	const req = socket.request;
	const res = socket.request.res;
	session(req, res, (err) => {
		next(err);
		req.session.save();
	});
}

// Namespaces for /home and /login
const home = io.of('/home');
const login = io.of('login');
const logout = io.of('/logout');

// Dummy data
const users = [
	{username: 'alex', password: 'abc'},
	{username: 'ben', password: 'def'},
	{username: 'cody', password: 'ghi'}
];

// Include above session middleware in Express
app.use(session);

// Route
app.get('/home', (req, res) => {
	res.sendFile(path.resolve(
		__dirname,
		'socket-final-client.html'
	));
});

// Use session middleware in /home namespace. Check every new socket to see if user is logged in. Otherwise forbid.
home.use(ioSession);
home.use((socket, next) => {
	const {session} = socket.request;
	if(session.isLogged){
		next();
	}
});

// Emit welcome event after successful login
home.on('connection', (socket) => {
	const {username} = socket.request.session;
	socket.emit('welcome', `Welcome ${username}, you are logged in.`);
});

// Use session middleware in /login namespace. Verify user exists w/ correct password when Client emits Enter event
login.use(ioSession);
login.on('connection', (socket) => {
	socket.on('enter', (data) => {
		const {username, password} = data;
		const {session} = socket.request;
		const found = users.find(user => (
			user.username === username &&
			user.password === password
		));
		if(found){
			session.isLogged = true;
			session.username = username;
			socket.emit('loginSuccess');
		} else{
			socket.emit('loginError', {
				message: 'Invalid credentials.'
			})
		}
	})
});

logout.use(ioSession);
logout.on('connection', (socket) => {
	socket.on('exit', () => {
		const {session} = socket.request;
		session.isLogged = false;
		session.username = false;
		socket.emit('loggedOut', {
			message: 'Logged out.'
		});
	});
});

// Listen for connections and attatch socket server
io.attach(app.listen(7777, () => {
	console.log('HTTP server and Socket.IO running on port 7777');
}));


