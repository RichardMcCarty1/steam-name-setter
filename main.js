const { app, BrowserWindow, ipcMain, Tray, Menu, session } = require('electron')
const { Steam } = require('./steam/steam')
const { dracFlowLyrics } = require('./dracula-flow')
const path = require('node:path')

let steamObj = new Steam();

let win, tray, ses;

ipcMain.on('submit-login', (_event, arg) => {
    ses.cookies.set({
      url: 'http://10.0.0.1',
      name: 'login',
      value: JSON.stringify({ accountName: arg.accountName, password: arg.password }),
      expirationDate: new Date().setDate(new Date().getDate() + 14)
    }).then((comp) => console.log(comp))
    .catch(err => console.log(err));
    steamObj.logOn(arg.accountName, arg.password);
});

ipcMain.on('start-nickname', (_event, arg) => {
    steamObj.initSetNickname(arg.nicknameList, arg.ms < 30000 ? 30000 : arg.ms);
});

ipcMain.on('stop-nickname', (_event, _arg) => {
    steamObj.stopSetNickname();
})

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.on('minimize', () => {
    win.setSkipTaskbar(true);
  });

  win.on('restore', () => {
    win.setSkipTaskbar(false);
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

  steamObj.on('error', function(err) {
    win.webContents.send('logon-error', err);
    setTimeout(() => {
      win.restore();
      win.flashFrame(true);
    }, 1000);
  })

  ses.cookies.get({ name: 'login' })
    .then((cookie) => {
      if (cookie && cookie[0]) {
        let value = JSON.parse(cookie[0].value);
        steamObj.logOn(value.accountName, value.password);
      }
    })
    .catch((err) => console.log(err));
  win.loadFile('index.html')
}

app.whenReady().then(() => {
  ses = session.fromPartition('persist:main');
  tray = new Tray(path.join(__dirname, 'draculaflow.ico'))
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show', click: () => win.show() },
    { label: 'Quit', click: () => win.close() },
  ])
  tray.setToolTip('This shit aint nothin to me man')
  tray.setContextMenu(contextMenu)
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