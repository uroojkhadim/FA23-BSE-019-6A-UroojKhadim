import { getSearch, postUpload } from './js/routes/timetableRoutes.js';

const el = {
  searchInput: document.getElementById('searchInput'),
  searchBtn: document.getElementById('searchBtn'),
  historySelect: document.getElementById('historySelect'),
  spinner: document.getElementById('spinner'),
  fileInput: document.getElementById('fileInput'),
  uploadBtn: document.getElementById('uploadBtn'),
  uploadStatus: document.getElementById('uploadStatus'),
  resultsTitle: document.getElementById('resultsTitle'),
  resultsSubtitle: document.getElementById('resultsSubtitle'),
  timetableGrid: document.getElementById('timetableGrid'),
  themeToggle: document.getElementById('themeToggle'),
  themeToggleTop: document.getElementById('themeToggleTop'),
  downloadBtn: document.getElementById('downloadBtn'),
  toast: document.getElementById('toast'),
};

function smoothScrollTo(id) {
  const target = document.getElementById(id);
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showToast(text) {
  el.toast.textContent = text;
  el.toast.classList.remove('hidden');
  setTimeout(() => el.toast.classList.add('hidden'), 2000);
}

function setTheme(name) {
  document.documentElement.setAttribute('data-theme', name);
  if (el.themeToggle) el.themeToggle.textContent = name === 'light' ? 'Light' : 'Dark';
  if (el.themeToggleTop) el.themeToggleTop.textContent = name === 'light' ? 'Light' : 'Dark';
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  setTheme(next);
  localStorage.setItem('tt-theme', next);
}

function loadTheme() {
  const saved = localStorage.getItem('tt-theme') || 'light';
  setTheme(saved);
}

function addHistoryItem(q) {
  const key = 'tt-history';
  const current = JSON.parse(localStorage.getItem(key) || '[]');
  const next = [q, ...current.filter((x) => x !== q)].slice(0, 6);
  localStorage.setItem(key, JSON.stringify(next));
  renderHistory();
}

function renderHistory() {
  const key = 'tt-history';
  const items = JSON.parse(localStorage.getItem(key) || '[]');
  el.historySelect.innerHTML = `<option value="">Search history</option>` + items.map((q) => `<option>${q}</option>`).join('');
}

function setLoading(flag) {
  el.spinner.classList.toggle('hidden', !flag);
}

function renderResults(title, subtitle, weekly) {
  el.resultsTitle.textContent = title;
  el.resultsSubtitle.textContent = subtitle;
  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  el.timetableGrid.innerHTML = '';
  for (const day of daysOrder) {
    const daySlots = weekly[day] || [];
    const dayEl = document.createElement('div');
    dayEl.className = 'day';
    dayEl.innerHTML = `<div class="day-title">${day}</div>`;
    for (const slot of daySlots) {
      const card = document.createElement('div');
      card.className = 'slot';
      const meta = [`${slot.room}`, slot.className ? slot.className : slot.teacher].filter(Boolean).join(' • ');
      card.innerHTML = `
        <div class="time">${slot.time}</div>
        <div class="subject">${slot.subject}</div>
        <div class="meta">${meta}</div>
      `;
      dayEl.appendChild(card);
    }
    el.timetableGrid.appendChild(dayEl);
  }
}

async function onSearch(q) {
  const query = (q ?? el.searchInput.value).trim();
  if (!query) {
    showToast('Enter a search term');
    return;
  }
  setLoading(true);
  const res = await getSearch(query);
  setLoading(false);
  if (!res.ok) {
    showToast(res.error || 'No results');
    return;
  }
  addHistoryItem(query);
  renderResults(res.data.title, res.data.subtitle, res.data.weekly);
}

async function onUpload() {
  const file = el.fileInput.files?.[0];
  if (!file) {
    showToast('Select a PDF to upload');
    return;
  }
  el.uploadStatus.textContent = 'Uploading...';
  const res = await postUpload(file);
  if (!res.ok) {
    el.uploadStatus.textContent = res.error || 'Upload failed';
    showToast('Upload failed');
    return;
  }
  el.uploadStatus.textContent = `Uploaded: ${res.data.name}`;
  showToast('Upload successful');
}

function onDownload() {
  window.print();
}

function init() {
  loadTheme();
  renderHistory();
  el.searchBtn.addEventListener('click', () => onSearch());
  el.searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') onSearch();
  });
  el.historySelect.addEventListener('change', (e) => {
    if (e.target.value) onSearch(e.target.value);
  });
  el.uploadBtn.addEventListener('click', onUpload);
  el.themeToggle.addEventListener('click', toggleTheme);
  if (el.themeToggleTop) el.themeToggleTop.addEventListener('click', toggleTheme);
  el.downloadBtn.addEventListener('click', onDownload);
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.getAttribute('href').replace('#', '');
      smoothScrollTo(id);
    });
  });
}

init();
