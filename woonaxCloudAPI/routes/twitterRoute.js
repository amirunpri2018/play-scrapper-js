var express = require('express');
var router = express.Router();

var tweetScrapper = require('../scrappers/tweetScrapper');
 
var LZString = require('lz-string');
var jsonpack = require('jsonpack/main')

/* GET home page. */
router.get('/getGetAllTweets/:userNames', function(req, res, next) {
	var userNames = req.params.userNames;
	userNames = userNames.split(',');

	tweetScrapper.getTweetsFromMultipleUsers( userNames , function(r){
		var compressedData = JSON.stringify(r);
		// compressedData =  LZString.compress(compressedData);
		// unpack , decompress
		res.send(compressedData);
	} );

});

module.exports = router;


