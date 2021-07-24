var dataRouter = require('express').Router()
const fs = require('fs')

dataRouter.get("/", (req, res) => {
	let id = req.headers.id
	try {
		let data = fs.readFileSync("upload/" + id, 'utf-8')
		res.send(data)
	}
	catch (err) {
		let data = fs.readFileSync("upload/template", 'utf-8')
		res.send(data)
	}

})

module.exports = dataRouter