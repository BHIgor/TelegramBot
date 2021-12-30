const TelegramBot = require('node-telegram-bot-api')
const kb = require('./keyboard-buttons')
const keyboard = require('./keyboard')
const helper = require('./helper')
const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk');
const SECRET_KEY = 'eyJ2ZXJzaW9uIjoiUDJQIiwiZGF0YSI6eyJwYXlpbl9tZXJjaGFudF9zaXRlX3VpZCI6ImVmdXJtOC0wMCIsInVzZXJfaWQiOiIzODA2MzgxOTM0MDAiLCJzZWNyZXQiOiJhNTJjNTVjOWUwM2Y5OTU3ZGZiMDE2NTZkZWI5MTc1NzI4NDE5NDk1ODI3ZGM1YWMxMTczNzE3NzI1NmQ4YzYzIn19';

const qiwiApi = new QiwiBillPaymentsAPI(SECRET_KEY);

const {google} = require('googleapis')
const keys = require('./credentials.json')
const { query } = require('express')

const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
)
/*inline_keyboard:  [
                    [    {
                            text:'🥝 QIWI',
                            callback_data:'qiwi',
                            url:link
                        }
                    ],
                    [
                        { 
                            text:'💳 VISA/MASTERCARD',
                            callback_data:'visa',
                            url:linkCard
                        }
             
                    ]],*/
helper.logStart()

const TOKEN = "5026018289:AAEGOOK3RIFu7WEryesHPgX-Rr6w-BxOvwI"
const bot = new TelegramBot(TOKEN, {polling:true})
let test = 0
let oplata = 0
let numberIndex = 0
let summ = 0
let time = 0
bot.on('message', msg => {
   

    (msg.forward_from_chat)?
    bot.forwardMessage('@f31f122',msg.chat.id, msg.message_id).then(function(){}):
    test = 1

    const chatId = helper.getChatId(msg)
    switch (msg.text){

case kb.home.glaza: 
        bot.sendMessage(chatId, `Перешлите пост на который нужно накрутить`,{
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
    oplata = 1

    bot.sendMessage(chatId,`Введите суму пополнения (руб.):`,{
            reply_markup:{ 
                resize_keyboard: true,
               keyboard:keyboard.back,
            }
     }) 
    
    client.authorize(function(err,tokens){
        if(err){
            console.log(err)
            return
        } else {
        
            popoln(client)
        
        }
    })
    function mesg(sum){
        const publicKey = '48e7qUxn9T7RyYE1MVZswX1FRSbE6iyCj2gCRwwF3Dnh5XrasNTx3BGPiMsyXQFNKQhvukniQG8RTVhYm3iPqQD6JkQycbDGTMKqjSE6zGHREdHw2CdeELpQ7Mm6YNTiQPe1GG4BSowUG3aqV3jgrEwgwW3tx8d6rARW3uCEW5qgpPNRcgTqJDv9PsQiB'

        const params = {
            publicKey,
            amount: sum,
            comment:chatId,
            paySource:'qw',
        };
        const paramsCard = {
            publicKey,
            amount: sum,
            comment:chatId,
            paySource:'card'
        };
        const link = qiwiApi.createPaymentForm(params);
        const linkCard = qiwiApi.createPaymentForm(paramsCard);
        
        bot.sendMessage(msg.chat.id,`Вы пополняете счет на сумму ${sum} руб.\n\nВыберите способ оплаты:`,{
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
    async function popoln(cl){
        
        const gsapi = google.sheets({version:'v4',auth: cl})

        const all = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:'A1:A'
        }
        let data = await gsapi.spreadsheets.values.get(all)
        let allID = data.data.values.flat().map(Number)
        numberIndex = allID.indexOf(chatId)
        
        bot.onText(/\d{1}/, msg=>{

            const updateBalance = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:`F${numberIndex+1}`,
                valueInputOption:'USER_ENTERED',
                resource: {values: [[msg.text]]}
            }
            gsapi.spreadsheets.values.update(updateBalance)
            mesg(msg.text)
            
            
        })   
    } 
    
break
 
case kb.home.instruction:
           
            bot.sendMessage(chatId, `
            Инструкция:
            `,{
                reply_markup:{ resize_keyboard: true,keyboard:keyboard.back}
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
            Доступные тарифы:\n📈 День: 100 руб\n📉 3 дня: 250 руб\n📈 Неделя: 500 руб\n📉 Месяц: 1500 руб \n\n\n📆 Выберите время аренды
            `,{
                reply_markup:{ resize_keyboard: true,keyboard:keyboard.tarif}
            })
break
case kb.profile.tarif:
            bot.sendMessage(chatId, `
                Доступные тарифы:\n📈 День: 100 руб\n📉 3 дня: 250 руб\n📈 Неделя: 500 руб\n📉 Месяц: 1500 руб \n\n\n📆 Выберите время аренды
                `,{
                    reply_markup:{ resize_keyboard: true,keyboard:keyboard.tarif}
            })
break
        break 
break
        break 
break
case kb.home.tarif: 
        case kb.home.tarif: 
case kb.home.tarif: 
        case kb.home.tarif: 
case kb.home.tarif: 
    
        bot.sendMessage(chatId, `
        Доступные тарифы:\n📈 День: 100 руб\n📉 3 дня: 250 руб\n📈 Неделя: 500 руб\n📉 Месяц: 1500 руб \n\n\n📆 Выберите время аренды
        `,{
            reply_markup:{ resize_keyboard: true,keyboard:keyboard.tarif}
       
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
        break 
break
        break 
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
    oplata = 0
    client.authorize(function(err,tokens){
        if(err){
            console.log(err)
            return
        } else {
            console.log('connecned')
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

      
        if(probaID[numberIndex]==='yes'){
            bot.sendMessage(chatId, `👉 Выберите, что хотите сделать:`,{
                reply_markup:{ resize_keyboard: true,keyboard:keyboard.home}
            })}
            else{
                bot.sendMessage(chatId, `👉 Выберите, что хотите сделать:`,{
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
                    console.log('connecned')
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
                [msg.chat.id,0,'no','no','Нету',0],
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


