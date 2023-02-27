module.exports = async (bot, message, Langue) =>{
    if(message.user && message.user.bot) return
    //////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////Mention//////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////
    if(message.content && typeof message.content === "string") if(message.content.startsWith(`<@!${bot.user.id}>`) || message.content.startsWith(`<@${bot.user.id}>`)){
            
        if(message.content.trim() === `<@!${bot.user.id}>` || message.content.trim() === `<@${bot.user.id}>`){
            if(!bot.cooldown.GetCooldown("mention").GetUser(message.user_id)){
                
                if(message.user.id !== bot.config.general["ID createur"]) bot.cooldown.GetCooldown("mention").AddUser({id: message.user.id, time: 10, date: Date.now()})
                
                message.reply({content: Langue["msg1"]})
            }
                    
        }else bot.handler.Analyse(bot, message)
                
    }
}