var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/playScrapper');
var collection = db.get('scrappedPlayData');
fs = require('fs');


oneFileSize = 4000;

function showWriteSomeData(index)
{
	collection.find({TimeScrapped :  { '$gt' : 0 }},{ "limit": oneFileSize , "skip" : oneFileSize*index }, function(e,data){
		if(data.length == 0)
		{
			console.log("done");
			return;
		}
			
                        console.log(" data feched ");
			fs.writeFileSync("./datajson/datai-"+index+".json", (JSON.stringify(data )) );
			console.log("written " + "./datai-"+index+".json" );
			showWriteSomeData(index + 1);
			 
	});
}


showWriteSomeData(0);
