knews-app
========================================
uses https://newsapi.org/ and then emails news headlines to subscribers


___________________
Required packages(npm modules)
___________________
- npm install sync-request
- npm install jsonfile
- npm install node-schedule
- npm install mailgun-js


___________________
Configuration
___________________
- Set mailer credentials
- set newsapi sources basing on: https://newsapi.org/sources keys
- set newsapi sortby to either top, latest or popular
- set newsapi key (https://newsapi.org/register)


___________________
Running app
___________________
- Ubuntu
 1. apt-get install nodejs-legacy
 2. apt-get install npm
 3. npm install knews-app
 4. npm start knews-app