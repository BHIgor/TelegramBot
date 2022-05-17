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

app.listen(process.env.PORT)

const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
)

helper.logStart()

const TOKEN = "5205903461:AAEahGqovkU3L53jAl5OA7Z4kEw_P5kRJvs"
const bot = new TelegramBot(TOKEN, {polling:true})
let test = 2
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
     
        const publicKey = '48e7qUxn9T7RyYE1MVZswX1FRSbE6iyCj2gCRwwF3Dnh5XrasNTx3BGPiMsyXQFNKQhvukniQG8RTVhYm3iPyVXeQ7k1CmVN3LeuRPFHNEVECeqUZRYkspJKKndxy37sZGuDxYiozW4B7MZa1ca5EnJkFpsRUEfLqxScwGE2XphFFkAZm7mXmAgsjdXvP'
    
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
        numberIndex = allID.indexOf(chatId)
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
        
          
        const updateCountAvto = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:`G${numberIndex+1}`,
            valueInputOption:'USER_ENTERED',
            resource: {values: [['Число автопросмотров']]}
        }
        const updatePodps = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:`G${numberIndex+1}`,
            valueInputOption:'USER_ENTERED',
            resource: {values: [['Число подписчиков']]}
        }
        const updatePodpsmed = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:`G${numberIndex+1}`,
            valueInputOption:'USER_ENTERED',
            resource: {values: [['Число подписчиков медленно']]}
        }
        const updatePodpsDef = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:`G${numberIndex+1}`,
            valueInputOption:'USER_ENTERED',
            resource: {values: [['Подписчики']]}
        }
        
        const updateNakr = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:`G${numberIndex+1}`,
            valueInputOption:'USER_ENTERED',
            resource: {values: [['Накрутка']]}
        }
        const updateNakrTime = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:`G${numberIndex+1}`,
            valueInputOption:'USER_ENTERED',
            resource: {values: [['Время накрутки']]}
        }
        const updateNakrAvto = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:`G${numberIndex+1}`,
            valueInputOption:'USER_ENTERED',
            resource: {values: [['Дней накрутки']]}
        }
        const updateStatusAvto = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:`G${numberIndex+1}`,
            valueInputOption:'USER_ENTERED',
            resource: {values: [['Автопросмотры']]}
        }
        const sendTexts = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:`G${numberIndex+1}`,
            valueInputOption:'USER_ENTERED',
            resource: {values: [['Напиши текст']]}
        }
        const updateGlavnya = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:`G${numberIndex+1}`,
            valueInputOption:'USER_ENTERED',
            resource: {values: [['Главная']]}
        }
      
        const allNumberPost = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:'L1:L'
        }
        let dataPost = await gsapi.spreadsheets.values.get(allNumberPost)
        let allNumberPostID = dataPost.data.values.flat()
      
        let postIndex = allNumberPostID.length

        const allNumberPostAvto = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:'S1:S'
        }
        let dataPostAvto = await gsapi.spreadsheets.values.get(allNumberPostAvto)
        let allNumberPostIDAvto = dataPostAvto.data.values.flat()
      
        let postIndexAvto = allNumberPostIDAvto.length
     
        const updateNumber = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:`M${postIndex}`,
            valueInputOption:'USER_ENTERED',
            resource: {values: [[msg.text]]}
        }
        const updateNumberAvto = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:`R${postIndexAvto+1}`,
            valueInputOption:'USER_ENTERED',
            resource: {values: [[msg.text]]}
        }
        let tarifTime = new Date().getTime()+(msg.text*97200)*1000
        let tarifDay = `${new Date(tarifTime).getDate()}`+'.'+`${new Date(tarifTime).getMonth()+1}`+'.'+`${new Date(tarifTime).getFullYear()}`+` `+`${new Date(tarifTime). getHours()}`+`:`+`${new Date(tarifTime).getMinutes()}`+`:`+`${new Date(tarifTime).getSeconds()}`
        const   updateNumberDayAvto = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:`S${postIndexAvto+1}`,
            valueInputOption:'USER_ENTERED',
            resource: {values: [[tarifDay]]}
        }
      
        
     
        if(idStatus[numberIndex]==='Оплата'&& Number(msg.text)){
            gsapi.spreadsheets.values.update(updateBalance)
                  //--
                  const saveIds = {
                    spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                    range:'V1:V'
                }
                let dataIds = await gsapi.spreadsheets.values.get(saveIds)
                let idTarifs = Number(dataIds.data.values[0].flat())
                const sendTextss = {
                    spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                    range:`V1`,
                    valueInputOption:'USER_ENTERED',
                    resource: {values: [[Number(idTarifs)+1]]}
                }
                gsapi.spreadsheets.values.update(sendTextss)
                //--
            bot.sendMessage('@newstlgr',`💰 Пополнения счета id${msg.chat.id} на ${msg.text}`)
            bot.sendMessage(chatId,`Вы пополняете счет на сумму ${Number(msg.text)} руб.\n\nВыберите способ оплаты:\n\n💬<i>Если не приходит код подтверждения обратитесь в службу поддержки @Zheka920</i>`,{
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
                },
                parse_mode:'HTML'
            })
        } 

        let postTime = new Date().getTime()
        
        let normalTime= `${new Date(postTime).getDate()}`+'.'+`${new Date(postTime).getMonth()+1}`+'.'+`${new Date(postTime).getFullYear()}`+` `+`${new Date(postTime). getHours()}`+`:`+`${new Date(postTime).getMinutes()}`+`:`+`${new Date(postTime).getSeconds()}`
  
        if(msg.forward_from_chat && idStatus[numberIndex]==='Накрутка' && msg.media_group_id === undefined){
            let idChannel = String(msg.forward_from_chat.id).substring(4)
          
            const appendOptions = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'I1',
                valueInputOption:'USER_ENTERED',
                includeValuesInResponse: true,
                resource: {values: [
                    [msg.forward_from_chat.title,msg.chat.id,idChannel, msg.forward_from_message_id,0,normalTime],
                ]}
            }
