"use strict";

const 
    IPC = require("../common/electron-ipc"),
    loggr = require("../common/electron-logger").init(),
    Electron = require("electron"),
    path = require("path"),
    url = require("url");


/** @type {Electron.BrowserWindow} */
let mainWindow;

/** @type {IPC} */
let myIPC;


const handleIPC = function(from, ...msg){
    //Nope.
}
const main = function(){
    loggr.debug(`Creating Back-end IPC...`);
    myIPC = new IPC("Back-end", handleIPC);
    loggr.debug(`Creating Electron.BrowserWindow instance...`);
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

    let cliURL = url.format({
        pathname: path.join(__base, "cli", "index.htm"),
        protocol: "file:",
        slashes: true
    });

    loggr.info(`Navigating to ${cliURL}...`);
    mainWindow.webContents.loadURL(cliURL);
    
    loggr.debug(`Opening DevTools...`);
    mainWindow.webContents.openDevTools({mode: 'undocked'});
    
    mainWindow.webContents.on('new-window', function(e, url){
        if(url != mainWindow.webContents.getURL()){
            e.preventDefault();
            Electron.shell.openExternal(url);
          }
      });
      
}

main();