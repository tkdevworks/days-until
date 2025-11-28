const eventForm = document.getElementById('eventForm');
const eventName = document.getElementById('eventName');
const eventDate = document.getElementById('eventDate');
const eventNote = document.getElementById('eventNote');
const eventList = document.getElementById('eventList');
const unitSelect = document.getElementById('unit');
const toggleMode = document.getElementById('toggleMode');

let events = JSON.parse(localStorage.getItem('events')) || [];
let currentUnit = unitSelect.value;

// Predefined emoji per type
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
  events.sort((a,b) => new Date(a.date) - new Date(b.date));

  events.forEach((ev,index) => {
    const li = document.createElement('li');
    li.className = "bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex items-center justify-between gap-4 transition-transform hover:scale-[1.01]";

    const emoji = getImage(ev.name);

    li.innerHTML = `
      <div class="text-3xl">${emoji}</div>
      <div class="flex-1">
        <h3 class="font-semibold text-lg">${ev.name}</h3>
        ${ev.note ? `<p class="text-sm opacity-70">${ev.note}</p>` : ''}
      </div>
      <div class="font-bold text-blue-500 dark:text-blue-400">${getCountdown(ev.date,currentUnit)} ${currentUnit}</div>
      <button class="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-semibold">Delete</button>
    `;

    li.querySelector('button').onclick = () => {
      events.splice(index,1);
      saveEvents();
      renderEvents();
    };

    eventList.appendChild(li);
  });
}

eventForm.addEventListener('submit', e => {
  e.preventDefault();
  events.push({ name:eventName.value, date:eventDate.value, note:eventNote.value });
  saveEvents();
  renderEvents();
  eventForm.reset();
});

unitSelect.addEventListener('change', e => {
  currentUnit = e.target.value;
  renderEvents();
});

toggleMode.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

setInterval(renderEvents, 60000);

renderEvents();
