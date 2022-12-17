const Event = require("./Event")
class Handler{
    constructor(bot, eventsar){
        this.bot = bot
        this.propositions = eventsar
        this.names = []
        this.events = this.AutomaticAdd()
        this.bot_name = bot.name
        this.state = "undeployed"
    }

    AutomaticAdd(){
        if(this.names.length === 0){
            let defa_eve = ["guildCreate.js", "guildDelete.js", "interactionCreate.js", "messageCreate.js", "ready.js"]
            let defaulte = []
            defa_eve.forEach(de => {
                let name = de
                if(name.includes(".")) name = name.split(".")[0]
                if(this.names.find(e => String(e).toLowerCase() === String(name).toLowerCase())) return "already exists"
                const co = new Event(name, require(`./Events/${de}`))
                defaulte.push(co)
                this.names.push(name)
            })
            return defaulte
        }
    }

    AddEvent(name, datas){
        name = String(name)
        if(name.includes(".")) name = name.split(".")[0]
        
        if(this.names.find(e => String(e).toLowerCase() === String(name).toLowerCase()) && !this.names.find(e => String(e).toLowerCase() === String(`${name}1`).toLowerCase())) name = `${name}1`
        else if(this.names.find(e => String(e).toLowerCase() === String(name).toLowerCase()) && this.names.find(e => String(e).toLowerCase() === String(`${name}1`).toLowerCase())) return "both already exist"
        
        const co = new Event(name, datas)
        this.events.push(co)
        this.names.push(name)
    }

    RemoveEvent(name){
        if(!name || typeof name !== "string") return "invalid name"
        this.events.splice(this.events.indexOf(this.events.find(e => String(e.name).toLowerCase() === String(name).toLowerCase())), 1)
        this.names.splice(this.names.indexOf(this.names.find(e => String(e).toLowerCase() === String(name).toLowerCase())), 1)
    }

    Deploy(){
        if(this.state !== "undeployed") return
        this.state = "deployed"
        const fs = require("fs")
        if(fs.readdirSync(`${process.cwd()}`).includes("Handler")) if(fs.readdirSync(`${process.cwd()}/Handler`).includes("Events")) fs.readdirSync(`${process.cwd()}/Handler/Events`).filter(e => e!==".DS_Store").forEach(dir => {
            let file = require(`${process.cwd()}/Handler/Events/${dir}`)
            this.AddEvent(dir.split(".")[0], file)
        })
        this.names.forEach(name => {
            let trueevent = this.propositions.find(proposition => proposition.toUpperCase().replaceAll("_", "") === name.toUpperCase().replaceAll("_", "")) || this.propositions.find(proposition => proposition.toUpperCase().replaceAll("_", "") === `GUILD_${name}`.toUpperCase().replaceAll("_", ""))
            if(trueevent) this.bot.on(trueevent, async (bo, da, olda) => this.Analyse(bo, da, olda, name))
        })
    }

    GetAll(){
        return this.events
    }

    async Analyse(bot, datas, olddatas, type){
        let event = this.events.find(e => String(e.name).toUpperCase().replaceAll("_", "") === String(type).toUpperCase().replaceAll("_", ""))
        
        if(!event) return

        let Langue = Find_Datas(datas, olddatas)

        if(!olddatas) event.execute(bot, datas, Langue)
        else event.execute(bot, datas, olddatas, Langue)

        let event2 = this.events.find(e => String(e.name).toUpperCase().replaceAll("_", "") === `${String(type).toUpperCase().replaceAll("_", "")}1`)
        
        if(!event2) return

        let Langue2 = Find_Datas(this.bot, datas, olddatas)

        if(!olddatas) event2.execute(bot, datas, Langue2)
        else event2.execute(bot, datas, olddatas, Langue2)
    }
}

function Find_Datas(bot, datas, olddatas){

    let Langue;
    if(datas){
        if(datas.vguild_id) Langue = bot.langues.find(la => la.LangueCode === `${datas.guild ? datas.guild.db_language : datas.db_language}`)
        else{
            if(datas.locale === "fr") Langue = bot.langues.find(la => la.LangueCode === "fr")
            else Langue = bot.langues.find(la => la.LangueCode === "en-US")
        }
    }
    if(!Langue && olddatas){
        if(olddatas.vguild_id) Langue = require("../Discord.js").Langues[`${olddatas.guild ? olddatas.guild.db_language : olddatas.db_language}`]
        else{
            if(olddatas.locale === "fr") Langue = bot.langues.find(la => la.LangueCode === "fr")
            else Langue = bot.langues.find(la => la.LangueCode === "en-US")
        }
    }

    return Langue
}

module.exports = Handler