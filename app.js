const tabs = {
  home:       document.getElementById('tab-home'),
  'my-items': document.getElementById('tab-my-items'),
  add:        document.getElementById('tab-add'),
  settings:   document.getElementById('tab-settings')
};
const sections = {
  home:       document.getElementById('home-section'),
  'my-items': document.getElementById('my-items-section'),
  add:        document.getElementById('add-section'),
  settings:   document.getElementById('settings-section')
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

function renderItems(listElem, data) {
  if (!data.length) {
    listElem.innerHTML = '<p class="placeholder">No items found.</p>';
    return;
  }
  listElem.innerHTML = data.map((it, idx) => `
  <div class="card">
    <div class="actions">
      <button onclick="startEdit(${idx})"><img src="icons/edit.png" alt="Edit"></button>
      <button onclick="deleteItem(${idx})"><img src="icons/delete.png" alt="Delete"></button>
    </div>
    <div class="item-title">${it.name}</div>
    <div class="item-meta">Shop: ${it.shop}</div>
    <div class="item-meta">${it.address}</div>
    <div class="item-meta">${it.date} • ${it.category} • Warranty: ${it.warranty}</div>
    ${it.details?`<div class="item-desc">${it.details}</div>`:''}
  </div>
`).join('');
}

function updateRecent() {
  const filter = document.getElementById('filterInput').value.toLowerCase();
  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(filter) ||
    i.shop.toLowerCase().includes(filter)
  );
  renderItems(document.getElementById('recentList'), filtered);
}

document.getElementById('filterInput').addEventListener('input', updateRecent);

window.startEdit = idx => {
  const it = items[idx];
  showSection('add');
  document.getElementById('itemName').value    = it.name;
  document.getElementById('shopName').value    = it.shop;
  document.getElementById('shopAddress').value = it.address;
  document.getElementById('itemDate').value    = it.date;
  document.getElementById('itemCategory').value= it.category;
  document.getElementById('itemWarranty').value= it.warranty;
  document.getElementById('itemDetails').value = it.details;
  editIndex = idx;
};

window.deleteItem = idx => {
  if (confirm('Delete this item?')) {
    items.splice(idx,1);
    localStorage.setItem('purchaseItems', JSON.stringify(items));
    updateRecent();
  }
};

let editIndex = null;
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
  if (editIndex !== null) items[editIndex] = data;
  else items.unshift(data);

  localStorage.setItem('purchaseItems', JSON.stringify(items));
  editIndex = null;
  itemForm.reset();
  updateRecent();
  showSection('my-items');
});

// Initialize default view
showSection('my-items');
updateRecent();
