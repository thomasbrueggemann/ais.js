var request = require("request");

module.exports = {
	get: function(mmsi, callback) {

		var mmsi = 211704920;
		request("https://www.vesselfinder.com/?mmsi=" + mmsi, function(error, response, body) {

			if (!error && response.statusCode == 200) {
				console.log(body) // Show the HTML for the Google homepage. 
				return callback(callback);
			}
		});
	}
};