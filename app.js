const eventForm = document.getElementById('eventForm');
const eventName = document.getElementById('eventName');
const eventDate = document.getElementById('eventDate');
const eventNote = document.getElementById('eventNote');
const eventList = document.getElementById('eventList');
const unitSelect = document.getElementById('unit');
const toggleMode = document.getElementById('toggleMode');

let events = JSON.parse(localStorage.getItem('events')) || [];
let currentUnit = unitSelect.value;

// Predefined emoji/images per type
function getImage(eventName) {
  const name = eventName.toLowerCase();
  if (name.includes("birthday")) return "🎂";
  if (name.includes("christmas")) return "🎄";
  if (name.includes("exam") || name.includes("test")) return "📝";
  if (name.includes("vacation") || name.includes("holiday")) return "🏖️";
  return "📅";
}

function getCountdown(eventDate, unit) {
  const now = new Date();
  const diffMs = new Date(eventDate) - now;

  switch(unit) {
    case 'minutes': return Math.floor(diffMs / (1000*60));
    case 'hours': return Math.floor(diffMs / (1000*60*60));
    case 'days': return Math.ceil(diffMs / (1000*60*60*24));
    case 'weeks': return Math.ceil(diffMs / (1000*60*60*24*7));
    case 'months': return Math.ceil(diffMs / (1000*60*60*24*30));
    default: return Math.ceil(diffMs / (1000*60*60*24));
  }
}

function saveEvents() {
  localStorage.setItem('events', JSON.stringify(events));
}

function renderEvents() {
  eventList.innerHTML = '';

  // Sort events by nearest first
  events.sort((a,b) => new Date(a.date) - new Date(b.date));

  events.forEach((ev, index) => {
    const li = document.createElement('li');

    const emoji = getImage(ev.name);

    li.innerHTML = `
      <div class="event-img">${emoji}</div>
      <div class="event-info">
        <h3>${ev.name}</h3>
        ${ev.note ? `<p>${ev.note}</p>` : ''}
      </div>
      <div class="countdown">${getCountdown(ev.date,currentUnit)} ${currentUnit}</div>
      <button class="delete-btn">Delete</button>
    `;

    li.querySelector('.delete-btn').onclick = () => {
      events.splice(index,1);
      saveEvents();
      renderEvents();
    };

    eventList.appendChild(li);
  });
}

// Form submit
eventForm.addEventListener('submit', e => {
  e.preventDefault();
  events.push({
    name: eventName.value,
    date: eventDate.value,
    note: eventNote.value
  });
  saveEvents();
  renderEvents();
  eventForm.reset();
});

// Unit change
unitSelect.addEventListener('change', e => {
  currentUnit = e.target.value;
  renderEvents();
});

// Dark/light toggle
toggleMode.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Update countdown every minute
setInterval(renderEvents, 60000);

// Initial render
renderEvents();
