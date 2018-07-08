"use strict";

var ais = require("../ais");

describe("ais.js", function() {
	it("should download the source code with HTTP 200", function(done) {
		ais.download(211704920, function(status, body) {
			status.should.equal(200);
			return done();
		});
	});

	it("should download and extract the lat/lon for a mmsi number", function(done) {
		ais.get(211704920, function(pos) {
			pos.length.should.equal(2);
			return done();
		});
	});

	it("should download and extract course, speed, time and name of vessel", function(done) {
		ais.get(265758190, function(pos, more) {
			more.name.should.equal("RAN");
			(more.time > 0).should.equal(true);
			(more.speed >= 0.0).should.equal(true);
			(more.course >= 0.0).should.equal(true);
			return done();
		});
	});

	it("should download and extract course, speed, time and name of vessel", function(done) {
		ais.get(219021049, function(pos, more) {
			more.name.should.equal("IDEFIX");
			(more.time > 0).should.equal(true);
			return done();
		});
	});
});
