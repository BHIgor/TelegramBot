const TelegramBot = require('node-telegram-bot-api')
const kb = require('./keyboard-buttons')
const keyboard = require('./keyboard')
const helper = require('./helper')

const TelegramServer = require('telegram-test-api');
  let serverConfig = {port: 9000};
  let server = new TelegramServer(serverConfig);
  await server.start();

  
helper.logStart()

const TOKEN = "5033990491:AAGKChEe_nf0SpyjZLb-QxKKw9E8YhpWO5s"
const bot = new TelegramBot(TOKEN, {polling:true})


bot.on('message', msg => {
    const chatId = helper.getChatId(msg)
    switch (msg.text){
        case kb.home.favorite:
            break
        case kb.home.films:
            bot.sendMessage(chatId, `Выберите жанр:`,{
                reply_markup:{keyboard:keyboard.films}
            })
            break
        case kb.home.cinemas:
            break 
        case kb.back:
            bot.sendMessage(chatId, `Что хотите посмотреть?`,{
                reply_markup:{keyboard:keyboard.home}
            })
        break           
    }
})

bot.onText(/\/start/, msg => {
    const text = `Привет ${msg.from.first_name}, я готов к работе`
    bot.sendMessage(helper.getChatId(msg), text, {
        reply_markup:{
            keyboard:keyboard.home
        }
    })
})