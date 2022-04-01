
module.exports = {
    logStart(){
        console.log('node index.js')
        
    },
    getChatId(msg) {
        return msg.chat.id
    }
   
}