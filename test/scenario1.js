'use strict';

var echolot = require("../echolot");
var fs 		= require("fs");
var async   = require("async");

describe("scenario1", function () {

	it("should create merged.json file", function (done) {

		// run echolot on test directory
		echolot.run("test/scenario1", function() {

			fs.exists("test/scenario1/merged.json", function (exists) {

				exists.should.equal(true);

				// cleanup
				require("glob").glob("test/scenario1/*.json", function (er, files) { 
					async.each(files, function(file, ready) {
						fs.unlink(file, ready);
					}, done);
				});
			});
		});
	});
});