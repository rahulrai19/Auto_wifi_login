function attemptLogin() {
  chrome.storage.local.get(['loginUrl', 'username', 'password'], (result) => {
    const { loginUrl, username, password } = result;

    if (!loginUrl || !username || !password) return;

    // Check if the current URL contains the configured login URL snippet
    if (!window.location.href.includes(loginUrl)) return;

    let userField = document.querySelector('input[type="text"], input[name="username"], input[id="username"]');
    let passField = document.querySelector('input[type="password"], input[name="password"], input[id="password"]');
    let submitBtn = document.querySelector('input[type="submit"], button[type="submit"], button');

    if (userField && passField) {
      // Avoid infinite loops if it's already filled
      if (userField.value === username) return;

      userField.value = username;
      passField.value = password;
      
      if (submitBtn) {
          submitBtn.click();
      } else if (userField.form) {
          userField.form.submit();
      }
      
      // Tell the background script to close this tab after a short delay
      // to allow the POST request to complete successfully.
      setTimeout(() => {
         chrome.runtime.sendMessage({ action: "closeTab" });
      }, 2500); 
    }
  });
}

// Ensure the DOM is fully loaded before attempting
setTimeout(attemptLogin, 500);