//---
            const saveIds = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'V1:V'
            }
            let dataIds = await gsapi.spreadsheets.values.get(saveIds)
            let idTarifs = Number(dataIds.data.values[0].flat())
            const sendTextss = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:`V1`,
                valueInputOption:'USER_ENTERED',
                resource: {values: [[Number(idTarifs)+1]]}
            }
            await gsapi.spreadsheets.values.update(sendTextss)

//-----     
        
            await bot.forwardMessage('@newstlgr',chatId, msg.message_id).then(function(){}) 

            const saveIdss = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'V1:V'
            }
            let dataIdss = await gsapi.spreadsheets.values.get(saveIdss)
            let idTarifss = Number(dataIdss.data.values[0].flat())
            await bot.sendMessage('@newstlgr', `👀 Просмотры`)
            await bot.sendMessage('@newstlgr', `https://t.me/newstlgr/${idTarifss}`)

            const sendTextsss = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:`V1`,
                valueInputOption:'USER_ENTERED',
                resource: {values: [[Number(idTarifss)+2]]}
            }
            await gsapi.spreadsheets.values.update(sendTextsss)

            gsapi.spreadsheets.values.append(appendOptions)
            gsapi.spreadsheets.values.update(updateCount)

            bot.sendMessage(chatId,`👁‍🗨 Введи нужное количество просмотров\n\n💯 Максимальное количество просмотров на один пост <b>10 000</b>\n\n💬 <i>Пример: на посте 1000 просмотров, но ты хочешь сделать чтобы было 3000. Тогда тебе нужно ввести 2000.</i>`,{parse_mode: 'HTML' })
        
        } else 
        if(msg.forward_from_chat && idStatus[numberIndex]==='Накрутка' && msg.media_group_id !== undefined){
            bot.sendMessage(chatId,`⚠️ Если в посте несколько медиафайлов (картинок или видео), в бота надо отправлять первую из них (правой кнопкой или длинный тап по последнему файлу и выбрать переслать)`,{parse_mode: 'HTML' })
        }

        if(idStatus[numberIndex]==='Число накрутки'&& Number(msg.text)<=10000){
//---
            const saveIds = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'V1:V'
            }
            let dataIds = await gsapi.spreadsheets.values.get(saveIds)
            let idTarifs = Number(dataIds.data.values[0].flat())
            const sendTextss = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:`V1`,
                valueInputOption:'USER_ENTERED',
                resource: {values: [[Number(idTarifs)+1]]}
            }
            await gsapi.spreadsheets.values.update(sendTextss)
//--

            gsapi.spreadsheets.values.update(updateNumber)
            gsapi.spreadsheets.values.update(updateNakrTime)
            await bot.sendMessage(chatId,`⏱ На сколько часов растянуть просмотры на 1 пост?\n\n👉 Укажите количество часов или 0, если хотите максимальную скорость:`)
            await bot.sendMessage('@newstlgr', `${msg.text}`)
        }
        if(idStatus[numberIndex]==='Число накрутки'&& Number(msg.text)>10000){
            bot.sendMessage(chatId,`⚠️ Максимальное количество 10 000`)
        }
        if(idStatus[numberIndex]==='Время накрутки'&& (Number(msg.text)||msg.text==='0')){
//---
            const saveIds = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'V1:V'
            }
            let dataIds = await gsapi.spreadsheets.values.get(saveIds)
            let idTarifs = Number(dataIds.data.values[0].flat())
            const sendTextss = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:`V1`,
                valueInputOption:'USER_ENTERED',
                resource: {values: [[Number(idTarifs)+1]]}
            }
            await gsapi.spreadsheets.values.update(sendTextss)
//--

            gsapi.spreadsheets.values.update(updateNakr)
            await bot.sendMessage(chatId,`✅ Просмотры подключены`)
            await bot.sendMessage('@newstlgr', `${msg.text}`)
        }

        if(idStatus[numberIndex]==='Подписчики'&& (msg.text.includes('https')||msg.text.includes('t.me')||msg.text.includes('http')||msg.text.includes('@'))){
            const allBalance = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'B1:B'
            }
            let dataBalance = await gsapi.spreadsheets.values.get(allBalance)
            let idBlnc = dataBalance.data.values.flat().map(Number)

            const appendOptions = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'I1',
                valueInputOption:'USER_ENTERED',
                includeValuesInResponse: true,
                resource: {values: [
                    ['Подписчики',msg.chat.id,msg.text, '-',0,normalTime],
                ]}
            }
            //---
            const saveIds = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'V1:V'
            }
            let dataIds = await gsapi.spreadsheets.values.get(saveIds)
            let idTarifs = Number(dataIds.data.values[0].flat())
            const sendTextss = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:`V1`,
                valueInputOption:'USER_ENTERED',
                resource: {values: [[Number(idTarifs)+1]]}
            }
            gsapi.spreadsheets.values.update(sendTextss)
