const request = require("request");
const cheerio = require("cheerio");
const moment = require("moment");

module.exports = {
	/**
	 * Downloads the source code of a website
	 * @param  {String}  mmsi  The ships MMSI id
	 */
	download: function(mmsi, callback) {
		const options = {
			url: `https://www.marinetraffic.com/en/ais/details/ships/mmsi:${mmsi}`,
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36"
			}
		};

		// trigger the request
		request(options, function(error, response, body) {
			// check the response code
			if (!error && body && response.statusCode == 200) {
				// all is clear!
				return callback(response.statusCode, body);
			}

			return callback(500, null);
		});
	},

	/**
	 * Returns the text content of the sibling element of an HTML tag that
	 * contains a certain text
	 * @param  {Object} $ 		   The cheerio handle
	 * @param  {String} tag        The HTML-tag to search for
	 * @param  {String} key        The text content the tag should contain
	 * @param  {String} siblingTag The HTML-tag of the sibling to read the text
	 *                             from
	 * @return {Object}            The found sibling or null
	 */
	findSibling: function($, tag, key, siblingTag) {
		const keyElement = $(tag + ":contains(" + key + ")")
			.filter((i, el) => {
				// filter exact matches for siblings
				return (
					cheerio(el)
						.text()
						.trim() == key
				);
			})
			.first();

		// no element found?
		if (!keyElement || keyElement.get().length === 0) return null;

		const sibling = keyElement.next(siblingTag);

		// only return the sibling, if the array has elements
		if (!sibling || sibling.get().length === 0) return null;

		return sibling.first();
	},

	/**
	 * Returns the text content of the sibling element of an HTML tag that
	 * contains a certain text
	 * @param  {Object} $ 		   The cheerio handle
	 * @param  {String} tag        The HTML-tag to search for
	 * @param  {String} key        The text content the tag should contain
	 * @param  {String} siblingTag The HTML-tag of the sibling to read the text
	 *                             from
	 * @return {String}            The text content of the sibling
	 */
	findSiblingText: function($, tag, key, siblingTag) {
		// find the next sibling that matches the criteria
		const sibling = this.findSibling($, tag, key, siblingTag);

		// no signling found?
		if (!sibling || sibling.text().length === 0) return null;

		return sibling.text().trim();
	},

	/**
	 * Extract speed and course
	 * @param  {Object} $   The cheerio handle
	 */
	extractSpeedCourse: function($) {
		const txt = module.exports.findSiblingText($, "span", "Speed/Course:", "span");
		const spdcrs = txt.split("/");

		return {
			spd: parseFloat(spdcrs[0]) || null,
			crs: parseFloat(spdcrs[1]) || null
		};
	},

	/**
	 * Extract latitude and longitude coordinates
	 * @param  {Object} $   The cheerio handle
	 */
	extractLatLon: function($) {
		const txt = module.exports.findSiblingText($, "span", "Latitude / Longitude:", "span");
		const latlon = txt.split("/");

		return {
			lat: parseFloat(latlon[0]),
			lon: parseFloat(latlon[1])
		};
	},

	/**
	 * Extract time information
	 * @param  {Object} $   The cheerio handle
	 */
	extractTime: function($) {
		let txt = module.exports.findSiblingText($, "span", "Position Received:", "span");
		if (!txt) txt = module.exports.findSiblingText($, "span", "Position Received:", "strong");

		if (txt.indexOf("ago") >= 0) {
			txt = txt
				.split("ago")[1]
				.replace("(", "")
				.replace(")", "");
		}

		return moment.utc(txt.replace(" UTC", "").trim(), "YYYY-MM-DD HH:mm").unix();
	},

	/**
	 * Returns a position update data structure for a given MMSI ship id
	 * @param  {String}  	mmsi  		The MMSI ship id
	 * @param  {Function} 	callback	A callback resolving with the latest ships information
	 */
	get: function(mmsi, callback) {
		// download source code
		module.exports.download(mmsi, function(status, body) {
			if (status !== 200) return callback(null);

			// try to extract course, speed and name of vessel
			const $ = cheerio.load(body);

			// extract information
			const position = module.exports.extractLatLon($);
			const speed_course = module.exports.extractSpeedCourse($);
			const time = module.exports.extractTime($);

			return callback([position.lat, position.lon], {
				course: speed_course.crs,
				speed: speed_course.spd,
				name:
					$("h1")
						.text()
						.trim() || null,
				time: time
			});
		});
	}
};
