module.exports = async(bot) =>{
  const Discord = require("@kamkam1_0/discord.js")
  
  let vraitestdate = Date.now()

  if(bot.config.general["presence_channel"] && bot.channels.get(bot.config.general["presence_channel"])){
    setInterval(() => {
      bot.SendMessage(bot.config.general["presence_channel"], {content: "<@867402024097939476> message connexion #A001"})
    }, 5000)
  }
  
  setInterval(() => bot.SetPresence({status: "online", activities: [{type: "watching", name: "/help"}]}), 2 * 1000 * 60 * 60)
  
  console.log("Bot Online !")

  if(bot.sql) bot.sql.query(`SELECT * FROM general`, function(err, guilds){
    bot.guilds.map(guild => guild.vguild_id).filter(guild => !guilds.find(g2 => g2.ID === guild)).forEach(g => {
      bot.sql.query(`INSERT INTO general (ID, Language, guild_state) VALUES ('${g}', '${bot.default_language}', 'enable')`)
    })
  })
  
  let User = bot.users.find(us => us.id === bot.config.general["ID créateur"])
  if(User){
    let renduembed = new Discord.Embed()
    .setTitle("Démarrage du bot")
    .setFooterText(`${User.username}#${User.discriminator}`)
    .setFooterIconURL(User.avatarURL)
    .setTimestamp()
    .setThumbnail(bot.user.avatarURL)
    .addFields([
      {name: "Durée du lancement", value: `${bot.ms(Number(Date.now() - bot.discordjs.lancement))} ms`, inline: true},
      {name: "Durée des checks bot", value: `${bot.ms(Number(Date.now() - vraitestdate))} ms`, inline: true},
      {name: "Mise en route", value: "Complète ✅", inline: true}
    ])
    .setColor("#0eff27")
    bot.SendMessage(bot.creator.channel_id, {embeds: [renduembed]})
    .catch(err => console.log(err))
  }
}