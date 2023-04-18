module.exports = async (bot, guild, langue) =>{
  const Discord = require("@kamkam1_0/discord.js")
  let logembed = new Discord.Embed()
  .setTitle(langue["newserv"])
  .addFields(
      {name: langue["date"], value: `${new Date(Date.now()).toUTCString()}`, inline: true},
      {name: langue["personnes"], value: `${guild.members.length}`, inline: true},
      {name: langue["serveurs"], value: `${bot.guilds.length}`, inline: true}
  )
  .setColor("RED")
  bot.channels.get(bot.config.general["logcha"]).send({embeds: [logembed]}).catch(err => {})

  let sendChannel = guild.channels.find(ch => ch.type === "GuildText")

  let embed = new Discord.Embed()
  .setTitle(langue["Hello everyone !"])
  .addFields(
    {name: langue["gc_1"], value: `${langue["gc_5"]} [${langue["gc_6"]}](${bot.config.general["inviteDiscord"]}) !`, inline: true},
    {name: langue["gc_2"], value: `${langue["gc_7"]} [${langue["gc_8"]}](https://discord.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=414464658432&scope=applications.commands%20bot) ${langue["gc_9"]} !`, inline: true},
    {name: langue["gc_3"], value: langue["gc_10"], inline: true},
    {name: langue["gc_4"], value: langue["gc_11"]}
  )
  .setThumbnail(bot.user.avatarURL)
  .setColor("#24bb2d")
  
  if(sendChannel) sendChannel.send({embeds: [embed]}).catch(err =>{ })
}

module.exports.langues = require("../utils/getLangues")()