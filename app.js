const eventForm = document.getElementById('eventForm');
const eventName = document.getElementById('eventName');
const eventDate = document.getElementById('eventDate');
const eventNote = document.getElementById('eventNote');
const eventList = document.getElementById('eventList');
const unitSelect = document.getElementById('unit');
const toggleMode = document.getElementById('toggleMode');

let events = JSON.parse(localStorage.getItem('events')) || [];
let currentUnit = unitSelect.value;

// Emoji badge per event type
function getImage(eventName) {
  const name = eventName.toLowerCase();
  if (name.includes("birthday")) return "🎂";
  if (name.includes("christmas")) return "🎄";
  if (name.includes("exam") || name.includes("test")) return "📝";
  if (name.includes("vacation") || name.includes("holiday")) return "🏖️";
  return "📅";
}

// Countdown calculations
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

// Save/load events
function saveEvents() { localStorage.setItem('events', JSON.stringify(events)); }

// Render events
function renderEvents() {
  eventList.innerHTML = '';
  events.sort((a,b) => new Date(a.date) - new Date(b.date));

  events.forEach((ev,index) => {
    const li = document.createElement('li');
    li.className = "bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg flex items-center gap-4 transition-transform hover:scale-[1.01]";

    const emoji = getImage(ev.name);

    li.innerHTML = `
      <div class="w-12 h-12 flex items-center justify-center text-2xl rounded-full bg-white dark:bg-gray-700 shadow-md">${emoji}</div>
      <div class="flex-1">
        <h3 class="text-xl font-semibold">${ev.name}</h3>
        ${ev.note ? `<p class="text-sm font-medium text-gray-500 dark:text-gray-400">${ev.note}</p>` : ''}
      </div>
      <div class="text-2xl font-bold text-blue-500 dark:text-blue-400">${getCountdown(ev.date,currentUnit)} ${currentUnit}</div>
      <button class="px-3 py-1 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors">Delete</button>
    `;

    li.querySelector('button').onclick = () => {
      events.splice(index,1);
      saveEvents();
      renderEvents();
    };

    eventList.appendChild(li);
  });
}

// Event form
eventForm.addEventListener('submit', e => {
  e.preventDefault();
  events.push({ name:eventName.value, date:eventDate.value, note:eventNote.value });
  saveEvents();
  renderEvents();
  eventForm.reset();
});

// Unit selector
unitSelect.addEventListener('change', e => {
  currentUnit = e.target.value;
  renderEvents();
});

// Dark mode toggle via settings icon
toggleMode.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Auto update every minute
setInterval(renderEvents, 60000);
renderEvents();
