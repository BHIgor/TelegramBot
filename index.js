const TelegramBot = require('node-telegram-bot-api')
const kb = require('./keyboard-buttons')
const keyboard = require('./keyboard')
const helper = require('./helper')
const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk');
const SECRET_KEY = 'eyJ2ZXJzaW9uIjoiUDJQIiwiZGF0YSI6eyJwYXlpbl9tZXJjaGFudF9zaXRlX3VpZCI6ImVmdXJtOC0wMCIsInVzZXJfaWQiOiIzODA2MzgxOTM0MDAiLCJzZWNyZXQiOiJhNTJjNTVjOWUwM2Y5OTU3ZGZiMDE2NTZkZWI5MTc1NzI4NDE5NDk1ODI3ZGM1YWMxMTczNzE3NzI1NmQ4YzYzIn19';
const qiwiApi = new QiwiBillPaymentsAPI(SECRET_KEY);

const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
/* 
const apiId = 9950159;
const apiHash = "b14f3786098d5dd8e9899797dec42bf2";
const session = new StringSession("1AgAOMTQ5LjE1NC4xNjcuNTABu2kEZYPC1U2z6ga2nbUg7CjeLui+IZNzqZ1Q8eC9shDShfPiN5zTqtvXHD6oxERlcs+YDLPPATNeBJ1MofTTH3HBPqMf54UhIm2XS0o9mCM87egutVRxVjoh76g1snbB7gbtSD2rtGLnO5yOBKGQAl1NM0lb5EFA43K+QSzyVyiSyVkbJWT7VEgMNm2LVTqQdESm+TJtmaMeY/J6w5cqGVmL62Cwpv65/W9+pFw/QuvKxYcrm54Vx0+jvi7Fl29IyOM19bMJkyPzmEahWMcL47u2/XsctB3W1UwBNX4g6AMFIhL/GFF61Gxs2In9wyg4v/EbgR3kkkXXswf9/caryjg="); // You should put your string session here
const clientApi = new TelegramClient(session, apiId, apiHash, {});
*/


const {google} = require('googleapis')
const keys = require('./credentials.json');
const { chat } = require('googleapis/build/src/apis/chat');

const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(80)

const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
)

helper.logStart()

