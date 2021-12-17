const TelegramBot = require('node-telegram-bot-api')

const TOKEN = "5033990491:AAGKChEe_nf0SpyjZLb-QxKKw9E8YhpWO5s"
const bot = new TelegramBot(TOKEN, {polling:true})

bot.on('message', msg => {
    bot.sendMessage(msg.chat.id, `hello s15551o2bawe112ra${msg.from.first_name}`)
})