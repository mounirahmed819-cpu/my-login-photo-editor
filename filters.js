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

function applyPreset(presetName) {
  const preset = FILTER_PRESETS[presetName];
  if (!preset) return;

  // تحديث state اللي موجود في script.js
  Object.entries(preset).forEach(([key, value]) => {
    state[key] = value;
    if (controls[key]) controls[key].value = value;
  });

  updateControlLabels();
  if (state.image) drawImageToCanvas();
}

function setupPresetButtons() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // إزالة active من الكل
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // تطبيق الفلتر
      applyPreset(btn.dataset.filter);
    });
  });
}

// تهيئة الفلاتر
setupPresetButtons();
