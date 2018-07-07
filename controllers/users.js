const express = require('express');
const User = require('../models/User');
const api = express.Router();
const util = require('util');

const isLogged = ({ session }, res, next) => {
	if(!session.user){
		res.status(403).json({
			status: "Not logged in."
		})
	}
	else next();
};

const isNotLogged = ({ session }, res, next) => {
	if(!session.user){
		res.status(403).json({
			status: "Already logged in."
		})
	}
	else next();
};

api.post('/login', isNotLogged, async(req, res) => {
	try{
		const {session, body} = req;
		const {username, password} = body;
		const user = await User.login(username, password);
		session.user = {
			_id: user._id,
			username: user.username
		};
		session.save(() => {
			res.status(200).json({ status: "Logging in." });
		});
	} catch(error){
		res.status(403).json({ error: error.message});
	}
});

api.post('/logout', isLogged, (req, res) => {
	req.session.destroy();
	res.status(200).send({ status: "Logging out."});
});

api.post('/signup', async(req, res) => {
	console.log('User Controller signup route');
	console.log('User Controller signup route username: ' + req.body.username);
	//console.log("REQ: " + req);
	//console.log(util.inspect(req.body, false, null))
	try{
		const {session, body} = req;
		const {username, password} = body;
		const user = await User.signup(username, password);
		res.status(201).json({ status: "User created." });
	} catch(error){
		res.status(403).json({ error: error.message });
	}
});

api.get('/profile', isLogged, (req, res) => {
	const { user } = req.session;
	res.status(200).json({ user });
});


module.exports = api;

