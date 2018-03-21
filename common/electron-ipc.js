"use strict";

const 
    Electron = require("electron"),
    Loggr = require("./electron-logger");

let loggr;
const insideElectron = Electron => "ipcRenderer" in Electron;

const IPC_CHANNEL = "electronipc";

const _defaultHandler = function(from, ...msg){
    loggr.debug(`From: ${from}\r\n\r\n${this.id}, \r\n${msg.join("\r\n")}`);
}
const _handleIPCMsg = function(event, origin, ...msg){
    loggr.debug(`${this.id} received ${msg.join("").length} bytes from ${origin}.`);

    if(typeof this.listener !== "function") 
        throw new Error("listener is not a function.");

    this.listener(origin, ...msg);
}


class ElectronIPC {
    constructor(myid = "", listener = null){
        if(typeof listener !== "function") 
            listener = _defaultHandler;

        this.listener = listener;
        loggr = Loggr.init();
        this.id = myid;
        this.ipc = insideElectron(Electron) ? Electron.ipcRenderer : Electron.ipcMain;
        this.ipc.on(IPC_CHANNEL, _handleIPCMsg.bind(this));
    }
    set handler(newListener){
        if(typeof newListener !== "function") 
            newListener = _defaultHandler;
        this.listener = newListener;
    }
    get handler(){
        return this.listener;
    }
    send(...msg){
        if(insideElectron(Electron))
            Electron.ipcRenderer.send(IPC_CHANNEL, this.id, ...msg); //send to node.js context in main
        else if(Electron.webContents.getAllWebContents().length > 0)
            Electron.webContents.getAllWebContents().forEach(wc=>wc.send(IPC_CHANNEL, this.id, ...msg)); //send to each renderer context  
        else {

        }
    }
}

module.exports = ElectronIPC;