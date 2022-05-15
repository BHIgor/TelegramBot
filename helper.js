

module.exports = {
    logStart(){
        console.log('bot has been')    
    },  
    stop(){
        console.log('bot has beensaddassad')    
    },
    getChatId(msg) {
        return msg.chat.id
    }
   
}