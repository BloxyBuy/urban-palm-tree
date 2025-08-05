const mineflayer = require('mineflayer')
const Movements = require('mineflayer-pathfinder').Movements
const fs = require('fs');
const pathfinder = require('mineflayer-pathfinder').pathfinder
const { GoalBlock } = require('mineflayer-pathfinder').goals
let rawdata = fs.readFileSync('config.json');


let data = JSON.parse(rawdata);

var host = data["ip"];
var username = data["username"]
var version = data["version"]
var password = data["password"]
var port = data["port"]
var bot = mineflayer.createBot({
    host: host,
    username: username,
    port: port,
    password: password,
    version: version,
});


bot.loadPlugin(pathfinder)
const mcData = require('minecraft-data')(bot.version)
const defaultMove = new Movements(bot, mcData)
bot.settings.colorsEnabled = false

bot.once("spawn", function() {
    console.log("\x1b[33m[BotLog] Bot joined to the server", '\x1b[0m')

    if (rawdata.utils['auto-auth'].enabled) {
        console.log("[INFO] Started auto-auth module")

        var password = rawdata.utils['auto-auth'].password
        setTimeout(function() {
            bot.chat(`/register ${password} ${password}`)
            bot.chat(`/login ${password}`)
        }, 500);

        console.log(`[Auth] Authentification commands executed.`)
    }

    if (rawdata.utils['chat-messages'].enabled) {
        console.log("[INFO] Started chat-messages module")
        var messages = config.utils['chat-messages']['messages']

        if (rawdata.utils['chat-messages'].repeat) {
            var delay = config.utils['chat-messages']['repeat-delay']
            let i = 0

            let msg_timer = setInterval(() => {
                bot.chat(`${messages[i]}`)

                if (i + 1 == messages.length) {
                    i = 0
                } else i++
            }, delay * 1000)
        } else {
            messages.forEach(function(msg) {
                bot.chat(msg)
            })
        }
    }


    const pos = rawdata.position

    if (rawdata.position.enabled) {
        console.log(`\x1b[32m[BotLog] Starting moving to target location (${pos.x}, ${pos.y}, ${pos.z})\x1b[0m`)
        bot.pathfinder.setMovements(defaultMove)
        bot.pathfinder.setGoal(new GoalBlock(pos.x, pos.y, pos.z))
    }

    if (rawdata.utils['anti-afk'].enabled) {
        bot.setControlState('jump', true)
        if (rawdata.utils['anti-afk'].sneak) {
            bot.setControlState('sneak', true)
        }
    }
})

bot.on("chat", function(username, message) {
    if (rawdata.utils['chat-log']) {
        console.log(`[ChatLog] <${username}> ${message}`)
    }
})

bot.on("goal_reached", function() {
    console.log(`\x1b[32m[BotLog] Bot arrived to target location. ${bot.entity.position}\x1b[0m`)
})

bot.on("death", function() {
    console.log(`\x1b[33m[BotLog] Bot has been died and was respawned ${bot.entity.position}`, '\x1b[0m')
})



bot.on('kicked', (reason) => console.log('\x1b[33m', `[BotLog] Bot was kicked from the server. Reason: \n${reason}`, '\x1b[0m'))
bot.on('error', err => console.log(`\x1b[31m[ERROR] ${err.message}`, '\x1b[0m'))



createBot()