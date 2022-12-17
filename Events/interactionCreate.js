module.exports = async (bot, interaction, Langue) => {
  if(interaction.isSlash) bot.handler.Analyse(bot, interaction, Langue)
  if(interaction.isButton){


    if(interaction.custom_id === "kill"){
      bot.DeleteMessage(interaction.channel_id, interaction.message.id).catch(err => {})
      if(interaction.user.id === bot.config.general["ID créateur"] && (Date.now() - Date.parse(new Date(interaction.message.timestamp).toUTCString())) < 15000){
        interaction.info("Le bot s'éteint !", "send").then(() => process.exit()).catch(err => {})
      }else interaction.info("Le bot ne s'éteindra pas !", "send").catch(err => {})
    }


    if(interaction.custom_id === "not_kill"){
      bot.DeleteMessage(interaction.channel_id, interaction.message.id).catch(err => {})
      interaction.info("Le bot ne s'éteindra pas !", "send").catch(err => {})
    }


    if(interaction.custom_id === "Response_ticket_button"){
      const Discord = require("@kamkam1_0/discord.js")
      const TextInput = new Discord.TextInput()
      .setCustomID("Feedback_answer_content")
      .setLabel("Contenu de votre réponse au feedback")
      .setMaxLength(1500)
      .setMinLength(20)
      .setPlaceHolder("Mettez ici le contenu de votre réponse au feedback")
      .setRequired(true)
      .setStyle("long")

      const Modal = new Discord.Form()
      .setCustomID("Modal Feedback Answer")
      .setTitle("Feedback")
      .AddTextInputs([TextInput])

      let replacemente = new Discord.Embed()
        .setTitle(interaction.message.embeds[0].title)
        .setThumbnail(interaction.message.embeds[0].thumbnail.url)
        .setFooterText(interaction.message.embeds[0].footer.text)
        .setColor(interaction.message.embeds[0].color)
        .addField(`${interaction.message.embeds[0].fields[0].name}`, `${interaction.message.embeds[0].fields[0].value} \n\n\n\`\`Feedback Answered\`\``)
        let disbutton = interaction.message.components[0].components[0]
        disbutton.disabled = true
        interaction.message.modify({embeds: [replacemente], components: [disbutton]})

      interaction.reply({modal: Modal}).catch(err => {})
    }


    if(interaction.custom_id === "help_right" || interaction.custom_id === "help_left"){
      const Discord = require("@kamkam1_0/discord.js")
      if(Date.now() - new Date(interaction.message.timestamp) >= 300000){
        let buttonleft = new Discord.Button()
        .setCustomID("help_left")
        .setStyle("SECONDARY")
        .setEmoji("◀️")
        .setDisabled(true)
        let buttonright = new Discord.Button()
        .setCustomID("help_right")
        .setStyle("SECONDARY")
        .setEmoji("▶️")
        .setDisabled(true)
        
        interaction.message.modify({embeds: interaction.message.embeds, components: [buttonleft, buttonright]}).catch(err => console.log(err))
        interaction.reply({content: Langue["h_1"], ephemeral: true})
        return
      }
      let buttonleft = new Discord.Button()
      .setCustomID("help_left")
      .setStyle("SECONDARY")
      .setEmoji("◀️")
      let buttonright = new Discord.Button()
      .setCustomID("help_right")
      .setStyle("SECONDARY")
      .setEmoji("▶️")

      let positions = interaction.message.embeds[0].footer.text.split("\n").map(text => {
        return {position: Number(text.split("->")[1].split("/")[0].trim()) - 1, name: text.split("->")[0].trim(), current: interaction.message.embeds[0].title.split(" ")[1].trim() === text.split("->")[0].trim() ? true : false}
      })
      
      if(positions.find(h => h.current).position === 0 && interaction.custom_id === "help_left"){
        positions.find(h => h.position === 0).current = false
        positions.find(h => h.position === Number(Math.max(...positions.map(h => h.position)))).current = true
      }
      else if(positions.find(h => h.current).position === Math.max(...positions.map(h => h.position)) && interaction.custom_id === "help_right"){
        positions.find(h => h.position === 0).current = true
        positions.find(h => h.position === Number(Math.max(...positions.map(h => h.position)))).current = false
      }
      else{
        let inital = positions.find(h => h.current).position
        positions.find(h => h.position === inital).current = false
        positions.find(h => h.position === ((interaction.custom_id === "help_left") ? (inital - 1) : (inital + 1))).current = true
      }

      let name = positions.find(h => h.current).name

      let embed = new Discord.Embed()
      .setTitle(`${Langue["Aide"]} ${name}`)
      .setColor("BLUE")
      .setFooterText(interaction.message.embeds[0].footer.text)


      let dirs_t = bot.handler.GetHandler(bot.handler.names.find(e => e.toLowerCase() === name.toLowerCase())).GetCommands()

      dirs_t.forEach(command => {
        embed.addField(command.name, Langue["Help"][`${command.name.split(".")[0]}_description`])
      })

      interaction.message.modify({embeds: [embed], components: [buttonleft, buttonright]}).catch(err => console.log(err))
      interaction.reply({ephemeral: true, content: Langue["h_2"]}).then(() => {
        setTimeout(() => {
          interaction.deletereply().catch(err => {})
        }, 5 * 1000)
      })
    }
  }
  if(interaction.isForm){
    if(interaction.custom_id === "Modal Feedback"){
      const Discord = require("@kamkam1_0/discord.js")
      let feedback = interaction.components.find(e => e.components[0].custom_id === "Feedback_content").components[0].value
      let c = bot.channels.get(bot.config.general["fbackchannel"])
        if(!c){
            interaction.error(Langue["feedback_1"]).catch(err =>{})
            bot.SendMessage(bot.creator.channel_id, {content: Langue["feedback_2"]})
            return
        }
        if(!feedback || String(feedback).trim().length === 0) return interaction.error(Langue["feedback_7"]).catch(err =>{})
        if(feedback.length > 1500) return interaction.error(Langue["feedback_3"]).catch(err =>{})
        let embed = new Discord.Embed()
        .setTitle("Nouveau feedback de " + interaction.user.username)
        .setThumbnail(interaction.user.avatarURL)
        .setFooterText("User ID:" + " " + `${interaction.user.id}`)
        .addField("Contenu du feedback", feedback)
        .setColor("BLUE")
        const RespondButton = new Discord.Button()
        .setCustomID("Response_ticket_button")
        .setEmoji("📥")
        .setStyle("DANGER")
        c.send({embeds: [embed], components: [RespondButton]}).catch(err =>{ })
        interaction.success(Langue["feedback_6"]).catch(err =>{})
    }
    if(interaction.custom_id === "Modal Feedback Answer"){
      const Discord = require("@kamkam1_0/discord.js")
      let content = interaction.components.find(e => e.components[0].custom_id === "Feedback_answer_content").components[0].value

      let embed = new Discord.Embed()
      .setTitle(`${interaction.user.username}#${interaction.user.discriminator} answered your feedback !`)
      .setDescription("```" + content + "```")
      .setColor('#36393F')
      bot.users.get(interaction.user.id).send({embeds: [embed]})
      .catch(err => {})
      let resem = new Discord.Embed()
      .setDescription(`<@${interaction.user.id}>, j'ai bien envoyé la réponse!`)
      .setColor('#36393F')
      interaction.reply({embeds: [resem]})
    }
  }
}