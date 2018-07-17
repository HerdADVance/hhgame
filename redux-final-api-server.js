const express = require('express')
const app = express()

app.get('/time', (req, res) => {
	setTimeout(() => {
		res.send(new Date().toTimeString())
	}, 2000)
})

app.get('/date', (req, res) => {
	setTimeout(() => {
		res.destroy(new Error('Internal server error'))
	}, 2000)
})

app.listen(7777, () => console.log("API server running on port 7777"))