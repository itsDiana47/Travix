// become-traveler.js
// Interactive behaviors: category selection, file upload preview + drag-drop, validation and enabling Post button.

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('tripForm');
  const postBtn = document.getElementById('postBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const ticketInput = document.getElementById('travelTicket');
  const ticketPreview = document.getElementById('ticketPreview');
  const ticketWrapper = document.getElementById('ticketUpload');
  const carryTiles = document.querySelectorAll('#carryTypes .cat-tile');
  const carryInput = document.getElementById('carryInput');
  const requiredIds = ['departureCity','departureDate','arrivalCity','arrivalDate','maxWeight','pricePerKg','travelTicket','confirmResponsible'];
  const errorsEl = document.getElementById('submitErrors');

  // Category selection (supports multiple selection) - store as comma list
  const selectedCarry = new Set();
  carryTiles.forEach(tile => {
    tile.tabIndex = 0;
    tile.addEventListener('click', () => toggleCarry(tile));
    tile.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCarry(tile); }
    });
  });

  function toggleCarry(tile){
    const val = tile.dataset.value;
    if(selectedCarry.has(val)){
      selectedCarry.delete(val);
      tile.classList.remove('selected');
    } else {
      selectedCarry.add(val);
      tile.classList.add('selected');
    }
    carryInput.value = Array.from(selectedCarry).join(',');
    validateForm();
  }

  // Ticket upload: preview images, show filename for pdf, size limit 5MB
  const MAX_BYTES = parseInt(ticketWrapper.dataset.maxbytes, 10) || 5 * 1024 * 1024;
  ticketInput.addEventListener('change', handleTicketChange);
  function handleTicketChange(e){
    const file = e.target.files && e.target.files[0];
    ticketPreview.innerHTML = '';
    ticketPreview.style.display = 'none';
    if(!file) { validateForm(); return; }
    if(file.size > MAX_BYTES){
      ticketPreview.innerHTML = `<div class="file-error">File too large (max ${Math.round(MAX_BYTES/1024/1024)}MB)</div>`;
      ticketPreview.style.display = 'block';
      e.target.value = '';
      validateForm();
      return;
    }
    const type = file.type;
    if(type.startsWith('image/')){
      const img = document.createElement('img');
      img.alt = 'Ticket preview';
      img.src = URL.createObjectURL(file);
      img.onload = () => URL.revokeObjectURL(img.src);
      ticketPreview.appendChild(img);
      ticketPreview.style.display = 'block';
    } else {
      // PDF or other: show filename
      const wrap = document.createElement('div');
      wrap.className = 'file-meta';
      wrap.innerHTML = `<strong>${file.name}</strong> <div class="hint small">${Math.round(file.size/1024)} KB</div>`;
      ticketPreview.appendChild(wrap);
      ticketPreview.style.display = 'block';
    }
    validateForm();
  }

  // Drag & drop support for ticket
  ticketWrapper.addEventListener('dragover', (ev) => { ev.preventDefault(); ticketWrapper.classList.add('dragover'); });
  ticketWrapper.addEventListener('dragleave', () => ticketWrapper.classList.remove('dragover'));
  ticketWrapper.addEventListener('drop', (ev) => {
    ev.preventDefault();
    ticketWrapper.classList.remove('dragover');
    const dt = ev.dataTransfer;
    if(dt && dt.files && dt.files.length){
      ticketInput.files = dt.files;
      ticketInput.dispatchEvent(new Event('change'));
    }
  });

  // Validation summary and enabling post button
  function validateForm(){
    errorsEl.innerHTML = '';
    const errorMsgs = [];

    // required simple checks
    const departureCity = document.getElementById('departureCity').value.trim();
    const departureDate = document.getElementById('departureDate').value;
    const arrivalCity = document.getElementById('arrivalCity').value.trim();
    const arrivalDate = document.getElementById('arrivalDate').value;
    const maxWeight = document.getElementById('maxWeight').value;
    const pricePerKg = document.getElementById('pricePerKg').value;
    const ticketFile = ticketInput.files && ticketInput.files.length ? ticketInput.files[0] : null;
    const confirmResponsible = document.getElementById('confirmResponsible').checked;

    if(!departureCity) errorMsgs.push('Please enter your departure city.');
    if(!departureDate) errorMsgs.push('Please select a departure date.');
    if(!arrivalCity) errorMsgs.push('Please enter your arrival city.');
    if(!arrivalDate) errorMsgs.push('Please select an arrival date.');
    if(selectedCarry.size === 0) errorMsgs.push('Select at least one item type you can carry.');
    if(!maxWeight || Number(maxWeight) <= 0) errorMsgs.push('Enter a valid maximum weight.');
    if(!pricePerKg || Number(pricePerKg) <= 0) errorMsgs.push('Enter a valid price per kg.');
    if(!ticketFile) errorMsgs.push('Upload your travel ticket (PDF, PNG, JPG).');
    if(ticketFile && ticketFile.size > MAX_BYTES) errorMsgs.push('Uploaded ticket exceeds size limit.');
    if(!confirmResponsible) errorMsgs.push('You must confirm responsibility for accepted items.');

    if(errorMsgs.length){
      const ul = document.createElement('ul');
      ul.style.margin = 0;
      ul.style.paddingLeft = '18px';
      errorMsgs.slice(0,6).forEach(m => {
        const li = document.createElement('li');
        li.textContent = m;
        ul.appendChild(li);
      });
      errorsEl.appendChild(ul);
      postBtn.disabled = true;
      postBtn.setAttribute('aria-disabled','true');
      return false;
    } else {
      errorsEl.innerHTML = '';
      postBtn.disabled = false;
      postBtn.removeAttribute('aria-disabled');
      return true;
    }
  }

  // Validate on input events
  form.addEventListener('input', validateForm);
  form.addEventListener('change', validateForm);

  // Cancel behavior
  cancelBtn.addEventListener('click', (e) => {
    if(!confirm('Discard trip and reset the form?')) return;
    form.reset();
    ticketPreview.innerHTML = '';
    ticketPreview.style.display = 'none';
    selectedCarry.clear();
    carryTiles.forEach(t => t.classList.remove('selected'));
    carryInput.value = '';
    validateForm();
  });

  // Submit: demo sends FormData then shows success
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if(!validateForm()) {
      document.getElementById('submitErrors').focus();
      return;
    }
    postBtn.disabled = true;
    postBtn.textContent = 'Posting...';
    // gather data
    const fd = new FormData(form);
    // For demo: log the fields (in real app: send to server)
    const payload = {};
    fd.forEach((v,k) => {
      if(v instanceof File) {
        payload[k] = v.name;
      } else {
        payload[k] = v;
      }
    });

    setTimeout(() => {
      alert('Trip posted (demo).\n\n' + JSON.stringify(payload, null, 2));
      postBtn.textContent = 'Post Your Trip';
      postBtn.disabled = false;
      form.reset();
      ticketPreview.innerHTML = '';
      ticketPreview.style.display = 'none';
      selectedCarry.clear();
      carryTiles.forEach(t => t.classList.remove('selected'));
      carryInput.value = '';
      validateForm();
    }, 800);
  });

  // initial validate
  validateForm();
});