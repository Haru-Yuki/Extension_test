document.querySelector('#remindersForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const reminderText = document.querySelector('#reminderInput').value;
    const reminderDate = document.querySelector('#reminderInputDate').valueAsNumber;

    addReminderToList(reminderText, reminderDate);
});

chrome.storage.onChanged.addListener(() => {
    renderRemindersList();
});

const renderRemindersList = () => {
    const remindersList = document.querySelector('#remindersList');
    remindersList.innerHTML = '';

    chrome.storage.local.get().then((storage) => {
        const remindersListStorage = storage.reminders;
        const listFragment = new DocumentFragment();

        if (remindersListStorage?.length) {
            remindersListStorage.forEach((reminder) => {
                const remindersItem = document.createElement('li');
                const remove = document.createElement('button');
                const formattedDate = document.createElement('div');
                let formattedDateText = new Date(reminder.date).toUTCString();
                formattedDateText = formattedDateText.substring(0, formattedDateText.length - 7);

                formattedDate.classList.add('reminder-date');
                formattedDate.innerText = formattedDateText;
                remindersItem.innerText = reminder.text;
                remove.innerText = 'Remove';
                remove.classList.add('button', 'button--remove')

                remindersItem.appendChild(formattedDate).append(remove);
                listFragment.append(remindersItem);

                remove.addEventListener('click', function handleRemove(e) {
                    if (e.target.nodeName === 'BUTTON') {
                        removeReminderFromList(reminder.id);
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

        if (reminders.find(reminder => reminder.text === reminderText && reminder.date === reminderDate)) {
            alert('You have already added such a reminder!')
            return;
        }

        reminders.push(reminder);

        chrome.storage.local.set({ reminders });
    });
};

const removeReminderFromList = (id) => {
    chrome.storage.local.get().then((storage) => {
        const reminders = storage.reminders.filter((item) => {
            return item.id !== id
        });

        chrome.storage.local.set({ reminders });
    });
};