//--
            bot.sendMessage('@newstlgr', `Подписчики сюда БЫСТРЫЕ ${msg.text}`)
           
            gsapi.spreadsheets.values.append(appendOptions)
            gsapi.spreadsheets.values.update(updatePodps)

            bot.sendMessage(chatId,`👥 Введи нужное количество подписчиков:\n\n Баланс позволяет накрутить <b>${Math.floor(idBlnc[numberIndex]/0.5)} подписчиков</b>`,{parse_mode: 'HTML' })
            
        }
        const allBalance = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:'B1:B'
        }
        let dataBalance = await gsapi.spreadsheets.values.get(allBalance)
        let idBlnc = dataBalance.data.values.flat().map(Number)
      
        if(idStatus[numberIndex]==='Число подписчиков'&& Number(msg.text)){
            
            if(idBlnc[numberIndex] >= Number(msg.text)*0.5){
            const updateBalance = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:`B${numberIndex+1}`,
                valueInputOption:'USER_ENTERED',
                resource: {values: [[Math.floor(idBlnc[numberIndex]-Number(msg.text)*0.5)]]}
            }
            //--
              const saveIds = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'V1:V'
            }
            let dataIds = await gsapi.spreadsheets.values.get(saveIds)
            let idTarifs = Number(dataIds.data.values[0].flat())
            const sendTextss = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:`V1`,
                valueInputOption:'USER_ENTERED',
                resource: {values: [[Number(idTarifs)+1]]}
            }
            gsapi.spreadsheets.values.update(sendTextss)
            //--
            gsapi.spreadsheets.values.update(updateNumber)
            gsapi.spreadsheets.values.update(updatePodpsDef)
            gsapi.spreadsheets.values.update(updateBalance)
            bot.sendMessage(chatId,`✅ Подписчики подключены`)
            bot.sendMessage('@newstlgr', `Количество подписчиков БЫСТРЫЕ: ${msg.text}`)
          } else if(idBlnc[numberIndex] < Number(msg.text)*0.5){
            bot.sendMessage(chatId,`❌ Недостаточно денег на балансе`)
          }
        }
        
        if(idStatus[numberIndex]==='Подписчики медленные'&& (msg.text.includes('https')||msg.text.includes('t.me')||msg.text.includes('http')||msg.text.includes('@'))){
            const allBalance = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'B1:B'
            }
            let dataBalance = await gsapi.spreadsheets.values.get(allBalance)
            let idBlnc = dataBalance.data.values.flat().map(Number)

            const appendOptions = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'I1',
                valueInputOption:'USER_ENTERED',
                includeValuesInResponse: true,
                resource: {values: [
                    ['Подписчики',msg.chat.id,msg.text, '-',0,normalTime],
                ]}
            }
             //--
             const saveIds = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'V1:V'
            }
            let dataIds = await gsapi.spreadsheets.values.get(saveIds)
            let idTarifs = Number(dataIds.data.values[0].flat())
            const sendTextss = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:`V1`,
                valueInputOption:'USER_ENTERED',
                resource: {values: [[Number(idTarifs)+1]]}
            }
            gsapi.spreadsheets.values.update(sendTextss)
            //--
            bot.sendMessage('@newstlgr', `Подписчики сюда МЕДЛЕННО ${msg.text}`)
           
            gsapi.spreadsheets.values.append(appendOptions)
            gsapi.spreadsheets.values.update(updatePodpsmed)

            bot.sendMessage(chatId,`👥 Введи нужное количество подписчиков:\n\n Баланс позволяет накрутить <b>${Math.floor(idBlnc[numberIndex]/0.05)} подписчиков</b>`,{parse_mode: 'HTML' })
            
        }
        if(idStatus[numberIndex]==='Число подписчиков медленно'&& Number(msg.text)){
            
            if(idBlnc[numberIndex] >= Number(msg.text)*0.05){
            const updateBalance = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:`B${numberIndex+1}`,
                valueInputOption:'USER_ENTERED',
                resource: {values: [[Math.floor(idBlnc[numberIndex]-Number(msg.text)*0.05)]]}
            }
             //--
             const saveIds = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'V1:V'
            }
            let dataIds = await gsapi.spreadsheets.values.get(saveIds)
            let idTarifs = Number(dataIds.data.values[0].flat())
            const sendTextss = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:`V1`,
                valueInputOption:'USER_ENTERED',
                resource: {values: [[Number(idTarifs)+1]]}
            }
            gsapi.spreadsheets.values.update(sendTextss)
            //--
            gsapi.spreadsheets.values.update(updateNumber)
            gsapi.spreadsheets.values.update(updatePodpsDef)
            gsapi.spreadsheets.values.update(updateBalance)
            bot.sendMessage(chatId,`✅ Подписчики подключены`)
            bot.sendMessage('@newstlgr', `Количество подписчиков МЕДЛЕННО: ${msg.text}`)
          } else if(idBlnc[numberIndex] < Number(msg.text)*0.05){
            bot.sendMessage(chatId,`❌ Недостаточно денег на балансе`)
          }
        }
    
        if(idStatus[numberIndex]==='Автопросмотры'&& (msg.text.includes('https')||msg.text.includes('t.me')||msg.text.includes('http')||msg.text.includes('@'))){
            
            const appendOptions = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'P1',
                valueInputOption:'USER_ENTERED',
                includeValuesInResponse: true,
                resource: {values: [
                    [msg.chat.id,(msg.text.includes('@')?`http://t.me/${msg.text}`:msg.text.includes('http')?`${msg.text}`:msg.text.includes('https')?`${msg.text}`:msg.text.includes('t.me')?`${msg.text}`:`${msg.text}`)],
                ]}
            }
            
              //--
              const saveIds = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'V1:V'
            }
            let dataIds = await gsapi.spreadsheets.values.get(saveIds)
            let idTarifs = Number(dataIds.data.values[0].flat())
            const sendTextss = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:`V1`,
                valueInputOption:'USER_ENTERED',
                resource: {values: [[Number(idTarifs)+1]]}
            }
            gsapi.spreadsheets.values.update(sendTextss)
            //--

            bot.sendMessage('@newstlgr', `👁‍🗨 АВТОПРОСМОТРЫ 👁‍🗨 ${msg.text}`)
            gsapi.spreadsheets.values.append(appendOptions)
            gsapi.spreadsheets.values.update(updateCountAvto)

            bot.sendMessage(chatId,`👁‍🗨 Введите нужное количество просмотров на один пост:`,{parse_mode: 'HTML' })
        }
       
    
        if(idStatus[numberIndex]==='Число автопросмотров'&& Number(msg.text)){
            const allBalance = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'B1:B'
            }
            let dataBalance = await gsapi.spreadsheets.values.get(allBalance)
            let idBlnc = dataBalance.data.values.flat().map(Number)
         
            gsapi.spreadsheets.values.update(updateNumberAvto)
            gsapi.spreadsheets.values.update(updateNakrAvto)
            bot.sendMessage(chatId,`⏳ Введите количество дней:\n\n Баланс позволяет продлить на <b>${Math.floor(idBlnc[numberIndex]/20)} дней</b>`,{
               parse_mode: 'HTML'
            })
              //--
              const saveIds = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'V1:V'
            }
            let dataIds = await gsapi.spreadsheets.values.get(saveIds)
            let idTarifs = Number(dataIds.data.values[0].flat())
            const sendTextss = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:`V1`,
                valueInputOption:'USER_ENTERED',
                resource: {values: [[Number(idTarifs)+1]]}
            }
            gsapi.spreadsheets.values.update(sendTextss)
            //--
            bot.sendMessage('@newstlgr', `Количество просмотров на пост: ${msg.text}`)
        }
 
        if(idStatus[numberIndex]==='Дней накрутки'&& Number(msg.text)){
            const allTarifs = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'E1:E'
            }
            let dataTarifs = await gsapi.spreadsheets.values.get(allTarifs)
            let idTarifs = dataTarifs.data.values
           
            if(idBlnc[numberIndex] >= Number(msg.text)*20 && idTarifs[numberIndex][0]!='Нету'){
            const updateBalance = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:`B${numberIndex+1}`,
                valueInputOption:'USER_ENTERED',
                resource: {values: [[idBlnc[numberIndex]-Number(msg.text)*20]]}
            }
              //--
              const saveIds = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'V1:V'
            }
            let dataIds = await gsapi.spreadsheets.values.get(saveIds)
            let idTarifs = Number(dataIds.data.values[0].flat())
            const sendTextss = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:`V1`,
                valueInputOption:'USER_ENTERED',
                resource: {values: [[Number(idTarifs)+1]]}
            }
            gsapi.spreadsheets.values.update(sendTextss)
            //--
            gsapi.spreadsheets.values.update(updateNumberDayAvto)
            gsapi.spreadsheets.values.update(updateStatusAvto)
            gsapi.spreadsheets.values.update(updateBalance)
            bot.sendMessage(chatId,`✅ Автопросмотры подключены`)
            bot.sendMessage('@newstlgr', `Количество дней: ${msg.text}`)
          } else if(idBlnc[numberIndex] < Number(msg.text)*20){
            bot.sendMessage(chatId,`❌ Недостаточно денег на балансе`)
          }else if(idTarifs[numberIndex][0]=== 'Нету'){
            bot.sendMessage(chatId,`💳 Для подключения автопросмотров <b>нужно приобрести тарифный план. </b>`,{parse_mode:'HTML'})
          }
        }
        if(idStatus[numberIndex]==='Продлевание'&& Number(msg.text)){
             
            if(idBlnc[numberIndex] >= Number(msg.text)*20){
                const updateBalance = {
                    spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                    range:`B${numberIndex+1}`,
                    valueInputOption:'USER_ENTERED',
                    resource: {values: [[idBlnc[numberIndex]-Number(msg.text)*20]]}
                }
             //--
             const saveIds = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'V1:V'
            }
            let dataIds = await gsapi.spreadsheets.values.get(saveIds)
            let idTarifs = Number(dataIds.data.values[0].flat())
            const sendTextss = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:`V1`,
                valueInputOption:'USER_ENTERED',
                resource: {values: [[Number(idTarifs)+1]]}
            }
            gsapi.spreadsheets.values.update(sendTextss)
            //--
            gsapi.spreadsheets.values.update(updateBalance)
            gsapi.spreadsheets.values.update(updateStatusAvto)
            bot.sendMessage('@newstlgr', `Количество дней: ${msg.text}`)
            bot.sendMessage(chatId,`✅ Автопросмотры продлены `)
        }else if(idBlnc[numberIndex] < Number(msg.text)*20){
            bot.sendMessage(chatId,`❌ Недостаточно денег на балансе`)
          }
        }

        if(idStatus[numberIndex]==='Количество автопросмотров'&& Number(msg.text)){
               //--
               const saveIds = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'V1:V'
            }
            let dataIds = await gsapi.spreadsheets.values.get(saveIds)
            let idTarifs = Number(dataIds.data.values[0].flat())
            const sendTextss = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:`V1`,
                valueInputOption:'USER_ENTERED',
                resource: {values: [[Number(idTarifs)+1]]}
            }
            gsapi.spreadsheets.values.update(sendTextss)
            //--
            gsapi.spreadsheets.values.update(updateStatusAvto)
            bot.sendMessage('@newstlgr', `Количество просмотров: ${msg.text}`)
            bot.sendMessage(chatId,`✅ Количество изменено `)
        }
        
        if(idStatus[numberIndex]==='Количество Qiwi'&& Number(msg.text)){
          
            if(idBlnc[numberIndex] >= Number(msg.text)*100){
                const updateBalance = {
                    spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                    range:`B${numberIndex+1}`,
                    valueInputOption:'USER_ENTERED',
                    resource: {values: [[idBlnc[numberIndex]-Number(msg.text)*100]]}
                }
            gsapi.spreadsheets.values.update(updateBalance)
            gsapi.spreadsheets.values.update(updateGlavnya)
                  //--
                  const saveIds = {
                    spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                    range:'V1:V'
                }
                let dataIds = await gsapi.spreadsheets.values.get(saveIds)
                let idTarifs = Number(dataIds.data.values[0].flat())
                const sendTextss = {
                    spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                    range:`V1`,
                    valueInputOption:'USER_ENTERED',
                    resource: {values: [[Number(idTarifs)+1]]}
                }
                gsapi.spreadsheets.values.update(sendTextss)
                //--
            bot.sendMessage('@newstlgr', `🥝QIWI🥝\n${chatId} \nКоличество QIWI: ${msg.text}`,{parse_mode:'HTML'})
            bot.sendMessage(chatId,`⏳<b>Ваша покупка обрабатывается</b>⏳\n\nЭто может занять до 10 минут.\n<b>Qiwi кошелек</b> будет отправлен в этот чат.\n\n<i>Если возникли трудности обратитесь в поддержку: @Zheka920 </i>`,{parse_mode:'HTML'})
        }else if(idBlnc[numberIndex] < Number(msg.text)*100){
            bot.sendMessage(chatId,`❌ Недостаточно денег на балансе`)
          }
        }
        
        if(idStatus[numberIndex]==='Отправка заказа'&& Number(msg.text)){
          
            const sendText = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:`U1`,
                valueInputOption:'USER_ENTERED',
                resource: {values: [[Number(msg.text)]]}
            }
            gsapi.spreadsheets.values.update(sendText)
            gsapi.spreadsheets.values.update(sendTexts)
            bot.sendMessage(chatId,`Id записан`)
        }
        if(idStatus[numberIndex]==='Напиши текст'&& msg.text){
            const saveId = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'U1:U'
            }
            let dataIds = await gsapi.spreadsheets.values.get(saveId)
            let idTarifs = Number(dataIds.data.values[0].flat())
            bot.sendMessage(idTarifs,`${msg.text}`)
            bot.sendMessage(chatId,`✉️Письмо отправлено✉️`)
            gsapi.spreadsheets.values.update(updateGlavnya)
        }
   

   }
  

    switch (msg.text){
        
case 'Киви заказ':
    client.authorize(function(err,tokens){
        if(err){
            console.log(err)
            return
        } else {
        
            qiwas(client)
        
        }
    })
    async function qiwas(cl){
        const gsapi = google.sheets({version:'v4',auth: cl})

        const all = {
        spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
        range:'A1:A'
        }
        let data = await gsapi.spreadsheets.values.get(all)
        let allID = data.data.values.flat().map(Number)
        numberIndex = allID.indexOf(chatId)
        const updateStp = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:`G${numberIndex+1}`,
            valueInputOption:'USER_ENTERED',
            resource: {values: [['Отправка заказа']]}
        }
        gsapi.spreadsheets.values.update(updateStp)
    }
