const canvas = document.getElementById('editorCanvas');
const ctx = canvas.getContext('2d');
const fileInput = document.getElementById('imageUpload');
const emptyState = document.getElementById('emptyState');
const imageInfo = document.getElementById('imageInfo');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const heroPreview = document.getElementById('heroPreview');
const generateSampleBtn = document.getElementById('generateSample');

const controls = {
  brightness: document.getElementById('brightness'),
  contrast: document.getElementById('contrast'),
  saturation: document.getElementById('saturation'),
  blur: document.getElementById('blur'),
  sepia: document.getElementById('sepia'),
  grayscale: document.getElementById('grayscale'),
  hue: document.getElementById('hue'),
  rotation: document.getElementById('rotation'),
  zoom: document.getElementById('zoom'),
  flipX: document.getElementById('flipX'),
  flipY: document.getElementById('flipY'),
};

const valueLabels = {
  brightness: document.getElementById('brightnessValue'),
  contrast: document.getElementById('contrastValue'),
  saturation: document.getElementById('saturationValue'),
  blur: document.getElementById('blurValue'),
  sepia: document.getElementById('sepiaValue'),
  grayscale: document.getElementById('grayscaleValue'),
  hue: document.getElementById('hueValue'),
};

const DEFAULTS = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  sepia: 0,
  grayscale: 0,
  hue: 0,
  rotation: 0,
  zoom: 100,
  flipX: false,
  flipY: false,
};

const FILTER_PRESETS = {
  none: { brightness: 100, contrast: 100, saturation: 100, blur: 0, sepia: 0, grayscale: 0, hue: 0 },
  grayscale: { brightness: 100, contrast: 110, saturation: 0, blur: 0, sepia: 0, grayscale: 100, hue: 0 },
  sepia: { brightness: 100, contrast: 100, saturation: 80, blur: 0, sepia: 100, grayscale: 0, hue: 0 },
  vintage: { brightness: 110, contrast: 85, saturation: 70, blur: 0, sepia: 40, grayscale: 0, hue: 0 },
  noir: { brightness: 90, contrast: 150, saturation: 0, blur: 0, sepia: 0, grayscale: 100, hue: 0 },
  warm: { brightness: 105, contrast: 105, saturation: 120, blur: 0, sepia: 20, grayscale: 0, hue: 15 },
  cool: { brightness: 100, contrast: 105, saturation: 90, blur: 0, sepia: 0, grayscale: 0, hue: 200 },
  dramatic: { brightness: 90, contrast: 160, saturation: 110, blur: 0, sepia: 0, grayscale: 0, hue: 0 },
  faded: { brightness: 120, contrast: 80, saturation: 60, blur: 0, sepia: 15, grayscale: 0, hue: 0 },
  vivid: { brightness: 110, contrast: 130, saturation: 160, blur: 0, sepia: 0, grayscale: 0, hue: 0 },
  sunset: { brightness: 105, contrast: 110, saturation: 130, blur: 0, sepia: 25, grayscale: 0, hue: 340 },
  ocean: { brightness: 100, contrast: 110, saturation: 100, blur: 0, sepia: 0, grayscale: 0, hue: 190 },
  forest: { brightness: 95, contrast: 110, saturation: 120, blur: 0, sepia: 10, grayscale: 0, hue: 100 },
  retro: { brightness: 110, contrast: 90, saturation: 80, blur: 0, sepia: 50, grayscale: 0, hue: 0 },
  cinema: { brightness: 95, contrast: 140, saturation: 90, blur: 0, sepia: 10, grayscale: 0, hue: 0 },
  polaroid: { brightness: 115, contrast: 90, saturation: 70, blur: 0, sepia: 30, grayscale: 0, hue: 0 },
};

const state = {
  image: null,
  filename: 'edited-image',
  ...DEFAULTS,
};

function updateControlLabels() {
  valueLabels.brightness.textContent = `${state.brightness}%`;
  valueLabels.contrast.textContent = `${state.contrast}%`;
  valueLabels.saturation.textContent = `${state.saturation}%`;
  valueLabels.blur.textContent = `${state.blur}px`;
  valueLabels.sepia.textContent = `${state.sepia}%`;
  valueLabels.grayscale.textContent = `${state.grayscale}%`;
  valueLabels.hue.textContent = `${state.hue}°`;
}

function setDefaults() {
  Object.entries(DEFAULTS).forEach(([key, value]) => {
    state[key] = value;
    if (key === 'flipX' || key === 'flipY') {
      controls[key].checked = Boolean(value);
    } else {
      controls[key].value = value;
    }
  });
  updateControlLabels();
}

