"use strict";

const 
    ambient = require("./common/ambient");

global.__base = __dirname;
if(ambient.isElectron)   
    require("./common/electron-main.js");
else 
    require("./common/electron-spawn.js");