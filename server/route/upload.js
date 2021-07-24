var uploadRouter = require('express').Router()
var multer = require('multer')
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'upload')
	},
	filename: function (req, file, cb) {
		cb(null, req.headers.id)
	}
})

var upload = multer({ storage: storage })

uploadRouter.post("/", upload.any(), (req, res) => {
	res.send("File upload success")
})

module.exports = uploadRouter