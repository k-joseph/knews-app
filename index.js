var jsonfile = require('jsonfile');
var request = require('request');
var schedule = require('node-schedule');
var articlesEndPoint = 'https://newsapi.org/v1/articles?';
var sourcesEndPoint = 'https://newsapi.org/v1/sources?';
var emailContent = '';
		
schedule.scheduleJob('*/360 * * * *', function() {//runs every 6 hours
	console.log('KNews App will email subcribers news headlines updates every 6 hours, keep this console open!');
	jsonfile.readFile('config.json', function(err, configs) {
		console.log('Starting to build news Headlines updates');
		for(i = 0; i < configs.newsApi.sources.length; i++) {
			if(i = 0)
				emailContent = '';
			request(articlesEndPoint + 'source=' + configs.newsApi.sources[i] + '&sortBy=latest&apiKey=' + configs.newsApi.ApiKey, function (error, response, body) {
	  			if (!error && response.statusCode == 200) {
	  				for(j=0; j < configs.keyWords.length; j++) {
	  					var bodyJson = JSON.parse(body);
	  					
	  					for(k=0; k < bodyJson.articles.length; k++) {
	  						if((bodyJson.articles[k].title && bodyJson.articles[k].title.indexOf(configs.keyWords[j]) > -1) || (bodyJson.articles[k].description && bodyJson.articles[k].description.indexOf(configs.keyWords[j]) > -1)) {
	  							
	  							emailContent += '<hr>';
	  							emailContent += '<h1>' + bodyJson.articles[k].title + '</h1>';
	  							emailContent += '<p>' + bodyJson.articles[k].description + '</p>';
	  							emailContent += 'Author(s): <b>' + bodyJson.articles[k].author + '</b><br/>';
	  							emailContent += 'Published at: <b>' + bodyJson.articles[k].publishedAt + '</b><br/>';
	  							emailContent += 'Source: <b>' + bodyJson.source.replace('-', ' ') + '</b><br/>';
	  							emailContent += 'Reference: <b>' + bodyJson.articles[k].url;
	  							emailContent +='<hr>';
	  						}
	  					}
	  				}
	  			}
			});
		}
		console.log('Finished to build news Headlines updates');	
		if(emailContent) {
			var mailgun = require('mailgun-js')({apiKey: configs.mailer.apiKey, domain: configs.mailer.domain});
 			var mail = configs.mailDraft;
 			
 			for(l=0; l < configs.subscribers.length; l++) {
 				mail.to = configs.subscribers[l].name + " <" + configs.subscribers[l].emailAddress + ">";
 				mail.html = emailContent;
 				mail.subject = mail.subject + ' for: ' + new Date().toDateString();
 				
 				console.log('Sending email to ' + configs.subscribers.length + ' subscribers');
				mailgun.messages().send(mail, function (error, body) {
					if(body)
  						console.log(body);
  					if(error)
  						console.log(error);
				});
			}
		}
		console.log('');
	});
});
