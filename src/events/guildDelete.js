module.exports = async (bot, guild, langue) =>{
    const Discord = require("@kamkam1_0/discord.js")
    let logembed = new Discord.Embed()
    .setTitle(langue["oldserv"])
    .addFields(
        {name: langue["date"], value: `${new Date(Date.now()).toUTCString()}`, inline: true},
        {name: langue["personnes"], value: `${guild.members.length}`, inline: true},
        {name: langue["serveurs"], value: `${bot.guilds.length}`, inline: true}
    )
    .setColor("RED")
    bot.channels.get(bot.config.general["logcha"]).send({embeds: [logembed]}).catch(err => {})
}

module.exports.langues = true