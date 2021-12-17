import TelegramBot from 'node-telegram-bot-api'

const TOKEN = "5033990491:AAGKChEe_nf0SpyjZLb-QxKKw9E8YhpWO5s"
const bot = new TelegramBot(TOKEN, {polling:true})

bot.on('message', msg =>{
    bot.sendMessage(msg.chat.id,`hello sobara${msg.from.first_name}`)
})