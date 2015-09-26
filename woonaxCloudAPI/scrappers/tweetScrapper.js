var Twitter = require('twitter');
var request = require('request');
var async = require("async");
var _ = require('underscore');

 

var badWords = [ 'http',  "4r5e","5h1t","5hit","a55","anal","anus","ar5e","arrse","arse","ass","ass-fucker","asses","assfucker","assfukka","asshole","assholes","asswhole","a_s_s","b!tch","b00bs","b17ch","b1tch","ballbag","balls","ballsack","bastard","beastial","beastiality","bellend","bestial","bestiality","bi+ch","biatch","bitch","bitcher","bitchers","bitches","bitchin","bitching","bloody","blow job","blowjob","blowjobs","boiolas","bollock","bollok","boner","boob","boobs","booobs","boooobs","booooobs","booooooobs","breasts","buceta","bugger","bum","bunny fucker","butt","butthole","buttmuch","buttplug","c0ck","c0cksucker","carpet muncher","cawk","chink","cipa","cl1t","clit","clitoris","clits","cnut","cock","cock-sucker","cockface","cockhead","cockmunch","cockmuncher","cocks","cocksuck ","cocksucked ","cocksucker","cocksucking","cocksucks ","cocksuka","cocksukka","cok","cokmuncher","coksucka","coon","cox","crap","cum","cummer","cumming","cums","cumshot","cunilingus","cunillingus","cunnilingus","cunt","cuntlick ","cuntlicker ","cuntlicking ","cunts","cyalis","cyberfuc","cyberfuck ","cyberfucked ","cyberfucker","cyberfuckers","cyberfucking ","d1ck","damn","dick","dickhead","dildo","dildos","dink","dinks","dirsa","dlck","dog-fucker","doggin","dogging","donkeyribber","doosh","duche","dyke","ejaculate","ejaculated","ejaculates ","ejaculating ","ejaculatings","ejaculation","ejakulate","f u c k","f u c k e r","f4nny","fag","fagging","faggitt","faggot","faggs","fagot","fagots","fags","fanny","fannyflaps","fannyfucker","fanyy","fatass","fcuk","fcuker","fcuking","feck","fecker","felching","fellate","fellatio","fingerfuck ","fingerfucked ","fingerfucker ","fingerfuckers","fingerfucking ","fingerfucks ","fistfuck","fistfucked ","fistfucker ","fistfuckers ","fistfucking ","fistfuckings ","fistfucks ","flange","fook","fooker","fuck","fucka","fucked","fucker","fuckers","fuckhead","fuckheads","fuckin","fucking","fuckings","fuckingshitmotherfucker","fuckme ","fucks","fuckwhit","fuckwit","fudge packer","fudgepacker","fuk","fuker","fukker","fukkin","fuks","fukwhit","fukwit","fux","fux0r","f_u_c_k","gangbang","gangbanged ","gangbangs ","gaylord","gaysex","goatse","God","god-dam","god-damned","goddamn","goddamned","hardcoresex ","hell","heshe","hoar","hoare","hoer","homo","hore","horniest","horny","hotsex","jack-off ","jackoff","jap","jerk-off ","jism","jiz ","jizm ","jizz","kawk","knob","knobead","knobed","knobend","knobhead","knobjocky","knobjokey","kock","kondum","kondums","kum","kummer","kumming","kums","kunilingus","l3i+ch","l3itch","labia","lmfao","lust","lusting","m0f0","m0fo","m45terbate","ma5terb8","ma5terbate","masochist","master-bate","masterb8","masterbat*","masterbat3","masterbate","masterbation","masterbations","masturbate","mo-fo","mof0","mofo","mothafuck","mothafucka","mothafuckas","mothafuckaz","mothafucked ","mothafucker","mothafuckers","mothafuckin","mothafucking ","mothafuckings","mothafucks","mother fucker","motherfuck","motherfucked","motherfucker","motherfuckers","motherfuckin","motherfucking","motherfuckings","motherfuckka","motherfucks","muff","mutha","muthafecker","muthafuckker","muther","mutherfucker","n1gga","n1gger","nazi","nigg3r","nigg4h","nigga","niggah","niggas","niggaz","nigger","niggers ","nob","nob jokey","nobhead","nobjocky","nobjokey","numbnuts","nutsack","orgasim ","orgasims ","orgasm","orgasms ","p0rn","pawn","pecker","penis","penisfucker","phonesex","phuck","phuk","phuked","phuking","phukked","phukking","phuks","phuq","pigfucker","pimpis","piss","pissed","pisser","pissers","pisses ","pissflaps","pissin ","pissing","pissoff ","poop","porn","porno","pornography","pornos","prick","pricks ","pron","pube","pusse","pussi","pussies","pussy","pussys ","rectum","retard","rimjaw","rimming","s hit","s.o.b.","sadist","schlong","screwing","scroat","scrote","scrotum","semen","sex","sh!+","sh!t","sh1t","shag","shagger","shaggin","shagging","shemale","shi+","shit","shitdick","shite","shited","shitey","shitfuck","shitfull","shithead","shiting","shitings","shits","shitted","shitter","shitters ","shitting","shittings","shitty ","skank","slut","sluts","smegma","smut","snatch","son-of-a-bitch","spac","spunk","s_h_i_t","t1tt1e5","t1tties","teets","teez","testical","testicle","tit","titfuck","tits","titt","tittie5","tittiefucker","titties","tittyfuck","tittywank","titwank","tosser","turd","tw4t","twat","twathead","twatty","twunt","twunter","v14gra","v1gra","vagina","viagra","vulva","w00se","wang","wank","wanker","wanky","whoar","whore","willies","willy","xrated","xxx"];

