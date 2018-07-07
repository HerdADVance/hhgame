var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const crypto = require('crypto');

const UserSchema = new Schema({
	username: { 
		type: String,
		unique: true,
		required: [true, "Username is required"],
		validate: {
			validator: function(value){
				return /^[a-zA-Z]+$/.test(value)
			},
			message: '{VALUE} is not a valid username'
		},
		trim: true,
		min: 5,
		max: 20
	},
	password: {
		type: String,
		required: true
	}
	// displayName: {
	// 	type: String,
	// 	required: true
	// }
});

UserSchema.static('login', async function(usr, pwd){
	const hash = crypto.createHash('sha256').update(String(pwd));
	const user = await this.findOne()
		.where('username').equals(usr)
		.where('password').equals(hash.digest('hex'));
	if(!user) throw new Error('Username and password don\'t match');
	delete user.password;
	return user;
});

UserSchema.static('signup', async function(usr, pwd){
	console.log('Username in schema: ' + usr);
	console.log('Password in schema: ' + pwd);
	if(pwd.length < 6){
		throw new Error('Password must have at least 6 characters');
	}
	const hash = crypto.createHash('sha256').update(String(pwd));
	const exist = await this.findOne()
		.where('username').equals(usr);
	if(exist){
		throw new Error('Username already exists');
	}
	const user = this.create({
		username: usr,
		password: hash.digest('hex')
	});
	return user;
});

UserSchema.method('changePass', async function(pwd){
	if(pwd.length < 6){
		throw new Error('Password must have at least 6 characters');
	}
	const hash = crypto.createHash('sha256').update(String(pwd));
	this.password = hash.digest('hex');
	return this.save();
});




module.exports = mongoose.model('User', UserSchema);