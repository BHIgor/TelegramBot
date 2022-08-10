const TelegramBot = require('node-telegram-bot-api')
const kb = require('./keyboard-buttons')
const keyboard = require('./keyboard')
const helper = require('./helper')
const sessionAkk = require('./sessionAkk')
const sessionAkkReaction = require('./sessionAkkReaction')
const http = require('http')
const url = require('url')
const { exec } = require("child_process");


const mysql = require("mysql2/promise");
const config = require('./config')

const freekassa = require("freekassa-node");
const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk');
const SECRET_KEY = 'eyJ2ZXJzaW9uIjoiUDJQIiwiZGF0YSI6eyJwYXlpbl9tZXJjaGFudF9zaXRlX3VpZCI6InhheXExbS0wMCIsInVzZXJfaWQiOiI3OTUzMjIzNjY1OCIsInNlY3JldCI6ImE1NTJmMWQwMzM5Zjc4ZWM0NjdjNDVkNTI5YWE5NzQ0ZWI2ZmI2Mzc4MThkNDI3NjU4MTcxN2I1YzAwNDUxODQifX0=';
const qiwiApi = new QiwiBillPaymentsAPI(SECRET_KEY);

const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input"); // npm i input

const apiId = 13546883;
const apiHash = "717b67ceb0ab2a1aa7fc9f858969e15f";

const stringSession = new StringSession("1AgAOMTQ5LjE1NC4xNjcuNDEBu3lZ+EJXuzE1rw7ctYWlpwIsv17I6vvW1ifcMgfhZgAeUi15rph2q8WfIKINhmV83M2NutTCdphfu34kwcmck1MIt/gqz/FzwJa5k6beeQzqtod6uWApkUtekD5gQi5MTbTpvlgg0RDDd+J3Xgm/emz6sKWD+VBeOD9XNfEDfQHQOG1ZZVKhMR+eYx14X3gFUFYozMdO9r3gfQZfBq/aJ+dzAQfpZa69yda0KadPnVCHIx+1r8fGKkjZyrcEDxwC0AxjmH/lDZnMy86oKkephqj3nl0dU6bUU5nS16x2sTC6KWzmnET9N2eAgsnXYzaDiqr9RE1iiIxinKQsLJ12Q4I="); // fill this later with the value from session.save()
const clientApi = new TelegramClient( stringSession, apiId, apiHash, {
    connectionRetries: 5,
    
  });

(async () => {
  console.log("Loading interactive example...");
 
  await clientApi.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });
  console.log("You should now be connected.");
  console.log(clientApi.session.save());
  await clientApi.sendMessage("me", { message: "Hello!" });

})();



const {google} = require('googleapis')
const keys = require('./credentials.json');
const { chat } = require('googleapis/build/src/apis/chat');

const express = require('express');
const { getRandomInt, generateRandomBigInt } = require('telegram/Helpers');
const app = express()
const setup = {port:8000}


// Слушаем порт и при запуске сервера сообщаем
app.listen(setup.port, () => {
  console.log('Сервер: порт %s - старт!', setup.port);
});
const bodyParser = require('body-parser')
const { getUpdates } = require('telegram-test-api/lib/routes/client/getUpdates')
const { error } = require('console')
const { resolve } = require('path')
app.use(bodyParser.urlencoded({
    extended: true,
}))
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('Hello World')

})
app.get('/good', function (req, res) {
    res.send('Оплата прошла успешно')
  
  })
app.get('/bad', function (req, res) {
    res.send('Оплата не прошла!')
  
  })    
  app.get('/shop-verification-nrmdP6emVL.txt', function (req, res) {
    res.send('shop-verification-nrmdP6emVL')
  
  })    
 
app.listen(process.env.PORT)
//process.env.PORT

helper.logStart()
//pm2 start index.js --deep-monitoring --attach
const TOKEN = "5169973391:AAH2-yK4i1T9xc-aWXvBA1pfEvu2weLK48U"
const bot = new TelegramBot(TOKEN, {polling:true})
let test = 2
let numberIndex = 0
let summ = 0
let time = 0
let verh = 0
let vniz = 0

 

app.post('/apicassa', function (req, res) {
    console.log(req.body)
    async function cassa(){
        const connMysql = await mysql.createConnection(config) 

        const [rows] = await connMysql.execute(`select * from users WHERE randomid = ${req.body.MERCHANT_ORDER_ID}`)

        let oneBalance = ''
        let oneId = ''

        rows.map(e =>{
            
            oneBalance = e.balance
            oneId = e.id
            
        })  

        await connMysql.execute(`UPDATE users SET balance=${Number(oneBalance)+Number(req.body.AMOUNT)} WHERE id = '${oneId}'`)
        await connMysql.execute(`UPDATE users SET randomid=0 WHERE id = '${oneId}'`)
       
        bot.sendMessage(oneId,`Ваш баланс пополнен на ${Number(req.body.AMOUNT)}р.`)
        bot.sendMessage('@kapustaBablo',`✅Баланс пополнен на ${Number(req.body.AMOUNT)}р. FREECASSA✅`)

       
        connMysql.end()
    }

    cassa()

})

app.post('/api', function (req, res) {
    console.log(req.body)
    async function apiq(){
        const connMysql = await mysql.createConnection(config) 
        const [rows] = await connMysql.execute(`select * from users WHERE randomid = ${Number(req.body.bill.billId)}`)

        let oneBalance = ''
        let oneId = ''
        let referal = ''
        let refBalance =''
        
        rows.map(e =>{
            
            oneBalance = e.balance
            oneId = e.id
            referal = e.brat
        })  

        const [refer] = await connMysql.execute(`select * from users WHERE id = '${referal}'`)

        refer.map(e =>{
            refBalance = e.hz
        })  

        console.log(oneId)

        if(req.body.bill.status.value === 'PAID' && oneId != ''){
       

        await connMysql.execute(`UPDATE users SET balance=${Number(oneBalance)+Number(req.body.bill.amount.value)} WHERE id = '${oneId}'`)

        await connMysql.execute(`UPDATE users SET randomid=0 WHERE id = '${oneId}'`)
       
        bot.sendMessage(oneId,`Ваш баланс пополнен на ${Number(req.body.bill.amount.value)}р.`)
        bot.sendMessage('@kapustaBablo',`✅Баланс пополнен на ${Number(req.body.bill.amount.value)}р.`)
       
        if(referal != ''){
            await connMysql.execute(`UPDATE users SET hz=${Math.floor(Number(refBalance)+(Number(req.body.bill.amount.value))*0.2)} WHERE id = '${referal}'`)    
            bot.sendMessage(referal,`Ваш реферальний баланс пополнен на ${Math.floor((Number(req.body.bill.amount.value))*0.2)}р.`)
        } 

        }else{
            console.log('errorssss')
        }
       
         connMysql.end()
    }

    apiq()

        
  })



