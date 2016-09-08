var request = require("request");
var cheerio = require("cheerio");

module.exports = {

	// DOWNLOAD
	download: function(mmsi, callback) {

		var options = {
			"url": "https://www.vesselfinder.com/?mmsi=" + mmsi,
			"headers": {
				"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36"
			}
		};

		// trigger the request
		request(options, function(error, response, body) {

			// check the response code
			if (!error && response && response.statusCode == 200) {

				// all is clear!
				return callback(response.statusCode, body);
			}

			return callback(500, null);
		});
	},

	// EXTRACT LATITUDE
	extract: function(what, body) {

		// find start position
		var pos = body.indexOf(what + ":");

		// slice from start position
		body = body.slice(pos);
		body = body.split(",");

		if (body.length > 0) {

			// try to parse to float
			var val = parseFloat(body[0].replace(what + ":", ""));

			if (val && typeof val === "number") {

				// success
				return val;
			}
		}

		return null
	},

	// GET
	get: function(mmsi, callback) {

		// download source code
		module.exports.download(mmsi, function(status, body) {

			if (status !== 200) return callback(null);

			// try to extract course, speed and name of vessel
			$ = cheerio.load(body);

			return callback([
				module.exports.extract("latitude", body),
				module.exports.extract("longitude", body)
			], {
				"course": parseInt($("#vessel_course").text()) || null,
				"speed": parseFloat($("#vessel_speed").text()) || null,
				"name": $("#vessel_name").text().trim() || null,
				"time": parseInt($("#last_report").data("ts"))
			});
		});
	}
};
