var request = require("request");
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/playScrapper');
var collection = db.get('scrappedPlayData');
var packegaList = db.get('packegaList');

async = require("async");

var recentlyAddedPackage = [];
var timeLastScrapped =  new Date().getTime();


collection.remove({});
packegaList.remove({});

collection.insert( {PackegeId: 'com.facebook.katana'}, console.log);
packegaList.insert( {PackegeId: 'com.facebook.katana'}, console.log);

