var express = require('express');
var router = express.Router();

var raspicam = require('raspicam');
var uuid = require('node-uuid');


var fs = require('fs');

router.post('/start_camera', function(req, res) {
	var db = req.db;

	var settings = req.body;
	
	var urlpath = "photos/" + uuid.v4() + ".jpg";

	settings.output = "./public/" + urlpath;

	var rs = fs.createReadStream("./photo.jpg", { autoClose: true });
	var ws = fs.createWriteStream(settings.output);

	rs.pipe(ws);


	console.log(settings);

	var time = new Date();

	db.put("photos|" + time, {timestamp: time, url: urlpath, thumb_url: urlpath }, {}, function(err) {
		if (err) {
			console.log(err);
		}
		console.log(urlpath);
		console.log("saved");
	});

/*	var camera = new raspicam(opts);

	camera.on('start', function() {
		console.log("started");
	});

	camera.on('read', function() {
		console.log("read");
	});

	camera.on('exit', function() {
		console.log("exited");

		res.send("Done");
	});

	camera.start();	*/
	console.log("done");
	res.send("Done");
});

module.exports = router;
