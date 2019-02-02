require('dotenv').config()
import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as url from "url";

const isDev = true

let mainWindow: Electron.BrowserWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      webSecurity: false,
      nodeIntegrationInWorker: true,
      plugins: true
    },
    height: 600,
    width: 800
  });


  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, '..', 'client', "index.html"),
      protocol: "file:",
      slashes: true
    })
  );

  mainWindow.webContents.openDevTools();


  if (isDev) {
    const {default: installExtension, MOBX_DEVTOOLS} = require("electron-devtools-installer");
    installExtension(MOBX_DEVTOOLS);
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}


app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

