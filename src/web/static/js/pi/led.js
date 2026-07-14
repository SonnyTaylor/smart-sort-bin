/**
 * Smart Bin — LED Ring Control
 */
var SB = window.SB || {};

SB.led = (function () {
  async function set(color) {
    try {
      await SB.api.led(color);
      SB.state.currentLED = color;
      updateUI(color);
    } catch (err) {
      SB.ui.toast('LED error: ' + err.message, 'error');
    }
  }

  function updateUI(color) {
    const label = document.getElementById('led-current');
    if (label) label.textContent = color;
    document.querySelectorAll('.led-swatch').forEach((sw) => {
      sw.classList.toggle('active', sw.dataset.color === color);
    });
  }

  function bind() {
    document.querySelectorAll('.led-swatch').forEach((sw) => {
      sw.addEventListener('click', () => set(sw.dataset.color));
    });
  }

  return { set, updateUI, bind };
})();

window.SB = SB;
