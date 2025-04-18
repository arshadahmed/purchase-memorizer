// iOS bottom-bar hide hack (in-browser)
window.addEventListener('load', () => {
  setTimeout(() => window.scrollTo(0,1), 0);
});

const tabs = {
  home:     document.getElementById('tab-home'),
  history:  document.getElementById('tab-history'),
  settings: document.getElementById('tab-settings')
};
const sections = {
  home:     document.getElementById('home-section'),
  history:  document.getElementById('history-section'),
  settings: document.getElementById('settings-section')
};
const addButton    = document.getElementById('addButton'),
      formOverlay  = document.getElementById('formOverlay'),
      itemForm     = document.getElementById('itemForm'),
      cancelButton = document.getElementById('cancelButton');

let items = [], editIndex = null;

function showSection(id) {
  Object.values(sections).forEach(s => s.classList.add('hidden'));
  Object.values(tabs).forEach(t => t.removeAttribute('aria-current'));
  sections[id].classList.remove('hidden');
  tabs[id].setAttribute('aria-current','page');
}
Object.keys(tabs).forEach(id =>
  tabs[id].addEventListener('click', () => showSection(id))
);

addButton.addEventListener('click', () => {
  editIndex = null;
  document.getElementById('formTitle').textContent = 'Add Purchase';
  formOverlay.classList.remove('hidden');
  showSection('home');
});

cancelButton.addEventListener('click', () => {
  formOverlay.classList.add('hidden');
  itemForm.reset();
  showSection('home');
});
formOverlay.addEventListener('click', e => {
  if (e.target.id==='formOverlay') {
    formOverlay.classList.add('hidden');
    itemForm.reset();
    showSection('home');
  }
});

itemForm.addEventListener('submit', async e => {
  e.preventDefault();
  const data = {
    name:     document.getElementById('itemName').value.trim(),
    shop:     document.getElementById('shopName').value.trim(),
    address:  document.getElementById('shopAddress').value.trim(),
    date:     document.getElementById('itemDate').value,
    category: document.getElementById('itemCategory').value,
    warranty: document.getElementById('itemWarranty').value,
    details:  document.getElementById('itemDetails').value.trim(),
    receipt:  null
  };
  const f = document.getElementById('itemReceipt').files[0];
  if (f) {
    data.receipt = await new Promise(r => {
      const rdr = new FileReader();
      rdr.onload = () => r(rdr.result);
      rdr.readAsDataURL(f);
    });
  }

  if (editIndex!==null) items[editIndex]=data;
  else items.unshift(data);

  updateRecent();
  itemForm.reset();
  formOverlay.classList.add('hidden');
  showSection('home');
});

function updateRecent() {
  const list = document.getElementById('recentList');
  if (!items.length) {
    list.innerHTML = '<p class="placeholder">No items yet.</p>';
    return;
  }
  list.innerHTML = items.map((it, idx)=>`
    <div class="card">
      <div class="actions">
        <button onclick="startEdit(${idx})"><img src="icons/edit.png" alt="Edit"></button>
        <button onclick="deleteItem(${idx})"><img src="icons/delete.png" alt="Del"></button>
      </div>
      <div class="item-title">${it.name}</div>
      <div class="item-meta">Shop: ${it.shop}</div>
      <div class="item-meta">${it.address}</div>
      <div class="item-meta">${it.date} • ${it.category} • Warranty: ${it.warranty}</div>
      ${it.details?`<div class="item-desc">${it.details}</div>`:''}
      ${it.receipt?`<img src="${it.receipt}" alt="Receipt">`:''}
    </div>
  `).join('');
}

window.startEdit = idx => {
  const it = items[idx];
  editIndex = idx;
  document.getElementById('formTitle').textContent = 'Edit Purchase';
  document.getElementById('itemName').value    = it.name;
  document.getElementById('shopName').value    = it.shop;
  document.getElementById('shopAddress').value = it.address;
  document.getElementById('itemDate').value    = it.date;
  document.getElementById('itemCategory').value= it.category;
  document.getElementById('itemWarranty').value= it.warranty;
  document.getElementById('itemDetails').value = it.details;
  formOverlay.classList.remove('hidden');
};

window.deleteItem = idx => {
  if (confirm('Delete this item?')) {
    items.splice(idx,1);
    updateRecent();
  }
};

// Install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('installButton').classList.remove('hidden');
});
document.getElementById('installButton').addEventListener('click', async()=>{
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  document.getElementById('installButton').classList.add('hidden');
});

showSection('home');
updateRecent();
