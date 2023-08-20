chrome.runtime.onMessage.addListener(
    (request) => {
        showReminder(request.message);
    }
);

const showReminder = (message) => {
    const reminder = document.createElement('div');
    const closeButton = document.createElement('button');
    const reminders = document.querySelectorAll('.reminder');

    closeButton.innerText = 'X';
    closeButton.classList.add('reminder-close');

    reminder.innerHTML = `<span class="reminder-icon">&#9432;</span><span class="reminder-text">${message}</span>`;
    reminder.insertAdjacentElement('beforeend', closeButton);
    reminder.classList.add('reminder');

    closeButton.addEventListener('click', (event) => {
        const parentNode = event.target.parentNode;

        if (parentNode.classList.contains('reminder')) {
            parentNode.remove()
        }
    })

    if (reminders.length) {
        let remindersHeight = 0;

        reminders.forEach(reminder => remindersHeight += reminder.offsetHeight + 10);
        reminder.style.top = `${remindersHeight}px`;

        reminders[reminders.length - 1].insertAdjacentElement('afterend', reminder);
    } else {
        document.body.insertAdjacentElement('afterbegin', reminder);
    }
};