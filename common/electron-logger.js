"use strict";

const Loggr = require("./loggr");

module.exports = exports = {
    
    init: /** @returns {Loggr} */ function(){
        if("loggr" in global)
            return global.loggr;
        
        let loggr = Loggr.init();
        loggr.skipWritingFile = true;
        loggr.register(
            {
                name: "error",
                color: "#cc0000",
                defaultShown: true
            }, 
            {
                name: "info",
                color: "#cccccc",
                defaultShown: !!process.argv.find(arg=>(/info/gi).test(arg))
            }, 
            {
                name: "debug",
                color: "#888888",
                defaultShown: !!process.argv.find(arg=>(/debug/gi).test(arg))
            },
            {
                name: "ok",
                color: "#008800",
                defaultShown: true
            },
            {
                name: "fail",
                color: "#880000",
                defaultShown: true
            },
            {
                name: "lessc",
                color: "#886600",
                defaultShown: !!process.argv.find(arg=>(/debug/gi).test(arg))
            },
            {
                name: "cli",
                color: "#006688",
                defaultShown: !!process.argv.find(arg=>(/debug/gi).test(arg))
            }
        );
        global.loggr = loggr;
        return loggr;
    }
}
