module.exports = async (bot, guild, langue) =>{
    let logChannel = bot.channels.get(bot.config.general.logChannel)
    if (!logChannel) return

    let logEmbed = new Discord.Embed()
    .setTitle(langue["oldserv"])
    .addFields(
        {name: langue["date"], value: `${new Date(Date.now()).toUTCString()}`, inline: true},
        {name: langue["personnes"], value: `${guild.members.length}`, inline: true},
        {name: langue["serveurs"], value: `${bot.guilds.length}`, inline: true}
    )
    .setColor("RED")

    logChannel.send(logEmbed).catch(err => {})
}

module.exports.langues = true