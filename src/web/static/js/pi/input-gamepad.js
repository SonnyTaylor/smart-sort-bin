/**
 * Smart Bin — Gamepad Input
 * Left stick pan/tilt (through the throttled sender), face buttons for actions.
 */
var SB = window.SB || {};

SB.inputGamepad = (function () {
  const DEADZONE = 0.15;
  let lastBtns = [];

  function isActive() {
    const gp = navigator.getGamepads()[SB.state.gamepadIndex];
    if (!gp) return false;
    return Math.abs(gp.axes[0]) > DEADZONE || Math.abs(gp.axes[1]) > DEADZONE;
  }

  function updateStatus(gp) {
    const nameEl = document.getElementById('gamepad-name');
    const detail = document.getElementById('gamepad-detail');
    if (gp) {
      if (nameEl) nameEl.textContent = gp.id.slice(0, 28);
      if (detail) detail.style.display = 'flex';
      const lx = document.getElementById('gp-lx');
      const ly = document.getElementById('gp-ly');
      if (lx) lx.textContent = gp.axes[0].toFixed(2);
      if (ly) ly.textContent = gp.axes[1].toFixed(2);
    } else {
      if (nameEl) nameEl.textContent = 'Not connected';
      if (detail) detail.style.display = 'none';
    }
  }

  function poll() {
    requestAnimationFrame(poll);

    const gps = navigator.getGamepads();
    let gp = null;
    for (let i = 0; i < gps.length; i++) {
      if (gps[i]) { gp = gps[i]; SB.state.gamepadIndex = i; break; }
    }
    if (!gp) {
      SB.state.gamepadIndex = null;
      updateStatus(null);
      return;
    }

    updateStatus(gp);
    if (!SB.state.gamepadControlActive) return;

    // Left stick → incremental pan/tilt (throttled sender coalesces)
    const lx = Math.abs(gp.axes[0]) > DEADZONE ? gp.axes[0] : 0;
    const ly = Math.abs(gp.axes[1]) > DEADZONE ? gp.axes[1] : 0;
    const invert = SB.state.gamepadInvertY ? -1 : 1;

    if (lx !== 0 || ly !== 0) {
      SB.servos.setTarget(
        SB.state.currentPan + lx * 0.02,
        SB.state.currentTilt - ly * invert * 0.02
      );
    }

    // Buttons (edge-triggered)
    const btns = gp.buttons.map((b) => b.pressed);
    if (btns[0] && !lastBtns[0]) SB.servos.home();                       // A
    if (btns[1] && !lastBtns[1]) SB.servos.sortToBin('general');         // B
    if (btns[2] && !lastBtns[2]) SB.servos.sortToBin('recycling');       // X
    if (btns[3] && !lastBtns[3]) SB.servos.sortToBin('compost');         // Y
    if (btns[4] && !lastBtns[4]) SB.servos.setAxis('pan', SB.state.currentPan - 0.25); // LB
    if (btns[5] && !lastBtns[5]) SB.servos.setAxis('pan', SB.state.currentPan + 0.25); // RB
    lastBtns = btns;
  }

  function bind() {
    document.getElementById('gp-enabled')?.addEventListener('change', (e) => {
      SB.state.gamepadControlActive = e.target.checked;
    });
    document.getElementById('gp-invert-y')?.addEventListener('change', (e) => {
      SB.state.gamepadInvertY = e.target.checked;
    });

    window.addEventListener('gamepadconnected', (e) => {
      SB.state.gamepadIndex = e.gamepad.index;
      SB.ui.toast(`Gamepad connected: ${e.gamepad.id.slice(0, 24)}`, 'success');
    });

    poll();
  }

  return { bind, isActive };
})();

window.SB = SB;
