const events = [
  { time: '07:18 — BUS STOP', title: 'THE BUS WAS LATE.', copy: 'Map time: 6 minutes. Real time: 13 minutes. The route waited for me.', note: '+ 7 MINUTES / WAITING' },
  { time: '07:32 — PLACE DU COMMERCE', title: 'THE FASTEST ROUTE FELT THE SLOWEST HERE.', copy: 'People, crossings, noise. A straight line becomes a crowded pause.', note: '+ TOO MUCH NOISE / CROWD EVENT' },
  { time: '07:46 — DETOUR', title: 'I STOPPED TO LISTEN.', copy: 'One small detour. One sound. One memory the map cannot calculate.', note: '+ 11 MINUTES / MEMORY DETOUR' },
  { time: '08:02 — WRONG STOP', title: 'I GOT OFF TOO EARLY.', copy: 'The stop was familiar, but not the right one. For a moment, the city redrew the route.', note: '+ 1 UNPLANNED BLOCK / WRONG TURN' },
  { time: '08:16 — RAIN', title: 'THE WEATHER CHANGED THE MAP.', copy: 'A dry shortcut disappeared. The long way became the only visible way forward.', note: '+ 9 MINUTES / WEATHER DETOUR' },
  { time: '08:24 — CROSSING', title: 'THE LIGHT STAYED RED.', copy: 'The street asked me to wait. The timetable had no category for this pause.', note: '+ 90 SECONDS / UNPLANNED WAIT' },
  { time: '08:31 — LOST OBJECT', title: 'I WENT BACK FOR MY SKETCHBOOK.', copy: 'The route folded back on itself. A mistake became part of the morning.', note: '+ 12 MINUTES / RETURN JOURNEY' },
  { time: '08:37 — STREET SOUND', title: 'A SOUND INTERRUPTED THE ROUTE.', copy: 'A rehearsal, a siren, a voice through an open window. The city changed direction without moving.', note: '+ 1 SOUND / ATTENTION SHIFT' }
];

const ticket = document.querySelector('#ticket');
const reveal = document.querySelector('#reveal');
const viewTabs = document.querySelector('.view-tabs');
const handle = document.querySelector('#tearHandle');
const restart = document.querySelector('#restart');
const routeTab = document.querySelector('#routeTab');
const majorTab = document.querySelector('#majorTab');
const majorView = document.querySelector('#majorView');
const eventNumber = document.querySelector('#eventNumber');
const eventTime = document.querySelector('#eventTime');
const eventTitle = document.querySelector('#eventTitle');
const eventCopy = document.querySelector('#eventCopy');
const eventNote = document.querySelector('#eventNote');
const ticketDate = document.querySelector('#ticketDate');
const stubDate = document.querySelector('#stubDate');
const departureTime = document.querySelector('#departureTime');
const arrivalTime = document.querySelector('#arrivalTime');
let startX = null;
let opened = false;

function setView(view) {
  const isMajor = view === 'major';
  viewTabs.hidden = false;
  reveal.hidden = true;
  ticket.hidden = isMajor;
  majorView.hidden = !isMajor;
  routeTab.classList.toggle('is-active', !isMajor);
  majorTab.classList.toggle('is-active', isMajor);
  routeTab.setAttribute('aria-selected', String(!isMajor));
  majorTab.setAttribute('aria-selected', String(isMajor));
  ticket.classList.remove('opening');
  opened = false;
}

function formatTime(date) {
  return new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false }).format(date);
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).format(date).toUpperCase();
}

function updateTicketTime() {
  const now = new Date();
  const arrival = new Date(now.getTime() + 115 * 60 * 1000);
  const date = formatDate(now);
  if (ticketDate) ticketDate.textContent = date;
  if (stubDate) stubDate.textContent = date;
  if (departureTime) departureTime.textContent = formatTime(now);
  if (arrivalTime) arrivalTime.textContent = formatTime(arrival);
}

function nextEvent() {
  const key = 'my-way-to-school-last-event';
  const previous = Number(localStorage.getItem(key));
  let value = Math.floor(Math.random() * events.length);
  if (Number.isInteger(previous) && events.length > 1 && value === previous) {
    value = (value + 1) % events.length;
  }
  localStorage.setItem(key, String(value));
  return value;
}

function showEvent() {
  if (opened) return;
  opened = true;
  const index = nextEvent();
  const item = events[index];
  eventNumber.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(events.length).padStart(2, '0');
  eventTime.textContent = item.time;
  eventTitle.textContent = item.title;
  eventCopy.textContent = item.copy;
  eventNote.textContent = item.note;
  ticket.classList.add('opening');
  viewTabs.hidden = true;
  majorView.hidden = true;
  window.setTimeout(() => {
    ticket.hidden = true;
    reveal.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 650);
}

handle.addEventListener('click', showEvent);
handle.addEventListener('pointerdown', (event) => {
  startX = event.clientX;
  handle.setPointerCapture?.(event.pointerId);
});
handle.addEventListener('pointerup', (event) => {
  if (startX !== null && event.clientX - startX > 35) showEvent();
  startX = null;
});
restart.addEventListener('click', () => {
  setView('route');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

routeTab.addEventListener('click', () => setView('route'));
majorTab.addEventListener('click', () => setView('major'));

updateTicketTime();
