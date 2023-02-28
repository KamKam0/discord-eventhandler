const Event = require("./Event")
class Handler{
    constructor(bot, eventsar){
        this.bot = bot
        this.propositions = eventsar
        this.presence = null
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
                const co = new Event(name, require(`./Events/${de}`), require(`./Events/${de}`).langues)
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
        
        const co = new Event(name, datas, datas.langues)
        this.events.push(co)
        this.names.push(name)
    }

    RemoveEvent(name){
        if(!name || typeof name !== "string") return "invalid name"
        this.events.splice(this.events.indexOf(this.events.find(e => String(e.name).toLowerCase() === String(name).toLowerCase())), 1)
        this.names.splice(this.names.indexOf(this.names.find(e => String(e).toLowerCase() === String(name).toLowerCase())), 1)
    }

    Deploy(presence){
        if(this.state !== "undeployed") return
        this.presence = presence
        this.state = "deployed"
        const fs = require("node:fs")
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

        let events = this.events.filter(e => [String(type).toUpperCase().replaceAll("_", ""), `${String(type).toUpperCase().replaceAll("_", "")}1`].includes(String(e.name).toUpperCase().replaceAll("_", "")) )
        events.filter(e => e).forEach(async event => {
            if(!event) return
            if(event.name === "ready") return event.execute(bot, this.presence)

            let Langue = await this.#findLangue(bot, datas, olddatas)
            
            if(event.langues && event.langues.length) Langue = event.langues.find(e => e.Langue_Code === Langue.Langue_Code) || event.langues.find(e => e.Langue_Code === bot.config.general.language) || event.langues.find(e => e.Langue_Code === "en-US")
            
            if(!olddatas) event.execute(bot, datas, Langue)
            else event.execute(bot, datas, olddatas, Langue)
        })
    }


    async #findLangue(bot, datas, olddatas){
        const analyse = async (defdata) => {
            let LangueIntern;
            if(defdata?.guild_id){
                let datasGuild = (await bot.sql.select("general", {ID: defdata.guild_id}).catch(err => {}))?.[0]
                if(datasGuild) LangueIntern = bot.langues.find(lan => lan.Langue_Code === datasGuild.Language)
                else LangueIntern = bot.langues.find(lan => lan.Langue_Code === bot.config.general.language)
            }else if (defdata?.typee === "slash"){
                LangueIntern = bot.langues.find(lan => lan.Langue_Code === defdata.locale)
                if(!Langue) bot.langues.find(lan => lan.Langue_Code === bot.config.general.language)
            }else LangueIntern = bot.langues.find(lan => lan.Langue_Code === bot.config.general.language)
            return LangueIntern
        }

        let Langue;
        if(datas) Langue = analyse(datas)
        if(!Langue && olddatas) Langue = analyse(olddatas)
        
        return Langue
    }
}

module.exports = Handler