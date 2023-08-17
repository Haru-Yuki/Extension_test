const blackList = document.querySelector('#blackList');
const mainMenu = document.querySelector('#mainMenu');
const reminders = document.querySelector('#reminder');
const back = document.querySelector('#back');

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get().then((storage) => {
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

        switch (storage.openedTab) {
            case 'blackList':
                showBlackList();
                break;
            case 'reminders':
                showReminders();
                break;
            default:
                showHome();
                break;
        }
    })
})

document.querySelector('#openBlacklist').addEventListener('click', () => {
    showBlackList();

    chrome.storage.local.set({openedTab: 'blackList'});
});

document.querySelector('#openReminders').addEventListener('click', () => {
    showReminders();

    chrome.storage.local.set({openedTab: 'reminders'});
});

back.addEventListener('click', () => {
    showHome();

    chrome.storage.local.set({openedTab: null});
});

const showHome = () => {
    back.style.display = 'none';
    blackList.style.display = 'none';
    reminders.style.display = 'none';
    mainMenu.style.display = 'block';
}

const showBlackList = () => {
    back.style.display = 'block';
    blackList.style.display = 'block';
    reminders.style.display = 'none';
    mainMenu.style.display = 'none';
}

const showReminders = () => {
    back.style.display = 'block';
    reminders.style.display = 'block';
    blackList.style.display = 'none';
    mainMenu.style.display = 'none';
}