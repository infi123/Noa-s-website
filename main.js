// Function to calculate the elapsed days
function calculateElapsedDays(startDate) {
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - startDate.getTime();
  const elapsedDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  return elapsedDays;
}



// Function to update the counter element with animation
function updateCounter() {
  const counterTextElement = document.getElementById('counter-text');
  const startDate = new Date('2021-09-25');
  const currentDays = calculateElapsedDays(startDate);

  let startValue = 0;
  const step = 1;
  const duration = 1000; // Duration of animation in milliseconds
  const interval = duration / currentDays;

  const animation = setInterval(() => {
    startValue += step;
    counterTextElement.textContent = `${startValue} Days memory was created`; // Modify the text here

    if (startValue >= currentDays) {
      counterTextElement.textContent = `${currentDays} Days memory was created`; // Modify the text here
      clearInterval(animation);
    }
  }, interval);
}

// Call the updateCounter function initially to display the initial value
updateCounter();

// Update the counter every day at midnight
setInterval(updateCounter, 24 * 60 * 60 * 1000);

// Function to generate the calendar slots
function generateCalendarSlots() {
  const calendarSlots = document.querySelector('.calendar-slots');

  const currentDate = new Date();
  const totalDays = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const currentMonthText = document.getElementById('currentMonth');
  currentMonthText.textContent = formatDate(currentDate);

  for (let day = 1; day <= totalDays; day++) {
    const slot = document.createElement('div');
    slot.classList.add('calendar-slot');

    const slotNumber = document.createElement('div');
    slotNumber.classList.add('slot-number');
    slotNumber.textContent = day;
    slot.appendChild(slotNumber);

    const notes = document.createElement('div');
    notes.classList.add('notes');
    const storedNote = getNoteFromStorage(formatDate(currentDate), day);
    if (storedNote) {
      notes.textContent = storedNote;
    }
    slot.appendChild(notes);

    slot.addEventListener('click', () =>
      deleteNoteFromStorage(formatDate(currentDate), day)
    );

    calendarSlots.appendChild(slot);
  }
}

const calendarSlots = document.querySelector('.calendar-slots');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const currentMonthText = document.getElementById('currentMonth');
const notesInput = document.getElementById('notesInput');
const addNoteBtn = document.getElementById('addNoteBtn');

let currentDate = new Date();

prevMonthBtn.addEventListener('click', goToPreviousMonth);
nextMonthBtn.addEventListener('click', goToNextMonth);
addNoteBtn.addEventListener('click', addNote);

renderCalendar();

function renderCalendar() {
  calendarSlots.innerHTML = '';

  const totalDays = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  currentMonthText.textContent = formatDate(currentDate);

  for (let day = 1; day <= totalDays; day++) {
    const slot = document.createElement('div');
    slot.classList.add('calendar-slot');

    const slotNumber = document.createElement('div');
    slotNumber.classList.add('slot-number');
    slotNumber.textContent = day;
    slot.appendChild(slotNumber);

    const notes = document.createElement('div');
    notes.classList.add('notes');
    const storedNote = getNoteFromStorage(formatDate(currentDate), day);
    if (storedNote) {
      notes.textContent = storedNote;
    }
    slot.appendChild(notes);

    slot.addEventListener('click', () =>
      deleteNoteFromStorage(formatDate(currentDate), day)
    );

    calendarSlots.appendChild(slot);
  }
}

function goToPreviousMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
}

function goToNextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
}

function addNote() {
  const notes = document.querySelectorAll('.notes');
  const inputText = notesInput.value.trim();
  if (inputText !== '') {
    notes.forEach((note) => {
      if (note.parentElement.classList.contains('selected')) {
        note.textContent = inputText;
        saveNoteToStorage(
          formatDate(currentDate),
          parseInt(note.parentElement.firstChild.textContent),
          inputText
        );
      }
    });
  }
  notesInput.value = '';
}

function formatDate(date) {
  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
  const year = date.getFullYear();
  return `${month} ${year}`;
}

function saveNoteToStorage(date, day, note) {
  const notes = JSON.parse(localStorage.getItem('notes')) || {};
  notes[date] = notes[date] || {};
  notes[date][day] = note;
  localStorage.setItem('notes', JSON.stringify(notes));
}

function getNoteFromStorage(date, day) {
  const notes = JSON.parse(localStorage.getItem('notes')) || {};
  if (notes[date] && notes[date][day]) {
    return notes[date][day];
  }
  return null;
}

function deleteNoteFromStorage(date, day) {
  const notes = JSON.parse(localStorage.getItem('notes')) || {};
  if (notes[date] && notes[date][day]) {
    delete notes[date][day];
    localStorage.setItem('notes', JSON.stringify(notes));
    renderCalendar();
  }
}

// Function to retrieve notes from localStorage
function getNotes(dateString) {
  const notes = localStorage.getItem(dateString);
  return notes ? JSON.parse(notes) : [];
}

// Function to save notes to localStorage
function saveNotes(dateString, notes) {
  localStorage.setItem(dateString, JSON.stringify(notes));
}

// Function to render notes in the slot
function renderNotes(slot, dateString) {
  const notes = getNotes(dateString);
  const notesContainer = slot.querySelector('.notes');
  notesContainer.innerHTML = '';

  notes.forEach((note, index) => {
    const noteElement = document.createElement('div');
    noteElement.textContent = note;
    noteElement.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      const notes = getNotes(dateString);
      notes.splice(index, 1);
      saveNotes(dateString, notes);
      renderNotes(slot, dateString);
    });
    notesContainer.appendChild(noteElement);
  });
}

// Event listener for adding and deleting notes
document.addEventListener('DOMContentLoaded', function() {
  const slots = document.querySelectorAll('.calendar-slot');

  slots.forEach((slot) => {
    const slotNumber = slot.querySelector('.slot-number');
    const dateString = `2023-05-${slotNumber.textContent}`;

    // Render existing notes
    renderNotes(slot, dateString);

    // Add note functionality
    slot.addEventListener('click', function(event) {
      const target = event.target;
      const isSlot = target.classList.contains('calendar-slot');
      const isNumber = target.classList.contains('slot-number');
      
      if (isSlot || isNumber) {
        const note = prompt('Enter a note:');
        if (note) {
          const notes = getNotes(dateString);
          notes.push(note);
          saveNotes(dateString, notes);
          renderNotes(slot, dateString);
        }
      }
    });

    // Delete note functionality
    slot.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      const target = e.target;
      const isSlot = target.classList.contains('calendar-slot');
      const isNumber = target.classList.contains('slot-number');

      if (isSlot || isNumber) {
        const notes = getNotes(dateString);
        const noteIndex = Array.from(slot.querySelectorAll('.notes div')).indexOf(target);
        if (noteIndex !== -1) {
          notes.splice(noteIndex, 1);
          saveNotes(dateString, notes);
          renderNotes(slot, dateString);
        }
      }
    });
  });
});




// Check if the slots have already been generated
if (!localStorage.getItem('slotsGenerated')) {
  // Generate the slots if not already generated
  generateCalendarSlots();
  localStorage.setItem('slotsGenerated', 'true');
}
