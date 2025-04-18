if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}

const form = document.getElementById('itemForm');
const list = document.getElementById('itemsList');
let items = JSON.parse(localStorage.getItem('purchaseItems') || '[]');

function render() {
  list.innerHTML = '';
  items.forEach((it, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${it.store}</strong> - ${it.date} - $${it.amount.toFixed(2)}
      ${it.receipt ? '<br><img src="' + it.receipt + '">' : ''}
    `;
    list.appendChild(li);
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const store = document.getElementById('store').value;
  const date = document.getElementById('date').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const receiptFile = document.getElementById('receipt').files[0];

  if (receiptFile) {
    const reader = new FileReader();
    reader.onload = () => {
      addItem(store, date, amount, reader.result);
    };
    reader.readAsDataURL(receiptFile);
  } else {
    addItem(store, date, amount, null);
  }
});

function addItem(store, date, amount, receipt) {
  items.push({ store, date, amount, receipt });
  localStorage.setItem('purchaseItems', JSON.stringify(items));
  render();
  form.reset();
}

render();