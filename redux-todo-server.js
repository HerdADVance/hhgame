const express = require('express');
const path = require('path');

const app = express();

app.use('/lib', express.static(
	path.join(__dirname, 'node_modules', 'redux', 'dist')
));

app.get('/', (req, res) => {
	res.sendFile(path.join(
		__dirname,
		'redux-todo.html'
	));
});

app.listen(7777, () => console.log('Running on port 7777'));