const TOKEN = "5026018289:AAEGOOK3RIFu7WEryesHPgX-Rr6w-BxOvwI"
const bot = new TelegramBot(TOKEN, {polling:true})
let test = 0
let numberIndex = 0
let summ = 0
let time = 0
bot.on('message', msg => {
    const chatId = helper.getChatId(msg)
  
    
    client.authorize(function(err,tokens){
        if(err){
            console.log(err)
            return
        } else {
          
            status(client)
        
        }
    })
    async function status(cl){
        const publicKey = '48e7qUxn9T7RyYE1MVZswX1FRSbE6iyCj2gCRwwF3Dnh5XrasNTx3BGPiMsyXQFNKQhvukniQG8RTVhYm3iPqQD6JkQycbDGTMKqjSE6zGHREdHw2CdeELpQ7Mm6YNTiQPe1GG4BSowUG3aqV3jgrEwgwW3tx8d6rARW3uCEW5qgpPNRcgTqJDv9PsQiB'

        const params = {
            publicKey,
            amount:  Number(msg.text),
            comment:chatId,
            paySource:'qw',
        };
        const paramsCard = {
            publicKey,
            amount:  Number(msg.text),
            comment:chatId,
            paySource:'card'
        };
        const link = qiwiApi.createPaymentForm(params);
        const linkCard = qiwiApi.createPaymentForm(paramsCard);
        
        const gsapi = google.sheets({version:'v4',auth: cl})

        const all = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:'A1:A'
        }
        let data = await gsapi.spreadsheets.values.get(all)
        let allID = data.data.values.flat().map(Number)
        const allstatus = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:'G1:G'
        }
        let dataStatus = await gsapi.spreadsheets.values.get(allstatus)
        let idStatus = dataStatus.data.values.flat()
        
        const updateBalance = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:`F${numberIndex+1}`,
            valueInputOption:'USER_ENTERED',
            resource: {values: [[msg.text]]}
        }
        
        const updateCount = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:`G${numberIndex+1}`,
            valueInputOption:'USER_ENTERED',
            resource: {values: [['Число накрутки']]}
        }
        
        const updateNakr = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:`G${numberIndex+1}`,
            valueInputOption:'USER_ENTERED',
            resource: {values: [['Накрутка']]}
        }
        
        const allNumberPost = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:'L1:L'
        }
        let dataPost = await gsapi.spreadsheets.values.get(allNumberPost)
        let allNumberPostID = dataPost.data.values.flat()
      
        let postIndex = allNumberPostID.length
     
        const updateNumber = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:`M${postIndex}`,
            valueInputOption:'USER_ENTERED',
            resource: {values: [[msg.text]]}
        }
       
        
        numberIndex = allID.indexOf(chatId)
        if(idStatus[numberIndex]==='Оплата'&& Number(msg.text)){
            gsapi.spreadsheets.values.update(updateBalance)
            bot.sendMessage(chatId,`Вы пополняете счет на сумму ${Number(msg.text)} руб.\n\nВыберите способ оплаты:`,{
                reply_markup:{
                    inline_keyboard:  [
                        [    {
                                text:'🥝 QIWI',
                                callback_data:'qiwi',
                                url:link
                            }
                        ],
                        [
                            { 
                                text:'💳 VISA/MASTERCARD',
                                callback_data:'no',
                                url:linkCard
                            }
                 
                        ]]
                }
            })
        } 

        let postTime = new Date().getTime()
        
        let normalTime= `${new Date(postTime).getDate()}`+'.'+`${new Date(postTime).getMonth()+1}`+'.'+`${new Date(postTime).getFullYear()}`+` `+`${new Date(postTime). getHours()}`+`:`+`${new Date(postTime).getMinutes()}`+`:`+`${new Date(postTime).getSeconds()}`
  
        if(msg.forward_from_chat && idStatus[numberIndex]==='Накрутка'){
            let idChannel = String(msg.forward_from_chat.id).substring(3)
     
            const appendOptions = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'I1',
                valueInputOption:'USER_ENTERED',
                includeValuesInResponse: true,
                resource: {values: [
                    [msg.forward_from_chat.title,msg.chat.id,idChannel, msg.forward_from_message_id,0,normalTime],
                ]}
            }
            bot.forwardMessage('@f31f122',chatId, msg.message_id).then(function(){ })

            bot.sendMessage('@f31f122', `Id канала: ${idChannel}\n\nНомер поста: ${msg.forward_from_message_id}`)
            gsapi.spreadsheets.values.append(appendOptions)
            gsapi.spreadsheets.values.update(updateCount)

            bot.sendMessage(chatId,`👁‍🗨 Введи нужное количество просмотров\n\n💬 <i>Пример: на посте 1000 просмотров, но ты хочешь сделать чтобы было 3000. Тогда тебе нужно ввести 2000.</i>`,{parse_mode: 'HTML' })
        
        } 
        if(idStatus[numberIndex]==='Число накрутки'&& Number(msg.text)){
            
           
            gsapi.spreadsheets.values.update(updateNumber)
            gsapi.spreadsheets.values.update(updateNakr)
            bot.sendMessage(chatId,`✅ Просмотры подключены`)
            bot.sendMessage('@f31f122', `Количество глаз: ${msg.text}`)
        }
     
       
   }


    switch (msg.text){

case kb.home.glaza: 
        client.authorize(function(err,tokens){
            if(err){
                console.log(err)
                return
            } else {
            
                statusNakrutka(client)
            }
        })
        async function statusNakrutka(cl){
            const gsapi = google.sheets({version:'v4',auth: cl})

            const all = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'A1:A'
            }
            let data = await gsapi.spreadsheets.values.get(all)
            let allID = data.data.values.flat().map(Number)
            numberIndex = allID.indexOf(chatId)

            const updateNakr = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:`G${numberIndex+1}`,
                valueInputOption:'USER_ENTERED',
                resource: {values: [['Накрутка']]}
            }
            gsapi.spreadsheets.values.update(updateNakr)

          
        }
        bot.sendMessage(chatId, `Перешлите пост на который нужно накрутить`,{
            reply_markup:{ resize_keyboard: true,keyboard:keyboard.back}
        })
        break 

