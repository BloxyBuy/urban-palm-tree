/* 
© 2021 by Mineboty 
© Team IC
Author - Kartik

*/

function mineboty() {
    console.log("\x1B[36m \x1B[1m Welcome to mineboty v1.0.6 see :- \x1B[31m https://www.npmjs.com/package/mineboty");
    console.log("\x1B[35m \x1B[1mJoin discord :- \x1B[31m https://teamic.ml/");
    console.log("\x1B[31m You have any problem or issues you can see this & frok also :) :- \x1B[32m[30m https://github.com/Team-IC/Mineboty");
    return require("./runnerboty/runnerboty")
}


function online() {
    return require("./online")
}

function eat() {
    return require("./eat")
}

function cmd() {
    return require("mineflayer-cmd")
}

function pvp() {
    return require("./pvp")
}

function inv() {
    return require("./runnermodules/runwebinv")
}

function ne() {
    return require("./runnermodules/new")
}


function mcc() {
    return require("./mcc")
}

function paste() {
    return require("./paste")
}



module.exports = { mineboty, online, eat, pvp, inv, cmd, ne, paste, mcc };