const timeZoneOffset = new Date().getTimezoneOffset() * 60000;
let intervalID;

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

chrome.runtime.onStartup.addListener(() => {
    if (intervalID) {
        clearInterval(intervalID);
    }
    intervalID = setInterval(checkReminderTime, 1000);
});

const checkReminderTime = () => {
    chrome.storage.local.get().then((storage) => {
        storage.reminders
            .map((reminder) => {
                if ((reminder.date + timeZoneOffset) - Date.now() <= 0) {
                    sendReminderMessage(reminder.text).then(() => {
                        removeReminderFromList(reminder.id);
                    });
                }
            })
    });
}

const sendReminderMessage = async (reminderText) => {
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});

    if (!tab || !tab.title || tab.url.includes('chrome://')) return;

    await chrome.tabs.sendMessage(tab.id, {message: reminderText});
};

const removeReminderFromList = (id) => {
    chrome.storage.local.get().then((storage) => {
        const reminders = storage.reminders.filter((item) => {
            return item.id !== id
        });

        chrome.storage.local.set({ reminders });
    });
};

intervalID = setInterval(checkReminderTime, 1000);