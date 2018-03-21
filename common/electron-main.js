"use strict";

const electron = require("electron");
const loggr = require("./electron-logger").init();


const readiness = function(){
    if(!electron.app.isReady())
        throw new Error(`Electron is not ready yet!`);
    
    loggr.debug(`Electron is ready to go.`);

    require("../electron/.");
}

const main = function(){
    loggr.info(`Running electron ${process.versions.electron}.`);
    loggr.debug(`Waiting for readiness of Electron...`);

    electron.app.on("ready", readiness);
    process.on("uncaughtException", function(e){
        loggr.error("Uncaught exception: ", e, e.stack, e.message);
        process.exit();
    });    
}

main();