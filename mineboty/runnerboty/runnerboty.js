const mineflayer = require('mineflayer');
const cmd = require('mineflayer-cmd').plugin;
const fs = require('fs');
const pvp = require('mineflayer-pvp').plugin;
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const armorManager = require('mineflayer-armor-manager');
const inventoryViewer = require('mineflayer-web-inventory');

let rawdata = fs.readFileSync('./config.json');

module.exports = function() {
    let data = JSON.parse(rawdata);
    let lasttime = -1;
    let moving = 0;
    let connected = 0;
    let actions = ['forward', 'back', 'left', 'right', 'jump'];
    let lastaction;
    const pi = 3.14159;
    const moveinterval = 1; // 2 second movement interval
    const maxrandom = 3; // 0-5 seconds added to movement interval (randomly)
    const host = data["ip"];
    const username = data["name"];
    const nightskip = data["auto-night-skip"];
    const loginmessage = data["loginmsg"];

    let reconnectDelay = 5000; // reconnect delay start 5 seconds
    let inventoryServer = null;

    function createBot() {
        const bot = mineflayer.createBot({
            host: host,
            username: username,
            version: data.version || '1.20.4'
        });

        bot.setMaxListeners(30);

        function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
        }

        bot.on('login', () => {
            console.log("Done all set Thank's for using mineboty");
            console.log("Logged In Successfully 👍");
            bot.chat(loginmessage);
        });

        bot.on('time', () => {
            if (nightskip === "true" && bot.time.timeOfDay >= 13000) {
                bot.chat('/time set day');
            }
            if (connected < 1) return;

            if (lasttime < 0) {
                lasttime = bot.time.age;
            } else {
                const randomadd = Math.random() * maxrandom * 20;
                const interval = moveinterval * 20 + randomadd;

                if (bot.time.age - lasttime > interval) {
                    if (moving === 1) {
                        bot.setControlState(lastaction, false);
                        moving = 0;
                        lasttime = bot.time.age;
                    } else {
                        const yaw = Math.random() * pi - (0.5 * pi);
                        const pitch = Math.random() * pi - (0.5 * pi);
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

        bot.loadPlugin(pvp);
        bot.loadPlugin(armorManager);
        bot.loadPlugin(pathfinder);

        bot.on('playerCollect', (collector, itemDrop) => {
            if (collector !== bot.entity) return;

            setTimeout(() => {
                const sword = bot.inventory.items().find(item => item.name.includes('sword'));
                if (sword) bot.equip(sword, 'hand');
            }, 150);

            setTimeout(() => {
                const shield = bot.inventory.items().find(item => item.name.includes('shield'));
                if (shield) bot.equip(shield, 'off-hand');
            }, 250);
        });

        let guardPos = null;

        function guardArea(pos) {
            guardPos = pos.clone();

            if (!bot.pvp.target) {
                moveToGuardPos();
            }
        }

        function stopGuarding() {
            guardPos = null;
            bot.pvp.stop();
            bot.pathfinder.setGoal(null);
        }

        function moveToGuardPos() {
            const mcData = require('minecraft-data')(bot.version);
            bot.pathfinder.setMovements(new Movements(bot, mcData));
            bot.pathfinder.setGoal(new goals.GoalBlock(guardPos.x, guardPos.y, guardPos.z));
        }

        bot.on('stoppedAttacking', () => {
            if (guardPos) moveToGuardPos();
        });

        bot.on('physicTick', () => {
            if (bot.pvp.target) return;
            if (bot.pathfinder.isMoving()) return;

            const entity = bot.nearestEntity();
            if (entity) bot.lookAt(entity.position.offset(0, entity.height, 0));
        });

        bot.on('physicTick', () => {
            if (!guardPos) return;

            const filter = e => e.type === 'mob' && e.position.distanceTo(bot.entity.position) < 16 &&
                e.mobType !== 'Armor Stand';

            const entity = bot.nearestEntity(filter);
            if (entity) {
                bot.pvp.attack(entity);
            }
        });

        bot.on('chat', (username, message) => {
            if (message === 'guard') {
                const player = bot.players[username];
                if (!player) {
                    bot.chat("I can't see you.");
                    return;
                }
                bot.chat('I will guard that location.');
                guardArea(player.entity.position);
            }
        });

        bot.on('chat', (username, message) => {
            if (message === 'fight me') {
                const player = bot.players[username];
                if (!player) {
                    bot.chat("I can't see you.");
                    return;
                }
                bot.chat('Prepare to fight!');
                bot.pvp.attack(player.entity);
            }
        });

        bot.on('chat', (username, message) => {
            if (message === 'stop') {
                bot.chat('I will no longer guard this area.');
                stopGuarding();
            }
        });

        bot.on('chat', (username, message) => {
            if (message === 'kartik op') {
                bot.chat('kartik is always op');
            }
        });

        bot.on('chat', (username, message) => {
            if (username === bot.username) return;
            switch (message) {
                case 'sleep':
                    goToSleep();
                    break;
                case 'wakeup':
                    wakeUp();
                    break;
            }
        });

        bot.on('sleep', () => {
            bot.chat('Good night!');
        });

        bot.on('wake', () => {
            bot.chat('Good morning!');
        });

        async function goToSleep() {
            const bed = bot.findBlock({
                matching: block => bot.isABed(block)
            });
            if (bed) {
                try {
                    await bot.sleep(bed);
                    bot.chat("I'm sleeping");
                } catch (err) {
                    bot.chat(`I can't sleep: ${err.message}`);
                }
            } else {
                bot.chat('No nearby bed');
            }
        }

        async function wakeUp() {
            try {
                await bot.wake();
            } catch (err) {
                bot.chat(`I can't wake up: ${err.message}`);
            }
        }

        bot.on('chat', (username, message) => {
            if (message === 'hello') {
                bot.chat('hi');
            }
        });

        bot.on('chat', (username, message) => {
            if (message === 'who made you') {
                bot.chat('kartik op from Team IC');
            }
        });

        bot.on('chat', (username, message) => {
            switch (message) {
                case 'day':
                    bot.chat('/time set day');
                    break;
                case 'midnight':
                    bot.chat('/time set midnight');
                    break;
                case 'noon':
                    bot.chat('/time set noon');
                    break;
                case 'rain':
                    bot.chat('/weather rain');
                    break;
                case 'wclear':
                    bot.chat('/weather clear');
                    break;
                case 'wthunder':
                    bot.chat('/weather thunder');
                    break;
            }
        });

        bot.loadPlugin(cmd);
        bot.loadPlugin(inventoryViewer);

        bot.once('spawn', () => {
            if (inventoryServer) {
                try {
                    inventoryServer.close();
                } catch (e) {
                    console.warn('Error closing previous inventory server:', e);
                }
            }
            inventoryServer = inventoryViewer(bot, { port: 3000 });
            console.log('Inventory web server started on port 3000');
        });

        bot.on('end', () => {
            console.log(`Bot disconnected. Reconnecting in ${reconnectDelay / 1000} seconds...`);
            if (inventoryServer) {
                try {
                    inventoryServer.close();
                    console.log('Inventory viewer stopped');
                } catch (e) {
                    console.warn('Error closing inventory viewer:', e);
                }
                inventoryServer = null;
            }
            setTimeout(() => {
                reconnectDelay = Math.min(reconnectDelay * 2, 60000);
                createBot();
            }, reconnectDelay);
        });

        bot.on('error', (err) => {
            console.error('Bot error:', err);
        });

        bot._client.on('error', (err) => {
            console.error('Low-level client error:', err);
        });

        return bot;
    }

    createBot();

    process.on('uncaughtException', (err) => {
        console.error('Uncaught Exception:', err);
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection:', reason);
    });
};
