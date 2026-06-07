/**
 * Smart Bin — Gamepad Input
 * Polling-based gamepad API for servo control and actions.
 */
var SB = window.SB || {};

SB.inputGamepad = (function () {
  const DEADZONE = 0.15;
  let lastPan = null;
  let lastTilt = null;
  let lastBtns = [];

  function isActive() {
    const gp = navigator.getGamepads()[SB.state.gamepadIndex];
    if (!gp) return false;
    return (
      Math.abs(gp.axes[0]) > DEADZONE || Math.abs(gp.axes[1]) > DEADZONE
    );
  }

  function updateStatus() {
    const gp = navigator.getGamepads()[SB.state.gamepadIndex];
    const info = document.getElementById('gamepad-info');
    const axesPanel = document.getElementById('gamepad-axes');
    const connectBtn = document.getElementById('btn-gamepad-connect');

    if (gp) {
      if (info) info.innerHTML = `<div style="font-size:0.8125rem;color:var(--status-ok)">✓ ${gp.id.slice(0, 30)}</div>`;
      if (axesPanel) axesPanel.style.display = 'block';
      if (connectBtn) connectBtn.textContent = 'Disconnect';

      document.getElementById('gp-lx').textContent = gp.axes[0].toFixed(2);
      document.getElementById('gp-ly').textContent = gp.axes[1].toFixed(2);
      document.getElementById('gp-rx').textContent = gp.axes[2]?.toFixed(2) || '0.00';
      document.getElementById('gp-ry').textContent = gp.axes[3]?.toFixed(2) || '0.00';
    } else {
      if (info) info.innerHTML = '<div style="font-size:0.8125rem;color:var(--text-muted)">Press a button on your controller to connect</div>';
      if (axesPanel) axesPanel.style.display = 'none';
      if (connectBtn) connectBtn.textContent = 'Connect';
    }
  }

  function poll() {
    requestAnimationFrame(poll);

    const gps = navigator.getGamepads();
    let gp = null;
    for (let i = 0; i < gps.length; i++) {
      if (gps[i]) { gp = gps[i]; SB.state.gamepadIndex = i; break; }
    }
    if (!gp) { SB.state.gamepadIndex = null; updateStatus(); return; }

    updateStatus();
    if (!SB.state.gamepadControlActive) return;

    // Left stick → pan/tilt
    const lx = Math.abs(gp.axes[0]) > DEADZONE ? gp.axes[0] : 0;
    const ly = Math.abs(gp.axes[1]) > DEADZONE ? gp.axes[1] : 0;
    const invert = SB.state.gamepadInvertY ? -1 : 1;

    if (lx !== 0 || ly !== 0) {
      const newPan = Math.max(-1, Math.min(1, SB.state.currentPan + lx * 0.02));
      const newTilt = Math.max(-1, Math.min(1, SB.state.currentTilt - ly * invert * 0.02));
      if (lastPan !== newPan || lastTilt !== newTilt) {
        SB.state.currentPan = +newPan.toFixed(2);
        SB.state.currentTilt = +newTilt.toFixed(2);
        SB.servos.updateDisplays();
        SB.servos.send('pan', SB.state.currentPan);
        SB.servos.send('tilt', SB.state.currentTilt);
        lastPan = newPan;
        lastTilt = newTilt;
      }
    }

    // Buttons
    const btns = gp.buttons.map((b) => b.pressed);
    if (btns[0] && !lastBtns[0]) SB.servos.home();         // A
    if (btns[1] && !lastBtns[1]) SB.servos.moveToCategory('general'); // B
    if (btns[2] && !lastBtns[2]) SB.servos.moveToCategory('recycling'); // X
    if (btns[3] && !lastBtns[3]) SB.servos.moveToCategory('compost'); // Y
    if (btns[4] && !lastBtns[4]) SB.servos.setAxis('pan', Math.max(-1, SB.state.currentPan - 0.25)); // LB
    if (btns[5] && !lastBtns[5]) SB.servos.setAxis('pan', Math.min(1, SB.state.currentPan + 0.25));  // RB
    lastBtns = btns;
  }

  function connect() {
    if (SB.state.gamepadIndex !== null) {
      SB.state.gamepadIndex = null;
      SB.ui.toast('Gamepad disconnected', 'info');
      updateStatus();
      return;
    }
    // Trigger browser to poll for gamepads
    const gps = navigator.getGamepads();
    for (let i = 0; i < gps.length; i++) {
      if (gps[i]) { SB.state.gamepadIndex = i; break; }
    }
    if (SB.state.gamepadIndex === null) {
      SB.ui.toast('No gamepad detected. Press a button.', 'error');
    } else {
      SB.ui.toast('Gamepad connected', 'success');
    }
  }

  function bind() {
    document.getElementById('btn-gamepad-connect')?.addEventListener('click', connect);
    document.getElementById('gp-enabled')?.addEventListener('change', (e) => {
      SB.state.gamepadControlActive = e.target.checked;
    });
    document.getElementById('gp-invert-y')?.addEventListener('change', (e) => {
      SB.state.gamepadInvertY = e.target.checked;
    });

    window.addEventListener('gamepadconnected', (e) => {
      SB.state.gamepadIndex = e.gamepad.index;
      SB.ui.toast(`Gamepad connected: ${e.gamepad.id.slice(0, 20)}`, 'success');
      updateStatus();
    });

    poll();
  }

  return { bind, isActive };
})();

window.SB = SB;
