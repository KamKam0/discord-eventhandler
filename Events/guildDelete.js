module.exports = async (bot, guild) =>{
    if(!bot.sql) return
    bot.sql.query(`UPDATE general SET guild_state = 'disable' WHERE ID = '${guild.vguild_id}'`)
    const Discord = require("Discord.js")
    let logembed = new Discord.Embed()
    .setTitle("Ancien Serveur")
    .addFields([
        {name: "Date", value: `${new Date(Date.now()).toUTCString()}`, inline: true},
        {name: "Nombre de personnes", value: `${guild.members.length}`, inline: true},
        {name: "Nombre de serveur", value: `${bot.guilds.length}`, inline: true}
    ])
    .setColor("RED")
    bot.channels.get(bot.config["Général"]["logcha"]).send({embeds: [logembed]}).catch(err => {})
}