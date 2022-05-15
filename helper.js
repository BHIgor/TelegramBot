var token = '1773be66-bad6-4552-9ead-c659b82e2e5d';
var appName = 'telegram-glaza-bot';
var dynoName = 'yourDynoHere';

var request = require('request');


module.exports = {
    logStart(){
        console.log('bot has been')
        
request.delete(
    {
        url: 'https://api.heroku.com/apps/' + appName + '/dynos/',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.heroku+json; version=3',
            'Authorization': 'Bearer ' + token
        }
    },
    function(error, response, body) {
        // Do stuff
    }
);
        
    },
    getChatId(msg) {
        return msg.chat.id
    }
   
}