const addButton    = document.getElementById('addButton');
const closeOverlay = document.getElementById('closeOverlay');
const formOverlay  = document.getElementById('formOverlay');

addButton.addEventListener('click', () => {
  formOverlay.classList.remove('hidden');
});
closeOverlay.addEventListener('click', () => {
  formOverlay.classList.add('hidden');
});

(function(){
  const cancelButton = document.getElementById('cancelButton');
  const itemForm     = document.getElementById('itemForm');

  cancelButton.addEventListener('click', () => {
    formOverlay.classList.add('hidden');
  });

  itemForm.addEventListener('submit', e => {
    e.preventDefault();
    // …existing save logic here…
    formOverlay.classList.add('hidden');
  });
})();
