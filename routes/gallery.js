var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/picture_list', function(req, res) {
	var db = req.db;
	
	var page = req.page;

	var pics = [];
	db.createReadStream({gte: 'pictures|', lte: 'pictures|\xff'})
		.on('data', function(data) {
			pics.push(data.value);
		})
		.on('error', function(err) {
			console.log('Error while reading picture list from DB.');
		})
		.on('end', function() {
			res.send(pics);
		});

});

router.get('/video_list', function(req, res) {
	var db = req.db;

	var vids = [];

	db.createReadStream({start: 'videos|', end: 'videos|\xff'})
		.on('data', function(data) {
			vids.push(data.value);
		})
		.on('error', function(err) {
			console.log('Error while reading video list from DB.');
		})
		.on('end', function() {
			res.send(vids);
		});

});

module.exports = router;
