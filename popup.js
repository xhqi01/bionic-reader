const toggle = document.getElementById('toggle');
const statusText = document.getElementById('status-text');

function updateUI(enabled) {
  toggle.checked = enabled;
  statusText.textContent = enabled ? 'On' : 'Off';
}

// Get current tab state
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tabId = tabs[0].id;

  chrome.tabs.sendMessage(tabId, { type: 'GET_STATE' }, (res) => {
    if (chrome.runtime.lastError || !res) {
      updateUI(false);
      return;
    }
    updateUI(res.enabled);
  });

  toggle.addEventListener('change', () => {
    const enabled = toggle.checked;
    updateUI(enabled);

    chrome.tabs.sendMessage(tabId, { type: 'TOGGLE', enabled }, () => {
      chrome.storage.local.set({ bionicEnabled: enabled });
    });
  });
});
