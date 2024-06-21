const helperText = document.getElementById('helperText');
const helperTextValue = document.getElementById('helperTextValue');
const newNameValue = document.getElementById('newNameValue');
const username = document.getElementById('username');
const password = document.getElementById('password');
const steamGuardCode = document.getElementById('steamGuard');
const nicknameList = document.getElementById('nicknameList');
const usernameDiv = document.getElementById('usernameDiv');
const passwordDiv = document.getElementById('passwordDiv');
const steamGuardDiv = document.getElementById('steamGuardDiv');
const nicknameListDiv = document.getElementById('nicknameListDiv');
const submitButton = document.getElementById('submit');
const stopButton = document.getElementById('stop');


submitButton.addEventListener('click', async () => {
  if (usernameDiv.style.display != 'none') {
    if (username.value != "" && password.value != "") {
        await window.electronAPI.submitLogin({ 
            accountName: username.value, 
            password: password.value 
        })
    } else {
        helperTextValue.innerHTML = "Please provide a valid username and password";
    }
  } else if (steamGuardDiv.style.display != 'none') {
    if (steamGuardCode.value != "") {
        await window.electronAPI.steamGuardSent(steamGuardCode.value)
    } else {
        helperTextValue.innerHTML = "Please providate a valid steam guard code";
    }
  } else if (nicknameListDiv.style.display != 'none') {
    helperTextValue.innerHTML = "Now Running with your nickname list!"
    await window.electronAPI.startNickname({
        nicknameList: JSON.parse(nicknameList.value),
        ms: 30000
    });
  }
});

stopButton.addEventListener('click', async () => {
    await window.electronAPI.stopNickname('');
})

window.electronAPI.onLoggedOn((value) => {
    usernameDiv.style.display = 'none';
    passwordDiv.style.display = 'none';
    steamGuardDiv.style.display = 'none';
    nicknameListDiv.style.display = 'block';
    stopButton.style.display = 'inline';
    nicknameList.value = JSON.stringify(value.nicknameList);
    helperTextValue.innerHTML = `You're logged in as ${value.username}`;
});

window.electronAPI.onSteamGuard((lastCodeWrong) => {
    usernameDiv.style.display = 'none';
    passwordDiv.style.display = 'none';
    steamGuardDiv.style.display = 'block';

    if (lastCodeWrong) {
        helperTextValue.innerHTML = 'The previous steam guard code was invalid'
    } else {
        helperTextValue.innerHTML = 'Please input a steam guard code'
    }
});

window.electronAPI.onNameUpdate((value) => {
    newNameValue.innerHTML = ` Your current nickname is ${value.username}`
})