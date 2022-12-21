module.exports = async (bot, guild) =>{
  const Discord = require("@kamkam1_0/discord.js")
  //////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////Add Base/////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////
  if(!bot.sql) return
  bot.sql.query(`SELECT * FROM general WHERE ID = '${guild.vguild_id}'`, async function(err, result){
    if(!result[0]){
      let logembed = new Discord.Embed()
      .setTitle("Nouveau Serveur")
      .addFields([
        {name: "Date", value: `${new Date(Date.now()).toUTCString()}`, inline: true},
        {name: "Nombre de personnes", value: `${guild.members.length}`, inline: true},
        {name: "Nombre de serveur", value: `${bot.guilds.length}`, inline: true}
      ])
      .setColor('GREEN')
      bot.channels.get(bot.config.general["logcha"]).send({embeds: [logembed]}).catch(err => {})
        const bdd = bot.config
        let embed = new Discord.Embed()
        .setTitle(Langue["Hello everyone !"])
        .addFields([
          {name: Langue["gc_1"], value: `${Langue["gc_5"]} [${Langue["gc_6"]}](${bdd["Général"]["inviteDiscord"]}) !`, inline: true},
          {name: Langue["gc_2"], value: `${Langue["gc_7"]} [${Langue["gc_8"]}](https://discord.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=414464658432&scope=applications.commands%20bot) ${Langue["gc_9"]} !`, inline: true},
          {name: Langue["gc_3"], value: Langue["gc_10"], inline: true},
          {name: Langue["gc_4"], value: Langue["gc_11"]}
        ])
        .setThumbnail(bot.user.avatarURL)
        .setColor("#24bb2d")
        
        let channel = guild.channels.find(ch => ch.type === "GUILD_TEXT")
        if(channel) channel.send({embeds: [embed]}).catch(err =>{ })
        bot.sql.query(`INSERT INTO general (ID, Language, guild_state) VALUES ('${guild.vguild_id}', '${bot.default_language}', 'enable')`)
    }else{
      bot.sql.query(`UPDATE general SET guild_state = 'enable' WHERE ID = '${guild.vguild_id}'`)
        let embed = new Discord.Embed()
        .setTitle(Langue["Hello everyone !"])
        .setDescription(Langue["gui_cre_2"])
        .setThumbnail(bot.user.avatarURL)
        .setColor("#24bb2d")
          
        let channel = guild.channels.find(ch => ch.type === "GUILD_TEXT")
        if(channel) channel.send({embeds: [embed]}).catch(err =>{ })
    }
  })
}

module.exports.langues = require("../Utils/getLangues")()