chrome.action.onClicked.addListener(() => {
  // Open a new browser window when the extension icon is clicked
  chrome.windows.create({
    url: chrome.runtime.getURL("index.html"), // Path to your popup HTML
    type: "normal",  // Open in a normal browser window, not a popup
    width: 600,      // Set window width
    height: 800,     // Set window height
    focused: true    // Focus on the new window
  });
});