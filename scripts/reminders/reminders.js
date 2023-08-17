document.querySelector('#remindersForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const reminderText = document.querySelector('#reminderInput').value;
    const reminderDate = document.querySelector('#reminderInputDate').valueAsNumber;

    addReminderToList(reminderText, reminderDate);
});

const renderRemindersList = () => {
    const remindersList = document.querySelector('#remindersList');
    remindersList.innerHTML = '';

    chrome.storage.local.get().then((storage) => {
        const remindersListStorage = storage.reminders;
        const listFragment = new DocumentFragment();

        if (remindersListStorage?.length) {
            remindersListStorage.forEach((item) => {
                const remindersItem = document.createElement('li');
                const remove = document.createElement('span');
                const formattedDate = new Date(item.date).toLocaleString();

                remindersItem.innerText = `${item.text} (${formattedDate})`;
                remove.innerText = ' X';

                remindersItem.insertAdjacentElement('beforeend', remove);
                listFragment.append(remindersItem);

                remove.addEventListener('click', function handleRemove(e) {
                    if (e.target.nodeName === 'SPAN') {
                        removeReminderFromList(item.id);
                    }
                    remove.removeEventListener('click', handleRemove);
                });
            })

            remindersList.insertBefore(listFragment, remindersList.firstChild);
        }
    });
};

renderRemindersList();

const addReminderToList = (reminderText, reminderDate) => {
    chrome.storage.local.get().then((storage) => {
        const reminders = storage.reminders;
        const reminder = {
            text: reminderText,
            date: reminderDate,
            id: self.crypto.randomUUID()
        };

        // if (remindersList.find(item => item.text === reminderText)) {
        //     alert('You have already added such a domain to blacklist!')
        //     return;
        // }

        reminders.push(reminder);

        chrome.storage.local.set({ reminders });

        renderRemindersList();
    });
};

const removeReminderFromList = (id) => {
    chrome.storage.local.get().then((storage) => {
        const reminders = storage.reminders.filter((item) => {
            return item.id !== id
        });

        chrome.storage.local.set({ reminders });

        renderRemindersList();
    });
};