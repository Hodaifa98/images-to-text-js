// ************************ Drag and drop ***************** //
const dropArea = document.getElementById('drop-area');
const selectBtn = document.querySelector('.button');

// Elements.
const convertBtn = document.getElementById('convertBtn');
const waitLabel = document.getElementById('waitLabel');

// Prevent default drag behaviors
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false)   ;
  document.body.addEventListener(eventName, preventDefaults, false);
})

// Highlight drop area when item is dragged over it
;['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false);
})

;['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false);
})

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false);

// Prevent default behaviors.
function preventDefaults (e) {
  e.preventDefault();
  e.stopPropagation();
}

// Highlight file upload area.
function highlight(e) {
  dropArea.classList.add('highlight');
  selectBtn.classList.add('highlight');
}

// Unhighlight file upload area.
function unhighlight(e) {
  dropArea.classList.remove('highlight');
  selectBtn.classList.remove('highlight');
}

// Handle the drop event of a file.
function handleDrop(e) {
  highlight(false);
  document.getElementById('gallery').innerHTML = '';
  var dt = e.dataTransfer;
  var file = dt.files[0];
  document.getElementById('fileElem').files = e.dataTransfer.files;
  // Check if a file is uploaded and it's an image.
  previewFile(file);
}

// Handle upload of files using the button.
function handleFiles(files) {
  highlight(false);
  document.getElementById('gallery').innerHTML = '';
  let file = files[0];
  previewFile(file);
}

// Preview a file and show it beneath the file upload element.
function previewFile(file) {
  let reader = new FileReader();
  reader.readAsDataURL(file)
  reader.onloadend = function() {
    let img = document.createElement('img');
    img.src = reader.result;
    document.getElementById('gallery').appendChild(img);
  }
}

// Reset elements.
function resetElements() {
  document.getElementById('fileElem').value = '';
  document.getElementById('gallery').innerHTML = '';
  unhighlight(false);
  convertBtn.style.display = 'inline';
}

// Handle clicking on the convert button.
convertBtn.addEventListener('click', (e) => {
  let file = document.getElementById('fileElem').files[0];
  convertBtn.style.display = 'none';
  // Check if a file is uploaded and it's an image.
  if (!file || (file.type != 'image/png' && file.type != 'image/jpeg' && file.type != 'image/jpg')) {
    resetElements();
    e.preventDefault();
    return false;
  }
  // Hide button.
  convertBtn.style.display = 'none';
  waitLabel.style.display = 'inline';
});