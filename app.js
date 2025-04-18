// Elements for tabs and sections
const homeTab = document.getElementById('tab-home');
const historyTab = document.getElementById('tab-history');
const settingsTab = document.getElementById('tab-settings');
const tabs = [homeTab, historyTab, settingsTab];

const homeSection = document.getElementById('home-section');
const historySection = document.getElementById('history-section');
const settingsSection = document.getElementById('settings-section');
const sections = {
  'home': homeSection,
  'history': historySection,
  'settings': settingsSection
};

// Floating add button and form overlay elements
const addButton = document.getElementById('addButton');
const formOverlay = document.getElementById('formOverlay');
const itemForm = document.getElementById('itemForm');
const cancelButton = document.getElementById('cancelButton');

// Install PWA button
const installButton = document.getElementById('installButton');

// Data store for items (recent items list)
let items = [];

// Function to switch tabs and show the corresponding section
function showSection(sectionId) {
  // Hide all sections and remove active state from all tabs
  for (let key in sections) {
    sections[key].classList.add('hidden');
  }
  tabs.forEach(tab => tab.removeAttribute('aria-current'));
  
  // Show the selected section and mark current tab
  sections[sectionId].classList.remove('hidden');
  const currentTab = document.getElementById(`tab-${sectionId}`);
  currentTab.setAttribute('aria-current', 'page');
}

// Tab button event handlers
homeTab.addEventListener('click', () => showSection('home'));
historyTab.addEventListener('click', () => showSection('history'));
settingsTab.addEventListener('click', () => showSection('settings'));

// Show the form overlay when + button is clicked
addButton.addEventListener('click', () => {
  formOverlay.classList.remove('hidden');
  // If currently in History or Settings, switch to Home in background (so new item will be visible in Home)
  showSection('home');
  // Optionally, focus the first input for accessibility
  document.getElementById('itemName').focus();
});

// Hide the form overlay on cancel or outside click
cancelButton.addEventListener('click', () => {
  formOverlay.classList.add('hidden');
  itemForm.reset();
});
formOverlay.addEventListener('click', (e) => {
  if (e.target.id === 'formOverlay') {  // clicked outside the form content
    formOverlay.classList.add('hidden');
    itemForm.reset();
  }
});

// Handle form submission to add a new item
itemForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // Get form data
  const name = document.getElementById('itemName').value.trim();
  const details = document.getElementById('itemDetails').value.trim();
  if (name === '') return;  // no name, do nothing

  // Add new item to the beginning of the list
  items.unshift({ name, details });
  updateRecentList();

  // Reset and hide the form
  itemForm.reset();
  formOverlay.classList.add('hidden');
  // Ensure Home tab is active to show the new item
  showSection('home');
});

// Update the Home section's recent items list in the UI
function updateRecentList() {
  const listContainer = document.getElementById('recentList');
  if (items.length === 0) {
    // If no items, show placeholder text
    listContainer.innerHTML = '<p class="placeholder">No items yet.</p>';
  } else {
    // Build HTML for each item card
    let listHTML = '';
    items.forEach(item => {
      listHTML += 
        `<div class="card">
           <div class="item-title">${item.name}</div>
           ${item.details ? `<div class="item-desc">${item.details}</div>` : ''}
         </div>`;
    });
    listContainer.innerHTML = listHTML;
  }
}

// PWA install prompt handling
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Show the install button when prompt is available
  installButton.classList.remove('hidden');
});

installButton.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  // Show browser install prompt
  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  if (choice.outcome === 'accepted') {
    console.log('PWA installation accepted');
  } else {
    console.log('PWA installation dismissed');
  }
  // Hide the install button after user makes a choice
  deferredPrompt = null;
  installButton.classList.add('hidden');
});

// (Optional) Handle the appinstalled event to confirm installation
window.addEventListener('appinstalled', () => {
  console.log('PWA was installed');
});

// Initialize: ensure only Home section is visible at start
showSection('home');
updateRecentList();
