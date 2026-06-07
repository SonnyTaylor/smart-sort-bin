/**
 * Smart Bin — LED Ring Control
 */
var SB = window.SB || {};

SB.led = (function () {
  async function set(color) {
    try {
      await SB.api.led(color);
      SB.state.currentLED = color;
      document.getElementById('led-current').textContent = color;
      // Update swatch active state
      document.querySelectorAll('.led-swatch').forEach((sw) => sw.classList.remove('active'));
      // Find swatch by onclick attribute (simple heuristic)
      const target = Array.from(document.querySelectorAll('.led-swatch')).find(
        (sw) => sw.getAttribute('onclick')?.includes(`'${color}'`)
      );
      if (target) target.classList.add('active');
    } catch (err) {
      SB.ui.toast('LED error: ' + err.message, 'error');
    }
  }

  async function pulse() {
    const colors = ['red', 'yellow', 'green', 'blue', 'purple', 'white'];
    SB.ui.toast('LED pulsing…', 'info');
    for (const c of colors) {
      await set(c);
      await new Promise((r) => setTimeout(r, 300));
    }
    await set('off');
  }

  return { set, pulse };
})();

window.SB = SB;
