module.exports = async(bot, presence) =>{
  const Discord = require("@kamkam1_0/discord.js")
  
  let vraitestdate = Date.now()
  
  setInterval(() => bot.setPresence(presence), 1000 * 60 * 30)
  
  console.log("Bot Online !")

  if(bot.sql) bot.sql.query(`SELECT * FROM general`, function(err, guilds){
    bot.guilds.map(guild => guild.id).filter(guild => !guilds.find(g2 => g2.ID === guild)).forEach(g => {
      bot.sql.query(`INSERT INTO general (ID, Language, guild_state) VALUES ('${g}', '${bot.default_language}', 'enable')`)
    })
  })
  
  let User = bot.users.find(us => us.id === bot.config.general["ID createur"])
  if(User){
    let renduembed = new Discord.Embed()
    .setTitle("Démarrage du bot")
    .setFooterText(`${User.username}#${User.discriminator}`)
    .setFooterIconURL(User.avatarURL)
    .setTimestamp()
    .setThumbnail(bot.user.avatarURL)
    .addFields(
      {name: "Durée du lancement", value: `${require("@kamkam1_0/ms")(Number(Date.now() - bot.discordjs.lancement))}`, inline: true},
      {name: "Durée des checks bot", value: `${require("@kamkam1_0/ms")(Number(Date.now() - vraitestdate))}`, inline: true},
      {name: "Mise en route", value: "Complète ✅", inline: true}
    )
    .setColor("#0eff27")
    bot.SendMessage(bot.creator.channel_id, {embeds: [renduembed]})
    .catch(err => console.log(err))
  }
} 

module.exports.langues = require("../Utils/getLangues")()