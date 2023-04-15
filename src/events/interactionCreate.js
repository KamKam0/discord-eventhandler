module.exports = async (bot, interaction) => {
  if(interaction.isSlash) bot.handler.analyse(bot, interaction)
  if(interaction.isButton){
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
      .AddTextInputs(TextInput)

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
  }
  if(interaction.isForm){
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