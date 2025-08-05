const mineflayer = require("mineflayer")
const autoeat = require("mineflayer-auto-eat")


const bot = mineflayer.createBot({
    host: process.argv[2] || process.config.ip,
    port: process.argv[3] || process.config.port,
    username: process.argv[4] || process.config.name,
    password: process.argv[5],
})

// Load the plugin
bot.loadPlugin(autoeat)

bot.once("spawn", () => {
    bot.autoEat.options.priority = "foodPoints"
    bot.autoEat.options.bannedFood = []
    bot.autoEat.options.eatingTimeout = 3
})

// The bot eats food automatically and emits these events when it starts eating and stops eating.

bot.on("autoeat_started", () => {
    console.log("Auto Eat started!")
})

bot.on("autoeat_stopped", () => {
    console.log("Auto Eat stopped!")
})

bot.on("health", () => {
    if (bot.food === 20) bot.autoEat.disable()
        // Disable the plugin if the bot is at 20 food points
    else bot.autoEat.enable() // Else enable the plugin again
})