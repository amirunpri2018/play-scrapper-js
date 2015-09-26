var cheerio = require("cheerio");
var request = require("request");
async = require("async");
var _ = require('underscore');



function ExtractHtmlFromAppName( packegeName , callback)
{
	url = 'https://play.google.com/store/apps/details?id=' + packegeName;

	request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
      
        callback(body);
      }
      else{    
        //  console.log("error  : " + url);
        // console.log(response.statusCode);
        // console.log(error);

        if(!error &&  response.statusCode == 404)
        {
        	callback(404);
        	return;
        }

         callback(null);
      }
    });

}



function extractDataFromSearchResultsHTML(html , callback)
{

	var $ = cheerio.load(html);

	var arrayOfIds = [];
	$('.preview-overlay-container').each( function(){
		arrayOfIds.push( $(this).attr('data-docid')   );
	} );

	callback(arrayOfIds);
 
}

function extractDataFromAppHTML(html , callback)
{
	var $ = cheerio.load(html);

	var itemData = {};


	itemData.TimeScrapped =  new Date().getTime();

 
	itemData.OrignalData = {};
	itemData.OrignalData.AppName = $('.document-title').text();
	itemData.OrignalData.Price = $($('.price')[0]).text();
	itemData.OrignalData.DeveloperName = $('.document-subtitle.primary').text();
	itemData.OrignalData.DeveloperUrl = $('.document-subtitle.primary').attr('href');
	itemData.OrignalData.updatedDate = $($('.document-subtitle')[1]).text();
	itemData.OrignalData.Category = $('.document-subtitle.category').text();
	itemData.OrignalData.OffersIAP = $(".inapp-msg").text();

	itemData.OrignalData.Reviews = {};
	itemData.OrignalData.Reviews.star5 = Number(($(".rating-bar-container.five .bar-number").text()).replace(/[',']/g, ""));
	itemData.OrignalData.Reviews.star4 = Number(($(".rating-bar-container.four .bar-number").text()).replace(/[',']/g, ""));
	itemData.OrignalData.Reviews.star3 = Number(($(".rating-bar-container.three .bar-number").text()).replace(/[',']/g, ""));
	itemData.OrignalData.Reviews.star2 = Number(($(".rating-bar-container.two .bar-number").text()).replace(/[',']/g, ""));
	itemData.OrignalData.Reviews.star1 = Number(($(".rating-bar-container.one .bar-number").text()).replace(/[',']/g, ""));
	itemData.OrignalData.Reviews.AvgRating = Number($(".score").text());
	itemData.OrignalData.Reviews.TotalNoOfRatings = Number(($(".reviews-num").text()).replace(/[',']/g, ""));
	itemData.OrignalData.Reviews.GPlusShares = -1;

	itemData.OrignalData.Reviews.ReviewData = [];
	$(".single-review").each(function(){
		rev = {};
		rev.Name = $(this).find(".author-name").text();
		rev.Url =  $(this).find(".author-name").find('a').attr('href');
 		rev.date = $(this).find(".review-date").text();
 		rev.Stars =  Number($(this).find(".star-rating-non-editable-container").attr('aria-label').match(/\d+/)[0]);
 		rev.Text = $(this).find(".review-body").text();
 		rev.Title = $(this).find(".review-title").text();
		
		itemData.OrignalData.Reviews.ReviewData.push(rev);
	});

	itemData.OrignalData.Description = $(".id-app-orig-desc").text();
	itemData.OrignalData.WhatsNew = $(".recent-change").text();
	itemData.OrignalData.Size = "?";
	itemData.OrignalData.Installs = "?";

	$('.content').each(function(){
		if($(this).attr('itemprop') == "fileSize")
			itemData.OrignalData.Size = $(this).text();
		else if($(this).attr('itemprop') == "numDownloads")
			itemData.OrignalData.Installs = $(this).text();
		else if($(this).attr('itemprop') == "softwareVersion")
			itemData.OrignalData.CurrentVer =$(this).text();
		else if($(this).attr('itemprop') == "operatingSystems")
			itemData.OrignalData.AndroidVer =$(this).text();
		else if($(this).attr('itemprop') == "contentRating")
			itemData.OrignalData.ContentRating = $(this).text();

	});

	itemData.OrignalData.Developer = {};

	$('.dev-link').each(function(){
		if($(this).text().toLowerCase().search("email") != -1)
			itemData.OrignalData.Developer.Email = $(this).attr("href");
		if($(this).text().toLowerCase().search("website") != -1)
			itemData.OrignalData.Developer.Website = $(this).attr("href");
		if($(this).text().toLowerCase().search("policy") != -1)
			itemData.OrignalData.Developer.PrivacyPolicyUrl = $(this).attr("href");
	});

	//$('.card.no-rationale.apps')
	itemData.OrignalData.SimmilarApps = [];
	itemData.OrignalData.MoreByDev = [];

	$('.rec-cluster').each(function(){
		if($(this).find('h1').text().toLowerCase().search("similar") != -1)
		{
			$(this).find('.card.no-rationale.apps').each(function(){
				itemData.OrignalData.SimmilarApps.push($($(this).find('a')[0]).attr('href').split('?id=')[1].split("&")[0]  );
			});
		}
		else if($(this).find('h1').text().toLowerCase().search("developer") != -1)
		{
			$(this).find('.card.no-rationale.apps').each(function(){
				itemData.OrignalData.MoreByDev.push($($(this).find('a')[0]).attr('href').split('?id=')[1].split("&")[0]  );
			});
		}

	});

	callback(itemData);
}


function getDataFromPackagename(packageName , callback)
{
	ExtractHtmlFromAppName(packageName , function(body){

		if(body == null)
		{
			callback(null);
			return;
		}

		if(body == 404)
		{
			var r = {};
			r.PackegeId = packageName;
			r.TimeScrapped =  404;
			callback(r);
			return;

		}

		extractDataFromAppHTML(body , function(r){
			r.PackegeId = packageName;
			console.lo
			callback(r);
		});
	});
}

exports.getDataFromMultiplePackageNames = function(packageNames , callback)
{
	var combinedData = []; // all the data scrapped will be stored here

	async.each(packageNames , function(item , acallback){
		 	getDataFromPackagename(item , function(r){
		 		if(r != null)
		 		{
		 			combinedData.push(r);
		 		}
		 		acallback();
		 	});
			
	}, function(e){
		callback(combinedData);
	});
}


// example
// getDataFromMultiplePackageNames( ['com.facebook.katana' , 'com.whatsapp'] , console.log );