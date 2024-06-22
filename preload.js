const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  submitLogin: (arg) => ipcRenderer.send('submit-login', arg),
  startNickname: (arg) => ipcRenderer.send('start-nickname', arg),
  steamGuardSent: (arg) => ipcRenderer.send('steam-guard-sent', arg),
  stopNickname: (arg) => ipcRenderer.send('stop-nickname', arg),
  onLoggedOn: (callback) => ipcRenderer.on('logged-on', (_event, value) => callback(value)),
  onSteamGuard: (callback) => ipcRenderer.on('steam-guard', (_event, value) => callback(value)),
  onNameUpdate: (callback) => ipcRenderer.on('name-update', (_event, value) => callback(value)),
  onLogonError: (callback) => ipcRenderer.on('logon-error', (_event, value) => callback(value)),
  onNicknameError: (callback) => ipcRenderer.on('nickname-error', (_event) => callback())
})

window.addEventListener('DOMContentLoaded', () => {
    const steamGuardDiv = document.getElementById('steamGuardDiv');
    const nicknameListDiv = document.getElementById('nicknameListDiv');
    const nicknameList = document.getElementById('nicknameList');
    const stopButton = document.getElementById('stop');
    const body = document.getElementsByTagName('body')[0];
    body.style.display = 'table-cell';
    body.style.textAlign = 'center';
    steamGuardDiv.style.display = 'none';
    nicknameListDiv.style.display = 'none';
    nicknameListDiv.style.height = '80%';
    nicknameListDiv.style.width = '80%';
    nicknameList.style.height = '100%';
    nicknameList.style.width = '100%'
    stopButton.style.display = 'none';
    //const replaceText = (selector, text) => {
    //  const element = document.getElementById(selector)
    //  if (element) element.innerText = text
    //}
  //
    //for (const type of ['chrome', 'node', 'electron']) {
    //  replaceText(`${type}-version`, process.versions[type])
    //}
  });