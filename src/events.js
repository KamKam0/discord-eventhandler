const Event = require("./event")
const fs = require("node:fs")
const os = require("node:os")
const systemLanguages = require("./utils/getLangues")()

let osSymbol = "/"
if(os.platform() === "win32") osSymbol = "\\"

class Handler{
    #systemLanguages

    constructor(bot, eventsar){
        this.bot = bot
        this.#systemLanguages = systemLanguages
        this.propositions = eventsar
        this.presence = null
        this.names = []
        this.events = this.automaticAdd()
        this.bot_name = bot.name
        this.state = "undeployed"
    }

    addLanguage(json){
        let validatedData = null;
        try{
            validatedData = JSON.parse(json)
        }catch(err){
            return this
        }
        if(!validatedData["commands"] || !validatedData["choices"] || !validatedData["options"] || !validatedData["languageCode"] || !validatedData["langue"]) return this
        this.#systemLanguages.push(validatedData)
        return this
    }

    getLanguages(){
        return this.#systemLanguages
    }

    automaticAdd(){
        if(this.names.length) return
        let rawPath = require.resolve("./events/guildCreate")
        let rawSplittedPath = rawPath.split(osSymbol)
        rawSplittedPath.splice(rawSplittedPath.length - 1, 1)
        let path = rawSplittedPath.join(osSymbol)
        let defaultEvents = fs.readdirSync(path).filter(file => file.endsWith(".js"))
        let returnedDefaultEvents = defaultEvents.map(event => this.addEvent(event, require(`./events/${event}`)))
        
        return returnedDefaultEvents
    }

    addEvent(name, datas){
        name = String(name)
        if(name.includes(".")) name = name.split(".")[0]
        
        if(this.names.find(e => String(e).toLowerCase() === String(name).toLowerCase()) && !this.names.find(e => String(e).toLowerCase() === String(`${name}1`).toLowerCase())) name = `${name}1`
        else if(this.names.find(e => String(e).toLowerCase() === String(name).toLowerCase()) && this.names.find(e => String(e).toLowerCase() === String(`${name}1`).toLowerCase())) return "both already exist"
        
        const registeredEvent = new Event(name, datas, datas.langues)
        if(this.events) this.events.push(registeredEvent)
        this.names.push(name)

        return registeredEvent
    }

    removeEvent(name){
        if(!name || typeof name !== "string") return "invalid name"
        let event = this.events.find(e => String(e.name).toLowerCase() === String(name).toLowerCase())
        let eventName = this.names.find(e => String(e).toLowerCase() === String(name).toLowerCase())
        if(event) this.events.splice(this.events.indexOf(event), 1)
        if(eventName) this.names.splice(this.names.indexOf(eventName), 1)
    }

    deploy(presence){
        if(this.state !== "undeployed") return
        this.presence = presence
        this.state = "deployed"
        if(fs.readdirSync(`${process.cwd()}`).includes("Handler")) if(fs.readdirSync(`${process.cwd()}/Handler`).includes("Events")) fs.readdirSync(`${process.cwd()}/Handler/Events`).filter(e => e!==".DS_Store").forEach(dir => {
            let file = require(`${process.cwd()}/Handler/Events/${dir}`)
            this.addEvent(dir.split(".")[0], file)
        })
        this.names.forEach(name => {
            let trueevent = this.propositions.find(proposition => proposition.toUpperCase().replaceAll("_", "") === name.toUpperCase().replaceAll("_", "")) || this.propositions.find(proposition => proposition.toUpperCase().replaceAll("_", "") === `GUILD_${name}`.toUpperCase().replaceAll("_", ""))
            if(trueevent) {
                this.bot.on(trueevent, async (bo, da, olda, modif) => this.analyse(bo, da, olda, modif, name))
            }
        })
    }

    getAll(){
        return this.events
    }

    analyse(bot, datas, olddatas, modifs, type){
        this.#getEvents(type).forEach(event => {
            let Langue = this.#findLangue(bot, datas, olddatas, event.name)
            
            if(event.langues ) Langue = this.#systemLanguages.find(e => e.languageCode === Langue.languageCode) || this.#systemLanguages.find(e => e.languageCode === bot.config.general.language) || this.#systemLanguages.find(e => e.languageCode === "en-US")
            
            if(event.name === "ready") return event.execute(bot, this.presence, Langue)

            if(!olddatas) event.execute(bot, datas, Langue)
            else event.execute(bot, datas, olddatas, modifs, Langue)
        })
    }

    #getEvents(type) {
        return this.events
        .filter(e => [String(type).toUpperCase().replaceAll("_", ""), `${String(type).toUpperCase().replaceAll("_", "")}1`].includes(String(e.name).toUpperCase().replaceAll("_", "")) )
        .filter(Boolean)
    }

    #findLangue(bot, datas, olddatas, eventName){
        const analyse = (defdata) => {
            let LangueIntern;
            if(defdata?.guild_id){
                let baseFoundLanguage = bot.langues.find(lan => lan.languageCode === defdata.guild.preferred_locale)
                if(baseFoundLanguage && (!["guildcreate", "guilddelete"].includes(eventName.toLowerCase()))) LangueIntern = baseFoundLanguage
                else LangueIntern = bot.langues.find(lan => lan.languageCode === bot.config.general.language)
            }else if (defdata?.receivingType === "interaction"){
                let baseFoundLanguage = bot.langues.find(lan => lan.languageCode === defdata?.locale)
                if(baseFoundLanguage) LangueIntern = baseFoundLanguage
                else LangueIntern = bot.langues.find(lan => lan.languageCode === bot.config.general.language)
            }else LangueIntern = bot.langues.find(lan => lan.languageCode === bot.config.general.language)
            return LangueIntern
        }

        let Langue;
        Langue = analyse(datas)
        if(!Langue && olddatas) Langue = analyse(olddatas)
        
        return Langue
    }
}

module.exports = Handler