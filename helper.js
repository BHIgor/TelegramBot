const Heroku = require('heroku-client')
const heroku = new Heroku({ token: process.env.HEROKU_API_TOKEN })

module.exports = {
    logStart(){
        console.log('bot has been')
        heroku.apps('telegram-glaza-bot').dynos().restartAll()
    },
    getChatId(msg) {
        return msg.chat.id
    }
   
}