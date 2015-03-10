
(function() {

	var app = angular.module("campi", ['ui.select', 'ngSanitize', 'ui.bootstrap', 'angular-underscore']);

	app.filter('groupBy', function() {

		return _.memoize(function(input, chsize) {
			if (input == undefined || chsize == undefined || typeof chsize !== 'number' || chsize % 1 !== 0 || chsize <= 0) {
				return;
			}

			var out = [];

			for (var i = 0; i < input.length; i += chsize) {
				out.push(input.slice(i, i + chsize));
			}

			return out;
		});
	});


	app.controller("camera_controller", ['$scope', '$http', function($scope, $http) {

		$scope.options = {
				'mode': {type: 'multi',
				         values: [{name: 'photo', pretty: 'Photo'},
				                  {name: 'timelapse', pretty: 'Timelapse'},
				                  {name: 'video', pretty: 'Video'}],
				         default: 0},

				'width': {type: 'int', min: 0, max: 2500, default: 1024},
				'height': {type: 'int', min: 0, max: 2000, default: 768},
				'quality': {type: 'slider', min: 0, max: 100, default: 85},
				'timeout': {type: 'int', min:0, default:5000},
				'timelapse': {type: 'int', min: 0, default: 1000},
				'sharpness': {type: 'slider', min: -100, max: 100, default: 0},
				'contrast': {type: 'slider', min: -100, max: 100, default: 0},
				'brightness': {type: 'slider', min: -100, max: 100, default: 50},
				'saturation': {type: 'slider', min: -100, max: 100, default: 0},
				'ev': {type: 'slider', min: -2, max: 2, default: 0},
				'ex': {type: 'multi', 
				       values: [{name: 'auto', pretty: 'Auto'}, 
				                {name: 'off', pretty: 'Off'}, 
				                {name: 'night', pretty: 'Night'}, 
				                {name: 'nightpreview', pretty: 'Night preview'},
				                {name: 'backlight', pretty: 'Backlight'},
				                {name: 'spotlight', pretty: 'Spotlight'},
				                {name: 'sports', pretty: 'Sports'},
				                {name: 'snow', pretty: 'Snow'}, 
				                {name: 'beach', pretty: 'Beach'},
				                {name: 'verylong', pretty: 'Very long'},
				                {name: 'fixedfps', pretty: 'Fixed FPS'},
				                {name: 'antishake', pretty: 'Anti-shake'},
				                {name: 'fireworks', pretty: 'Fireworks'}], 
				       default: 0},
				'awb': {type: 'multi',
				        values: [{name: 'auto', pretty: 'Auto'}, 
				                 {name: 'off', pretty: 'Off'},
				                 {name: 'sun', pretty: 'Sun'},
				                 {name: 'cloud', pretty: 'Cloud'},
				                 {name: 'shade', pretty: 'Shade'},
				                 {name: 'tungsten', pretty: 'Tungsten'},
				                 {name: 'fluorescent', pretty: 'Fluorescent'},
				                 {name: 'incandescent', pretty: 'Incandescent'},
				                 {name: 'flash', pretty: 'Flash'},
				                 {name: 'horizon', pretty: 'Horizon'}],
					    default: 0},
				'ifx': {type: 'multi',
				        values: [{name: 'none', pretty: 'None'},
				                 {name: 'negative', pretty: 'Negative'},
				                 {name: 'solarise', pretty: 'Solarise'},
				                 {name: 'sketch', pretty: 'Sketch'},
				                 {name: 'denoise', pretty: 'Denoise'},
				                 {name: 'emboss', pretty: 'Emboss'},
				                 {name: 'oilpaint', pretty: 'Oil painting'},
				                 {name: 'hatch', pretty: 'Hatch'},
				                 {name: 'gpen', pretty: 'GPen'},
				                 {name: 'pastel', pretty: 'Pastel'},
				                 {name: 'watercolour', pretty: 'Watercolour'},
				                 {name: 'film', pretty: 'Film'},
				                 {name: 'blur', pretty: 'Blur'},
				                 {name: 'saturation', pretty: 'Saturation'},
				                 {name: 'colourswap', pretty: 'Colour swap'},
				                 {name: 'washedout', pretty: 'Washed out'},
				                 {name: 'posterise', pretty: 'Posterise'}, 
				                 {name: 'colourpoint', pretty: 'Colour point'},
				                 {name: 'colourbalance', pretty: 'Colour balance'},
				                 {name: 'cartoon', pretty: 'Cartoon'}],
				        default: 0},
				'metering': {type: 'multi',
				             values: [{name: 'average', pretty: 'Average'},
				                      {name: 'spot', pretty: 'Spot'},
				                      {name: 'backlit', pretty: 'Backlit'},
				                      {name: 'matrix', pretty: 'Matrix'}],
				             default: 0},
				'bitrate': {type: 'int', min: 100000, max: 5000000, default: 1000000},
				'framerate': {type: 'int', min: 1, max: 90, default: 25},
				'vstab': {type: 'bool', default: false},
				'hflip': {type: 'bool', default: true},
				'vflip': {type: 'bool', default: true}
		};

		$scope.curr_settings = {};		
		for (var idx in $scope.options) {
			var type = $scope.options[idx]['type'];
			var def = $scope.options[idx]['default'];

			if (type === 'multi') {
				$scope.curr_settings[idx] = $scope.options[idx]['values'][def]['name'];
			}  else {
				$scope.curr_settings[idx] = def;
			}

		}


		$scope.start_camera = function() {
			$http.post('/camera/start_camera', $scope.curr_settings).success(function(data) {
				console.log(data);

				$scope.$emit('img_vid_ready');
			});
		}

	}]);


	app.controller("gallery_controller", 
			["$scope", "$http", "$rootScope", 
			 function($scope, $http, $rootScope) {

				$scope.get_photo_list = function() {
					$http.get('/gallery/photo_list').success(function(data) {
						console.log("photo_list")
						console.log(data);
						$scope.photo_list = data;
					});
				}

				$scope.get_video_list = function() {
					$http.get('/gallery/video_list').success(function(data) {
						console.log(data);
						$scope.video_list = data;
					});
				}

				$rootScope.$on('img_vid_ready', function(event) {
					// TODO check which tab (photo, timelapse, video) is active and refresh it
					$scope.get_photo_list();
				});

			}]);


	app.config(function(uiSelectConfig) {
		uiSelectConfig.searchEnabled = false;
	});


})();
