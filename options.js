document.addEventListener('DOMContentLoaded', () => {
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const saveBtn = document.getElementById('saveBtn');
  const statusDiv = document.getElementById('status');

  // Load saved data
  chrome.storage.local.get(['username', 'password'], (result) => {
    if (result.username) usernameInput.value = result.username;
    if (result.password) passwordInput.value = result.password;
  });

  saveBtn.addEventListener('click', () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    chrome.storage.local.set({
      username: username,
      password: password
    }, () => {
      statusDiv.textContent = 'Credentials saved! You can close this tab.';
      setTimeout(() => {
        statusDiv.textContent = '';
      }, 3000);
    });
  });
});
