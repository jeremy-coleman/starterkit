'use strict';

var electron = require('electron');
var path = require('path');
var url = require('url');

require('dotenv').config();
const isDev = true;
let mainWindow;
function createWindow() {
    mainWindow = new electron.BrowserWindow({
        webPreferences: {
            webSecurity: false,
            nodeIntegrationInWorker: true,
            plugins: true
        },
        height: 600,
        width: 800
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '..', 'client', "index.html"),
        protocol: "file:",
        slashes: true
    }));
    mainWindow.webContents.openDevTools();
    if (isDev) {
        const { default: installExtension, MOBX_DEVTOOLS } = require("electron-devtools-installer");
        installExtension(MOBX_DEVTOOLS);
    }
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}
electron.app.on("ready", createWindow);
electron.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        electron.app.quit();
    }
});
electron.app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});