case kb.home.keryvannya: 
        client.authorize(function(err,tokens){
            if(err){
                console.log(err)
                return
            } else {
            
                keryvannya(client)
            
            }
        })
        async function keryvannya(cl){
             
            const gsapi = google.sheets({version:'v4',auth: cl})
    
            const all = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'I2:N'
            }
            let data = await gsapi.spreadsheets.values.get(all)
            let  allID = data.data.values   
            
           if(allID !== undefined){
            let  key = ['name','id','idChannel','post', 'count','time']
            let objKeruvannya = allID.map(row =>
                row.reduce((acc, cur, i) =>
                  (acc[key[i]] = cur, acc), {}))
       
            objKeruvannya.map(e => {
                if(Number(e.id) === chatId){
                    bot.sendMessage(chatId,`<b>Пост добавлен</b> ${e.time}\n<a href='https://t.me/c/${e.idChannel}/${e.post}'>${e.name}</a>\n<b>Заказано:</b> ${e.count} просмотров`,{
                        reply_markup:{ resize_keyboard: true,  inline_keyboard:  [
                            [    {
                                    text:'❌ Удалить',
                                    callback_data:`delete`                            }
                            ]
                            ]},
                        parse_mode:'HTML'
                    })
                    }
                })    
                numberIndex = allID.indexOf(chatId) 
            }
           
        }
        bot.sendMessage(chatId, `
            Посты которые накручиваются: 
        `,{
            reply_markup:{ resize_keyboard: true,keyboard:keyboard.back}
        })

        break 

case kb.home.profile:
             client.authorize(function(err,tokens){
                if(err){
                    console.log(err)
                    return
                } else {
                  
                    saveproba(client)
                
                }
            })
            async function saveproba(cl){
             
                

                const gsapi = google.sheets({version:'v4',auth: cl})
        
                const all = {
                    spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                    range:'A1:A'
                }
                let data = await gsapi.spreadsheets.values.get(all)
                let allID = data.data.values.flat().map(Number)
        
                const allBalance = {
                    spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                    range:'B1:B'
                }
                let dataBalance = await gsapi.spreadsheets.values.get(allBalance)
                let idBlnc = dataBalance.data.values.flat().map(Number)

                const allTarif = {
                    spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                    range:'E1:E'
                }
                let dataTarif = await gsapi.spreadsheets.values.get(allTarif)
                let idTrf = dataTarif.data.values.flat()
                
                numberIndex = allID.indexOf(chatId)
     
        
          
            bot.sendMessage(chatId, `
                👤 Ваш ID: ${chatId}\n💰 Баланс: ${idBlnc[numberIndex]}р.\n🎯 Тариф: ${idTrf[numberIndex]}\n \n 
            `,{
                reply_markup:{ 
                    resize_keyboard: true,
                   keyboard:keyboard.profile
                }
            })    }
break
case kb.profile.balance:
 
  
  
    client.authorize(function(err,tokens){
        if(err){
            console.log(err)
            return
        } else {
        
            popoln(client)
        
        }
    })

    async function popoln(cl){
          
        await bot.sendMessage(chatId,`Введите суму пополнения (руб.):`,{
            reply_markup:{ 
                resize_keyboard: true,
            keyboard:keyboard.back,
            }
         }) 

        const gsapi = google.sheets({version:'v4',auth: cl})

        const all = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:'A1:A'
        }
        let data = await gsapi.spreadsheets.values.get(all)
        let allID = data.data.values.flat().map(Number)

        numberIndex = allID.indexOf(chatId)
       
        const updateBalancessss = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:`G${numberIndex+1}`,
            valueInputOption:'USER_ENTERED',
            resource: {values: [['Оплата']]}
        }
       
        
    
        gsapi.spreadsheets.values.update(updateBalancessss)
    }

