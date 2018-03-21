"use strict";

const electron = require("electron");

module.exports = exports = {
    isElectron: (typeof electron === "object" && typeof electron.app === "object"),
    electron
};