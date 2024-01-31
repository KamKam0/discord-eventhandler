module.exports = async (bot, message) =>{
    if(message.user && message.user.bot) return
    
    if(message.content && typeof message.content === "string") if(message.content.startsWith(`<@!${bot.user.id}>`) || message.content.startsWith(`<@${bot.user.id}>`)){
            
        if(message.content.trim() === `<@!${bot.user.id}>` || message.content.trim() === `<@${bot.user.id}>`) message.content = message.content.trim() + " help"

        bot.handler.analyse(bot, message)
    }
}