break
 
case kb.home.instruction:
           
            bot.sendMessage(chatId, `<b>Что делает бот</b>❓\n▶️ Бот накручивает просмотры на закрытые/открытые каналы.\n\n<b>Как пользоваться ботом</b>❓\n▶️ Для накрутки просмотров нужно перейти в раздел <b>"👀 Накрутка просмотров"</b> --> переслать в бота пост на который нужно накрутить просмотры --> ввести нужное количество просмотров.\n\n<b>Как считаются просмотры</b>❓\n▶️ Введенное вами количество просмотров суммируется к общему числу (пример: на посте 2000 просмотров, вы хотите 5000 просмотров,тогда нужно ввести 3000)\n\n<b>Как купить тариф</b>❓\n▶️ Для того чтобы купить тариф сначала нужно пополнить счета одним из доступных способов, в разделе <b>"👤 Профиль"</b>, затем перейти на вкладку <b>"👁️ Тарифы"</b> выбрать нужный тариф и оплатить.\n\n<b>Я оплатил, а деньги не пришли. Что делать?</b>❓\n▶️ В этом случаи Вам нужно написать в службу поддержки: @betplanetos\n\n❗️ <b>Чтобы не потерять бота</b> ❗️\n▶️ Подписывайтесь на канал @glazaVtelege там вы найдете всегда актуальную ссылку `,{
                reply_markup:{ resize_keyboard: true,keyboard:keyboard.back},parse_mode:'HTML'
            })
     
break
case kb.blockhome.proba:   

            bot.sendMessage(chatId, `Вы хотите использовать пробный период на 15 минут?`,{
                reply_markup:{ resize_keyboard: true,  inline_keyboard:  [
                    [    {
                            text:'✅ Да',
                            callback_data:'yes'
                        }
                    ],
                    [
                        { 
                            text:'❌ Нет',
                            callback_data:'no'
                        }
             
                    ]],}
            })
            break
case kb.blockhome.kupit: 
         
            bot.sendMessage(chatId, `
            <b>Доступные тарифы:</b>\n📈 День: 100 руб\n📉 3 дня: 250 руб\n📈 Неделя: 500 руб\n📉 Месяц: 1500 руб \n\n\n📆 Выберите время аренды
            `,{
                reply_markup:{ resize_keyboard: true,keyboard:keyboard.tarif},
                parse_mode:'HTML'
            })
break
case kb.profile.tarif:
            bot.sendMessage(chatId, `
            <b>Доступные тарифы:</b>\n📈 День: 100 руб\n📉 3 дня: 250 руб\n📈 Неделя: 500 руб\n📉 Месяц: 1500 руб \n\n\n📆 Выберите время аренды
                `,{
                    reply_markup:{ resize_keyboard: true,keyboard:keyboard.tarif},
                    parse_mode:'HTML'
            })
break
  
case kb.home.tarif: 
    
        bot.sendMessage(chatId, `
        <b>Доступные тарифы:</b>\n📈 День: 100 руб\n📉 3 дня: 250 руб\n📈 Неделя: 500 руб\n📉 Месяц: 1500 руб \n\n\n📆 Выберите время аренды
        `,{
            reply_markup:{ resize_keyboard: true,keyboard:keyboard.tarif},
            parse_mode:'HTML'
       
        })
    
        break 