var client = new Twitter({
  consumer_key: 'EjV5hnqTFomIr3mwb8i5TG2xj',
  consumer_secret: 'x6msDOg8Ap6HYFV0wdh6TaezIY6pklPMi2mXPnElgXCVZDSarp',
  access_token_key: '312016800-zfTPdz4MxgbPjUFRMuLYPBmhxbqJmIwKsRM5vSnz',
  access_token_secret: 'XcfCqQfqKPJI6OcPSMllywEdtSNjjcR0UqWyn4WbY8RnX'
});

// "99" -> "98" // for very large numbers in js
function subtractOneFromNumberString(str)
{
	str = str.split('');

	if(str[str.length - 1] != '0')
	{
		str[str.length - 1]  = ( Number(str[str.length - 1] ) -1 ).toString()[0];
		
	}
	else
	{
		var i = str.length -1;
		while(str[i] == '0')
		{
			str[i] = '9';
			i--;
		}
		str[i]  = ( Number(str[i] ) -1 ).toString()[0];
	}

	return str.join('');
}




function fethcAllTweetsRecursive(userId , max_id  , callback) // maxx_id = 0 at first
{
	var q = {screen_name:userId , trim_user:true , count: 200 , exclude_replies:true } ;

	if(max_id != 0)
	{
		q.max_id = max_id;
	}

	var allTweetsToBeReturned = [];

	client.get('statuses/user_timeline',  q ,function(error, tweets, response){
		if(error) 
		{
			callback([]);
			return;
			console.log("error");
		}

		var filteredTweets = ( filterTweetsObject(tweets));  // The favorites. 
		// console.log(filteredTweets);
	    allTweetsToBeReturned = allTweetsToBeReturned.concat(filteredTweets);

	    if(tweets.length == 0)
	    {
	    	callback([]);
	    	return;
	    }
	    else
	    {
	    	var lastTweetId = (tweets[tweets.length -1 ].id_str);
	    	lastTweetId = subtractOneFromNumberString(lastTweetId);
 
	    	fethcAllTweetsRecursive(userId , lastTweetId , function(furtherTweets){
	    		 allTweetsToBeReturned = allTweetsToBeReturned.concat(furtherTweets);
	    		 callback(allTweetsToBeReturned);
	    	});

	    }

	});

}



function filterTweetsObject(data)
{
	// just have the text
	data = _.map(data, function(item){ return item.text ; });

	// remove the @ RT part

	data = _.map(data, function(item){ 
		if(item.indexOf('RT @') == 0)
		{
			item = item.split(':');
			item.splice(0,1); // remove 1st element
			item = item.join(':');
		}

		item= item.replace(/RT (@\S+)/gi,"");
		item= item.replace(/RT(@\S+)/gi,"");

		return item;

	 });

	// remve tweets with bad words
	data = _.filter(data, function(item){ 

		for(var i in badWords)
		{
			if(item.indexOf(badWords[i] ) > -1)
				return false;
		}

		return true;
	});

	return data;
}


exports.getTweetsFromMultipleUsers = function(userNames , callback)
{
	var combinedData = {}; // all the data scrapped will be stored here

	async.each(userNames , function(item , acallback){
		 	fethcAllTweetsRecursive(item , 0  ,  function(r){
		 		combinedData[item] = (r);
		 		acallback();
		 	});
			
	}, function(e){
		callback(combinedData);
	});
}


// //Main; funnyoneliners

// fethcAllTweetsRecursive("funnyoneliners" , 0 , function(data){
// 	console.log("doneeeee");
// 	console.log(data);
// });