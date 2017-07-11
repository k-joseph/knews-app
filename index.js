var jsonfile = require('jsonfile');
var request = require('sync-request');
//var schedule = require('node-schedule');
var articlesEndPoint = 'https://newsapi.org/v1/articles?';
var sourcesEndPoint = 'https://newsapi.org/v1/sources?';

//console.log('KNews App will email subcribers news headlines updates every 6 hours, keep this console open!');			
//schedule.scheduleJob('*/360* * * *', function() {//runs every 6 hours
	jsonfile.readFile('/Users/k-joseph/Projects/kaweesi/knews-app/config.json', function(err, configs) {
		if(configs) {
			for(i = 0; i < configs.newsApi.sources.length; i++) {
				var response = request('GET', articlesEndPoint + 'source=' + configs.newsApi.sources[i] + '&apiKey=' + configs.newsApi.ApiKey);
				
				if (response && response.getBody() && response.statusCode == 200) {
	  				var emailContent = '';
	  				var eC = '';
	  				var bodyJson = JSON.parse(response.getBody());				
	  				
	  				console.log('Starting to build news Headlines updates');
	  				for(k=0; k < bodyJson.articles.length; k++) {
	  					for(j=0; j < configs.keyWords.length; j++) {
	  						if((bodyJson.articles[k].title && bodyJson.articles[k].title.indexOf(configs.keyWords[j]) > -1) || (bodyJson.articles[k].description && bodyJson.articles[k].description.indexOf(configs.keyWords[j]) > -1)) {
	  							var newEContent = '';
	  							var readableContent = '';
	  							
	  							if(bodyJson.articles[k].title) {
	  								newEContent += '<h1>' + bodyJson.articles[k].title + '</h1>';
	  								if(configs.logMailsToFileSystem)
	  									readableContent += 'Title: ' + bodyJson.articles[k].title + '\n';
	  							}
	  							if(bodyJson.articles[k].description) {
	  								newEContent += '<p>' + bodyJson.articles[k].description + '</p>';
	  								if(configs.logMailsToFileSystem)
	  									readableContent += 'Description: ' + bodyJson.articles[k].description + '\n';
	  							}
	  							if(bodyJson.articles[k].description) {
	  								newEContent += 'Author(s): <b>' + bodyJson.articles[k].author + '</b><br/>';
	  								if(configs.logMailsToFileSystem)
	  									readableContent += 'Author(s): ' + bodyJson.articles[k].author + '\n';
	  							}
	  							if(bodyJson.articles[k].publishedAt)
	  								newEContent += 'Published at: <b>' + bodyJson.articles[k].publishedAt + '</b><br/>';
	  								if(configs.logMailsToFileSystem)
	  									readableContent += 'Published at: ' + bodyJson.articles[k].publishedAt + '\n';
	  							if(bodyJson.source) {
	  								newEContent += 'Source: <b>' + bodyJson.source.replace('-', ' ') + '</b><br/>';
	  								if(configs.logMailsToFileSystem)
	  									readableContent += 'Source: ' + bodyJson.source.replace('-', ' ') + '\n';
	  							}
	  							if(bodyJson.articles[k].url) {
	  								newEContent += 'Reference: <b>' + bodyJson.articles[k].url + '</b>';
	  								if(configs.logMailsToFileSystem)
	  									readableContent += 'Reference: ' + bodyJson.source.url + '\n';
	  							}
	  							newEContent +='<hr>';
	  							if(readableContent)
	  								readableContent += '\n';
	  							
	  							if(eC.indexOf(newEContent) < 0) {
	  								emailContent += newEContent.replace(configs.keyWords[j],'<u>' +  configs.keyWords[j] + '</u>');
	  								eC += newEContent;
	  							}
	  							//TODO log readableContent to file System within loggedMails (create folder if it doesn't exist)
	  						}
	  					}
	  				}
	  				console.log('Finished to build news Headlines updates');
	  				sendEmailContent(emailContent, configs);
	  				console.log('');
	  			}
			}
		}
	});
//});

function sendEmailContent(emailContent, configs) {
	if(emailContent) {
		console.log('Queuing news update to to be sent to subscribers');
		var mailgun = require('mailgun-js')({apiKey: configs.mailer.apiKey, domain: configs.mailer.domain});
 		var mail = configs.mailDraft;
 		
 		for(l=0; l < configs.subscribers.length; l++) {
 			mail.to = configs.subscribers[l].name + " <" + configs.subscribers[l].emailAddress + ">";
 			mail.html = emailContent;
 			mail.subject = 'KNews App Update for: ' + new Date().toDateString();
 				
 			//console.log('Sending email to ' + configs.subscribers.length + ' subscriber(s)');
			mailgun.messages().send(mail, function (error, body) {
			if(body)
  				console.log(body);
  			if(error)
  				console.log(error);
			});
		}
	}
}