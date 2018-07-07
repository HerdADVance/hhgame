// Dependencies
const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo')(session);

// API
const api = require('./controllers/users');

// App
const app = express();

// Database
var mongoDB = 'mongodb://hhgameuser:3hd1!zjZreT!4@ds229701.mlab.com:29701/hhgame'
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Parser for Request body
app.use(bodyParser.json());

// Sessions
app.use(session({
	secret: 'HuntingtonHoldem7',
	resave: false,
	saveUninitialized: true,
	store: new MongoStore({
		collection: 'sessions',
		mongooseConnection: mongoose.connection
	})
}));

// Controller
app.use('/users', api);

// Listen
app.listen(7777, () => console.log('Server running on port 7777'));