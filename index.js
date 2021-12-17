const TelegramBot = require('node-telegram-bot-api')
const kb = require('./keyboard-buttons')
const keyboard = require('./keyboard')


const TOKEN = "5033990491:AAGKChEe_nf0SpyjZLb-QxKKw9E8YhpWO5s"
const bot = new TelegramBot(TOKEN, {polling:true})


bot.on('message', msg => {
    switch (msg.text){
        case kb.home.favorite:
            break
        case kb.home.films:
            break
        case kb.home.cine:
            break
                    
    }
})

bot.onText(/\/start/, msg => {
    const text = `Привет ${msg.from.first_name}, я готов к работе`
    bot.sendMessage(msg.chat.id, text, {
        reply_markup:{
            keyboard:keyboard.home
        }
    })
})