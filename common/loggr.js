"use strict";

const 
    chalk = require("chalk"),
    moment = require("moment"),
    fs = require("fs"),
    path = require("path");

class Loggr {
    utilFileTimestamp(){
        return moment().format("YYYYMMDD-HHmmss-SSS");
    }

    utilMessageTimestamp(now){
        if(!now) now = moment();
        let newday = this.messages.length == 0 || moment([...this.messages].pop().date).date() !== moment(now).date();
        return moment(now).format(`${newday?"YYYY-MM-DD ":""}HH:mm:ss.SSS`);
    }
    utilHexToChalkfn(color){
        return chalk.hex(color);
    }
    constructor(){
        /** @type {Level[]} */
        this.logLevels = [];

        /** @type {Message[]} */
        this.messages = [];
        
        //netstatus-20180213-071700.log
        this.filename = path.basename(__base) + `-${this.utilFileTimestamp()}.log`;
    }

    register(...levels){
        let self = this;
        levels.forEach(level=>{
            let isExistant = self.logLevels.find(searchLevel=>searchLevel.name === level.name);
            if(!isExistant){
                self.logLevels.push(level);
                level.fn = self[level.name] = function(...msg){
                    self.log(level, level.defaultShown, level.color, ...msg);
                };
            }
        });

        return levels;
    }

    log(level, showCon, color, ...msg){
        let now = moment();
        let levelName = level;
        
        if(typeof level === "string"){
            level = this.logLevels.find(searchLevel => searchLevel.name == levelName);
        }
        if(typeof level == "undefined"){
            // return console.error(`Log level non-existent ${levelName}`);
            level = {name: "default"};
        }
        
        let fullmsg = msg.map(msgChunk => String(msgChunk)).join(" ");
        let colorfn = level.color ? (typeof level.color === "string" ? this.utilHexToChalkfn(level.color) : level.color) : chalk;

        let message = {
            plain: `[${this.utilMessageTimestamp(now)}] [${level.name}] ${fullmsg}`,
            formatted: `[${chalk.bold(this.utilMessageTimestamp(now))}] ` + colorfn(`[${level.name}] ${fullmsg}`),
            date: now,
            message: fullmsg,
            level: level,
            shown: showCon
        };

        this.messages.push(message);

        if(showCon)
            console.log(message.formatted);
        if(!("skipWritingFile" in this))
            fs.appendFile(this.filename, message.plain + "\r\n", "utf8", err=>{
                if(err)
                    console.error(chalk.red`Failed to write ${this.filename}! ${err}`);
            });
    }
}


exports = module.exports = {
    init: function(){
        return new Loggr();
    },
    Loggr
}


/**@typedef {Object} Level 
 * @prop {String} name
 * @prop {String} color
 * @prop {Boolean} defaultShown
*/

/** @typedef {Object} Message
 * @prop {Moment.moment} date
 * @prop {String} message
 * @prop {Level} level
 * @prop {boolean} shown 
 */