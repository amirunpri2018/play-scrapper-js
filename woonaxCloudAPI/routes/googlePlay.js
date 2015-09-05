var express = require('express');
var router = express.Router();

var playScrapper = require('../scrappers/googlePlay');
 
var LZString = require('lz-string');
var jsonpack = require('jsonpack/main')

/* GET home page. */
router.get('/getDetails/:packageNames', function(req, res, next) {
	var packageNames = req.params.packageNames;
	packageNames = packageNames.split(',');

	playScrapper.getDataFromMultiplePackageNames( packageNames , function(r){
		var compressedData = JSON.stringify(r);
		// compressedData =  LZString.compress(compressedData);
		// unpack , decompress
		res.send(compressedData);
	} );

});

module.exports = router;


