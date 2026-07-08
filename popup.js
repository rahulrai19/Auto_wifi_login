document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('loginBtn');
  const toggleEditBtn = document.getElementById('toggleEditBtn');
  const editForm = document.getElementById('editForm');
  const saveBtn = document.getElementById('saveBtn');
  const statusDiv = document.getElementById('status');

  const loginUrlInput = document.getElementById('loginUrl');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');

  // Load saved data
  chrome.storage.local.get(['loginUrl', 'username', 'password'], (result) => {
    if (result.loginUrl) loginUrlInput.value = result.loginUrl;
    if (result.username) usernameInput.value = result.username;
    if (result.password) passwordInput.value = result.password;
  });

  // Toggle edit form with CSS class for animation
  toggleEditBtn.addEventListener('click', () => {
    editForm.classList.toggle('show');
  });

  // Save credentials
  saveBtn.addEventListener('click', () => {
    chrome.storage.local.set({
      loginUrl: loginUrlInput.value,
      username: usernameInput.value,
      password: passwordInput.value
    }, () => {
      statusDiv.classList.add('show');
      setTimeout(() => statusDiv.classList.remove('show'), 2500);
    });
  });

  // Login directly
  loginBtn.addEventListener('click', () => {
    chrome.storage.local.get(['loginUrl', 'username', 'password'], (result) => {
      if (!result.loginUrl) {
        alert("Please set the Login URL in the Manage Credentials section first.");
        editForm.classList.add('show');
        return;
      }
      if (!result.username || !result.password) {
        alert("Please set your Username and Password first.");
        editForm.classList.add('show');
        return;
      }

      // Open the login URL in a new inactive tab
      let url = result.loginUrl;
      if (!url.startsWith('http')) {
        url = 'http://' + url;
      }
      
      chrome.tabs.create({ url: url, active: false });
      window.close(); // Close the popup
    });
  });
});
