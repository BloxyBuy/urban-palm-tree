const mineflayer = require('mineflayer')
const cmd = require('mineflayer-cmd').plugin
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
var host = data["server"]["ip"];
var username = data["account"]["name"]
var nightskip = data["auto-night-skip"]
var bot = mineflayer.createBot({
    host: host,
    username: username
});

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;

}

bot.loadPlugin(cmd)






bot.on('login', function() {
    console.log("Done all set Thank's for using mineboty")
    console.log("Logged In Successfully 👍")
    bot.chat("hello");
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
            bot.chat("kartik op from Team IC")
            return
        }

        bot.chat(`kartik op from Team IC`)

    }
})

bot.on('chat', (username, message) => {
    if (message === 'day') {


        if (!player) {
            bot.chat("/time set day")
            return
        }


        bot.chat('/time set day')


    }
})

bot.on('chat', (username, message) => {
    if (message === 'midnight') {


        if (!player) {
            bot.chat("/time set midnight")
            return
        }


        bot.chat('/time set midnight')


    }
})

bot.on('chat', (username, message) => {
    if (message === 'noon') {


        if (!player) {
            bot.chat("/time set noon")
            return
        }


        bot.chat('/time set noon')


    }
})

bot.on('chat', (username, message) => {
    if (message === 'rain') {


        if (!player) {
            bot.chat("/weather rain")
            return
        }


        bot.chat('/weather rain')


    }
})

bot.on('chat', (username, message) => {
    if (message === 'wclear') {


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
})

bot.on('chat', (username, message) => {
    if (message === 'help') {
        const player = bot.players[username]

        if (!player) {
            bot.chat(`help - 1- hello
      2- day (to make change time to day)`)
            return
        }

        bot.chat(`help - 1- hello
      2- day (to make change time to day)`)

    }
})

bot.loadPlugin(autoeat)

bot.once("spawn", () => {
    bot.autoEat.options.priority = "foodPoints"
    bot.autoEat.options.bannedFood = []
    bot.autoEat.options.eatingTimeout = 3
})


bot.once('spawn', () => {
    setInterval(() => {
        const mobFilter = e => e.type === 'mob' && e.mobType === 'Zombie'

        const mob = bot.nearestEntity(mobFilter)

        if (!mob) return;

        const pos = mob.position;
        bot.lookAt(pos, true, () => {
            bot.attack(mob);
        });
    }, 1000);
});




bot.on('spawn', function() {
    connected = 1;
});

bot.on('death', function() {
    bot.emit("respawn")
});

inventoryViewer(bot)