function drawImageToCanvas() {
  const image = state.image;
  if (!image) return;

  const maxWidth = 900;
  const maxHeight = 600;
  const ratio = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
  const drawWidth = image.width * ratio;
  const drawHeight = image.height * ratio;

  canvas.width = drawWidth;
  canvas.height = drawHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const rotation = (state.rotation * Math.PI) / 180;
  const zoomMultiplier = state.zoom / 100;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);
  ctx.scale(state.flipX ? -1 : 1, state.flipY ? -1 : 1);
  ctx.filter = `brightness(${state.brightness}%) contrast(${state.contrast}%) saturate(${state.saturation}%) blur(${state.blur}px) sepia(${state.sepia}%) grayscale(${state.grayscale}%) hue-rotate(${state.hue}deg)`;

  const scaledWidth = drawWidth * zoomMultiplier;
  const scaledHeight = drawHeight * zoomMultiplier;

  ctx.drawImage(image, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);

  ctx.restore();
  emptyState.classList.add('hidden');
  imageInfo.textContent = `${Math.round(canvas.width)} × ${Math.round(canvas.height)}`;
}

function applyFilter(presetName) {
  const preset = FILTER_PRESETS[presetName];
  if (!preset) return;

  Object.entries(preset).forEach(([key, value]) => {
    state[key] = value;
    if (controls[key]) controls[key].value = value;
  });

  updateControlLabels();
  if (state.image) drawImageToCanvas();
}

function setupFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-btn');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterName = btn.getAttribute('data-filter');
      applyFilter(filterName);
    });
  });
}

function syncStateFromControls() {
  state.brightness = Number(controls.brightness.value);
  state.contrast = Number(controls.contrast.value);
  state.saturation = Number(controls.saturation.value);
  state.blur = Number(controls.blur.value);
  state.sepia = Number(controls.sepia.value);
  state.grayscale = Number(controls.grayscale.value);
  state.hue = Number(controls.hue.value);
  state.rotation = Number(controls.rotation.value);
  state.zoom = Number(controls.zoom.value);
  state.flipX = controls.flipX.checked;
  state.flipY = controls.flipY.checked;
  updateControlLabels();

  if (state.image) drawImageToCanvas();
}

function applyImageToEditor(file) {
  if (!file || !file.type.startsWith('image/')) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      state.image = img;
      state.filename = file.name.replace(/\.[^/.]+$/, '') || 'edited-image';
      drawImageToCanvas();
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function downloadImage() {
  if (!state.image) return;

  canvas.toBlob((blob) => {
    if (!blob) return;

    const link = document.createElement('a');
    const fileUrl = URL.createObjectURL(blob);
    link.href = fileUrl;
    link.download = `${state.filename}-edited.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(fileUrl);
  }, 'image/png');
}

function loadSampleImage() {
  const sampleUrl = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80';
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    state.image = img;
    state.filename = 'sample-photo';
    drawImageToCanvas();
  };
  img.src = sampleUrl;
}

function attachEvents() {
  Object.keys(controls).forEach((key) => {
    const input = controls[key];
    if (input.type === 'checkbox') {
      input.addEventListener('change', syncStateFromControls);
    } else {
      input.addEventListener('input', syncStateFromControls);
    }
  });

  fileInput.addEventListener('change', (event) => {
    const [file] = event.target.files;
    applyImageToEditor(file);
  });

  const uploadLabel = document.querySelector('.upload-label');

  ['dragenter', 'dragover'].forEach((eventName) => {
    uploadLabel.addEventListener(eventName, (event) => {
      event.preventDefault();
      uploadLabel.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach((eventName) => {
    uploadLabel.addEventListener(eventName, (event) => {
      event.preventDefault();
      uploadLabel.classList.remove('dragover');
    });
  });

  uploadLabel.addEventListener('drop', (event) => {
    const file = event.dataTransfer.files[0];
    applyImageToEditor(file);
  });

  downloadBtn.addEventListener('click', downloadImage);

  resetBtn.addEventListener('click', () => {
    setDefaults();
    document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
    document.querySelector('.filter-btn[data-filter="none"]').classList.add('active');
    if (state.image) drawImageToCanvas();
  });

  generateSampleBtn.addEventListener('click', loadSampleImage);
}

setDefaults();
attachEvents();
setupFilterButtons();

if (heroPreview) {
  heroPreview.addEventListener('error', () => {
    heroPreview.src = 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1000&q=80';
  });
}
