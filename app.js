const tabs = {
  home:     document.getElementById('tab-home'),
  history:  document.getElementById('tab-history'),
  add:      document.getElementById('tab-add'),
  settings: document.getElementById('tab-settings')
};
const sections = {
  home:     document.getElementById('home-section'),
  history:  document.getElementById('history-section'),
  add:      document.getElementById('add-section'),
  settings: document.getElementById('settings-section')
};

function showSection(id) {
  Object.values(sections).forEach(sec => sec.classList.add('hidden'));
  Object.values(tabs).forEach(tab => tab.removeAttribute('aria-current'));
  sections[id].classList.remove('hidden');
  tabs[id].setAttribute('aria-current', 'page');
}
Object.keys(tabs).forEach(id =>
  tabs[id].addEventListener('click', () => showSection(id))
);

// Cancel and Save logic for Add section
const cancelAdd = document.getElementById('cancelAdd');
const itemForm  = document.getElementById('itemForm');

cancelAdd.addEventListener('click', () => showSection('home'));
itemForm.addEventListener('submit', e => {
  e.preventDefault();
  // existing save logic here
  showSection('home');
});

// Initialize
showSection('home');
updateRecent();
