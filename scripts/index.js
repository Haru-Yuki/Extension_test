const blackList = document.querySelector('#blackList');
const mainMenu = document.querySelector('#mainMenu');
const json = document.querySelector('#JSON-overwrite');
const back = document.querySelector('#back');

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get().then((storage) => {
        if (!storage.blackList || !Array.isArray(storage.blackList)) {
            chrome.storage.local.set({
                blackList: []
            });
        }

        switch (storage.openedTab) {
            case 'blackList':
                showBlackList();
                break;
            case 'JSON':
                showJSON();
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

document.querySelector('#openJSON').addEventListener('click', () => {
    showJSON();

    chrome.storage.local.set({openedTab: 'JSON'});
});

back.addEventListener('click', () => {
    showHome();

    chrome.storage.local.set({openedTab: null});
});

const showHome = () => {
    back.style.display = 'none';
    blackList.style.display = 'none';
    json.style.display = 'none';
    mainMenu.style.display = 'block';
}

const showBlackList = () => {
    back.style.display = 'block';
    blackList.style.display = 'block';
    json.style.display = 'none';
    mainMenu.style.display = 'none';
}

const showJSON = () => {
    back.style.display = 'block';
    json.style.display = 'block';
    blackList.style.display = 'none';
    mainMenu.style.display = 'none';
}