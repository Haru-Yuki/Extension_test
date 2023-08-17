const renderBlackList = () => {
    const blackListList = document.querySelector('#blockedList');
    blackListList.innerHTML = '';

    chrome.storage.local.get().then((storage) => {
        const blackList = storage.blackList;

        if (blackList && blackList.length > 0) {
            blackList.forEach((item, i) => {
                const blackListItem = document.createElement('li');
                blackListItem.innerText = item.url;
                const remove = document.createElement('span');
                remove.innerText = ' X';
                remove.id = 'id-' + item.id;
                blackListItem.insertAdjacentElement('beforeend', remove);
                blackListList.insertAdjacentElement('beforeend', blackListItem);

                document.querySelector(`#id-${item.id}`).addEventListener('click', (e) => {
                    if (e.target.nodeName === 'SPAN') {
                        e.target.parentNode.remove();

                        removeFromList(item.id);
                    }
                })
            })
        }
    });
}

renderBlackList();

document.querySelector('#addToBlackList').addEventListener('click', () => {
    const url = document.querySelector('#blackListInput').value;
    const domainRegex = /^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

    if (url.match(domainRegex)) {
        addToList(url);
    } else {
        alert('Please, enter valid domain!')
    }
});

const addToList = (url) => {
    chrome.storage.local.get().then((storage) => {
        const blackList = storage.blackList;
        const domain = {
            url: url,
            id: self.crypto.randomUUID()
        }

        if (blackList.find(item => item.url = domain.url)) {
            return;
        }

        blackList.push(domain);

        chrome.storage.local.set({
            blackList: blackList
        })

        blockDomain(domain);
        renderBlackList();
    })
}

const removeFromList = (id) => {
    chrome.storage.local.get().then((storage) => {
        const blackList = storage.blackList.filter((item) => {
            return item.id !== id
        });

        chrome.storage.local.set({
            blackList: blackList
        })

        unblockDomain(id);
        renderBlackList();
    })
}

const blockDomain = (domain) => {
    domain = {
        url: `||${domain.url}/`,
        id: parseInt(domain.id.match(/\d/g).join('').substring(0, 5), 10)
    }

    console.log(domain);

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
    })
}

const unblockDomain = (id) => {
    id = parseInt(id.match(/\d/g).join('').substring(0, 5), 10);

    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [id]
    })
}