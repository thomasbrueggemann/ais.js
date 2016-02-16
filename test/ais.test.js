'use strict';

var ais = require("../ais");

describe("ais.js", function() {

	it("should download the source code with HTTP 200", function(done) {

		ais.download(211704920, function(status, body) {

			status.should.equal(200);
			return done();
		});
	});

	it("should download source code and contain latitude and longitude variables", function(done) {

		ais.download(211704920, function(status, body) {

			status.should.equal(200);
			(body.indexOf("latitude:") >= 0).should.equal(true);
			(body.indexOf("longitude:") >= 0).should.equal(true);
			return done();
		});
	});

	it("should find the latitude value in a string", function(done) {

		var testBody = "ack:true,latitude:51.743563333333,longitude:4.2447066666667,zoom:17,g1:0,g";
		var result = ais.extract("latitude", testBody);

		result.should.equal(51.743563333333);
		return done();
	});

	it("should find the longitude value in a string", function(done) {

		var testBody = "ack:true,latitude:51.743563333333,longitude:4.2447066666667,zoom:17,g1:0,g";
		var result = ais.extract("longitude", testBody);

		result.should.equal(4.2447066666667);
		return done();
	});

	it("should download and extract the lat/lon for a mmsi number", function(done) {

		ais.get(211704920, function(pos) {
			return done();
		});
	});
});