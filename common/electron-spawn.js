"use strict";

const ambient = require("./ambient");
const cp = require("child_process");
const fs = require("fs");

if(!ambient.isElectron){
    let electron = cp.spawn(ambient.electron, ["."].concat(process.argv.slice(2)), {
        detached: false,
        stdio: "inherit"
    });
    
    // electron.on("exit", function(){
    //     console.log(`Exited.`);
    // })
    
    // process.on("SIGINT", function(){
    //     console.log(`Exited.`);
    //     if(electron)
    //         electron.kill();
    // });
}
