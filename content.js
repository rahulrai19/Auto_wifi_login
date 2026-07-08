function attemptLogin() {
  // Prevent infinite loops if page reloads without success
  if (sessionStorage.getItem('autoLoginAttempted')) return;

  chrome.storage.local.get(['loginUrl', 'username', 'password'], (result) => {
    const { loginUrl, username, password } = result;

    if (!loginUrl || !username || !password) return;

    // Remove http:// or https:// from loginUrl to make matching more robust
    const searchUrl = loginUrl.replace(/^https?:\/\//, '');
    if (!window.location.href.includes(searchUrl)) return;

    let userField = document.querySelector('input[type="text"], input[name="username"], input[id="username"], input[name="user"], input[name="userId"]');
    let passField = document.querySelector('input[type="password"], input[name="password"], input[id="password"], input[name="pass"]');

    if (userField && passField) {
      sessionStorage.setItem('autoLoginAttempted', 'true');

      userField.value = username;
      userField.dispatchEvent(new Event('input', { bubbles: true }));
      userField.dispatchEvent(new Event('change', { bubbles: true }));

      passField.value = password;
      passField.dispatchEvent(new Event('input', { bubbles: true }));
      passField.dispatchEvent(new Event('change', { bubbles: true }));
      
      let submitBtn = null;
      let form = userField.form || userField.closest('form');
      if (form) {
          submitBtn = form.querySelector('input[type="submit"], button[type="submit"], button');
      } 
      
      if (!submitBtn) {
          submitBtn = document.querySelector('input[type="submit"], button[type="submit"]');
      }

      // Fallback: search literally every element for the exact text "Sign in" or "Login"
      if (!submitBtn) {
          let elements = document.querySelectorAll('button, input, a, div, span');
          for (let el of elements) {
              let text = (el.innerText || el.value || '').trim().toLowerCase();
              if (text === 'sign in' || text === 'login') {
                  // Ensure the element is actually visible on screen
                  if (el.offsetWidth > 0 && el.offsetHeight > 0) {
                      submitBtn = el;
                      break;
                  }
              }
          }
      }

      // Add a slight delay before clicking to allow the page's own scripts to process the input
      setTimeout(() => {
          // Method 1: Press 'Enter' on the password field (Works on 99% of login forms)
          const enterDown = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, keyCode: 13, key: 'Enter' });
          const enterUp = new KeyboardEvent('keyup', { bubbles: true, cancelable: true, keyCode: 13, key: 'Enter' });
          passField.dispatchEvent(enterDown);
          passField.dispatchEvent(enterUp);

          // Method 2: Actually click the button with full synthetic mouse events
          if (submitBtn) {
              submitBtn.click();
              submitBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
              submitBtn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
          } 
          
          // Method 3: Fallback to standard form submission
          if (form) {
              form.submit();
          }
      }, 500);
      
      // Close the tab after 30 seconds to allow the login to process and the success screen to show
      setTimeout(() => {
         chrome.runtime.sendMessage({ action: "closeTab" });
      }, 5000); 
    } else {
      // Retry in case DOM isn't fully loaded
      setTimeout(attemptLogin, 500);
    }
  });
}

// Ensure the DOM is fully loaded before attempting
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(attemptLogin, 500));
} else {
    setTimeout(attemptLogin, 500);
}
