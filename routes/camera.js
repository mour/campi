var express = require('express');
var router = express.Router();

var raspicam = require('raspicam');
var uuid = require('node-uuid');


var fs = require('fs');

router.post('/start_camera', function(req, res) {
	console.log("start_camera")

	var db = req.db;
	var settings = req.body;

	var uuid_str = uuid.v4();
	
	var img_url = "photos/" + uuid_str + ".jpg";

	settings.output = "./public/" + img_url;

	var thumb_url = "photos/thumb-" + uuid_str + ".jpg";

	var rs = fs.createReadStream("./photo.jpg", { autoClose: true });
	var ws = fs.createWriteStream(settings.output);

	rs.pipe(ws);

	var rs_thumb = fs.createReadStream("./photo-thumb.jpg", { autoClose: true });
	var ws_thumb = fs.createWriteStream("./public/" + thumb_url);

	rs_thumb.pipe(ws_thumb);


	console.log(settings);

	var time = new Date();

	db.put("photos|" + time, {'timestamp': time, 'url': img_url, 'thumb_url': thumb_url }, {}, function(err) {
		if (err) {
			console.log(err);
		}
		console.log(img_url);
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
