const TelegramBot = require('node-telegram-bot-api')
const kb = require('./keyboard-buttons')
const keyboard = require('./keyboard')
const helper = require('./helper')


const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");


const apiId = 9950159;
const apiHash = "b14f3786098d5dd8e9899797dec42bf2";
const stringSession = new StringSession("1AgAOMTQ5LjE1NC4xNjcuNTABu2kEZYPC1U2z6ga2nbUg7CjeLui+IZNzqZ1Q8eC9shDShfPiN5zTqtvXHD6oxERlcs+YDLPPATNeBJ1MofTTH3HBPqMf54UhIm2XS0o9mCM87egutVRxVjoh76g1snbB7gbtSD2rtGLnO5yOBKGQAl1NM0lb5EFA43K+QSzyVyiSyVkbJWT7VEgMNm2LVTqQdESm+TJtmaMeY/J6w5cqGVmL62Cwpv65/W9+pFw/QuvKxYcrm54Vx0+jvi7Fl29IyOM19bMJkyPzmEahWMcL47u2/XsctB3W1UwBNX4g6AMFIhL/GFF61Gxs2In9wyg4v/EbgR3kkkXXswf9/caryjg="); 
const client = new TelegramClient(stringSession, apiId, apiHash, {});

helper.logStart()

const TOKEN = "5033990491:AAGKChEe_nf0SpyjZLb-QxKKw9E8YhpWO5s"
const bot = new TelegramBot(TOKEN, {polling:true})
let test = 0

bot.on('message', msg => {
    (msg.forward_from_chat)?
    bot.forwardMessage('@f31f122',msg.chat.id, msg.message_id).then(function(){}):
    test = 1

    const chatId = helper.getChatId(msg)
    switch (msg.text){
        case kb.home.instruction:
            break
        case kb.home.profile:
            break
        case kb.home.glaza:
           
            bot.sendMessage(chatId, `Перешлите пост на который нужно накрутить`,{
                reply_markup:{keyboard:keyboard.nakrutka}
            })
            break 
        case kb.home.news:
            break 
        case kb.back:
            bot.sendMessage(chatId, `👉 Выберите, что хотите сделать:`,{
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

});


