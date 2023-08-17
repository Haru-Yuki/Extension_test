document.querySelector('#addToBlackList').addEventListener('click', () => {
    const url = document.querySelector('#blackListInput').value;
    const domainRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

    if (url.match(domainRegex)) {
        addToList(url);
    } else {
        alert('Please, enter valid domain!')
    }
});

const renderBlackList = () => {
    const blackListList = document.querySelector('#blockedList');
    blackListList.innerHTML = '';

    chrome.storage.local.get().then((storage) => {
        const blackList = storage.blackList;
        const listFragment = new DocumentFragment();

        if (blackList?.length) {
            blackList.forEach((item) => {
                const blackListItem = document.createElement('li');
                const remove = document.createElement('span');

                blackListItem.innerText = item.url;
                remove.innerText = ' X';

                blackListItem.insertAdjacentElement('beforeend', remove);
                listFragment.append(blackListItem);

                remove.addEventListener('click', function handleRemove(e) {
                    if (e.target.nodeName === 'SPAN') {
                        removeFromList(item.id);
                    }
                    remove.removeEventListener('click', handleRemove);
                });
            })

            blackListList.insertBefore(listFragment, blackList.firstChild);
        }
    });
};

renderBlackList();

const addToList = (url) => {
    chrome.storage.local.get().then((storage) => {
        const blackList = storage.blackList;
        const domain = {
            url: url,
            id: self.crypto.randomUUID()
        };

        if (blackList.find(item => item.url === domain.url)) {
            alert('You have already added such a domain to blacklist!')
            return;
        }

        blackList.push(domain);

        chrome.storage.local.set({ blackList });

        blockDomain(domain);
        renderBlackList();
    });
};

const removeFromList = (id) => {
    chrome.storage.local.get().then((storage) => {
        const blackList = storage.blackList.filter((item) => {
            return item.id !== id
        });

        chrome.storage.local.set({ blackList });

        unblockDomain(id);
        renderBlackList();
    });
};

const blockDomain = (domain) => {
    domain = {
        url: domain.url,
        id: parseInt(domain.id.match(/\d/g).join('').substring(0, 5), 10)
    };

    chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [{
            'id': domain.id,
            'priority': 1,
            'action': {
                'type': 'block'
            },
            'condition': {
                'urlFilter': domain.url,
                'resourceTypes': [
                    'csp_report', 'font', 'image', 'main_frame', 'media', 'object', 'other', 'ping', 'script',
                    'stylesheet', 'sub_frame', 'webbundle', 'websocket', 'webtransport', 'xmlhttprequest'
                ]
            }
        }]
    });
};

const unblockDomain = (id) => {
    id = parseInt(id.match(/\d/g).join('').substring(0, 5), 10);

    chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: [id] });
};