//--------------------------
case kb.tarif.day: 
        client.authorize(function(err,tokens){
            if(err){
                console.log(err)
                return
            } else {
            
                day(client)
            
            }
        })
        async function day(cl){
            
            const gsapi = google.sheets({version:'v4',auth: cl})

            const all = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'A1:A'
            }
            let data = await gsapi.spreadsheets.values.get(all)
            let allID = data.data.values.flat().map(Number)

            const allBalance = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'B1:B'
            }
            let dataBalance = await gsapi.spreadsheets.values.get(allBalance)
            let idBlnc = dataBalance.data.values.flat().map(Number)
            
            numberIndex = allID.indexOf(chatId)
            summ = 100
            time = 86400
         bot.sendMessage(chatId, `
        💸 Стоимость тарифа на 1 день 100р.\n\n💰 На Вашем балансе ${idBlnc[numberIndex]} руб.\n\n Подтверждаете оплату❓
        `,{
            reply_markup:{ resize_keyboard: true,keyboard:keyboard.yesornot},
            
        })
        
    }
     
break
        

case kb.tarif.three: 
        client.authorize(function(err,tokens){
            if(err){
                console.log(err)
                return
            } else {
            
                three(client)
            
            }
        })
        async function three(cl){
            
            const gsapi = google.sheets({version:'v4',auth: cl})

            const all = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'A1:A'
            }
            let data = await gsapi.spreadsheets.values.get(all)
            let allID = data.data.values.flat().map(Number)

            const allBalance = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'B1:B'
            }
            let dataBalance = await gsapi.spreadsheets.values.get(allBalance)
            let idBlnc = dataBalance.data.values.flat().map(Number)
            summ = 250
            time = 259200
            numberIndex = allID.indexOf(chatId)
        bot.sendMessage(chatId, `
        💸 Стоимость тарифа на 3 дня 250р.\n\n💰 На Вашем балансе ${idBlnc[numberIndex]} руб.\n\n Подтверждаете оплату❓
        `,{
        reply_markup:{ resize_keyboard: true,keyboard:keyboard.yesornot},
        
        })}
break
case kb.tarif.week: 
        client.authorize(function(err,tokens){
            if(err){
                console.log(err)
                return
            } else {
            
                week(client)
            
            }
        })
        async function week(cl){
            
            const gsapi = google.sheets({version:'v4',auth: cl})

            const all = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'A1:A'
            }
            let data = await gsapi.spreadsheets.values.get(all)
            let allID = data.data.values.flat().map(Number)

            const allBalance = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'B1:B'
            }
            let dataBalance = await gsapi.spreadsheets.values.get(allBalance)
            let idBlnc = dataBalance.data.values.flat().map(Number)
            summ = 500
            time = 604800
            numberIndex = allID.indexOf(chatId)
    
        bot.sendMessage(chatId, `
        💸 Стоимость тарифа на неделю 500р.\n\n💰 На Вашем балансе ${idBlnc[numberIndex]} руб.\n\n Подтверждаете оплату❓
        `,{
        reply_markup:{ resize_keyboard: true,keyboard:keyboard.yesornot},

        })}
break
    case kb.tarif.month: 
    client.authorize(function(err,tokens){
        if(err){
            console.log(err)
            return
        } else {
        
            month(client)
        
        }
    })
    async function month(cl){
        
        const gsapi = google.sheets({version:'v4',auth: cl})

        const all = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:'A1:A'
        }
        let data = await gsapi.spreadsheets.values.get(all)
        let allID = data.data.values.flat().map(Number)

        const allBalance = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:'B1:B'
        }
        let dataBalance = await gsapi.spreadsheets.values.get(allBalance)
        let idBlnc = dataBalance.data.values.flat().map(Number)
        
        numberIndex = allID.indexOf(chatId)
        summ = 1500 
        time = 86400*30 
        bot.sendMessage(chatId, `
        💸 Стоимость тарифа на месяць 1500р.\n\n💰 На Вашем балансе ${idBlnc[numberIndex]} руб.\n\n Подтверждаете оплату❓
        `,{
        reply_markup:{ resize_keyboard: true,keyboard:keyboard.yesornot},

        })}
break

