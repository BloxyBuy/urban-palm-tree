const mineflayer = require('mineflayer')
const inventoryViewer = require('mineflayer-web-inventory')

const bot = mineflayer.createBot({
    host: process.config.ip,
    port: process.config.port,
    username: process.argv[4] || process.config.name
})

inventoryViewer(bot)