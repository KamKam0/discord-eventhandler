module.exports = async(bot, presence, Langue) =>{
  const Discord = require("@kamkam1_0/discord.js")
  
  let vraitestdate = Date.now()
  
  setInterval(() => bot.setPresence(presence), 1000 * 60 * 30)
  
  console.log(Langue["online"])
  
  let User = bot.users.find(us => us.id === bot.config.general["ID createur"])
  if(User){
    let renduembed = new Discord.Embed()
    .setTitle(Langue["demarrage"])
    .setFooterText(`${User.username}#${User.discriminator}`)
    .setFooterIconURL(User.avatarURL)
    .setTimestamp()
    .setThumbnail(bot.user.avatarURL)
    .addFields(
      {name: Langue["lancement"], value: `${require("@kamkam1_0/ms")(Number(Date.now() - bot.ws.discordSide.lancement))}`, inline: true},
      {name: Langue["checks"], value: `${require("@kamkam1_0/ms")(Number(Date.now() - vraitestdate))}`, inline: true},
      {name: Langue["launch"], value: Langue["complete"]+" ✅", inline: true}
    )
    .setColor("#0eff27")
    bot.messages.send(bot.creator.channel_id, {embeds: [renduembed]})
    .catch(err => console.log(err))
  }
} 

module.exports.langues = require("../utils/getLangues")()