case kb.yesornot.yes:
    client.authorize(function(err,tokens){
        if(err){
            console.log(err)
            return
        } else {
        
            yes(client)
        
        }
    })
    async function yes(cl){
        
        const gsapi = google.sheets({version:'v4',auth: cl})

        const all = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:'A1:A'
        }
        let data = await gsapi.spreadsheets.values.get(all)
        let allID = data.data.values.flat().map(Number)

        const allBalance = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:'B1:B'
        }
        let dataBalance = await gsapi.spreadsheets.values.get(allBalance)
        let idBlnc = dataBalance.data.values.flat().map(Number)
        numberIndex = allID.indexOf(chatId)

        const updateBalance = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:`B${numberIndex+1}`,
            valueInputOption:'USER_ENTERED',
            resource: {values: [[idBlnc[numberIndex]-summ]]}
        }
        
        const nowupdateOptions = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:`D${numberIndex+1}`,
            valueInputOption:'USER_ENTERED',
            resource: {values: [['yes']]}
        }
        const nowupdateOptionsNo = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:`D${numberIndex+1}`,
            valueInputOption:'USER_ENTERED',
            resource: {values: [['no']]}
        }
        const nowallProba = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:'D1:D'
        }
        let nowdataproba = await gsapi.spreadsheets.values.get(nowallProba)
        let nowprobaID = nowdataproba.data.values.flat()
        let tarifTime = new Date().getTime()+time*1000
        let tarifDay = `${new Date(tarifTime).getDate()}`+'.'+`${new Date(tarifTime).getMonth()+1}`+'.'+`${new Date(tarifTime).getFullYear()}`+` `+`${new Date(tarifTime). getHours()}`+`:`+`${new Date(tarifTime).getMinutes()}`+`:`+`${new Date(tarifTime).getSeconds()}`
    
        const updateTarif = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:`E${numberIndex+1}`,
            valueInputOption:'USER_ENTERED',
            resource: {values: [[`до ` +tarifDay]]}
        }
        const updateTarifNo = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:`E${numberIndex+1}`,
            valueInputOption:'USER_ENTERED',
            resource: {values: [['Нету']]}
        }

        if(idBlnc[numberIndex] >= summ && summ === 1500 && nowprobaID[numberIndex]==='no'){
                gsapi.spreadsheets.values.update(updateTarif)
                gsapi.spreadsheets.values.update(updateBalance)
                bot.sendMessage(chatId, `✅ Оплата успешно проведена! 
                `,{reply_markup:{ resize_keyboard: true,keyboard:keyboard.home},})
                gsapi.spreadsheets.values.update(nowupdateOptions)

                function setDaysTimeout(callback,days) {
                   
                    let msInDay = 86400*1000; 
                
                    let dayCount = 0;
                    let timer = setInterval(function() {
                        dayCount++;  
                
                        if (dayCount === days) {
                           clearInterval(timer);
                           callback.apply(this, []);
                        }
                    }, msInDay);
                }
           
                setDaysTimeout(function() {
                    bot.sendMessage(chatId, `☹️ Время тарифного плана истекло. \n \n Выберите тариф чтобы использовать функционал! `,{
                        reply_markup:{ resize_keyboard: true,keyboard:keyboard.blockhome}
                    }) 
                    gsapi.spreadsheets.values.update(nowupdateOptionsNo)
                    gsapi.spreadsheets.values.update(updateTarifNo)
                    
                }, 30); 
                
            }
      
        
       if(idBlnc[numberIndex] >= summ && nowprobaID[numberIndex]==='no' && summ !==1500 ){
            
            gsapi.spreadsheets.values.update(updateTarif)
            gsapi.spreadsheets.values.update(updateBalance)
            bot.sendMessage(chatId, `✅ Оплата успешно проведена! ✅
             `,{reply_markup:{ resize_keyboard: true,keyboard:keyboard.home},})
             gsapi.spreadsheets.values.update(nowupdateOptions)
            setTimeout(function() {bot.sendMessage(chatId, `☹️ Время тарифного плана истекло. \n \n Выберите тариф чтобы использовать функционал! `,{
                reply_markup:{ resize_keyboard: true,keyboard:keyboard.blockhome}
            }) 
            gsapi.spreadsheets.values.update(nowupdateOptionsNo)
            gsapi.spreadsheets.values.update(updateTarifNo)
              }, time*1000)
              
        }else if( nowprobaID[numberIndex]==='yes'){
            bot.sendMessage(chatId, `✔️ Вы уже используете тарифный план 
             `,{
            reply_markup:{ resize_keyboard: true,keyboard:keyboard.yesornot},
            })
        } else if(idBlnc[numberIndex] < summ){
            bot.sendMessage(chatId, `❌ Недостаточно денег на счету! 
             `,{
            reply_markup:{ resize_keyboard: true,keyboard:keyboard.yesornot},
    
            })}
        

    }

    
