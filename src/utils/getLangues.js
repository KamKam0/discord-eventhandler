const os = require('node:os')
const fs = require("node:fs")

module.exports = () => {
    let symbol;
    if(os.platform() === "darwin") symbol = "/"
    if(os.platform() === "win32") symbol = "\\"
    let path = require.resolve("../langues/eng.json").split(symbol)
    path.pop()
    path = path.join(symbol)
    let files = fs.readdirSync(path).filter(e => e.endsWith("json")).map(e => require(`../langues/${e}`)).filter(e => e["languageCode"] && e["langue"])
    return files
}