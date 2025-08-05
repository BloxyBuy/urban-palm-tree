"use strict";
var fs = require('fs');
const prompt = require("prompt-sync")({ sigint: true });

let cmdname = prompt("Enater your Command Name: ");
let cmdmsg = prompt("Enater your Message on reply: ");

fs.appendFile(("./runnerboty/runnerboty.js"),
    `
bot.on('chat', (username, message) => {
 // ${cmdname} ${cmdmsg} xD
     if (message === '${cmdname}') {
      const player = bot.players[username]
  
      if (!player) {
        bot.chat("${cmdmsg}")
        return
      }
  
      bot.chat('${cmdmsg}')

    }
}) 

`, () => {
        console.log('Successfully saved & maded');
    })