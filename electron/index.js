"use strict";

const 
    IPC = require("../common/electron-ipc"),
    loggr = require("../common/electron-logger").init(),
    Electron = require("electron"),
    path = require("path");


/** @type {Electron.BrowserWindow} */
let mainWindow;

/** @type {IPC} */
let myIPC;


const handleIPC = function(from, ...msg){
    //Nope.
}
const main = function(){
    myIPC = new IPC("Back-end", handleIPC);
    mainWindow = new Electron.BrowserWindow({
        webPreferences: {
            webSecurity: false
        },
        show: true,
        autoHideMenuBar: true,
        width: 1280,
        height: 720,
        useContentSize: true
    });
    
    global.myIPC = myIPC;
    global.mainWindow = mainWindow;
    
    mainWindow.webContents.openDevTools({mode: 'detach'});
    mainWindow.webContents.loadURL(path.join(__base, "cli", "index.htm"));

    mainWindow.webContents.on('new-window', function(e, url){
        if(url != mainWindow.webContents.getURL()){
            e.preventDefault();
            Electron.shell.openExternal(url);
          }
      });
      
}

main();