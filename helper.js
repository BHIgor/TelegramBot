var token = '1773be66-bad6-4552-9ead-c659b82e2e5d';
var appName = 'telegram-glaza-bot';
var dynoName = 'web.1';

var request = require('request');
const Heroku = require('heroku-client')
const heroku = new Heroku({ token: process.env.HEROKU_API_TOKEN })

module.exports = {
    logStart(){
        console.log('bot has been')    
        
    heroku.delete('/apps/' + appName + '/dynos/' + dynoName)
           .then( x => console.log(x) );
    },
    
    getChatId(msg) {
        return msg.chat.id
    }
   
}