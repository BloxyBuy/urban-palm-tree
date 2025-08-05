const mineflayer = require('mineflayer')
const cmd = require('mineflayer-cmd').plugin
const readline = require('readline');
const fs = require('fs');
let rawdata = fs.readFileSync('./config.json');
const http = require("http")
const pvp = require('mineflayer-pvp').plugin
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const armorManager = require('mineflayer-armor-manager')
const inventoryViewer = require('mineflayer-web-inventory')
const path = require("path");
const autoeat = require("mineflayer-auto-eat")
let data = JSON.parse(rawdata);
var lasttime = -1;
var moving = 0;
var connected = 0;
var actions = ['forward', 'back', 'left', 'right', 'jump']
var lastaction;
var pi = 3.14159;
var moveinterval = 1; // 2 second movement interval
var maxrandom = 3; // 0-5 seconds added to movement interval (randomly)
var host = data["ip"];
var username = data["name"]
var nightskip = data["auto-night-skip"]
var channel = data["channelid"]
var token = data["token"]
var loginmessage = data["loginmsg"]
var bot = mineflayer.createBot({
    host: host,
    username: username,

});

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;

}

bot.loadPlugin(cmd)


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});




bot.on('login', function() {
    console.log("Done all set Thank's for using mineboty")
    console.log("Logged In Successfully 👍")
    bot.chat(loginmessage);
});

bot.on('time', function(time) {
    if (nightskip == "true") {
        if (bot.time.timeOfDay >= 13000) {
            bot.chat('/time set day')
        }
    }
    if (connected < 1) {
        return;
    }
    if (lasttime < 0) {
        lasttime = bot.time.age;
    } else {
        var randomadd = Math.random() * maxrandom * 20;
        var interval = moveinterval * 20 + randomadd;
        if (bot.time.age - lasttime > interval) {
            if (moving == 1) {
                bot.setControlState(lastaction, false);
                moving = 0;
                lasttime = bot.time.age;
            } else {
                var yaw = Math.random() * pi - (0.5 * pi);
                var pitch = Math.random() * pi - (0.5 * pi);
                bot.look(yaw, pitch, false);
                lastaction = actions[Math.floor(Math.random() * actions.length)];
                bot.setControlState(lastaction, true);
                moving = 1;
                lasttime = bot.time.age;
                bot.activateItem();
            }
        }
    }
});

bot.loadPlugin(pvp)
bot.loadPlugin(armorManager)
bot.loadPlugin(pathfinder)


bot.on('playerCollect', (collector, itemDrop) => {
    if (collector !== bot.entity) return

    setTimeout(() => {
        const sword = bot.inventory.items().find(item => item.name.includes('sword'))
        if (sword) bot.equip(sword, 'hand')
    }, 150)
})

bot.on('playerCollect', (collector, itemDrop) => {
    if (collector !== bot.entity) return

    setTimeout(() => {
        const shield = bot.inventory.items().find(item => item.name.includes('shield'))
        if (shield) bot.equip(shield, 'off-hand')
    }, 250)
})

let guardPos = null

function guardArea(pos) {
    guardPos = pos.clone()

    if (!bot.pvp.target) {
        moveToGuardPos()
    }
}

function stopGuarding() {
    guardPos = null
    bot.pvp.stop()
    bot.pathfinder.setGoal(null)
}

function moveToGuardPos() {
    const mcData = require('minecraft-data')(bot.version)
    bot.pathfinder.setMovements(new Movements(bot, mcData))
    bot.pathfinder.setGoal(new goals.GoalBlock(guardPos.x, guardPos.y, guardPos.z))
}

bot.on('stoppedAttacking', () => {
    if (guardPos) {
        moveToGuardPos()
    }
})

bot.on('physicTick', () => {
    if (bot.pvp.target) return
    if (bot.pathfinder.isMoving()) return

    const entity = bot.nearestEntity()
    if (entity) bot.lookAt(entity.position.offset(0, entity.height, 0))
})

bot.on('physicTick', () => {
    if (!guardPos) return

    const filter = e => e.type === 'mob' && e.position.distanceTo(bot.entity.position) < 16 &&
        e.mobType !== 'Armor Stand' // Mojang classifies armor stands as mobs for some reason?

    const entity = bot.nearestEntity(filter)
    if (entity) {
        bot.pvp.attack(entity)
    }
})

bot.on('chat', (username, message) => {
    if (message === 'guard') {
        const player = bot.players[username]

        if (!player) {
            bot.chat("I can't see you.")
            return
        }

        bot.chat('I will guard that location.')
        guardArea(player.entity.position)
    }

    if (message === 'fight me') {
        const player = bot.players[username]

        if (!player) {
            bot.chat("I can't see you.")
            return
        }

        bot.chat('Prepare to fight!')
        bot.pvp.attack(player.entity)
    }

    if (message === 'stop') {
        bot.chat('I will no longer guard this area.')
        stopGuarding()
    }
})

bot.on('chat', (username, message) => {
    if (message === 'kartik op') {
        const player = bot.players[username]

        if (!player) {
            bot.chat("kartik is always op")
            return
        }

        bot.chat('kartik is always op')

    }
})

bot.on('chat', (username, message) => {
    if (username === bot.username) return
    switch (message) {
        case 'sleep':
            goToSleep()
            break
        case 'wakeup':
            wakeUp()
            break
    }
})

bot.on('sleep', () => {
    bot.chat('Good night!')
})
bot.on('wake', () => {
    bot.chat('Good morning!')
})

