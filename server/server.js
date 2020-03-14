const express = require('express')

const app = express()

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/../client/dist/index.html')
})

app.listen(3000, function() {
	console.log('App listening on 3000')
})
