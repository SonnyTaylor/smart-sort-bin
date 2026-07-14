/**
 * Smart Bin — Keyboard Input
 * WASD pan/tilt with hold-to-repeat, shortcuts for sort/center/snapshot.
 */
var SB = window.SB || {};

SB.inputKeyboard = (function () {
  const held = new Set();
  let repeatTimer = null;

  const MOVE_KEYS = new Set(['w', 'a', 's', 'd']);

  function applyHeld() {
    if (held.has('w')) SB.servos.nudge('tilt', 1);
    if (held.has('s')) SB.servos.nudge('tilt', -1);
    if (held.has('a')) SB.servos.nudge('pan', -1);
    if (held.has('d')) SB.servos.nudge('pan', 1);
  }

  function onKeyDown(e) {
    if (!SB.state.keyboardEnabled) return;
    if (e.target.matches('input, select, textarea')) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    const key = e.key.toLowerCase();

    if (MOVE_KEYS.has(key)) {
      if (!held.has(key)) {
        held.add(key);
        SB.servos.nudge(
          key === 'w' ? 'tilt' : key === 's' ? 'tilt' : 'pan',
          key === 'w' || key === 'd' ? 1 : -1
        );
      }
      // Hold to repeat
      if (!repeatTimer) {
        repeatTimer = setInterval(applyHeld, 120);
      }
      return;
    }

    switch (key) {
      case 'q': SB.servos.setAxis('pan', SB.state.currentPan - 0.25); break;
      case 'e': SB.servos.setAxis('pan', SB.state.currentPan + 0.25); break;
      case 'h': SB.servos.home(); break;
      case ' ': e.preventDefault(); SB.camera.snapshot(); break;
      case '1': SB.servos.sortToBin('general'); break;
      case '2': SB.servos.sortToBin('recycling'); break;
      case '3': SB.servos.sortToBin('compost'); break;
    }
  }

  function onKeyUp(e) {
    held.delete(e.key.toLowerCase());
    if (held.size === 0 && repeatTimer) {
      clearInterval(repeatTimer);
      repeatTimer = null;
    }
  }

  function bind() {
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', () => {
      held.clear();
      if (repeatTimer) { clearInterval(repeatTimer); repeatTimer = null; }
    });

    document.getElementById('kb-enabled')?.addEventListener('change', (e) => {
      SB.state.keyboardEnabled = e.target.checked;
    });
  }

  return { bind };
})();

window.SB = SB;
