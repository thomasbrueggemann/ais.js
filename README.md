# ais.js [![Build Status](https://travis-ci.org/thomasbrueggemann/ais.js.svg?branch=master)](https://travis-ci.org/thomasbrueggemann/ais.js) [![npm](https://img.shields.io/badge/npm-1.0.1-blue.svg)](https://www.npmjs.com/package/ais)
Tries to gather the latest AIS position of a MMSI number

## Installation

```npm install ais```

## Usage

```javascript
var ais = require("ais");

// pass the MMSI as first parameter
ais.get(211704920, function(pos) {

	console.log(pos);	// prints either a lat/long array 
						// [56.57469, 9.05306] or null
});
```
