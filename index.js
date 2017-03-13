var jsonfile = require('jsonfile');
var request = require('request');
var mailer = require('nodemailer');
var schedule = require('node-schedule');
var articlesEndPoint = 'https://newsapi.org/v1/articles?';
var sourcesEndPoint = 'https://newsapi.org/v1/sources?';

schedule.scheduleJob('*/240 * * * *', function(){//runs every 4 hours
	jsonfile.readFile('config.json', function(err, configs) {
		for(i = 0; i < configs.newsApi.sources.length; i++) {
			request(articlesEndPoint + 'source=' + configs.newsApi.sources[i] + '&sortBy=latest&apiKey=' + configs.newsApi.ApiKey, function (error, response, body) {
	  			if (!error && response.statusCode == 200) {
	  				for(j=0; j < configs.keyWords.length; j++) {
	  					var bodyJson = JSON.parse(body);
	  					
	  					for(k=0; k < bodyJson.articles.length; k++) {
	  						if((bodyJson.articles[k].title && bodyJson.articles[k].title.indexOf(configs.keyWords[j]) > -1) || (bodyJson.articles[k].description && bodyJson.articles[k].description.indexOf(configs.keyWords[j]) > -1)) {
	  							//TODO email here
	  							console.log('');
	  							console.log('###################################################');
	  							console.log('TITLE: ' + bodyJson.articles[k].title);
	  							console.log('');
	  							console.log('DESCRIPTION: ' + bodyJson.articles[k].description);
	  							console.log('');
	  							console.log('URL: ' + bodyJson.articles[k].url);
	  							console.log('');
	  							console.log('AUTHOR: ' + bodyJson.articles[k].author);
	  							console.log('');
	  							console.log('PUBLISHED AT: ' + bodyJson.articles[k].publishedAt);
	  							console.log('');
	  							console.log('SOURCE: ' + bodyJson.source.replace('-', ' '));
	  							console.log('###################################################');
	  							console.log('');
	  						}
	  					}
	  				}
	  			}
			});
		}
	});
});
