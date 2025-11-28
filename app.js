const eventForm = document.getElementById('eventForm');
const eventName = document.getElementById('eventName');
const eventDate = document.getElementById('eventDate');
const eventList = document.getElementById('eventList');

let events = JSON.parse(localStorage.getItem('events')) || [];

function saveEvents() {
  localStorage.setItem('events', JSON.stringify(events));
}

function renderEvents() {
  eventList.innerHTML = '';
  events.forEach((ev, index) => {
    const li = document.createElement('li');
    const days = Math.ceil((new Date(ev.date) - new Date()) / (1000*60*60*24));
    li.innerHTML = `<span>${ev.name}: ${days} day${days !== 1 ? 's' : ''}</span>`;
    const delBtn = document.createElement('button');
    delBtn.classList.add('delete-btn');
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => {
      events.splice(index, 1);
      saveEvents();
      renderEvents();
    };
    li.appendChild(delBtn);
    eventList.appendChild(li);
  });
}

eventForm.addEventListener('submit', e => {
  e.preventDefault();
  events.push({ name: eventName.value, date: eventDate.value });
  saveEvents();
  renderEvents();
  eventForm.reset();
});

renderEvents();
