const SteamUser = require('steam-user'); // Replace this with `require('steam-user');` if used outside of the module directory

class Steam {
    currentListeners = {};

    nameSetter;

    window;

    constructor() {
        this.client = new SteamUser();
    }

    getUsername() {
        return this.client.steamID.toString();
    }

    setWindow(window) {
        this.window = window;
    }

    on(eventName, callback) {
        this.client.on(eventName, callback);
        this.currentListeners[eventName] = callback;
    }

    logOn(accountName, password) {
        this.client.logOn({ accountName, password });
    }

    #setNickname(nicknameList) {
        let newProfileName = nicknameList[Math.floor(Math.random() * nicknameList.length)];
        this.client.setPersona(SteamUser.EPersonaState.Online, newProfileName);
        this.window.webContents.send('name-update', {
            username: newProfileName
        });
    }

    initSetNickname(nicknameList, ms) {
        this.nameSetter = setInterval(() => this.#setNickname(nicknameList), ms);
    }

    stopSetNickname() {
        if (this.nameSetter) {
            clearInterval(this.nameSetter);
        }
    }
}

module.exports = { Steam };
