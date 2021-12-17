module.exports = {
    logStart(){
        console.log('bot has been')
    },
    getChatId(msg) {
        return msg.chat.id
    }
}