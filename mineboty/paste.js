"use strict";
var fs = require('fs');
const prompt = require("prompt-sync")({ sigint: true });

let paste = prompt("Enater your Command Name: ");

fs.appendFile(("./runnerboty/runnerboty.js"),
    `


    ${paste}


`, () => {
        console.log('Successfully saved & pasted');
    })