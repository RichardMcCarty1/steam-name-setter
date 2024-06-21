const { app, BrowserWindow, ipcMain } = require('electron')
const { Steam } = require('./steam/steam')
const { dracFlowLyrics } = require('./dracula-flow')
const path = require('node:path')

let steamObj = new Steam();

ipcMain.on('submit-login', (_event, arg) => {
    steamObj.logOn(arg.accountName, arg.password);
});

ipcMain.on('start-nickname', (_event, arg) => {
    steamObj.initSetNickname(arg.nicknameList, arg.ms < 30000 ? 30000 : arg.ms);
});

ipcMain.on('stop-nickname', (_event, _arg) => {
    steamObj.stopSetNickname();
})

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  steamObj.setWindow(win);

  steamObj.on('loggedOn', function(details) {
    win.webContents.send('logged-on', {
        username: steamObj.getUsername(),
        nicknameList: dracFlowLyrics
    });
  });

  steamObj.on('steamGuard', function(domain, callback, lastCodeWrong) {
    win.webContents.send('steam-guard', lastCodeWrong);
    ipcMain.on('steam-guard-sent', (_event, code) => {
        callback(code)
    });
  });

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})