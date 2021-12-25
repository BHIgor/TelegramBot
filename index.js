const TelegramBot = require('node-telegram-bot-api')
const kb = require('./keyboard-buttons')
const keyboard = require('./keyboard')
const helper = require('./helper')


const {google} = require('googleapis')
const keys = require('./credentials.json')

const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
)



 /*
client.authorize(function(err,tokens){
    if(err){
        console.log(err)
        return
    } else {
        console.log('connecned')
        gsrun(client)
    }
})

async function gsrun(cl){

    const gsapi = google.sheets({version:'v4',auth: cl})

    const opt = {
        spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
        range:'A2:B5'
    }
    let data = await gsapi.spreadsheets.values.get(opt)
    let dataArray = data.data.values

   let newDataArray = dataArray.map(function(r){
        r.push(r[0] + '-' + r[1])
        return r
    })
    const updateOptions = {
        spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
        range:'E2',
        valueInputOption:'USER_ENTERED',
        resource: {values: newDataArray}
    }
    let res = await gsapi.spreadsheets.values.update(updateOptions)
    console.log(dataArray)
}*/
helper.logStart()

const TOKEN = "5033990491:AAGKChEe_nf0SpyjZLb-QxKKw9E8YhpWO5s"
const bot = new TelegramBot(TOKEN, {polling:true})
let test = 0
let numberIndex

bot.on('message', msg => {
    (msg.forward_from_chat)?
    bot.forwardMessage('@f31f122',msg.chat.id, msg.message_id).then(function(){}):
    test = 1

  
    switch (msg.text){
        case kb.home.glaza: 
        bot.sendMessage(chatId, `Перешлите пост на который нужно накрутить`,{
            reply_markup:{ resize_keyboard: true,keyboard:keyboard.back}
        })
        break 
        case kb.home.tarif: 
        bot.sendMessage(chatId, `
            Доступные тарифы:
        `,{
            reply_markup:{ resize_keyboard: true,keyboard:keyboard.back}
        })
        break 
        case kb.home.keryvannya: 
        bot.sendMessage(chatId, `
            Посты которые накручиваются: 
        `,{
            reply_markup:{ resize_keyboard: true,keyboard:keyboard.back}
        })
        break 
        case kb.home.profile:
            
            bot.sendMessage(chatId, `
                👤 Ваш ID: ${chatId}\n💰 Баланс: 0р.\n🎯 Тариф:\n \nВыберите способ пополнения баланса:
            `,{
                reply_markup:{ 
                    resize_keyboard: true,
                    inline_keyboard: [
                        [
                            {
                                text:'QIWI',
                                url:'qiwi.com',
                                callback_data:'1'
                            }
                        ],
                        [
                            {
                                text:'Visa/Mastercard',
                                callback_data:'2'
                            }
                        ],
                    ],
                }
            })
            break
        case kb.home.instruction:
            bot.sendMessage(chatId, `
            Инструкция:
            `,{
                reply_markup:{ resize_keyboard: true,keyboard:keyboard.back}
            })
            break
      
        case kb.back:
            bot.sendMessage(chatId, `👉 Выберите, что хотите сделать:`,{
                reply_markup:{ resize_keyboard: true,keyboard:keyboard.home}
            })
        break           
    }
})


bot.onText(/\/start/, msg => {
    const text = `Привет ${msg.from.first_name}, я готов к работе`
    bot.sendMessage(helper.getChatId(msg), text, {
        reply_markup:{
            resize_keyboard: true,
            keyboard:keyboard.home
        },
 
    })
    client.authorize(function(err,tokens){
        if(err){
            console.log(err)
            return
        } else {
            console.log('connecned')
            saveID(client)
        }
    })
    async function saveID(cl){
    
        const gsapi = google.sheets({version:'v4',auth: cl})
    
        const appendOptions = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:'A1',
            valueInputOption:'USER_ENTERED',
            insertDataOption:'INSERT_ROWS',
            includeValuesInResponse: true,
            resource: {values: [
                [msg.chat.id,0],
            ]}
        }
        const all = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:'A1:A'
        }
        let data = await gsapi.spreadsheets.values.get(all)
        let allID = data.data.values.flat().map(Number)
        
        if(allID.includes(msg.chat.id)){
            numberIndex = allID.indexOf(msg.chat.id)
        } else{
            await gsapi.spreadsheets.values.append(appendOptions)
        }
        
       
        
    }
  
});