break

//-------------------------
case kb.back:

    client.authorize(function(err,tokens){
        if(err){
            console.log(err)
            return
        } else {
          
            saveBack(client)
        }
    })
    async function saveBack(cl){
        const gsapi = google.sheets({version:'v4',auth: cl})
        
        const all = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:'A1:A'
        }
        let data = await gsapi.spreadsheets.values.get(all)
        let allID = data.data.values.flat().map(Number)
        numberIndex = allID.indexOf(chatId)

        
        const allProba = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:'D1:D'
        }
        let dataproba = await gsapi.spreadsheets.values.get(allProba)
        let probaID = dataproba.data.values.flat()

        const updateGlavnya = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:`G${numberIndex+1}`,
            valueInputOption:'USER_ENTERED',
            resource: {values: [['Главная']]}
        }
      
        if(probaID[numberIndex]==='yes'){
             gsapi.spreadsheets.values.update(updateGlavnya)
             bot.sendMessage(chatId, `👉 Выберите, что хотите сделать:\n\n❗️ Подписывайтесь на канал @glazaVtelege ❗️`,{
                reply_markup:{ resize_keyboard: true,keyboard:keyboard.home}
            })
        }
            else{
                  gsapi.spreadsheets.values.update(updateGlavnya)
                  bot.sendMessage(chatId, `👉 Выберите, что хотите сделать:\n\n❗️ Подписывайтесь на канал @glazaVtelege ❗️`,{
                    reply_markup:{ resize_keyboard: true,keyboard:keyboard.blockhome}
                })
               
            }
            }
  
        break           
    }
})