bot.on('message', msg => {
  
    const chatId = helper.getChatId(msg)
   
   

    async function status(){
        const connMysql = await mysql.createConnection(config) 

        const [rows] = await connMysql.execute('select * from users')

        let oneId = ''
        let oneStatus = ''
        let oneBalance = ''
        let oneTarif = ''

        rows.map(e =>{
            if(Number(e.id) === chatId){
                oneId = e.id 
                oneStatus = e.status
                oneBalance = Number(e.balance)
                oneTarif = e.tarif
            }
        })  

      
        let usersId  = []

        const result = await clientApi.invoke(new Api.channels.GetParticipants({
            channel: 'glazaVtelege',
            filter: new Api.ChannelParticipantsMentions({}),
            offset: 0,
            limit: 10000,
            hash: BigInt('-4156887774564')
        
            }));
    
      
          result.users.map(e => {
            usersId.push(parseInt(e.id))
        })    
       
        if(oneId===''){
            bot.sendMessage(chatId,`Чтобы продолжить выполните команду /start`)
        } else if(!usersId.includes(chatId)){
            bot.sendMessage(chatId,`❗️ <b>Подпишитесь чтобы убрать это сообщение</b> ❗️\nЧтобы использовать бота вы должны быть подписаны на наш канал @glazaVtelege\n\n<i>В случаи блокировки бота, на канале вы найдете всегда актуальную ссылку на бота</i>`,{parse_mode: 'HTML' })
        }else{

        if(msg.forward_from_chat && oneStatus==='Накрутка' && msg.media_group_id === undefined){
            let idChannel = String(msg.forward_from_chat.id).substring(4)

            
            async function zakazilo() { 
                const watchpost = await clientApi.invoke(
                    new Api.channels.ReadHistory({
                        channel: "-1001632245000",
                        maxId: 0,
                    })
                    );
                const idPosts =  await clientApi.invoke(
                    new Api.channels.GetFullChannel({
                        channel: "-1001632245000",
                        })
                );
               
                const result0 = await clientApi.invoke(
                    new Api.messages.SendMessage({
                        peer: "telemnogocombot",
                        message: "🔚 Домой",
                        randomId: generateRandomBigInt(1,100000),
                        noWebpage: true,
                        scheduleDate: 43,
                    })
                    );
                const result = await clientApi.invoke(
                new Api.messages.ForwardMessages({
                    fromPeer: "-1001632245000",
                    id: [idPosts.fullChat.readInboxMaxId],
                    randomId: [generateRandomBigInt(1,100000)],
                    toPeer: "telemnogocombot",
                    withMyScore: true,
                    scheduleDate: 43,
                })
                );
            } 
                async function runss() {         
                                                
                const watchpost = await clientApi.invoke(
                    new Api.channels.ReadHistory({
                        channel: "-1001769608495",
                        maxId: 0,
                    })
                    );
                const idPosts =  await clientApi.invoke(
                    new Api.channels.GetFullChannel({
                        channel: "-1001769608495",
                        })
                );
               
                const result0 = await clientApi.invoke(
                    new Api.messages.SendMessage({
                        peer: "telemnogocombot",
                        message: "🔚 Домой",
                        randomId: generateRandomBigInt(1,100000),
                        noWebpage: true,
                        scheduleDate: 43,
                    })
                    );
                const result = await clientApi.invoke(
                new Api.messages.ForwardMessages({
                    fromPeer: "-1001769608495",
                    id: [idPosts.fullChat.readInboxMaxId],
                    randomId: [generateRandomBigInt(1,100000)],
                    toPeer: "telemnogocombot",
                    withMyScore: true,
                    scheduleDate: 43,
                })
                );
                    
            };

            let billid =  Math.floor(Math.random() * (10000000 - 1) + 1)
           
            await connMysql.execute(`INSERT INTO views(name,idUser,idChannel,numberZakaz) VALUES('${msg.forward_from_chat.title}',${msg.chat.id},${idChannel},${billid})`)
            
            await bot.forwardMessage((Number(idChannel)===1735748885||Number(idChannel)===1557490766 ||Number(idChannel)===1786540189||Number(idChannel)===1660144286)?'-1001632245000':'-1001769608495',chatId, msg.message_id).then(function(){}) 
    
            await (Number(idChannel)===1735748885||Number(idChannel)===1557490766||Number(idChannel)===1786540189||Number(idChannel)===1660144286)?zakazilo():runss()
                   
            await connMysql.execute(`UPDATE users SET status="Число накрутки" WHERE id = ${oneId}`)

            await bot.sendMessage(chatId,`👁‍🗨 Введи нужное количество просмотров\n\n💯 Максимальное количество просмотров на один пост <b>10 000</b>\n\n💬 <i>Пример: на посте 1000 просмотров, но ты хочешь сделать чтобы было 3000. Тогда тебе нужно ввести 2000.</i>`,{parse_mode: 'HTML' })
            
         
        } else 
        if(msg.forward_from_chat && oneStatus==='Накрутка' && msg.media_group_id !== undefined){
            bot.sendMessage(chatId,`⚠️ Если в посте несколько медиафайлов (картинок или видео), в бота надо отправлять первую из них (правой кнопкой или длинный тап по последнему файлу и выбрать переслать)`,{parse_mode: 'HTML' })
        }

        if(oneStatus==='Число накрутки'&& Number(msg.text)<=10000){
            const connMysql = await mysql.createConnection(config) 
        
            const [rows] = await connMysql.execute('select * from views')
            
            let oneNumber = ''
            let idChnl = ''
            rows.slice(-1).map(e =>{
                
                oneNumber = e.numberZakaz
                idChnl = Number(e.idChannel)
                
            })  
            async function chislo(){
              

                await bot.sendMessage(chatId,`⏱ На сколько часов растянуть просмотры на 1 пост?\n\n👉 Укажите количество часов или 0, если хотите максимальную скорость:`)
                await connMysql.execute(`UPDATE views SET count=${Number(msg.text)} WHERE numberZakaz = ${oneNumber}`)
                await connMysql.execute(`UPDATE users SET status="Время накрутки" WHERE id = ${oneId}`)

                await connMysql.end()
            }
            chislo()

          
            await bot.sendMessage((idChnl===1735748885||idChnl===1557490766||idChnl===1786540189||idChnl===1660144286)?'-1001632245000':'-1001769608495', `${msg.text}`)
        
            async function zakazos() {
                const watchpost = await clientApi.invoke(
                    new Api.channels.ReadHistory({
                        channel: "-1001632245000",
                        maxId: 0,
                    })
                    );
                const idPosts =  await clientApi.invoke(
                    new Api.channels.GetFullChannel({
                        channel: "-1001632245000",
                        })
                );
                const result = await clientApi.invoke(
                new Api.messages.ForwardMessages({
                    fromPeer: "-1001632245000",
                    id: [idPosts.fullChat.readInboxMaxId],
                    randomId: [generateRandomBigInt(1,100000)],
                    toPeer: "telemnogocombot",
                    withMyScore: true,
                    scheduleDate: 43,
                })
                );

            };
            
          async function runsos() {
                const watchpost = await clientApi.invoke(
                    new Api.channels.ReadHistory({
                        channel: "-1001769608495",
                        maxId: 0,
                    })
                    );
                const idPosts =  await clientApi.invoke(
                    new Api.channels.GetFullChannel({
                        channel: "-1001769608495",
                        })
                );
                const result = await clientApi.invoke(
                new Api.messages.ForwardMessages({
                    fromPeer: "-1001769608495",
                    id: [idPosts.fullChat.readInboxMaxId],
                    randomId: [generateRandomBigInt(1,100000)],
                    toPeer: "telemnogocombot",
                    withMyScore: true,
                    scheduleDate: 43,
                })
                );

            };
            (idChnl===1557490766||idChnl===1735748885||idChnl===1786540189||idChnl===1660144286)?zakazos():runsos()
        }
        if(oneStatus==='Число накрутки'&& Number(msg.text)>10000){
            bot.sendMessage(chatId,`⚠️ Максимальное количество 10 000`)
        }
   
        if(oneStatus==='Время накрутки'&& (Number(msg.text)||msg.text==='0')){
            const connMysql = await mysql.createConnection(config) 
        
                const [rows] = await connMysql.execute('select * from views')
                
                let oneNumber = ''
                let idChnl = ''
                rows.slice(-1).map(e =>{
                    
                    oneNumber = e.numberZakaz
                    idChnl = Number(e.idChannel)
                })  
            async function times(){
                
                await bot.sendMessage(chatId,`✅ Просмотры подключены`)
                await connMysql.execute(`UPDATE views SET time=${Number(msg.text)} WHERE numberZakaz = '${oneNumber}'`)
                await connMysql.execute(`UPDATE users SET status="Накрутка" WHERE id = ${oneId}`)
                
                await connMysql.end()
            }
            times()
            
            await bot.sendMessage((idChnl===1557490766||idChnl===1735748885||idChnl===1786540189||idChnl===1660144286)?'-1001632245000':'-1001769608495', `${msg.text}`)
        
            async function zakazTime() {
                const watchpost = await clientApi.invoke(
                    new Api.channels.ReadHistory({
                        channel: "-1001632245000",
                        maxId: 0,
                    })
                    );
                const idPosts =  await clientApi.invoke(
                    new Api.channels.GetFullChannel({
                        channel: "-1001632245000",
                        })
                );
                const result = await clientApi.invoke(
                new Api.messages.ForwardMessages({
                    fromPeer: "-1001632245000",
                    id: [idPosts.fullChat.readInboxMaxId],
                    randomId: [generateRandomBigInt(1,100000)],
                    toPeer: "telemnogocombot",
                    withMyScore: true,
                    scheduleDate: 43,
                })
                );

            };
            async function runss() {
                const watchpost = await clientApi.invoke(
                    new Api.channels.ReadHistory({
                        channel: "-1001769608495",
                        maxId: 0,
                    })
                    );
                const idPosts =  await clientApi.invoke(
                    new Api.channels.GetFullChannel({
                        channel: "-1001769608495",
                        })
                );
                const result = await clientApi.invoke(
                new Api.messages.ForwardMessages({
                    fromPeer: "-1001769608495",
                    id: [idPosts.fullChat.readInboxMaxId],
                    randomId: [generateRandomBigInt(1,100000)],
                    toPeer: "telemnogocombot",
                    withMyScore: true,
                    scheduleDate: 43,
                })
                );

            };
            (idChnl===1557490766||idChnl===1735748885||idChnl===1786540189||idChnl===1660144286)?zakazTime():runss()
        }

        
        if(oneStatus==='Подписчики'&& (msg.text.includes('https')||msg.text.includes('t.me')||msg.text.includes('http')||msg.text.includes('@'))){
            
            let billid =  Math.floor(Math.random() * (10000000 - 1) + 1)
          
            await connMysql.execute(`UPDATE users SET status="Число подписчиков" WHERE id = ${oneId}`)
            await connMysql.execute(`INSERT INTO views(name,idUser,numberZakaz) VALUES('${msg.text}',${msg.chat.id},${billid})`)

            bot.sendMessage('@zakazSudo', `Подписчики сюда БЫСТРЫЕ ${msg.text}`)

            bot.sendMessage(chatId,`👥 Введи нужное количество подписчиков:\n\n Баланс позволяет накрутить <b>${Math.floor(oneBalance/0.5)} подписчиков</b>`,{parse_mode: 'HTML' })
            
        }
       
      
        if(oneStatus==='Число подписчиков'&& Number(msg.text)){
            
            if(oneBalance >= Number(msg.text)*0.5){
                
                await connMysql.execute(`UPDATE users SET balance=${oneBalance-Number(msg.text)*0.5} WHERE id = ${oneId}`)
           
                async function countpdp(){
                    const connMysql = await mysql.createConnection(config) 
            
                    const [rows] = await connMysql.execute('select * from views')
                    
                    let oneNumber = ''
                    
                    rows.slice(-1).map(e =>{
                        
                        oneNumber = e.numberZakaz
                        
                    })  

                    await bot.sendMessage(chatId,`⏱ На сколько часов растянуть выполнение заказа?\n\n👉 Укажите количество часов или 0, если хотите максимальную скорость:`)
                    await connMysql.execute(`UPDATE views SET count=${Number(msg.text)} WHERE numberZakaz = ${oneNumber}`)
                    await connMysql.execute(`UPDATE users SET status="Время накрутки пдп" WHERE id = ${oneId}`)

                    await connMysql.end()
                }
                countpdp()

            bot.sendMessage('@zakazSudo', `Количество подписчиков БЫСТРЫЕ: ${msg.text}`)
          } else if(oneBalance < Number(msg.text)*0.5){
            bot.sendMessage(chatId,`❌ Недостаточно денег на балансе`)
          }
        }

        if(oneStatus==='Время накрутки пдп'&& (Number(msg.text)||msg.text==='0')){
 
            async function timespdp(){
                const connMysql = await mysql.createConnection(config) 
        
                const [rows] = await connMysql.execute('select * from views')
                
                let oneNumber = ''
                
                rows.slice(-1).map(e =>{
                    
                    oneNumber = e.numberZakaz
                    
                })  
                await bot.sendMessage(chatId,`✅ Подписчики подключены`)
                await connMysql.execute(`UPDATE views SET time=${Number(msg.text)} WHERE numberZakaz = ${oneNumber}`)
                await connMysql.execute(`UPDATE users SET status="Подписчики" WHERE id = ${oneId}`)
                bot.sendMessage('@zakazSudo', `Растянуть подписчиков БЫСТРЫЕ: на ${msg.text} часа ✅`)

                await connMysql.end()
            }
            timespdp()
        }

        if(oneStatus==='Подписчики медленные'&& (msg.text.includes('https')||msg.text.includes('t.me')||msg.text.includes('http')||msg.text.includes('@'))){


            let billid =  Math.floor(Math.random() * (10000000 - 1) + 1)
          
            await connMysql.execute(`UPDATE users SET status="Число подписчиков медленно" WHERE id = ${oneId}`)
            await connMysql.execute(`INSERT INTO views(name,idUser,numberZakaz) VALUES('${msg.text}',${msg.chat.id},${billid})`)

            bot.sendMessage('@zakazSudo', `Подписчики сюда МЕДЛЕННО ${msg.text}`)

            bot.sendMessage(chatId,`👥 Введи нужное количество подписчиков:\n\n Баланс позволяет накрутить <b>${Math.floor(oneBalance/0.05)} подписчиков</b>`,{parse_mode: 'HTML' })
        }

        if(oneStatus==='Число подписчиков медленно'&& Number(msg.text)){
            
            if(oneBalance >= Number(msg.text)*0.05){
                
                await connMysql.execute(`UPDATE users SET balance=${oneBalance-Number(msg.text)*0.05} WHERE id = ${oneId}`)
           
                async function countpdp(){
                    const connMysql = await mysql.createConnection(config) 
            
                    const [rows] = await connMysql.execute('select * from views')
                    
                    let oneNumber = ''
                    
                    rows.slice(-1).map(e =>{
                        
                        oneNumber = e.numberZakaz
                        
                    })  

                    await bot.sendMessage(chatId,`⏱ На сколько часов растянуть выполнение заказа?\n\n👉 Укажите количество часов или 0, если хотите максимальную скорость:`)
                    await connMysql.execute(`UPDATE views SET count=${Number(msg.text)} WHERE numberZakaz = ${oneNumber}`)
                    await connMysql.execute(`UPDATE users SET status="Время накрутки пдп мед" WHERE id = ${oneId}`)
                 
                    await connMysql.end()
                }
                countpdp()

            bot.sendMessage('@zakazSudo', `Количество подписчиков МЕДЛЕННО: ${msg.text}`)
          } else if(oneBalance < Number(msg.text)*0.05){
            bot.sendMessage(chatId,`❌ Недостаточно денег на балансе`)
          }
        }

        if(oneStatus==='Время накрутки пдп мед'&& (Number(msg.text)||msg.text==='0')){
 
            async function timespdpmed(){
                const connMysql = await mysql.createConnection(config) 
        
                const [rows] = await connMysql.execute('select * from views')
                
                let oneNumber = ''
                
                rows.slice(-1).map(e =>{
                    
                    oneNumber = e.numberZakaz
                    
                })  
                await bot.sendMessage(chatId,`✅ Подписчики подключены`)
                await connMysql.execute(`UPDATE views SET time=${Number(msg.text)} WHERE numberZakaz = ${oneNumber}`)
                await connMysql.execute(`UPDATE users SET status="Подписчики меделенно" WHERE id = ${oneId}`)
                bot.sendMessage('@zakazSudo', `Растянуть подписчиков МЕДЛЕННО: на ${msg.text} часа ✅`)

                await connMysql.end()
            }
            timespdpmed()
        }

        
        if(oneStatus==='Количество Qiwi'&& Number(msg.text)){
          
            if(oneBalance >= Number(msg.text)*150){
             
            await connMysql.execute(`UPDATE users SET balance=${oneBalance-Number(msg.text)*150} WHERE id = ${oneId}`)
            await connMysql.execute(`UPDATE users SET status="Главная" WHERE id = ${oneId}`)
              
               
            bot.sendMessage('@zakazSudo', `🥝QIWI🥝\n${chatId} \nКоличество QIWI: ${msg.text}`,{parse_mode:'HTML'})
            bot.sendMessage(chatId,`⏳<b>Ваша покупка обрабатывается</b>⏳\n\nЭто может занять до 10 минут.\n<b>Qiwi кошелек</b> будет отправлен в этот чат.\n\n<i>Если возникли трудности обратитесь в поддержку: @glazaAdmin </i>`,{parse_mode:'HTML'})
        }else if(oneBalance < Number(msg.text)*150){
            bot.sendMessage(chatId,`❌ Недостаточно денег на балансе`)
          }
        }

        if(oneStatus==='Отправка заказа'&& Number(msg.text)){

            await connMysql.execute(`UPDATE qiwi SET idUser=${Number(msg.text)} WHERE id = 1`)
            await connMysql.execute(`UPDATE users SET status="Напиши текст" WHERE id = ${oneId}`)
           
            bot.sendMessage(chatId,`Id записан`)
        }
        if(oneStatus==='Напиши текст'&& msg.text){

            async function zakaz(){
                const connMysql = await mysql.createConnection(config) 
        
                const [rows] = await connMysql.execute('select * from qiwi')
                
                let oneNumber = ''
                
                rows.map(e =>{
                    
                    oneNumber = e.idUser
                    
                })  
                bot.sendMessage(oneNumber,`${msg.text}`)
                bot.sendMessage(chatId,`✉️Письмо отправлено✉️`)
                await connMysql.execute(`UPDATE users SET status="Главная" WHERE id = ${oneId}`)
           
                await connMysql.end()
            }
            zakaz()
        }

        if(oneStatus==='Комментарии' && msg.text.includes('https')){

            let linkchat =  msg.text.substring(13)
            let indx =  linkchat.indexOf('/');
            let newlink = linkchat.slice(0,indx)
            let billid =  Math.floor(Math.random() * (10000000 - 1) + 1)
          
            await connMysql.execute(`INSERT INTO coment(idUser,chat,link,post,numberZakaz) VALUES(${msg.chat.id},'${msg.text}','${newlink}','${linkchat.substring(indx+1)}',${billid})`)
            await connMysql.execute(`UPDATE users SET status="Текст комментариев" WHERE id = ${oneId}`)
            
            bot.sendMessage(chatId,`📃 Введите комментарии которые хотите накрутить через запятую ','\n❗️ Минимальное количество 2 шт.\n\n<i>Пример: Всем привет,Отлично,Как у вас дела?,и так далее</i>`,{parse_mode:'HTML'})
        }
    
            if(oneStatus==='Текст комментариев' && msg.text.includes(',')){
                
                async function textComentt(){
                    const connMysql = await mysql.createConnection(config) 
            
                    const [rows] = await connMysql.execute('select * from coment')
                    
                    let oneNumber = ''
                    let oneLink = ''
                    rows.slice(-1).map(e =>{
                        
                        oneNumber = e.numberZakaz
                        oneLink = e.link
                    })  
                    await connMysql.execute(`UPDATE users SET status="Проверка заказа" WHERE id = ${oneId}`)
                    await connMysql.execute(`UPDATE coment SET text='${msg.text}' WHERE numberZakaz = ${oneNumber}`)
 
                    const [rowses] = await connMysql.execute('select * from coment')
                   
                    rowses.slice(-1).map(e =>{
                        if(Number(e.idUser) === chatId){   
                    
                            bot.sendMessage(chatId,`📌 <b>Ваш заказ:</b>\n\n🔗 Ссылка на пост: ${e.chat}\n❗️ Количество комментариев: ${e.text.split(',').length}шт.\n📝 Текст комментариев: <b>${e.text}</b>\n💵 <b>Стоимость (рублей):  ${e.text.split(',').length * 0.5}</b>`,{
                               reply_markup:{
                               inline_keyboard:  [
                                   [    {
                                           text:'💰 Оплатить',
                                           callback_data:'oplataKoment',
                                           
                                          
                                       }
                                   ]]
                            },parse_mode: 'HTML'})
                            bot.sendMessage('-1001769608495',`📌 <b>Ваш заказ:</b>\n\n🔗 Ссылка на пост: ${e.chat}\n❗️ Количество комментариев: ${e.text.split(',').length}шт.\n📝 Текст комментариев: <b>${e.text}</b>\n💵 <b>Стоимость (рублей):  ${e.text.split(',').length * 0.5}</b>`,{parse_mode: 'HTML'})
                       } 
                        
                        
                    })  


                    await connMysql.end()
                }
                textComentt()

        }else if(oneStatus==='Текст комментариев' && !msg.text.includes(',')&&!msg.text.includes('🔙 Назад')){
            bot.sendMessage(chatId,`Комментарии должны быть через запятую пример: `)
        }
        
            
        if(oneStatus==='Автопросмотры'&& (msg.text.includes('https')||msg.text.includes('t.me')||msg.text.includes('http')||msg.text.includes('@'))){

            let billid =  Math.floor(Math.random() * (10000000 - 1) + 1)
          
            await connMysql.execute(`INSERT INTO avto(idUser,channel,numberZakaz) VALUES(${msg.chat.id},'${(msg.text.includes('@')?`http://t.me/${msg.text}`:msg.text.includes('http')?`${msg.text}`:msg.text.includes('https')?`${msg.text}`:msg.text.includes('t.me')?`${msg.text}`:`${msg.text}`)}',${billid})`)

            await connMysql.execute(`UPDATE users SET status="Число автопросмотров" WHERE id = ${oneId}`)  

            bot.sendMessage('@zakazSudo', `👁‍🗨 АВТОПРОСМОТРЫ 👁‍🗨 ${msg.text}`)

            bot.sendMessage(chatId,`👁‍🗨 Введите нужное количество просмотров на один пост:`,{parse_mode: 'HTML' })
        }
       
    
        if(oneStatus==='Число автопросмотров'&& Number(msg.text)){

            async function chisloAvto(){
                const connMysql = await mysql.createConnection(config) 
        
                const [rows] = await connMysql.execute('select * from avto')
                
                let oneNumber = ''
                
                rows.slice(-1).map(e =>{
                    
                    oneNumber = e.numberZakaz
                    
                })  
                await connMysql.execute(`UPDATE users SET status="Число растянуть" WHERE id = ${oneId}`)  

                await connMysql.execute(`UPDATE avto SET count='${msg.text}' WHERE numberZakaz = ${oneNumber}`)
                connMysql.end()
            }
            chisloAvto()
           
            bot.sendMessage('@zakazSudo', `Количество просмотров на пост: ${msg.text}`)
            bot.sendMessage(chatId,`⏱ На сколько часов растянуть просмотры на 1 пост?\n\n👉 Укажите количество часов или 0, если хотите максимальную скорость:`,{
                parse_mode: 'HTML'
             })
        }

        if(oneStatus==='Число растянуть'&& Number(msg.text)){
            
            async function chisloRast(){
                const connMysql = await mysql.createConnection(config) 
        
                const [rows] = await connMysql.execute('select * from avto')
                
                let oneNumber = ''
                
                rows.slice(-1).map(e =>{
                    
                    oneNumber = e.numberZakaz
                    
                })  
                await connMysql.execute(`UPDATE users SET status="Дней накрутки" WHERE id = ${oneId}`)  

                await connMysql.execute(`UPDATE avto SET time='${msg.text}' WHERE numberZakaz = ${oneNumber}`)
                connMysql.end()
            }
            chisloRast()
           
            bot.sendMessage(chatId,`⏳ Введите количество дней:\n\n Баланс позволяет продлить на <b>${Math.floor(oneBalance/20)} дней</b>`,{
               parse_mode: 'HTML'
            })     
        
            bot.sendMessage('@zakazSudo', `Растянуть на: ${msg.text} часа`)
        }

        if(oneStatus==='Дней накрутки'&& Number(msg.text)){
            
            if(oneBalance >= Number(msg.text)*20 && oneTarif!='Нету'){

                async function dayNakr(){
                    const connMysql = await mysql.createConnection(config) 
            
                    const [rows] = await connMysql.execute('select * from avto')
                    
                    let oneNumber = ''
                    
                    rows.slice(-1).map(e =>{
                        
                        oneNumber = e.numberZakaz
                        
                    })  

                    let tarifTime = new Date().getTime()+(msg.text*97200)*1000
                    let tarifDay = `${new Date(tarifTime).getDate()}`+'.'+`${new Date(tarifTime).getMonth()+1}`+'.'+`${new Date(tarifTime).getFullYear()}`+` `+`${new Date(tarifTime). getHours()}`+`:`+`${new Date(tarifTime).getMinutes()}`+`:`+`${new Date(tarifTime).getSeconds()}`

                    await connMysql.execute(`UPDATE users SET status="Автопросмотры" WHERE id = ${oneId}`)  
                    await connMysql.execute(`UPDATE users SET balance = ${oneBalance-Number(msg.text)*20} WHERE id = ${oneId}`)

                    await connMysql.execute(`UPDATE avto SET day='${tarifDay}' WHERE numberZakaz = ${oneNumber}`)
                    connMysql.end()
                }
                dayNakr()
           
            bot.sendMessage(chatId,`✅ Автопросмотры подключены`)
            bot.sendMessage('@zakazSudo', `Количество дней: ${msg.text}`)
          } else if(oneBalance < Number(msg.text)*20){
            bot.sendMessage(chatId,`❌ Недостаточно денег на балансе`)
          }else if(oneTarif=== 'Нету'){
            bot.sendMessage(chatId,`💳 Для подключения автопросмотров <b>нужно приобрести тарифный план. </b>`,{parse_mode:'HTML'})
          }
        }

        
        if(oneStatus==='Продлевание'&& Number(msg.text)){
             
            if(oneBalance >= Number(msg.text)*20){
                await connMysql.execute(`UPDATE users SET status="Автопросмотры" WHERE id = ${oneId}`)  
                await connMysql.execute(`UPDATE users SET balance = ${oneBalance-Number(msg.text)*20} WHERE id = ${oneId}`)
               
            bot.sendMessage('@zakazSudo', `Количество дней: ${msg.text}`)
            bot.sendMessage(chatId,`✅ Автопросмотры продлены `)
        }else if(oneBalance < Number(msg.text)*20){
            bot.sendMessage(chatId,`❌ Недостаточно денег на балансе`)
          }
        }

        if(oneStatus==='Количество автопросмотров'&& Number(msg.text)){
            
            await connMysql.execute(`UPDATE users SET status="Автопросмотры" WHERE id = ${oneId}`) 
             
            bot.sendMessage('@zakazSudo', `Количество просмотров: ${msg.text}`)
            bot.sendMessage(chatId,`✅ Количество изменено `)
        }
      
         
        if(oneStatus==='Оплата'&& Number(msg.text)){
            const publicKey = '48e7qUxn9T7RyYE1MVZswX1FRSbE6iyCj2gCRwwF3Dnh5XrasNTx3BGPiMsyXQFNKQhvukniQG8RTVhYm3iPyVXeQ7k1CmVN3LeuRPFHNEVECeqUZRYkspJKKndxy37sZGuDxYio6RdVFJSYqWViQvE7cH7EdNe9Bv2ENW1PboQ3tfbjBNaBuegVJTGwr'
            let billid =  Math.floor(Math.random() * (10000000 - 1) + 1)
              const params = {
                  publicKey,
                  amount:  Number(msg.text),
                  billId: billid,
                  comment:chatId,
                  paySource:'qw',
              };
              const paramsCard = {
                  publicKey,
                  amount:  Number(msg.text),
                  billId: billid,
                  comment:chatId,
                  paySource:'card'
              };
              const link = qiwiApi.createPaymentForm(params);
              const linkCard = qiwiApi.createPaymentForm(paramsCard);
              
              await connMysql.execute(`UPDATE users SET randomid=${billid} WHERE id = ${oneId}`)
              await connMysql.execute(`UPDATE users SET popolnennya=${msg.text} WHERE id = ${oneId}`)
           
              async function oplata(){
                const connMysql = await mysql.createConnection(config) 
        
                const [rows] = await connMysql.execute('select * from users')
                
                let oneBrat = ''
                
                rows.map(e =>{
                    if(Number(e.id) === chatId){
                        oneBrat = Number(e.brat)
                    }
                })  
                if(oneBrat===695925439){
                    bot.sendMessage('@kapustaBablo',`💰 Пополнения счета id${msg.chat.id} на ${msg.text}р. БРАТ`)
                } else if(oneBrat != 0){
                    bot.sendMessage('@kapustaBablo',`💰 Пополнения счета id${msg.chat.id} на ${msg.text}р. Реферала id${oneBrat}`)
                } else{
                    bot.sendMessage('@kapustaBablo',`💰 Пополнения счета id${msg.chat.id} на ${msg.text}р.`)
                }
               
                connMysql.end()
            }
            oplata()
           
            bot.sendMessage(chatId,`Вы пополняете счет на сумму ${Number(msg.text)} руб.\n\nВыберите способ оплаты:\n\n💬<i>Если не приходит код подтверждения обратитесь в службу поддержки @glazaAdmin</i>`,{
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
                                text:'💳 VISA/MASTERCARD RUB',
                                callback_data:'no',
                                url:linkCard
                            }
                 
                        ],
                        [
                            { 
                                text:'💳 VISA/MASTERCARD UAH',
                                callback_data:'uah',
                            }
                 
                        ],
                        [
                            { 
                                text:'⚒ Криптовалюта',
                                callback_data:'other'
                              
                            }
                 
                        ]]
                },
                parse_mode:'HTML'
            })
        } 

        if(oneStatus==='Поповнення балансу пользователя'){

            async function userBalance(){
                const connMysql = await mysql.createConnection(config) 
        
                await connMysql.execute(`UPDATE qiwi SET idUser=${Number(msg.text)} WHERE id = 1`)
               
                bot.sendMessage(chatId,`Id записан, яка сумма?`)
                await connMysql.execute(`UPDATE users SET status="Сума поповнення пользователя" WHERE id = ${chatId}`)
                
                connMysql.end()
            }
        
            userBalance()
        }
        if(oneStatus==='Обнулювання пользователя'){

            async function obnulplzv(){
                const connMysql = await mysql.createConnection(config) 
        
                await connMysql.execute(`UPDATE users SET proba="yes", activ="no", tarif="Нету",status="Главная" WHERE id = ${msg.text}`)
                
                bot.sendMessage(chatId,`✅Користучав обнулений`)
                await connMysql.execute(`UPDATE users SET status="Главная" WHERE id = ${chatId}`)
                connMysql.end()
            }
        
            obnulplzv()
        }
        
        if(oneStatus==='Обнулювання реферального балансу'){

            async function obnulplzvref(){
                const connMysql = await mysql.createConnection(config) 
        
                await connMysql.execute(`UPDATE users SET hz=0 WHERE id = ${msg.text}`)
                
                bot.sendMessage(chatId,`✅Реферальний баланс обнулений`)
                await connMysql.execute(`UPDATE users SET status="Главная" WHERE id = ${chatId}`)
                connMysql.end()
            }
        
            obnulplzvref()
        }
        if(oneStatus==='Сума поповнення пользователя'){

            async function sumaUser(){
                const connMysql = await mysql.createConnection(config) 
        
                const [rows] = await connMysql.execute('select * from qiwi')
                const [rowses] = await connMysql.execute('select * from users')

                let oneBalance = ''

                let oneNumber = ''
                
                await rows.map(e =>{
                    
                    oneNumber = e.idUser
                   
                })  
                await rowses.map(e =>{
                    if(e.id === oneNumber){
                        oneBalance = e.balance
                    }
                })  
                await  console.log(oneBalance)
                bot.sendMessage(oneNumber,`Ваш баланс пополнен на ${msg.text}р.`)
                await connMysql.execute(`UPDATE users SET balance=${Number(oneBalance)+Number(msg.text)} WHERE id = '${oneNumber}'`)
                await connMysql.execute(`UPDATE qiwi SET idUser='${0}' WHERE id = 1`)

                bot.sendMessage(chatId,`✅Баланс пополнен✅`)
                await connMysql.execute(`UPDATE users SET status="Главная" WHERE id = ${chatId}`)
           
                await connMysql.end()
            }
            
            sumaUser()
        }

        if(oneStatus==='Реакции'&& msg.text.includes('+')){

           
            async function linkReact(){
                const connMysql = await mysql.createConnection(config) 
                
                let linkchat =  msg.text.substring(14)
                let billid =  Math.floor(Math.random() * (10000000 - 1) + 1)
              
                await connMysql.execute(`INSERT INTO reaction(idUser,chat,link,numberZakaz) VALUES(${msg.chat.id},'${msg.text}','${linkchat}',${billid})`)
                await connMysql.execute(`UPDATE users SET status="Номер поста реакций" WHERE id = ${oneId}`)
                
                bot.sendMessage(chatId,`Перешлите пост (сделайте репост в бота) на который нужно накрутить`,{parse_mode:'HTML'})
           
           
                await connMysql.end()
            }
            
            linkReact()
        } 

        if(oneStatus==='Номер поста реакций'&& msg.forward_from_chat ){

            async function numberpstReaction(){
                const connMysql = await mysql.createConnection(config) 
                let idChannel = String(msg.forward_from_chat.id)

                await connMysql.execute(`UPDATE reaction SET idChannel = '${idChannel.substring(4)}',post = '${msg.forward_from_message_id}' ORDER BY id DESC LIMIT 1 `)
                await connMysql.execute(`UPDATE users SET status="Выбор реакций" WHERE id = ${oneId}`)
                
                bot.sendMessage(chatId,`🔆 <b>Выберите реакции которые хотите накрутить:</b> 🔆\n\n 1 - 👍\n2 - 👎\n3 - ❤️\n4 - 🔥\n5 - 🥰\n6 - 😁\n7 - 😱\n8 - 🤬\n9 - 💩\n\n❗️ Реакции нужно вводить: <b>Номер реакции - количество реакций</b>, через запятую если несколько реакций.\n⚠️ Общее количество реакций не больше 200 штук на один пост.\n\n<i>Пример ввода: 1-54,4-12,7-89</i>`,{ parse_mode:'HTML'})
           
           
                await connMysql.end()
            }
            
            numberpstReaction()
        }
        if(oneStatus==='Выбор реакций'){

            async function selectReaction(){
                const connMysql = await mysql.createConnection(config) 
                
                let perviyMasiv = msg.text.split(',')
                let newMasiv = []
                perviyMasiv.map(e=>{
                    newMasiv.push(e.split('-'))
                })
                
               newMasiv.map(e=>{
                    
                    if(e[0].includes('1')){
                        connMysql.execute(`UPDATE reaction SET verh = '${e[1]}' ORDER BY id DESC LIMIT 1 `)   
                    } else if(e[0].includes('2')){
                        connMysql.execute(`UPDATE reaction SET vniz = '${e[1]}' ORDER BY id DESC LIMIT 1 `)
                    } else if(e[0].includes('3')){
                        connMysql.execute(`UPDATE reaction SET likes = '${e[1]}' ORDER BY id DESC LIMIT 1 `)
                    } else if(e[0].includes('4')){
                        connMysql.execute(`UPDATE reaction SET fire = '${e[1]}' ORDER BY id DESC LIMIT 1 `)
                    } else if(e[0].includes('5')){
                        connMysql.execute(`UPDATE reaction SET lubov = '${e[1]}' ORDER BY id DESC LIMIT 1 `)
                    } else if(e[0].includes('6')){
                        connMysql.execute(`UPDATE reaction SET smex = '${e[1]}' ORDER BY id DESC LIMIT 1 `)
                    } else if(e[0].includes('7')){
                        connMysql.execute(`UPDATE reaction SET shok = '${e[1]}' ORDER BY id DESC LIMIT 1 `)
                    } else if(e[0].includes('8')){
                        connMysql.execute(`UPDATE reaction SET fuck = '${e[1]}' ORDER BY id DESC LIMIT 1 `)
                    } else if(e[0].includes('9')){
                        connMysql.execute(`UPDATE reaction SET govno = '${e[1]}' ORDER BY id DESC LIMIT 1 `)
                 
                    } 
                })
                
                await connMysql.execute(`UPDATE users SET status="Проверка реакций заказа" WHERE id = ${oneId}`)     
           
                const [rows] = await connMysql.execute('select * from reaction')

                rows.slice(-1).map(e=>{
                    if(Number(e.idUser) === chatId){

                        bot.sendMessage(chatId,`📌<b> Ваш заказ на реакции:</b>\n\n📡 Ссылка на канал: ${e.chat}\n🔗 Ссылка на пост: https://t.me/c/${e.idChannel}/${e.post}\n🔥 <b>Количество реакций:</b> ${(e.verh !='')?`👍 - ${e.verh}`:''} ${(e.vniz !='')?`👎 - ${e.vniz}`:''} ${(e.likes !='')?`❤️ - ${e.likes}`:''} ${ (e.fire !='')?`🔥 - ${e.fire}`:''} ${(e.lubov !='')?`🥰 - ${e.lubov}`:''} ${(e.smex !='')?`😁 - ${e.smex}`:''} ${(e.shok !='')?`😱 - ${e.shok}`:''} ${(e.fuck !='')?`🤬 - ${e.fuck}`:''} ${(e.govno !='')?`💩 - ${e.govno}`:''}\n💵 <b>Стоимость (рублей):  ${Math.ceil((Number(e.verh)+Number(e.vniz)+Number(e.likes)+Number(e.fire)+Number(e.lubov)+Number(e.smex)+Number(e.shok)+Number(e.fuck)+Number(e.govno))*0.1)}</b>`,{
                            reply_markup:{
                            inline_keyboard:  [
                                [    {
                                        text:'💰 Оплатить',
                                        callback_data:'oplataReaction',
                                    }
                                ]]
                        } , parse_mode:'HTML'})

                        bot.sendMessage('-1001769608495',`📌<b> Ваш заказ на реакции:</b>\n\n📡 Ссылка на канал: ${e.chat}\n🔗 Ссылка на пост: https://t.me/c/${e.idChannel}/${e.post}\n🔥 <b>Количество реакций:</b> ${(e.verh !='')?`👍 - ${e.verh}`:''} ${(e.vniz !='')?`👎 - ${e.vniz}`:''} ${(e.likes !='')?`❤️ - ${e.likes}`:''} ${ (e.fire !='')?`🔥 - ${e.fire}`:''} ${(e.lubov !='')?`🥰 - ${e.lubov}`:''} ${(e.smex !='')?`😁 - ${e.smex}`:''} ${(e.shok !='')?`😱 - ${e.shok}`:''} ${(e.fuck !='')?`🤬 - ${e.fuck}`:''} ${(e.govno !='')?`💩 - ${e.govno}`:''}`,{parse_mode: 'HTML'})
                        
                    
                 }})
              
             
           
           
                await connMysql.end()
            }
            
            selectReaction()
        }
       

        connMysql.end()
    }
}
    status() 


    switch (msg.text){
case 'Очистить просмотры':
    async function cleasn(){
        const connMysql = await mysql.createConnection(config) 

        await connMysql.execute(`TRUNCATE TABLE views`)
        bot.sendMessage(chatId,`✅Таблица просмотров очищена`)     
        connMysql.end()
    }

    cleasn()
break
case 'Обнулить пользователя':
    async function obnul(){
        const connMysql = await mysql.createConnection(config) 


        const [rows] = await connMysql.execute('select * from users')

        let oneId = ''

        rows.map(e =>{
            if(Number(e.id) === chatId){
                oneId = e.id
            }
        })  
        bot.sendMessage(chatId,`Введить id кому обнуляти`)      
        await connMysql.execute(`UPDATE users SET status="Обнулювання пользователя" WHERE id = ${oneId}`)
        
        connMysql.end()
    }

    obnul()
break
case 'Обнулить реферальный баланс':
    async function obnulRef(){
        const connMysql = await mysql.createConnection(config) 


        const [rows] = await connMysql.execute('select * from users')

        let oneId = ''

        rows.map(e =>{
            if(Number(e.id) === chatId){
                oneId = e.id
            }
        })  
        bot.sendMessage(chatId,`Введить id кому обнуляти`)      
        await connMysql.execute(`UPDATE users SET status="Обнулювання реферального балансу" WHERE id = ${oneId}`)
        
        connMysql.end()
    }

    obnulRef()
break
case 'Баланс пополнить уже':

    async function balancePopln(){
        const connMysql = await mysql.createConnection(config) 

        const [rows] = await connMysql.execute('select * from users')

        let oneId = ''

        rows.map(e =>{
            if(Number(e.id) === chatId){
                oneId = e.id
            }
        })  
        bot.sendMessage(chatId,`Введить id кому поповнювати`)      
        await connMysql.execute(`UPDATE users SET status="Поповнення балансу пользователя" WHERE id = ${oneId}`)
        
        connMysql.end()
    }

    balancePopln()
break
case 'Киви заказ':

    async function qiwi(){
        const connMysql = await mysql.createConnection(config) 

        const [rows] = await connMysql.execute('select * from users')

        let oneId = ''

        rows.map(e =>{
            if(Number(e.id) === chatId){
                oneId = e.id
            }
        })  

        await connMysql.execute(`UPDATE users SET status="Отправка заказа" WHERE id = ${chatId}`)
       
        connMysql.end()
    }

    qiwi()
break
case 'Админ подпишись на новости':

    async function admines(){
        const connMysql = await mysql.createConnection(config) 

        const [rows] = await connMysql.execute('select * from users')

        let allID = []

        rows.map(e =>{

            allID.push(e.id)
        })  
        
        allID.forEach(e =>  bot.sendMessage(e,`❗️ <b>РЕАКЦИИ УЖЕ ДОСТУПНЫ</b>❗️\n\n🔥 Накручивайте реакции вместе с нами в ЗАКРЫТЫЕ каналы\n\nБолее подробно тут @glazaVtelege \n\nПерейдите в 👤 Профиль чтобы ознакомиться! `,{parse_mode: 'HTML'}))

        connMysql.end()
    }

    admines()

    break
case kb.home.reaction:

    bot.sendMessage(chatId,`<b>🔥 Реакции 🔥</b>\n\n📘 <b>Условия накрутки реакций на пост:</b>\n📺 Крутить можно как на <b>открытые</b> так и <b>закрытые каналы</b>!\n❗️<b>ВАЖНО:</b>❗️\n🔗 Cсылка на канал должна быть как для закрытых каналов, (в открытых канал ее можно взять в настройках канала в разделе 'Пригласительные ссылки')\n🔅 Ссылка должна быть <b>БЕЗ ЗАЯВОК</b>\n\n👨‍👨‍👧 При накрутке на канал будут подписываться боты, для того чтобы поставить реакцию!\n🚀 Скорость накрутки: 1 реакция за 10 секунд.\n💰 <b>Цена за 1 реакцию: 0.1р</b>\n\n👇 Введите ссылку на канал где нужно накрутить реакции 👇\n\n<i>Пример ссылки: https://t.me/+aYfseehCbdH5iTGMy</i>`,{
        reply_markup:{ resize_keyboard: true,keyboard:keyboard.back},parse_mode: 'HTML'
    })   
    async function reaction(){

        const connMysql = await mysql.createConnection(config) 

        const [rows] = await connMysql.execute('select * from users')

        let oneId = ''

        rows.map(e =>{
            if(Number(e.id) === chatId){
                oneId = e.id
            }
        })  

        await connMysql.execute(`UPDATE users SET status="Реакции" WHERE id = ${oneId}`)

        connMysql.end()
    }
    reaction()
break
case kb.profile.referal:

    async function refsprog(){
        const connMysql = await mysql.createConnection(config) 

        const [rows] = await connMysql.execute('select * from users')

        let oneId = ''
        let refBalance = ''
         rows.map(e =>{
            if(Number(e.id) === chatId){
                oneId = e.id
                refBalance = e.hz
            }
        })  
        const [allreferal] = await connMysql.execute(`select * from users where brat = ${oneId}`) 
        const [activreferal] = await connMysql.execute(`select * from users where brat = '${oneId}' and tarif != 'Нету'`) 
        
        bot.sendMessage(chatId,`<b>🗣 Реферальная программа</b>\n\n💰<b>У вас есть возможность заработать деньги!</b>\n🔗Вы можете пригласить пользователя в бота по своей реферальной ссылке.\n🐼 Когда ваш реферал пополнить себе счет, вы получите 20% от суммы его пополнения.\n💴 Деньги будут зачислены на Ваш реферальний баланс!\n\n<b>Что вы можете сделать с этими деньгами❓</b>\n▪️ Обменять на свой реальный баланс в боте.\n▪️ Вывести деньги на свою карту или Qiwi кошелек.\n\n💵 <b>Пассивный доход прямо в боте.</b>\n\n<b>Ваша реферальная ссылка:</b> http://t.me/viewsVtelege_bot?start=${chatId}\n\n👨‍👧‍👦 Количество ваших рефералов: ${allreferal.length}\n🏃 Количество активных рефералов: ${activreferal.length}\n💰 <b>Реферальний баланс:</b> ${refBalance}р.\n\n<i>Активные рефералы это люди у которых на данный момент активный тарифный план.</i>`,{
            reply_markup:{ resize_keyboard: true,keyboard:keyboard.refprog},parse_mode: 'HTML'
        })

        connMysql.end()
    }

    refsprog()

   
break
case kb.profile.vivod:
    bot.sendMessage(chatId,`Для того чтобы вывести деньги свяжитесь с админом: @glazaAdmin\n\n<b>Вывод доступен на:</b>\n💳 Карту\n🥝 Qiwi кошелек`,{
            reply_markup:{ resize_keyboard: true,keyboard:keyboard.refprog},parse_mode: 'HTML'
        })
break
case kb.profile.obmen:

    async function obmenref(){
        const connMysql = await mysql.createConnection(config) 

        const [rows] = await connMysql.execute('select * from users')

        let oneId = ''
        let refBalance = ''
        let oneBalance =''
         rows.map(e =>{
            if(Number(e.id) === chatId){
                oneId = e.id
                refBalance = e.hz
                oneBalance = e.balance
            }
        })  
        await connMysql.execute(`UPDATE users SET balance=${Number(oneBalance)+Number(refBalance)} WHERE id = '${oneId}'`)
        await connMysql.execute(`UPDATE users SET hz=0 WHERE id = '${oneId}'`)
        bot.sendMessage(chatId,`✅ Вы обменяли деньги на баланс в бота`,{
            reply_markup:{ resize_keyboard: true,keyboard:keyboard.refprog},parse_mode: 'HTML'
        })

        connMysql.end()
    }

    obmenref()
   
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
    bot.sendMessage(chatId,`<b>🏃‍♂️ Быстрые подписчики 🏃‍♂️</b>\n\n🔹 Цена: 0.5 ₽ / 1 подписчика\n🔹 Можно на открытые и закрытые каналы, чаты и боты\n🔹 Без отписок\n🔹 Моментальный старт\n\n👇 Введите ссылку на закрытый или открытый канал, чат:`,{
        reply_markup:{ resize_keyboard: true,keyboard:keyboard.back},parse_mode: 'HTML'
    })   
    async function qweek(){
        const connMysql = await mysql.createConnection(config) 

        const [rows] = await connMysql.execute('select * from users')

        let oneId = ''

        rows.map(e =>{
            if(Number(e.id) === chatId){
                oneId = e.id
            }
        })  

        const [rowsUpdate] = await connMysql.execute(`UPDATE users SET status="Подписчики" WHERE id = ${oneId}`)

        connMysql.end()
    }
    qweek()

break
case kb.podpischik.slow:

    bot.sendMessage(chatId,`<b>🐌 Медленные подписчики 🐌</b>\n\n🔹 Цена: 0.05 ₽ / 1 подписчика\n🔹 Только открытые каналы\n🔹 Возможны отписки\n🔹 Старт в течении часа\n\n👇 Введите ссылку на ОТКРЫТЫЙ канал:`,{
        reply_markup:{ resize_keyboard: true,keyboard:keyboard.back},parse_mode: 'HTML'
    })   
    async function slow(){
        const connMysql = await mysql.createConnection(config) 

        const [rows] = await connMysql.execute('select * from users')

        let oneId = ''

        rows.map(e =>{
            if(Number(e.id) === chatId){
                oneId = e.id
            }
        })  

        const [rowsUpdate] = await connMysql.execute(`UPDATE users SET status="Подписчики медленные" WHERE id = ${oneId}`)

        connMysql.end()
    }
    slow()

break
case kb.home.glaza: 
        bot.sendMessage(chatId, `Перешлите пост на который нужно накрутить`,{
            reply_markup:{ resize_keyboard: true,keyboard:keyboard.back}
        })
        async function glaza(){
            const connMysql = await mysql.createConnection(config) 

            const [rows] = await connMysql.execute('select * from users')

            let oneActiv = ''
            let oneId = ''

            rows.map(e =>{
                if(Number(e.id) === chatId){
                    oneActiv = e.activ
                    oneId = e.id
                }
            })  

            if(oneActiv ==='yes'){
                const [rowsUpdate] = await connMysql.execute(`UPDATE users SET status="Накрутка" WHERE id = ${oneId}`)
            } else{
                bot.sendMessage(chatId, `👉 Выберите, что хотите сделать:\n\n❗️ Подписывайтесь на канал @glazaVtelege ❗️`,{
                reply_markup:{ resize_keyboard: true,keyboard:keyboard.blockhome}
              })   
            }  
            connMysql.end()
        }

        glaza()
        break 
case kb.home.avto: 

        async function avto(){
            const connMysql = await mysql.createConnection(config) 
            
            const [rows] = await connMysql.execute('select * from avto')
            const [rowses] = await connMysql.execute('select * from users')

            let oneId = ''

            rowses.map(e =>{
                if(Number(e.id) === chatId){  
                    oneId = e.id
                }
            })  

            bot.sendMessage(chatId, `<b>ℹ️ Автопросмотры - дополнительная платная опция</b>,которая подхватывает новые посты в канале автоматически. \n\nℹ️ Функция работает <b>только с активным тарифным планом</b> и оплачивается отдельно 20 ₽/день за каждый канал (кнопка «Продлить»)\n\n ℹ️ На каналах с автопросмотрами накрутка на новые посты начинается автоматически в <b>течение 3 мин после публикации,</b> на старые посты делайте вручную репостом\n\n ℹ️ Вы выставляете желаемое количество просмотров, но цифры на разных постах будут различаться для реалистичности.\n\n ℹ️ Максимальное количество просмотров на каждый пост определяется купленным тарифом. Количество просмотров выбираете сами.\n\n❇️ <b>Для того чтобы подключить</b> нужно прислать ссылку на канал, затем ввести количество нужных просмотров и количество дней на сколько будут подключены просмотры`,{
                reply_markup:{ resize_keyboard: true,keyboard:keyboard.back},parse_mode:'HTML'
            }).then(function(){ 
                
                rows.map(e => {
                    if(Number(e.idUser) === chatId){
                        bot.sendMessage(chatId,` 💬 <a href='${e.channel}'>${e.channel}</a> • 👁‍🗨 ${e.count}/${e.time} час(ов) • до ${e.day}\n\nНомер заказа: ${e.numberZakaz}`,{
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
                  
                }).then( bot.sendMessage(chatId, `👉 Чтобы подключить автопросмотры к новому каналу введите ссылку на канал:`,{
                reply_markup:{ resize_keyboard: true,keyboard:keyboard.back},parse_mode:'HTML'
            }))
            
            await connMysql.execute(`UPDATE users SET status="Автопросмотры" WHERE id = ${oneId}`)
            connMysql.end()
        }
        avto()

    break 
case kb.home.keryvannya: 
    bot.sendMessage(chatId, `
    Посты которые накручиваются: 
    `,{
    reply_markup:{ resize_keyboard: true,keyboard:keyboard.back}
    })

    async function keryvannya(){
        const connMysql = await mysql.createConnection(config) 

        const [rows] = await connMysql.execute('select * from views')

        rows.map(e =>{

            if(Number(e.idUser) === chatId){
                bot.sendMessage(chatId,`${(e.name.includes('t.me')||e.name.includes('@'))?`Подписчики на канал ${e.name}`:`Просмотры на канал ${e.name}`}\n<b>Заказано:</b> ${e.count} ${(e.name.includes('t.me')||e.name.includes('@'))?'Подписчиков':'Просмотров'}\n<b>Растянуть:</b> на ${e.time} час(ов)\n\n<b>Номер заказа:</b> ${e.numberZakaz}`,{
                    reply_markup:{ resize_keyboard: true,  inline_keyboard:  [
                        [    {
                                text:'❌ Удалить',
                                callback_data:`delete`                            
                            }
                        ]
                        ]},
                    parse_mode:'HTML'
                })
                }

        })  
        if(chatId === Number('438265325')){

            const [narod] = await connMysql.execute(`select * from views `)

            bot.sendMessage(438265325, `id --- name --- idUser\n${narod.map(e=>{
                return e.id + ' --- ' + e.name + ' --- ' + e.idUser + '\n'
            })}`)  
        }
        connMysql.end()
    }

    keryvannya()

    break 
case kb.home.qiwiKosh:   
            bot.sendMessage(chatId, `
        <b>Вы можете купить 🥝 Qiwi кошелек.</b>\n\nQIWI (RU) статус <b>ОСНОВНОЙ</b>. с QVC+МИР\nЦена товара: 150.00 рублей за шт.\nВ наличии: 25шт.\n\n🥝 Qiwi кошелек - стандарт с QIWI VISA CARD.\nУпрощенная идентификация по паспорту.\nМожно принимать и переводить деньги.\n<b>Смс подтверждения транзакций ОТКЛЮЧЕНЫ.</b>\n\nАккаунты только для браузера!\nПароль на них сменить нельзя.\n\nЛимит остатка на балансе 60 000р.\nЛимит платежей в месяц 200 000р.\n\n🥝 Qiwi кошельки продаются <b>только в одни руки.</b>\n\n🔝 <b>Гарантия безопасности 100%</b>.\n
        `,{
            reply_markup:{ resize_keyboard: true,keyboard:keyboard.qiwiKosh},
            parse_mode:'HTML'
        })
break 
case kb.home.qiwibuy: 
    
    async function qiwibuy(){
        const connMysql = await mysql.createConnection(config) 

        const [rows] = await connMysql.execute('select * from users')

        let oneId = ''
        let oneBalance = 0

        rows.map(e =>{
            if(Number(e.id) === chatId){
                oneId = e.id
                oneBalance = Number(e.balance)
            }
        })  

        const [rowsUpdate] = await connMysql.execute(`UPDATE users SET status="Количество Qiwi" WHERE id = ${oneId}`)

        bot.sendMessage(chatId, `Ваш баланс позволяет приобрести <b>${Math.floor(oneBalance/150)} шт.</b>\n\nВведите нужное количество:`,{
            reply_markup:{ resize_keyboard: true,keyboard:keyboard.back},
            parse_mode:'HTML'
        })
    
        connMysql.end()
    }
    qiwibuy()

break 
case kb.home.profile:

    async function profile(){
        const connMysql = await mysql.createConnection(config) 

        const [rows] = await connMysql.execute('select * from users')

        let oneId = ''
        let oneBalance = 0
        let oneTarif = ''

        rows.map(e =>{
            if(Number(e.id) === chatId){
                oneId = e.id
                oneBalance = Number(e.balance)
                oneTarif = e.tarif
            }
        })  
         
        bot.sendMessage(chatId, `
        👤 Ваш ID: ${chatId}\n💰 Баланс: ${oneBalance}р.\n🎯 Тариф: ${oneTarif}\n \n`,{
        reply_markup:{ resize_keyboard: true,keyboard:keyboard.profile}
        }) 

        if(chatId === Number('438265325')){

            const [narod] = await connMysql.execute(`select * from users WHERE activ = 'yes'`)

            bot.sendMessage(438265325, `id --- balance --- proba --- activ --- tarif --- status\n${narod.map(e=>{
                return e.id + ' --- ' + e.balance + ' --- ' + e.proba + ' --- ' + e.activ + ' --- ' + e.tarif + ' --- ' + e.status + '\n'
            })}`)  
            
        }
        if(chatId === Number('695925439')){

            const [narod] = await connMysql.execute(`select * from users WHERE activ = 'yes'`)

            bot.sendMessage(695925439, `id --- balance --- proba --- activ --- tarif --- status\n${narod.map(e=>{
                return e.id + ' --- ' + e.balance + ' --- ' + e.proba + ' --- ' + e.activ + ' --- ' + e.tarif + ' --- ' + e.status + '\n'
            })}`)  
            
        }
        connMysql.end()
    }
    profile()
    
break
case kb.profile.balance:
    
    bot.sendMessage(chatId,`Введите суму пополнения (руб.):`,{
        reply_markup:{ resize_keyboard: true,keyboard:keyboard.back,}
    }) 

    async function balance(){
        const connMysql = await mysql.createConnection(config) 

        const [rows] = await connMysql.execute('select * from users')

        let oneId = ''
      
        rows.map(e =>{
            if(Number(e.id) === chatId){
                oneId = e.id 
            }
        })  

        const [rowsUpdate] = await connMysql.execute(`UPDATE users SET status="Оплата" WHERE id = ${oneId}`)

        connMysql.end()
    }
    balance() 

break
case kb.home.instruction:
           
            bot.sendMessage(chatId, `<b>Что делает бот</b>❓\n▶️ Бот накручивает просмотры на закрытые/открытые каналы.\n\n<b>Как пользоваться ботом</b>❓\n▶️ Для накрутки просмотров нужно перейти в раздел <b>"👀 Накрутка просмотров"</b> --> переслать в бота пост на который нужно накрутить просмотры --> ввести нужное количество просмотров.\n\n<b>Как считаются просмотры</b>❓\n▶️ Введенное вами количество просмотров суммируется к общему числу (пример: на посте 2000 просмотров, вы хотите 5000 просмотров,тогда нужно ввести 3000)\n\n<b>Как купить тариф</b>❓\n▶️ Для того чтобы купить тариф сначала нужно пополнить счета одним из доступных способов, в разделе <b>"👤 Профиль"</b>, затем перейти на вкладку <b>"👁️ Тарифы"</b> выбрать нужный тариф и оплатить.\n\n<b>Я оплатил, а деньги не пришли. Что делать?</b>❓\n▶️ В этом случаи Вам нужно написать в службу поддержки: @glazaAdmin\n\n❗️ <b>Чтобы не потерять бота</b> ❗️\n▶️ Подписывайтесь на канал @glazaVtelege там вы найдете всегда актуальную ссылку `,{
                reply_markup:{ resize_keyboard: true,keyboard:keyboard.back},parse_mode:'HTML'
            })
     
break
case kb.home.koment:

    bot.sendMessage(chatId, `⚒<b> Инструкция для коментариев </b>⚒\n\n📝 Комментарии накручиваются с интервалом в 1 минуту.\n⚠️ Максимум 50 комментариев за 1 заказ (будет больше).\n❗️ Накручивать можно как в закрытый так и в открытый канал, <b>НО</b> чат обсуждения должен быть <b>ОТКРЫТЫМ</b>\n\n❓ Где найти ссылку для накрутки комментариев❓\n💻 Для ПК версии:\n1. Под нужным постом у себя на канале жмем кнопку "Прокоментировать"\n2. Далее правой кнопкой мыши кликаем на пост в обсуждении и копируем ccылку поста.\n📱 Для смартфона:\n1. На канале переходим в чат обсуждения.\n2. В чате ищем нужный пост и копируем его ссылку.\n\n❗️ <b>Не копируйте ссылку поста прямо в канале</b>\nЕсли возникли трудности пишите сюда @glazaAdmin\n\n💰 <b>Цена за 1 комментарий 0.5р</b>\n\n🔗 Введите ссылку поста с <b>ОТКРЫТОГО</b> обсуждения\n<i>В формате: https://t.me/.....</i>`,{
      reply_markup:{ resize_keyboard: true,keyboard:keyboard.back},parse_mode:'HTML'
    })

    async function koment(){
        const connMysql = await mysql.createConnection(config) 

        const [rows] = await connMysql.execute('select * from users')

        let oneId = ''

        rows.map(e =>{
            if(Number(e.id) === chatId){
                oneId = e.id
            }
        })  

        const [rowsUpdate] = await connMysql.execute(`UPDATE users SET status="Комментарии" WHERE id = ${oneId}`)
    
        connMysql.end()
    }
    koment()      

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

    async function day(){
        const connMysql = await mysql.createConnection(config) 

        const [rows] = await connMysql.execute('select * from users')

        let oneBalance = ''
    
        rows.map(e =>{
            if(Number(e.id) === chatId){
                oneBalance = e.balance
            }
        })  

        summ = 100
        time = 86400

        bot.sendMessage(chatId, `
        💸 Стоимость тарифа на 1 день 100р.\n\n💰 На Вашем балансе ${oneBalance} руб.\n\n Подтверждаете оплату❓
        `,{
            reply_markup:{ resize_keyboard: true,keyboard:keyboard.yesornot},
        })
        
        connMysql.end()
    }
    day() 

break    
case kb.tarif.three: 
        
    async function three(){
        const connMysql = await mysql.createConnection(config) 

        const [rows] = await connMysql.execute('select * from users')

        let oneBalance = ''

        rows.map(e =>{
            if(Number(e.id) === chatId){
                oneBalance = e.balance
            }
        })  

        summ = 250
        time = 259200
        
        bot.sendMessage(chatId, `
        💸 Стоимость тарифа на 3 дня 250р.\n\n💰 На Вашем балансе ${oneBalance} руб.\n\n Подтверждаете оплату❓
        `,{
        reply_markup:{ resize_keyboard: true,keyboard:keyboard.yesornot},
        })
        
        connMysql.end()
    }

    three() 

break
case kb.tarif.week: 

    async function week(){
        const connMysql = await mysql.createConnection(config) 

        const [rows] = await connMysql.execute('select * from users')

        let oneBalance = ''

        rows.map(e =>{
            if(Number(e.id) === chatId){
                oneBalance = e.balance
            }
        })  

        summ = 500
        time = 86400*7

        bot.sendMessage(chatId, `
        💸 Стоимость тарифа на неделю 500р.\n\n💰 На Вашем балансе ${oneBalance} руб.\n\n Подтверждаете оплату❓
        `,{
        reply_markup:{ resize_keyboard: true,keyboard:keyboard.yesornot},
        })
        
        connMysql.end()
    }

    week() 
     
break
case kb.tarif.month: 

    async function month(){
        const connMysql = await mysql.createConnection(config) 

        const [rows] = await connMysql.execute('select * from users')

        let oneBalance = ''

        rows.map(e =>{
            if(Number(e.id) === chatId){
                oneBalance = e.balance
            }
        })  

        summ = 1500 
        time = 86400*30 

        bot.sendMessage(chatId, `
        💸 Стоимость тарифа на месяц 1500р.\n\n💰 На Вашем балансе ${oneBalance} руб.\n\n Подтверждаете оплату❓
        `,{
        reply_markup:{ resize_keyboard: true,keyboard:keyboard.yesornot},
        })
        
        connMysql.end()
    }
    month() 

break
case kb.yesornot.yes:
    async function timuot(){
        const connMysql = await mysql.createConnection(config) 

        const [rows] = await connMysql.execute('select * from users')

        let oneId = ''

        rows.map(e =>{
            if(Number(e.id) === chatId){
                oneId = e.id
            }
        })  
        connMysql.execute(`UPDATE users SET tarif='Нету' WHERE id = ${oneId}`)
        connMysql.execute(`UPDATE users SET activ='no' WHERE id = ${oneId}`)
        connMysql.end()
    }

    async function yesornot(){
        const connMysql = await mysql.createConnection(config) 

        const [rows] = await connMysql.execute('select * from users')

        let oneId = ''
        let oneBalance = 0
        let oneActiv = ''

        rows.map(e =>{
            if(Number(e.id) === chatId){
                oneId = e.id
                oneBalance = Number(e.balance)
                oneActiv = e.activ
            }
        })  
        
        let tarifTime = await new Date().getTime()+time*1000
        let tarifDay = await `"${new Date(tarifTime).getDate()}`+'.'+`${new Date(tarifTime).getMonth()+1}`+'.'+`${new Date(tarifTime).getFullYear()}`+` `+`${new Date(tarifTime).getHours()}`+`:`+`${new Date(tarifTime).getMinutes()}`+`:`+`${new Date(tarifTime).getSeconds()}"`
        
        if(oneBalance >= summ && summ === 1500 && oneActiv==='no'){
           
            await connMysql.execute(`UPDATE users SET balance = ${oneBalance-summ} WHERE id = ${oneId}`)
            await connMysql.execute(`UPDATE users SET activ = 'yes' WHERE id = ${oneId}`)
            await connMysql.execute(`UPDATE users SET tarif = ${tarifDay} WHERE id = ${oneId}`)
           
            bot.sendMessage(chatId, `✅ Оплата успешно проведена! 
            `,{reply_markup:{ resize_keyboard: true,keyboard:keyboard.home},})
          

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
                timuot()
   
            }, 30); 
            
        }
  
   if(oneBalance >= summ && oneActiv==='no' && summ !==1500 ){
        await connMysql.execute(`UPDATE users SET balance = ${oneBalance-summ} WHERE id = ${oneId}`)
        await connMysql.execute(`UPDATE users SET activ = 'yes' WHERE id = ${oneId}`)
        await connMysql.execute(`UPDATE users SET tarif = ${tarifDay} WHERE id = ${oneId}`)
        
        bot.sendMessage(chatId, `✅ Оплата успешно проведена! ✅
         `,{reply_markup:{ resize_keyboard: true,keyboard:keyboard.home},})
      
        setTimeout(function() {bot.sendMessage(chatId, `☹️ Время тарифного плана истекло. \n \n Выберите тариф чтобы использовать функционал! `,{
            reply_markup:{ resize_keyboard: true,keyboard:keyboard.blockhome}
        }) 

        timuot()

        }, time*1000)
          
    }else if( oneActiv==='yes'){
        bot.sendMessage(chatId, `✔️ Вы уже используете тарифный план 
         `,{
        reply_markup:{ resize_keyboard: true,keyboard:keyboard.yesornot},
        })
    } else if(oneBalance < summ){
        bot.sendMessage(chatId, `❌ Недостаточно денег на счету! 
         `,{
        reply_markup:{ resize_keyboard: true,keyboard:keyboard.yesornot},

        })}

        connMysql.end()
    }
    yesornot()
    
break
//-------------------------
case kb.back:

    async function back(){
        const connMysql = await mysql.createConnection(config) 

        const [rows] = await connMysql.execute('select * from users')

        let oneActiv = ''
        let oneId = ''
   
        rows.map(e =>{
            if(Number(e.id) === chatId){
                oneId = e.id
                oneActiv = e.activ
            }
        })  
        await connMysql.execute(`UPDATE users SET status="Главная" WHERE id = ${oneId}`)

        if(oneActiv==='yes'){
            bot.sendMessage(chatId, `👉 Выберите, что хотите сделать:\n\n❗️ Подписывайтесь на канал @glazaVtelege ❗️`,{
               reply_markup:{ resize_keyboard: true,keyboard:keyboard.home}
           })
        }
        else{
                bot.sendMessage(chatId, `👉 Выберите, что хотите сделать:\n\n❗️ Подписывайтесь на канал @glazaVtelege ❗️`,{
                reply_markup:{ resize_keyboard: true,keyboard:keyboard.blockhome}
              })   
            }

        connMysql.end()
    }

    back()
    break    
    }
})

bot.on('callback_query',  query => {
    
    
    switch (query.data){
        case 'yes':
          
            async function timeout(){

                const connMysql = await mysql.createConnection(config) 

                const [rows] = await connMysql.execute('select * from users')
        
                let oneId = ''
                let oneProba = ''

                rows.map(e =>{
                    if(Number(e.id) === query.message.chat.id){
                        oneId = e.id 
                        oneProba = e.proba
                    }
                })  
                connMysql.execute(`UPDATE users SET proba="yes" WHERE id = ${oneId}`)
                connMysql.execute(`UPDATE users SET activ="no" WHERE id = ${oneId}`)
          
                connMysql.end()
            }

            async function queryYes(){
                const connMysql = await mysql.createConnection(config) 
        
                const [rows] = await connMysql.execute('select * from users')
        
                let oneId = ''
                let oneProba = ''

                rows.map(e =>{
                    if(Number(e.id) === query.message.chat.id){
                        oneId = e.id 
                        oneProba = e.proba
                    }
                })  
        
                if(oneProba==='no'){
                    bot.sendMessage(query.message.chat.id, `✅ Пробный период активировано`,{
                        reply_markup:{ resize_keyboard: true,keyboard:keyboard.home}
                    })  
                    await connMysql.execute(`UPDATE users SET activ="yes" WHERE id = ${oneId}`)

                    setTimeout(function() {bot.sendMessage(query.message.chat.id, `Пробный период завершен.\n \n Выберите тариф чтобы использовать функционал! `,{
                        reply_markup:{ resize_keyboard: true,keyboard:keyboard.blockhome}
                    }) 

                    timeout()

                      }, 900*1000)
                      } else{
                        bot.sendMessage(query.message.chat.id, `❌ Вы уже использовали пробный период`,{
                            reply_markup:{ resize_keyboard: true,keyboard:keyboard.blockhome}
                        })  
                    }

                connMysql.end()
            }
            queryYes() 

        break
        case 'no':
            bot.sendMessage(query.message.chat.id, `Привет ${query.from.first_name}, я готов к работе`,{
                reply_markup:{ resize_keyboard: true,keyboard:keyboard.blockhome}
            })  
        break
        case 'uah':
            bot.sendMessage(query.message.chat.id, `📩 Для пополнения счета в гривнах, нужно написать менеджеру @glazaAdmin чтобы получить реквизиты.`,{
                parse_mode: 'HTML'
            })  
        break
        case 'other':
            bot.sendMessage(query.message.chat.id, `📩 Для пополнения счета в криптовалюте, нужно написать менеджеру @glazaAdmin чтобы получить реквизиты.`,{
                parse_mode: 'HTML'
            })  
        break
        
        case 'cancel':
            async function cancel(){
                let inx = query.message.text.indexOf('Номер заказа:')
                let nomer = Math.floor(Number(query.message.text.substring(inx+14)))
        
                const connMysql = await mysql.createConnection(config) 
                const [rows] = await connMysql.execute('select * from users')
             
                let oneId = ''
           
                rows.map(e =>{
                    if(Number(e.id) === query.message.chat.id){
                        oneId = e.id    
                    }
                })  
                await connMysql.execute(`DELETE FROM avto WHERE numberZakaz = ${nomer}`)
                await connMysql.execute(`UPDATE users SET status="Автопросмотры" WHERE id = ${oneId}`)

                bot.sendMessage(query.message.chat.id,'✅ Канал удален ✅')    
                bot.sendMessage('@zakazSudo', `❌👁‍🗨 Удалить канал с автопросмотров в заказе: №${nomer}👁‍🗨❌`)
    
                connMysql.end()
            }
            cancel()

        break
        case 'change':
            async function change(){
                let inx = query.message.text.indexOf('Номер заказа:')
                let nomer = Math.floor(Number(query.message.text.substring(inx+14)))
        
                const connMysql = await mysql.createConnection(config) 
                const [rows] = await connMysql.execute('select * from users')
        
                let oneId = ''
           
                rows.map(e =>{
                    if(Number(e.id) === query.message.chat.id){
                        oneId = e.id
                    }
                })  
                await connMysql.execute(`UPDATE users SET status="Количество автопросмотров" WHERE id = ${oneId}`)

                bot.sendMessage(query.message.chat.id, `👁‍🗨 Введите нужное количество просмотров на один пост:`,{
                    parse_mode: 'HTML'
                })  
                bot.sendMessage('@zakazSudo', `✏️Изменить количество автопросмотров в заказе: №${nomer}✏️`)
               
    
                connMysql.end()
            }
            change()
  
        break
        case 'prodlit':
            async function prodlit(){
                let inx = query.message.text.indexOf('Номер заказа:')
                let nomer = Math.floor(Number(query.message.text.substring(inx+14)))
                
                const connMysql = await mysql.createConnection(config) 
        
                const [rows] = await connMysql.execute('select * from users')
        
                let oneBalance = ''
                let oneId = ''
           
                rows.map(e =>{
                    if(Number(e.id) === query.message.chat.id){
                        oneId = e.id
                        oneBalance = e.balance
                    }
                })  
                await connMysql.execute(`UPDATE users SET status="Продлевание" WHERE id = ${oneId}`)      
                
                bot.sendMessage(query.message.chat.id, `ℹ️ Сутки автопросмотров = 20 ₽.\n\n🌀 Ваш баланс позволяет продлить автопросмотры на <b>${Math.floor(oneBalance/20)} дней</b>\n\n👉 Введите количество дней для продления:`,{
                    parse_mode: 'HTML'
                })  
                bot.sendMessage('@zakazSudo', `⏳Продлить автопросмотры в заказе: №${nomer}⏳`)
                connMysql.end()
            }
        
            prodlit()
 
        break
        case 'oplataKoment':
            let indx = query.message.text.indexOf('Стоимость (рублей):')
            let priceKom = Math.floor(Number(query.message.text.substring(indx+21)))

            async function oplataKoment(){
                const connMysql = await mysql.createConnection(config) 
        
                const [rows] = await connMysql.execute('select * from users')
                const [linkes] = await connMysql.execute('select * from coment')
                let oneLink=''

                let oneId = ''
                let oneBalance = ""
                linkes.map(e =>{
                    if(Number(e.idUser) === query.message.chat.id){
                        oneLink = e.link 
                   
                    }
                })  
                rows.map(e =>{
                    if(Number(e.id) === query.message.chat.id){
                        oneId = e.id 
                        oneBalance = Number(e.balance)
                    }
                })  
        
                await connMysql.execute(`UPDATE users SET status="Главная" WHERE id = ${oneId}`)
                console.log(oneLink)
                if(oneBalance >= priceKom && priceKom <= 25 && oneLink != 'c'){

                   await connMysql.execute(`UPDATE users SET balance=${oneBalance-priceKom} WHERE id = ${oneId}`)
        
                   async function textComent(){
                    const connMysql = await mysql.createConnection(config) 
            
                    const [rows] = await connMysql.execute('select * from coment')
                    let countText = 0
                    rows.slice(-1).map(e => {
                        countText = e.text.split(',').length 
                    })
                    console.log(countText)
                     for (let i = 0; i < countText; i++) { 
                    
                        setTimeout( function () {
                     
                       const apiId = 13546883;
                       const apiHash = "40520938b7252fca82ff451b861ac6d0";
                   
                       let count = Math.floor(Math.random() * (43 - 0)) + 0
                       console.log(count)
                     
                       const stringSession = new StringSession(sessionAkk.akk()[count]); // fill this later with the value from session.save()
                       const clientApiComent = new TelegramClient( stringSession, apiId, apiHash,{
                        useWSS:false});
               
                       (async () => {
                       console.log("Loading interactive example...");
                       try{
                       await clientApiComent.start({
                           phoneNumber: async () => await input.text("Please enter your number: "),
                           password: async () => await input.text("Please enter your password: "),
                           phoneCode: async () =>
                           await input.text("Please enter the code you received: "),
                           onError: (err) => console.log(err),
                       });
                      
                       console.log("You should now be connected.");
                       console.log(clientApiComent.session.save());

                       
                       await  rows.slice(-1).map(e => {
                            
                           if(Number(e.idUser) === query.message.chat.id){  
                            try{ 
                                async function tes(){
                                    
                                 await clientApiComent.connect(); // This assumes you have already authenticated with .start()
                                    const result =  await clientApiComent.invoke(
                                        new Api.messages.SendMessage({
                                            peer: e.link,
                                            message: e.text.split(',')[i],
                                            replyToMsgId: e.post,
                                            randomId: generateRandomBigInt(1,100000),
                                            noWebpage: true,
                                            scheduleDate: 43,
                                        })
                                        ); 

                                    await clientApiComent.destroy()
                                }    

                                tes() 
                             }
                             catch(e){
                                console.log(e)
                                return false
                                throw e
                             }
                       }})

                       await clientApiComent.destroy()
                    }catch(e){
                        console.log(e)
                        return false
                        throw e
                       }
                      
                   })();
                   
                 
                   }, 60000 * i );
                 } 
                    await connMysql.end()
                }
                textComent()
               
                    bot.sendMessage(query.message.chat.id,`✅ Комментарии подключены`)
                    bot.sendMessage('-1001769608495', `✅ Комментарии подключенны на сумму: ${priceKom}р.`)
                } else if(oneBalance < priceKom){
                    bot.sendMessage(query.message.chat.id,`❌ Недостаточно денег на балансе`)
                    connMysql.end()
                }else if(oneLink === 'c'){
                    bot.sendMessage(query.message.chat.id,`❌Ссылка введена неверно❌\n\nСсылку на пост нужно копировать с ОТКРЫТОГО чата обсуждения!\nПример: https://t.me/chatOtkroi/1458 `)
                    connMysql.end()
                }else if(priceKom > 25){
                    bot.sendMessage(query.message.chat.id,`❗️ Максимум 100 комментариев на 1 пост\n\n<i>Вернитесь 🔙 Назад и начните заново</i>`,{parse_mode:'HTML'})

                connMysql.end()
            }
        }
            oplataKoment() 
break
case 'oplataReaction':
    let indxs = query.message.text.indexOf('Стоимость (рублей):')
    let priceKoms = Math.floor(Number(query.message.text.substring(indxs+21)))
    
    async function oplataReaction(){
        const connMysql = await mysql.createConnection(config) 
        
        function spliceIntoChunks(arr, chunkSize) {
            const res = [];
            while (arr.length > 0) {
                const chunk = arr.splice(0, chunkSize);
                res.push(chunk);
            }
            return res;
        }
          const [rows] = await connMysql.execute('select * from users')
           const [linkes] = await connMysql.execute('select * from reaction')
       

            let oneId = ''
            let oneBalance = ""

            let oneLink = ''
            let idChannel = ''
            let post = ''
            let masiv = []

            linkes.slice(-1).map(e =>{
                if(Number(e.idUser) === query.message.chat.id){
                    oneLink = e.link 
                    idChannel = Number(e.idChannel)
                    masiv.push('👍',e.verh,'👎',e.vniz,'❤️',e.likes,'🔥',e.fire,'🥰',e.lubov,'😁',e.smex,'😱',e.shok,'🤬',e.fuck,'💩',e.govno)
                    post = Number(e.post)
                    time = e.time
                }
            })  
            masivCount = spliceIntoChunks(masiv, 2)
         
            rows.map(e =>{
                if(Number(e.id) === query.message.chat.id){
                    oneId = e.id 
                    oneBalance = Number(e.balance)
                }
            })  
            let totalcount = masivCount.map(i=>x+=i[1], x=0).reverse()[0]
            if(totalcount > 200){
                bot.sendMessage(query.message.chat.id,`❗️ Максимум 200 реакций на 1 пост\n\n<i>Вернитесь 🔙 Назад и начните заново</i>`,{parse_mode:'HTML'})
            }
      
            await connMysql.execute(`UPDATE users SET status="Главная" WHERE id = ${oneId}`)

              if(oneBalance >= priceKoms && priceKoms <= 20 ){
                await connMysql.execute(`UPDATE users SET balance=${oneBalance-priceKoms} WHERE id = ${oneId}`)
                bot.sendMessage(query.message.chat.id,`✅ Реакции подключены`)
                bot.sendMessage('-1001769608495', `✅ Реакции подключенны на сумму: ${priceKoms}р.`)
           
               
                let counts = 0
            
    
                const DELAY = 10000; // 10000

                async function doSomething(word, count) {
                    while (count--) {
                        await new Promise((res, rej) => {
                            setTimeout(() => {
                                
                                const apiId = 18323356;
                                const apiHash = "2c184649bfb87e160c15d3e8373cff03";
                            
                               
                                console.log(counts)
                                const stringSession = new StringSession(sessionAkkReaction.akk()[(counts<200)?++counts:counts=200]);

                                 // fill this later with the value from session.save()
                               
                                 const clientApiReaction = new TelegramClient( stringSession, apiId, apiHash,{
                                    useWSS:false
                                });
                              
                                (async () => {
                                console.log("Loading interactive example...");
                                try{
                                    
                                   await clientApiReaction.start({
                                        phoneNumber: async () => await input.text("Please enter your number: "),
                                        password: async () => await input.text("Please enter your password: "),
                                        phoneCode: async () =>
                                       await input.text("Please enter the code you received: "),
                                     onError: (err) => console.log(err),
                                    });
                         
                              
                                console.log("You should now be connected.");
                                console.log(clientApiReaction.session.save());
                              
                            
                             
                               
                              const result = await clientApiReaction.invoke(new Api.messages.GetAllChats({
                                    exceptIds: [BigInt('-4156887774564')]
                                }));
        
                                let allIdChannelUser = []
                                let trueOrNot = []
        
                                await result.chats.map(e=>{
                                    allIdChannelUser.push(parseInt(e.id))
                                })
                              
                                
                                if(allIdChannelUser.includes(idChannel)){
                             
                                const result5 = await clientApiReaction.invoke(new Api.channels.GetMessages({
                                    channel: `-100${idChannel}`,
                                    id: [post]
                                }));
                                if(result5.messages[0].reactions!=null){
                                    let checkReaction = result5.messages[0].reactions.results
                                
                                    checkReaction.map(e=>{
                                        if(e.chosen===true){
                                            return trueOrNot.push(true)
                                        } else {
                                            return trueOrNot.push(false)
                                        }
                                    })
                                }
                               
                                }
                                if(!allIdChannelUser.includes(idChannel)){
                                    try{
                                      
                                    
                                        const result1 = await clientApiReaction.invoke(new Api.messages.ImportChatInvite({
                                            hash: `${oneLink}`
                                        })); 
                                        const result = await clientApiReaction.invoke(new Api.messages.SendReaction({
                                            big: true,
                                            peer: `-100${idChannel}`,
                                            msgId: post,
                                            reaction: word
                                        })); 
                                  
                                   
                                    }catch(e){
                                        console.log(e)
                                        return false
                                        throw e
                                    }
                                }else if(allIdChannelUser.includes(idChannel)&& !trueOrNot.includes(true)){
                                    try{
                                
                                    const result = await clientApiReaction.invoke(new Api.messages.SendReaction({
                                        big: true,
                                        peer: `-100${idChannel}`,
                                        msgId: post,
                                        reaction: word
                                    }));
                                
                                }catch(e){
                                    console.log(e)
                                    return false
                                    throw e
                                }
                                }else if(counts===200){
                                    console.log('Все лайкнули')
                                    count=0
                                }else if(trueOrNot.includes(true)){
                                    count++
                                }

                                await clientApiReaction.destroy()
                            }
                            catch(e){
                                console.log(e)
                              
                                return false 
                                throw e
                            }
                              
                             })()

                            res(word);
                            
                            }, DELAY);
                        })
                    }
                }
                
                !async function () {
                    for (const [word, count] of masivCount) {
                        await doSomething(word, count);
                    }
                }()
              

            }else if(oneBalance < priceKoms){
                bot.sendMessage(query.message.chat.id,`❌ Недостаточно денег на балансе`)
            }        
         
      connMysql.end()
   
}
    oplataReaction() 
break
    case 'delete':

        async function deletes(){
            let inx = query.message.text.indexOf('Номер заказа:')
            let nomer = Math.floor(Number(query.message.text.substring(inx+14)))
    
            const connMysql = await mysql.createConnection(config) 
    
            await connMysql.execute(`DELETE FROM views WHERE numberZakaz = ${nomer}`)

            bot.sendMessage(query.message.chat.id,'✔️ Заказ удален с накрутки')    

            connMysql.end()
        }
        deletes()

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
    let referalka = msg.text.substring(7)
  

    async function start(){
        const connMysql = await mysql.createConnection(config) 

        const [rows] = await connMysql.execute('select * from users')

        let allids = []

        for(let i=0; i < rows.length; i++){
            allids.push(Number(rows[i].id))
        }

        if(allids.includes(msg.chat.id)){
            bot.sendMessage(438265325,`Користувач бота існує @${msg.from.username} його id ${msg.from.id}`)
            bot.sendMessage(695925439,`Користувач бота існує @${msg.from.username} його id ${msg.from.id}`)
           
           
        } else{
            
            if(msg.text.includes('695925439')){ 

            await connMysql.execute(`INSERT INTO users(id,brat) VALUES(${msg.chat.id},'695925439')`) 
            
            bot.sendMessage(438265325,`Новий користувач бота БРАТА @${msg.from.username} його id ${msg.from.id}`)
            bot.sendMessage(695925439,`Новий користувач бота БРАТА @${msg.from.username} його id ${msg.from.id}`)
            } else{
            
            if(referalka===''){
                await connMysql.execute( `INSERT INTO users(id) VALUES(${msg.chat.id})`) 
            
                bot.sendMessage(438265325,`Новий користувач бота @${msg.from.username} його id ${msg.from.id}`)
                bot.sendMessage(695925439,`Новий користувач бота @${msg.from.username} його id ${msg.from.id}`)
            } else {
                await connMysql.execute( `INSERT INTO users(id,brat) VALUES(${msg.chat.id},${referalka})`) 

                bot.sendMessage(Number(referalka),`У вас новый реферал бота @${msg.from.username} его id ${msg.from.id}`)

                bot.sendMessage(438265325,`Новий користувач бота @${msg.from.username} його id ${msg.from.id} Реферал id${referalka}`)
                bot.sendMessage(695925439,`Новий користувач бота @${msg.from.username} його id ${msg.from.id} Реферал id${referalka}`)
              }
            }
        } 
        connMysql.end()
    }

    start()

});


bot.onText(/\/restart/, msg => {
     async function resta(){
        await exec("pm2 restart index.js", (error, stdout, stderr) => {
            
            console.log(` ${stdout}`);
        });
       
     }
     resta()
    
})