break
case 'Админ подпишись на новости':
    client.authorize(function(err,tokens){
        if(err){
            console.log(err)
            return
        } else {
        
            admin(client)
        
        }
    })
    async function admin(cl){
        const gsapi = google.sheets({version:'v4',auth: cl})

        const all = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:'A2:A'
        }
        let data = await gsapi.spreadsheets.values.get(all)
        let allID = data.data.values.flat().map(Number)
  
    
        allID.forEach(e =>  bot.sendMessage(e,`❗️ <b>Увеличили максимальное количество просмотров</b>❗️\n\n Теперь доступно 10 000 просмотров на один пост\n\nБолее подробно тут @glazaVtelege \n\nНачинайте тестировать💪 `,{parse_mode: 'HTML'}))
       
    }
    break

case kb.home.podpschik:     
    bot.sendMessage(chatId,`<b>👇 Выберите тип подписчиков 👇</b>`,{
        reply_markup:{ resize_keyboard: true,keyboard:keyboard.podpisota},parse_mode: 'HTML'
    })
break
case kb.blockhome.podpschik: 
    bot.sendMessage(chatId,`<b>👇 Выберите тип подписчиков 👇</b>`,{
        reply_markup:{ resize_keyboard: true,keyboard:keyboard.podpisota},parse_mode: 'HTML'
    })      
