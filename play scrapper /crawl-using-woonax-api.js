var request = require("request");
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/playScrapper');
var collection = db.get('scrappedPlayData');
var packegaList = db.get('packegaList');

async = require("async");

var recentlyAddedPackage = [];
var timeLastScrapped =  new Date().getTime();


var allPackageNameDict = {};


function loadPackageNamesRecursive(index , callback)
{
	var oneFileSize = 4000;
	console.log("loded " + index);
	timeLastScrapped =  new Date().getTime();

	packegaList.find({},{ "limit": oneFileSize , "skip" : oneFileSize*index }, function(e,data){
		if(data.length == 0)
		{
			callback();
			return;
		}

		for(var i =0 ; i < data.length; i++)
			 allPackageNameDict  [(data[i].PackegeId) ]  = 1 ;
		

		loadPackageNamesRecursive(index + 1 ,  callback);
			 
	});
}

function loadAllPackageNameDictFromDB(callback)
{
	collection.find({TimeScrapped : null},{}, function(e,data){
		for(var i =0 ; i < data.length; i++)
			 allPackageNameDict  [(data[i].PackegeId) ]  = 1 ;

		callback();
	});
}


function pushToScrapePackageIfPssible(packageName , callback )
{
	if(recentlyAddedPackage.length > 3)
			recentlyAddedPackage.shift();

	timeLastScrapped =  new Date().getTime();
		
	if( allPackageNameDict[packageName] != 1  && recentlyAddedPackage.indexOf(packageName) == -1 )
	{
		recentlyAddedPackage.push(packageName);
		timeLastScrapped =  new Date().getTime();
		allPackageNameDict[packageName] = 1;
		

		collection.insert([ {PackegeId : packageName} ], {w: 1}, function(err, records){
			
			packegaList.insert([ {PackegeId : packageName} ], {w: 1}, function(err, records){
				console.log("adding new " + packageName);
				callback();
			});
			
		});
		
	}
	else
	{
		callback();
	}
}


function writeFetchedDataToDb(data , callback)
{

	async.each(data , function(item , acallback){


		
		collection.update({PackegeId : item.PackegeId } , item , function(e , data){
			console.log(item.PackegeId );
			console.log(e , data);
			acallback();
		})
		 
	}, function(e){

		 callback();
	});


	
}


function crawlToPackeges(packeges , callback) // packages comma seperated
{
	var url = 'localhost:3000/googlePlay/getDetails/'+ packeges;

	var url = 'http://localhost:3000/googlePlay/getDetails/'+ packeges;

	console.log(url);

	request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
      		
      		var resultData = JSON.parse(body);

      		//console.log(body);
      		// pust result data in db




      		allNewPackageNames = [];
      		
      		for(var i in resultData)
      		{
      			if(resultData[i].TimeScrapped != 404 )
      			{
      				var oneAppData = resultData[i];
      				var allNewPackages = oneAppData.OrignalData.SimmilarApps.concat(oneAppData.OrignalData.MoreByDev);

      				allNewPackageNames = allNewPackageNames.concat(allNewPackages);

      			}			
      			
      		}

      		 
			async.each(allNewPackageNames , function(item , acallback){
				pushToScrapePackageIfPssible(item , function(){
					acallback();
				});
				 
			}, function(e){

				writeFetchedDataToDb(resultData , function(){
					callback();
				})
				 
			});

      		
        
      }
      else{    
         
         callback(null);
      }
    });


}


function performCrawlJob()
{
	collection.find({TimeScrapped : null},{ "limit": 30  }, function(e,data){
		//console.log(data); //item.PackegeId

		var allIds = [];

		for(var i =0 ; i < data.length; i++)
		{
			allIds .push(data[i].PackegeId)  ;
		}

		allIds = allIds.join(',');

	
		crawlToPackeges(allIds , function(){
			performCrawlJob();
		});


		 
	});
}




function checkIfHanging()
{
	if(new Date().getTime()- timeLastScrapped > 120056 )
	{
		console.log("exiting ;9")
		process.exit(code=0);
	}
	// restarted via shell script

	  setTimeout(function(){
        checkIfHanging();
      }, 1000);


}


// Main 
loadPackageNamesRecursive( 0  , function(){

	checkIfHanging();
	performCrawlJob();
});


// run this first time
// collection.insert( {PackegeId: 'com.facebook.katana'}, console.log);
// packegaList.insert( {PackegeId: 'com.facebook.katana'}, console.log);

