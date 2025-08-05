const mineflayer = require('mineflayer')
const cmd = require('mineflayer-cmd').plugin
const fs = require('fs');
let rawdata = fs.readFileSync('config.json');
const http = require("http")

const path = require("path");


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
var username = data["username"]
var nightskip = data["auto-night-skip"]
var bot = mineflayer.createBot({
    host: host,
    username: username,

});

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;

}

bot.loadPlugin(cmd)




bot.on('login', function() {
    console.log("Done all set Thank's for using mineboty")
    console.log("Logged In Successfully 👍")

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


bot.once('spawn', () => {
    setInterval(() => {
        const mobFilter = e => e.type === 'mob' && e.mobType === 'Guard'
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