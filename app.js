const tabs = {
  home:     document.getElementById('tab-home'),
  'my-items': document.getElementById('tab-my-items'),
  add:      document.getElementById('tab-add'),
  settings: document.getElementById('tab-settings')
};
const sections = {
  home:     document.getElementById('home-section'),
  'my-items': document.getElementById('my-items-section'),
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

// Load & render data
let items = JSON.parse(localStorage.getItem('purchaseItems') || '[]');

function updateRecent() {
  const filter = document.getElementById('filterInput').value.toLowerCase();
  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(filter) ||
    i.shop.toLowerCase().includes(filter)
  );
  const list = document.getElementById('recentList');
  if (!filtered.length) {
    list.innerHTML = '<p class="placeholder">No items found.</p>';
    return;
  }
  list.innerHTML = filtered
    .map(it => `<div class="card"><strong>${it.name}</strong> — ${it.shop} — ${it.date}</div>`)
    .join('');
}

document.getElementById('filterInput').addEventListener('input', updateRecent);

// Add section logic
const cancelAdd = document.getElementById('cancelAdd');
const itemForm  = document.getElementById('itemForm');

cancelAdd.addEventListener('click', () => showSection('home'));
itemForm.addEventListener('submit', e => {
  e.preventDefault();
  const data = {
    name:     document.getElementById('itemName').value,
    shop:     document.getElementById('shopName').value,
    address:  document.getElementById('shopAddress').value,
    date:     document.getElementById('itemDate').value,
    category: document.getElementById('itemCategory').value,
    warranty: document.getElementById('itemWarranty').value,
    details:  document.getElementById('itemDetails').value
  };
  items.unshift(data);
  localStorage.setItem('purchaseItems', JSON.stringify(items));
  updateRecent();
  showSection('my-items');
});

// Initialize
showSection('my-items');
updateRecent();