async function goToSleep() {
    const bed = bot.findBlock({
        matching: block => bot.isABed(block)
    })
    if (bed) {
        try {
            await bot.sleep(bed)
            bot.chat("I'm sleeping")
        } catch (err) {
            bot.chat(`I can't sleep: ${err.message}`)
        }
    } else {
        bot.chat('No nearby bed')
    }
}

async function wakeUp() {
    try {
        await bot.wake()
    } catch (err) {
        bot.chat(`I can't wake up: ${err.message}`)
    }
}


bot.on('chat', (username, message) => {
    if (message === 'hello') {
        const player = bot.players[username]

        if (!player) {
            bot.chat("hi")
            return
        }

        bot.chat('hi')

    }
})

bot.on('chat', (username, message) => {
    if (message === 'who made you') {
        const player = bot.players[username]

        if (!player) {
            bot.chat("kartik op from IDI")
            return
        }

        bot.chat(`kartik op from IDI ${bot.players[username]} `)

    }
})

function sayCommand(sender, flags, args) {
    return new Promise((resolve, reject) => {
        let message = ''

        if (flags.showsender) message += sender + ': '
        if (flags.color) message += '&' + flags.color[0]

        message += args.join(' ')
        bot.chat(message)
        resolve()
    })
}

bot.once('cmd_ready', () => {
    bot.cmd.registerCommand('say', sayCommand, // Create a new command called 'say' and set the executor function
            'make me say something', // help text
            'say <message>') // usage text

    // Add a flag called 'color' that expects 1 input
    .addFlag('color', 1, ['color code'], 'Changes the chat color')

    // Add a flag called 'showsender' that expects 0 inputs
    .addFlag('showsender', 0, [], 'If present, displays the sender who sent this message')
})

// And listen for command inputs from any source
// Let's listen for chat events that start with "!"
bot.on('chat', (username, message) => {
    if (message.startsWith('!')) {
        const command = message.substring(1)
        bot.cmd.run(username, command) // Run with the sender and the command itself
    }
})


bot.on('chat', (username, message) => {
    if (message === 'day') {
        const player = bot.players[username]

        if (!player) {
            bot.chat("/time set day")
            return
        }


        bot.chat('/time set day')


    }
})

bot.on('chat', (username, message) => {
    if (message === 'midnight') {
        const player = bot.players[username]

        if (!player) {
            bot.chat("/time set midnight")
            return
        }


        bot.chat('/time set midnight')


    }
})

bot.on('chat', (username, message) => {
    if (message === 'noon') {
        const player = bot.players[username]

        if (!player) {
            bot.chat("/time set noon")
            return
        }


        bot.chat('/time set noon')


    }
})

bot.on('chat', (username, message) => {
    if (message === 'rain') {
        const player = bot.players[username]

        if (!player) {
            bot.chat("/weather rain")
            return
        }


        bot.chat('/weather rain')


    }
})

bot.on('chat', (username, message) => {
    if (message === 'wclear') {
        const player = bot.players[username]

        if (!player) {
            bot.chat("/weather clear")
            return
        }


        bot.chat('/weather clear')


    }
})

bot.on('chat', (username, message) => {
    if (message === 'wclear') {
        const player = bot.players[username]

        if (!player) {
            bot.chat("/weather clear")
            return
        }


        bot.chat('/weather clear')


    }
})

bot.on('chat', (username, message) => {
    if (message === 'iron golem') {
        const player = bot.players[username]

        if (!player) {
            bot.chat("/summon minecraft:iron_golem")
            return
        }


        bot.chat('/summon minecraft:iron_golem')


    }
})

bot.on('chat', (username, message) => {
    if (message === 'night') {
        const player = bot.players[username]

        if (!player) {
            bot.chat("/time set night")
            return
        }

        bot.chat('/time set night')

    }
})

bot.on('chat', (username, message) => {
    if (message === 'th') {
        const player = bot.players[username]

        if (!player) {
            bot.chat("/weather thunder")
            return
        }

        bot.chat('/weather thunder')

    }

    if (message === 'comehere') {
        if (username === "Server") return bot.chat(`I can only tp to players`)
        bot.chat(`/tp ${username}`)
    }
    if (message === 'chatbot on') {
        chatbot = true
    }
    if (message === 'chatbot off') {
        chatbot = false
    }


})


bot.on('spawn', function() {
    connected = 1;
});

bot.on('death', function() {
    bot.emit("respawn")
});


rl.on("line", input => {
    if (input == "/quit") {
        bot.quit();
        process.exit(1);
        return;
    }

    if (input == "/reconnect") {
        bot.quit();
        process.exit();
        return;
    }

    bot.chat(input);
});


bot.on("autoeat_started", () => {
    console.log("Auto Eat started!")
})

bot.on("autoeat_stopped", () => {
    console.log("Auto Eat stopped!")
})



const Discord = require('discord.js')
const client = new Discord.Client()


client.on('ready', () => {
    console.log(`The discord bot logged in! Username: ${client.user.username}!`)
    channel = client.channels.cache.get(channel)
})

// Redirect Discord messages to in-game chat
client.on('message', message => {
    // Only handle messages in specified channel
    if (message.channel.id !== channel.id) return
        // Ignore messages from the bot itself
    if (message.author.id === client.user.id) return

    bot.chat(`${message.author.username}: ${message.content}`)
})

// Redirect in-game messages to Discord channel
bot.on('chat', (username, message) => {
    // Ignore messages from the bot itself
    if (username === bot.username) return

    channel.send(`${username}: ${message}`)
})

client.on('message', message => {
    if (message.content === 'ip') {
        message.channel.send(`**${host}**`);
    }
});



// Login Discord bot
client.login(token)