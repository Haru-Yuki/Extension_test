const blackList = document.querySelector('#blackList');
const reminders = document.querySelector('#reminder');

(function initListeners() {
    document.addEventListener('DOMContentLoaded', () => init());
    document.querySelector('#openBlacklist').addEventListener('click', () => manageMenu('blackList'));
    document.querySelector('#openReminders').addEventListener('click', () => manageMenu('reminders'));

})();

const init = () => {
    chrome.storage.local.get().then((storage) => {
        initStore(storage);
        manageMenu(storage.openedTab);
    })
}

const manageMenu = (openedTab) => {
    const blackListRadio = document.querySelector('#openBlacklistInput');
    const remindersRadio = document.querySelector('#openRemindersInput');

    switch (openedTab) {
        case 'blackList':
            blackList.style.display = 'block';
            reminders.style.display = 'none';
            blackListRadio.checked = true;
            break;
        case 'reminders':
            reminders.style.display = 'block';
            blackList.style.display = 'none';
            remindersRadio.checked = true;
            break;
        default:
            blackList.style.display = 'none';
            reminders.style.display = 'none';
            break;
    }

    chrome.storage.local.set({openedTab: openedTab});
}

const initStore = (storage) => {
    if (!storage.blackList || !Array.isArray(storage.blackList)) {
        chrome.storage.local.set({
            blackList: []
        });
    }

    if (!storage.reminders || !Array.isArray(storage.reminders)) {
        chrome.storage.local.set({
            reminders: [],
        });
    }
}