break
case kb.podpischik.qweek:
            client.authorize(function(err,tokens){
                if(err){
                    console.log(err)
                    return
                } else {
                
                    podpschik(client)
                }
            })
            async function podpschik(cl){
                const gsapi = google.sheets({version:'v4',auth: cl})

                const all = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'A1:A'
            }
            let data = await gsapi.spreadsheets.values.get(all)
            let allID = data.data.values.flat().map(Number)
            numberIndex = allID.indexOf(chatId)
            const updateStp = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:`G${numberIndex+1}`,
                valueInputOption:'USER_ENTERED',
                resource: {values: [['Подписчики']]}
            }
            gsapi.spreadsheets.values.update(updateStp)

        }
        bot.sendMessage(chatId,`<b>🏃‍♂️ Быстрые подписчики 🏃‍♂️</b>\n\n🔹 Цена: 0.5 ₽ / 1 подписчика\n🔹 Можно на открытые и закрытые каналы, чаты и боты\n🔹 Без отписок\n🔹 Моментальный старт\n\n👇 Введите ссылку на закрытый или открытый канал, чат:`,{
            reply_markup:{ resize_keyboard: true,keyboard:keyboard.back},parse_mode: 'HTML'
        })
break
case kb.podpischik.slow:
        client.authorize(function(err,tokens){
            if(err){
                console.log(err)
                return
            } else {
            
                podpschikslow(client)
            }
        })
        async function podpschikslow(cl){
            const gsapi = google.sheets({version:'v4',auth: cl})

            const all = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:'A1:A'
        }
        let data = await gsapi.spreadsheets.values.get(all)
        let allID = data.data.values.flat().map(Number)
        numberIndex = allID.indexOf(chatId)
        const updateStp = {
            spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
            range:`G${numberIndex+1}`,
            valueInputOption:'USER_ENTERED',
            resource: {values: [['Подписчики медленные']]}
        }
        gsapi.spreadsheets.values.update(updateStp)

        }
        bot.sendMessage(chatId,`<b>🐌 Медленные подписчики 🐌</b>\n\n🔹 Цена: 0.05 ₽ / 1 подписчика\n🔹 Только открытые каналы\n🔹 Возможны отписки\n🔹 Старт в течении часа\n\n👇 Введите ссылку на ОТКРЫТЫЙ канал:`,{
        reply_markup:{ resize_keyboard: true,keyboard:keyboard.back},parse_mode: 'HTML'
        })