bot.on('callback_query',  query => {
   
    switch (query.data){
        case 'yes':
            client.authorize(function(err,tokens){
                if(err){
                    console.log(err)
                    return
                } else {
                    
                    saveproba(client)
                }
            })
            async function saveproba(cl){
                
                const gsapi = google.sheets({version:'v4',auth: cl})
            
               
                const all = {
                    spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                    range:'A1:A'
                }
                let data = await gsapi.spreadsheets.values.get(all)
                let allID = data.data.values.flat().map(Number)
                numberIndex = allID.indexOf(query.message.chat.id)
                
             //----------------------
                const updateOptions = {
                    spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                    range:`C${numberIndex+1}`,
                    valueInputOption:'USER_ENTERED',
                    resource: {values: [['yes']]}
                }
                const allProba = {
                    spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                    range:'C1:C'
                }
                let dataproba = await gsapi.spreadsheets.values.get(allProba)
                let probaID = dataproba.data.values.flat()
             //----------------------
             const nowupdateOptions = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:`D${numberIndex+1}`,
                valueInputOption:'USER_ENTERED',
                resource: {values: [['yes']]}
            }
            const nowupdateOptionsNo = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:`D${numberIndex+1}`,
                valueInputOption:'USER_ENTERED',
                resource: {values: [['no']]}
            }
            const nowallProba = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'D1:D'
            }
            let nowdataproba = await gsapi.spreadsheets.values.get(nowallProba)
            let nowprobaID = nowdataproba.data.values.flat()
             
               
              if(probaID[numberIndex]==='no'){
                bot.sendMessage(query.message.chat.id, `✅ Пробный период активировано`,{
                    reply_markup:{ resize_keyboard: true,keyboard:keyboard.home}
                })  
                gsapi.spreadsheets.values.update(nowupdateOptions)
                setTimeout(function() {bot.sendMessage(query.message.chat.id, `Пробный период завершен.\n \n Выберите тариф чтобы использовать функционал! `,{
                    reply_markup:{ resize_keyboard: true,keyboard:keyboard.blockhome}
                }) 
                gsapi.spreadsheets.values.update(updateOptions)
                gsapi.spreadsheets.values.update(nowupdateOptionsNo)
                  }, 900*1000)
                  } else{
                    bot.sendMessage(query.message.chat.id, `❌ Вы уже использовали пробный период`,{
                        reply_markup:{ resize_keyboard: true,keyboard:keyboard.blockhome}
                    })  
                }
            }
            
 
        break
        case 'no':
            bot.sendMessage(query.message.chat.id, `Привет ${query.from.first_name}, я готов к работе`,{
                reply_markup:{ resize_keyboard: true,keyboard:keyboard.blockhome}
            })  
        break
        case 'delete':
            let posts = query.message.entities[1].url.substring(26)
            let idChannels = query.message.entities[1].url.substring(15,25)
            let masivNakrutka = `${idChannels},${posts}`
            client.authorize(function(err,tokens){
                if(err){
                    console.log(err)
                    return
                } else {
                  
                    deletes(client)
                }
            })
            async function deletes(cl){
                const gsapi = google.sheets({version:'v4',auth: cl})
                
                const all = {
                    spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                    range:'K2:L'
                }
                let data = await gsapi.spreadsheets.values.get(all)
                let allID = data.data.values

                let newmasiv = []
                allID.map(e=>{
                    newmasiv.push(e.join())
                })
                numberIndex = newmasiv.indexOf(masivNakrutka)
              
                const clearRange = {
                    spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                    range:`I${numberIndex+2}:N${numberIndex+2}`
                }
               
                await gsapi.spreadsheets.values.clear(clearRange)

                const alls = {
                    spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                    range:'I2:N'
                }
                let datas = await gsapi.spreadsheets.values.get(alls)
                let allIDs = datas.data.values

                await gsapi.spreadsheets.values.get(alls)
                let newAlls = []
                allIDs.map(e=>{
                    if(e.length>0){
                        newAlls.push(e)
                    }
                })

                const updatealls = {
                    spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                    range:`I2:N`,
                    valueInputOption:'USER_ENTERED',
                    resource: {values: newAlls}
                }
                const clearRange2 = {
                    spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                    range:`I2:N`
                }
                await gsapi.spreadsheets.values.clear(clearRange2)
                await gsapi.spreadsheets.values.update(updatealls)
                bot.sendMessage(query.message.chat.id,'✔️ Пост удален с накрутки')
                bot.sendMessage('@f31f122',`❌ Удалить пост: ${posts}\nId канала: ${idChannels} ❌`)

              
            }
          
         
        break
    }
 
  
})

bot.onText(/\/start/, msg => {
    const text = `Привет ${msg.from.first_name}, я готов к работе`

    bot.sendMessage(helper.getChatId(msg), text, {
        reply_markup:{
            resize_keyboard: true,
            keyboard:keyboard.blockhome
        },
 
    })
    client.authorize(function(err,tokens){
        if(err){
            console.log(err)
            return
        } else {
         
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
                [msg.chat.id,0,'no','no','Нету',0,'Главная'],
            ]}
        }
        const all = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:'A1:A'
        }
        let data = await gsapi.spreadsheets.values.get(all)
        let allID = data.data.values.flat().map(Number)

        const allBalance = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:'B1:B'
        }
        let dataBalance = await gsapi.spreadsheets.values.get(allBalance)
        let idBlnc = dataBalance.data.values.flat().map(Number)
        
        if(allID.includes(msg.chat.id)){
            numberIndex = allID.indexOf(msg.chat.id)
            balanceId = idBlnc[numberIndex]
        } else{
            await gsapi.spreadsheets.values.append(appendOptions)
        }
        
       
        
    }
  
});


