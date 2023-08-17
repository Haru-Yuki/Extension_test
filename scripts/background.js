chrome.runtime.onInstalled.addListener(async () => {
    for (const contentScripts of chrome.runtime.getManifest().content_scripts) {
        for (const tab of await chrome.tabs.query({url: contentScripts.matches})) {
            chrome.scripting.executeScript({
                target: {tabId: tab.id},
                files: contentScripts.js,
            });
        }
    }
});