break
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

            const allStatusTarif = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'D1:D'
            }
            let dataStatusTarif  = await gsapi.spreadsheets.values.get(allStatusTarif)
            let allStatus = dataStatusTarif.data.values.flat()

            numberIndex = allID.indexOf(chatId)
  
            if(allStatus[numberIndex] ==='yes'){
                const updateNakrz = {
                    spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                    range:`G${numberIndex+1}`,
                    valueInputOption:'USER_ENTERED',
                    resource: {values: [['Накрутка']]}
                }
                gsapi.spreadsheets.values.update(updateNakrz)
                bot.sendMessage(chatId, `Перешлите пост на который нужно накрутить`,{
                    reply_markup:{ resize_keyboard: true,keyboard:keyboard.back}
                })
            }
            
        }
        break 
case kb.home.avto: 
        client.authorize(function(err,tokens){
            if(err){
                console.log(err)
                return
            } else {
            
                statusAvto(client)
            }
        })
        async function statusAvto(cl){
            const gsapi = google.sheets({version:'v4',auth: cl})

            const all = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'P2:S'
            }
            let data = await gsapi.spreadsheets.values.get(all)
            let  allID = data.data.values
         
            numberIndex = allID.indexOf(chatId)

            const allavto = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'A1:A'
            }
            let dataallavto = await gsapi.spreadsheets.values.get(allavto)
            let allIDallavto = dataallavto.data.values.flat().map(Number)
            numberIndexavto = allIDallavto.indexOf(chatId)
            const updateStatusAvto = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:`G${numberIndexavto+1}`,
                valueInputOption:'USER_ENTERED',
                resource: {values: [['Автопросмотры']]}
            }
            
          

            bot.sendMessage(chatId, `<b>ℹ️ Автопросмотры - дополнительная платная опция</b>,которая подхватывает новые посты в канале автоматически. \n\nℹ️ Функция работает <b>только с активным тарифным планом</b> и оплачивается отдельно 20 ₽/день за каждый канал (кнопка «Продлить»)\n\n ℹ️ На каналах с автопросмотрами накрутка на новые посты начинается автоматически в <b>течение 3 мин после публикации,</b> на старые посты делайте вручную репостом\n\n ℹ️ Вы выставляете желаемое количество просмотров, но цифры на разных постах будут различаться для реалистичности.\n\n ℹ️ Максимальное количество просмотров на каждый пост определяется купленным тарифом. Количество просмотров выбираете сами.\n\n❇️ <b>Для того чтобы подключить</b> нужно прислать ссылку на канал, затем ввести количество нужных просмотров и количество дней на сколько будут подключены просмотры`,{
                reply_markup:{ resize_keyboard: true,keyboard:keyboard.back},parse_mode:'HTML'
            }).then(function(){ if(allID !== undefined){
                let  key = ['id','channel','count','time']
                let objKeruvannya = allID.map(row =>
                    row.reduce((acc, cur, i) =>
                      (acc[key[i]] = cur, acc), {}))
                 
                objKeruvannya.map(e => {
                    if(Number(e.id) === chatId){
                        bot.sendMessage(chatId,` 💬 <a href='${e.channel}'>${e.channel}</a> • 👁‍🗨 ${e.count} • до ${e.time}`,{
                            reply_markup:{ resize_keyboard: true,  inline_keyboard:  [
                                [
                                    {
                                        text:'📆 Продлить',
                                        callback_data:`prodlit`
                                    }
                                ],
                                [    {
                                        text:'✏️ Изменить',
                                        callback_data:`change`
                                    },
                                    {
                                        text:'❌ Отключить',
                                        callback_data:`cancel`
                                    }
                                ]
                                ]},
                            parse_mode:'HTML'
                        })
                        }
                    })    
                  
                }}).then( bot.sendMessage(chatId, `👉 Чтобы подключить автопросмотры к новому каналу введите ссылку на канал:`,{
                reply_markup:{ resize_keyboard: true,keyboard:keyboard.back},parse_mode:'HTML'
            }))

            
          
            gsapi.spreadsheets.values.update(updateStatusAvto)
        }
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
            numberIndex = allID.indexOf(chatId) 
           if(allID !== undefined){
            let  key = ['name','id','idChannel','post', 'count','time']
            let objKeruvannya = allID.map(row =>
                row.reduce((acc, cur, i) =>
                  (acc[key[i]] = cur, acc), {}))
               
            objKeruvannya.map(e => {
                if(Number(e.id) === chatId){
                    bot.sendMessage(chatId,`<b>Заказ добавлен</b> ${e.time}\n${(e.name==='Подписчики')?`<a href='${e.idChannel}'>${e.name}</a>`:`<a href='https://t.me/c/${e.idChannel}/${e.post}'>${e.name}</a>`}\n<b>Заказано:</b> ${e.count} ${(e.name==='Подписчики')?'Подписчиков':'Просмотров'}`,{
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
              
            }
           
        }
        bot.sendMessage(chatId, `
            Посты которые накручиваются: 
        `,{
            reply_markup:{ resize_keyboard: true,keyboard:keyboard.back}
        })

        break 

case kb.home.qiwiKosh: 
        
             
            bot.sendMessage(chatId, `
        <b>Вы можете купить 🥝 Qiwi кошелек.</b>\n\nQIWI (RU) статус <b>ОСНОВНОЙ</b>. с QVC+МИР\nЦена товара: 100.00 рублей за шт.\nВ наличии: 25шт.\n\n🥝 Qiwi кошелек - стандарт с QIWI VISA CARD.\nУпрощенная идентификация по паспорту.\nМожно принимать и переводить деньги.\n<b>Смс подтверждения транзакций ОТКЛЮЧЕНЫ.</b>\n\nАккаунты только для браузера!\nПароль на них сменить нельзя.\n\nЛимит остатка на балансе 60 000р.\nЛимит платежей в месяц 200 000р.\n\n🥝 Qiwi кошельки продаются <b>только в одни руки.</b>\n\n🔝 <b>Гарантия безопасности 100%</b>.\n
        `,{
            reply_markup:{ resize_keyboard: true,keyboard:keyboard.qiwiKosh},
            parse_mode:'HTML'
        })
break 
case kb.home.qiwibuy: 
        client.authorize(function(err,tokens){
            if(err){
                console.log(err)
                return
            } else {
            
                qiwibuy(client)
            
            }
        })
        async function qiwibuy(cl){
             
            const gsapi = google.sheets({version:'v4',auth: cl})
        
            const all = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'A1:A'
            }
            let data = await gsapi.spreadsheets.values.get(all)
            let allID = data.data.values.flat().map(Number)
            numberIndex = allID.indexOf(chatId)
            const allBalance = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'B1:B'
            }
            let dataBalance = await gsapi.spreadsheets.values.get(allBalance)
            let idBlnc = dataBalance.data.values.flat().map(Number)
            const updateQiwi = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:`G${numberIndex+1}`,
                valueInputOption:'USER_ENTERED',
                resource: {values: [['Количество Qiwi']]}
            }
               
            gsapi.spreadsheets.values.update(updateQiwi)
            
            bot.sendMessage(chatId, `Ваш баланс позволяет приобрести <b>${Math.floor(idBlnc[numberIndex]/100)} шт.</b>\n\nВведите нужное количество:`,{
            reply_markup:{ resize_keyboard: true,keyboard:keyboard.back},
            parse_mode:'HTML'
            })
        }
    
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
                numberIndex = allID.indexOf(chatId)
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
           
            bot.sendMessage(chatId, `<b>Что делает бот</b>❓\n▶️ Бот накручивает просмотры на закрытые/открытые каналы.\n\n<b>Как пользоваться ботом</b>❓\n▶️ Для накрутки просмотров нужно перейти в раздел <b>"👀 Накрутка просмотров"</b> --> переслать в бота пост на который нужно накрутить просмотры --> ввести нужное количество просмотров.\n\n<b>Как считаются просмотры</b>❓\n▶️ Введенное вами количество просмотров суммируется к общему числу (пример: на посте 2000 просмотров, вы хотите 5000 просмотров,тогда нужно ввести 3000)\n\n<b>Как купить тариф</b>❓\n▶️ Для того чтобы купить тариф сначала нужно пополнить счета одним из доступных способов, в разделе <b>"👤 Профиль"</b>, затем перейти на вкладку <b>"👁️ Тарифы"</b> выбрать нужный тариф и оплатить.\n\n<b>Я оплатил, а деньги не пришли. Что делать?</b>❓\n▶️ В этом случаи Вам нужно написать в службу поддержки: @Zheka920\n\n❗️ <b>Чтобы не потерять бота</b> ❗️\n▶️ Подписывайтесь на канал @glazaVtelege там вы найдете всегда актуальную ссылку `,{
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
            time = 97200
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
            time = 270000
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
            time = 615600
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
        time = 86760*30 
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
        case 'cancel':
            client.authorize(function(err,tokens){
                if(err){
                    console.log(err)
                    return
                } else {
                  
                    cancels(client)
                }
            })
            async function cancels(cl){
                const gsapi = google.sheets({version:'v4',auth: cl})
                
                let сhannelss = query.message.entities[0].url
                const all = {
                    spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                    range:'A1:A'
                }
                let data = await gsapi.spreadsheets.values.get(all)
                let allID = data.data.values.flat().map(Number)
                numberIndex = allID.indexOf(query.message.chat.id)
           
                const updateNakrAvto = {
                    spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                    range:`G${numberIndex+1}`,
                    valueInputOption:'USER_ENTERED',
                    resource: {values: [['Автопросмотры']]}
                }
                gsapi.spreadsheets.values.update(updateNakrAvto)
      
              
            bot.sendMessage(query.message.chat.id, `✅ Канал удален ✅`,{
                parse_mode: 'HTML'
            })  
             //--
             const saveIds = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'V1:V'
            }
            let dataIds = await gsapi.spreadsheets.values.get(saveIds)
            let idTarifs = Number(dataIds.data.values[0].flat())
            const sendTextss = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:`V1`,
                valueInputOption:'USER_ENTERED',
                resource: {values: [[Number(idTarifs)+1]]}
            }
            gsapi.spreadsheets.values.update(sendTextss)
            //--
            bot.sendMessage('@newstlgr', `❌👁‍🗨 Удалить канал с автопросмотров: ${сhannelss}👁‍🗨❌`)
        }
        break
        case 'change':
            client.authorize(function(err,tokens){
                if(err){
                    console.log(err)
                    return
                } else {
                  
                    changes(client)
                }
            })
            async function changes(cl){
                const gsapi = google.sheets({version:'v4',auth: cl})
                
                let сhannelss = query.message.entities[0].url
                const all = {
                    spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                    range:'A1:A'
                }
                let data = await gsapi.spreadsheets.values.get(all)
                let allID = data.data.values.flat().map(Number)
                numberIndex = allID.indexOf(query.message.chat.id)
           
                const updateNakrAvto = {
                    spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                    range:`G${numberIndex+1}`,
                    valueInputOption:'USER_ENTERED',
                    resource: {values: [['Количество автопросмотров']]}
                }
                gsapi.spreadsheets.values.update(updateNakrAvto)
                 //--
             const saveIds = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'V1:V'
            }
            let dataIds = await gsapi.spreadsheets.values.get(saveIds)
            let idTarifs = Number(dataIds.data.values[0].flat())
            const sendTextss = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:`V1`,
                valueInputOption:'USER_ENTERED',
                resource: {values: [[Number(idTarifs)+1]]}
            }
            gsapi.spreadsheets.values.update(sendTextss)
            //--
              
            bot.sendMessage(query.message.chat.id, `👁‍🗨 Введите нужное количество просмотров на один пост:`,{
                parse_mode: 'HTML'
            })  
            bot.sendMessage('@newstlgr', `✏️Изменить количество автопросмотров: ${сhannelss}✏️`)
        }
        break
        case 'prodlit':
        
            client.authorize(function(err,tokens){
                if(err){
                    console.log(err)
                    return
                } else {
                  
                    prodlits(client)
                }
            })
            async function prodlits(cl){
                const gsapi = google.sheets({version:'v4',auth: cl})
                
                let сhannelss = query.message.entities[0].url
                const all = {
                    spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                    range:'A1:A'
                }
                let data = await gsapi.spreadsheets.values.get(all)
                let allID = data.data.values.flat().map(Number)
                numberIndex = allID.indexOf(query.message.chat.id)
           
                const updateNakrAvto = {
                    spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                    range:`G${numberIndex+1}`,
                    valueInputOption:'USER_ENTERED',
                    resource: {values: [['Продлевание']]}
                }
                gsapi.spreadsheets.values.update(updateNakrAvto)
      
                const allBalance = {
                    spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                    range:'B1:B'
                }
                let dataBalance = await gsapi.spreadsheets.values.get(allBalance)
                let idBlnc = dataBalance.data.values.flat().map(Number)
             
                 //--
             const saveIds = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'V1:V'
            }
            let dataIds = await gsapi.spreadsheets.values.get(saveIds)
            let idTarifs = Number(dataIds.data.values[0].flat())
            const sendTextss = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:`V1`,
                valueInputOption:'USER_ENTERED',
                resource: {values: [[Number(idTarifs)+1]]}
            }
            gsapi.spreadsheets.values.update(sendTextss)
            //--
            bot.sendMessage(query.message.chat.id, `ℹ️ Сутки автопросмотров = 20 ₽.\n\n🌀 Ваш баланс позволяет продлить автопросмотры на <b>${Math.floor(idBlnc[numberIndex]/20)} дней</b>\n\n👉 Введите количество дней для продления:`,{
                parse_mode: 'HTML'
            })  
            bot.sendMessage('@newstlgr', `⏳Продлить автопросмотры: ${сhannelss}⏳`)
        }
     
        break
        case 'delete':
            let posts = query.message.entities[1].url.substring(26)
            let idChannels = query.message.entities[1].url.substring(15,25)
            let masivNakrutka = `${idChannels},${posts}`
            let channelsPodp = query.message.entities[1].url
         
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
                 //--
             const saveIds = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:'V1:V'
            }
            let dataIds = await gsapi.spreadsheets.values.get(saveIds)
            let idTarifs = Number(dataIds.data.values[0].flat())
            const sendTextss = {
                spreadsheetId:'1Hblq_0kcMgtXKiJVxPkWybZoC15f9sRoO6Fyypuu_dg',
                range:`V1`,
                valueInputOption:'USER_ENTERED',
                resource: {values: [[Number(idTarifs)+1]]}
            }
            gsapi.spreadsheets.values.update(sendTextss)
            //--
                bot.sendMessage(query.message.chat.id,'✔️ Заказ удален с накрутки')
                bot.sendMessage('@newstlgr',`❌ Удалить заказ ${channelsPodp} ❌`)

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


