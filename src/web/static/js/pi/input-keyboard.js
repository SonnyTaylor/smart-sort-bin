/**
 * Smart Bin — Keyboard Input
 * WASD pan/tilt, shortcuts for sort/home/snapshot.
 */
var SB = window.SB || {};

SB.inputKeyboard = (function () {
  const keys = new Set();
  let continuousInterval = null;

  function onKeyDown(e) {
    if (!SB.state.keyboardEnabled) return;
    if (e.target.matches('input, select, textarea')) return;

    keys.add(e.key.toLowerCase());

    const big = 0.25;
    const small = SB.state.nudgeStep;

    switch (e.key.toLowerCase()) {
      case 'w': SB.servos.nudge('tilt', 1); break;
      case 's': SB.servos.nudge('tilt', -1); break;
      case 'a': SB.servos.nudge('pan', -1); break;
      case 'd': SB.servos.nudge('pan', 1); break;
      case 'q': SB.servos.setAxis('pan', Math.max(-1, SB.state.currentPan - big)); break;
      case 'e': SB.servos.setAxis('pan', Math.min(1, SB.state.currentPan + big)); break;
      case 'h': SB.servos.home(); break;
      case ' ': e.preventDefault(); SB.camera.snapshot(); break;
      case '1': SB.servos.moveToCategory('general'); break;
      case '2': SB.servos.moveToCategory('recycling'); break;
      case '3': SB.servos.moveToCategory('compost'); break;
    }

    if (SB.state.keyboardContinuous && !continuousInterval) {
      continuousInterval = setInterval(() => {
        if (keys.has('w')) SB.servos.nudge('tilt', 1);
        if (keys.has('s')) SB.servos.nudge('tilt', -1);
        if (keys.has('a')) SB.servos.nudge('pan', -1);
        if (keys.has('d')) SB.servos.nudge('pan', 1);
      }, 150);
    }
  }

  function onKeyUp(e) {
    keys.delete(e.key.toLowerCase());
    if (keys.size === 0 && continuousInterval) {
      clearInterval(continuousInterval);
      continuousInterval = null;
    }
  }

  function bind() {
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    document.getElementById('kb-enabled')?.addEventListener('change', (e) => {
      SB.state.keyboardEnabled = e.target.checked;
    });
    document.getElementById('kb-continuous')?.addEventListener('change', (e) => {
      SB.state.keyboardContinuous = e.target.checked;
    });
  }

  return { bind };
})();

window.SB = SB;
