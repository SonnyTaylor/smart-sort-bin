/**
 * Smart Bin — Servo Control
 * Sliders, D-pad, joystick, presets, nudge, home.
 */
var SB = window.SB || {};

SB.servos = (function () {
  const DEADZONE = 0.15;

  function updateDisplays() {
    const pan = SB.state.currentPan;
    const tilt = SB.state.currentTilt;

    const panDisp = document.getElementById('pan-display');
    const tiltDisp = document.getElementById('tilt-display');
    const panSlider = document.getElementById('pan-slider');
    const tiltSlider = document.getElementById('tilt-slider');
    const panInput = document.getElementById('pan-input');
    const tiltInput = document.getElementById('tilt-input');
    const joyPan = document.getElementById('joy-pan');
    const joyTilt = document.getElementById('joy-tilt');

    if (panDisp) panDisp.textContent = pan.toFixed(2);
    if (tiltDisp) tiltDisp.textContent = tilt.toFixed(2);
    if (panSlider) panSlider.value = pan;
    if (tiltSlider) tiltSlider.value = tilt;
    if (panInput) panInput.value = pan.toFixed(2);
    if (tiltInput) tiltInput.value = tilt.toFixed(2);
    if (joyPan) joyPan.textContent = pan.toFixed(2);
    if (joyTilt) joyTilt.textContent = tilt.toFixed(2);
  }

  async function send(axis, value) {
    value = Math.max(-1, Math.min(1, parseFloat(value)));
    if (axis === 'pan') SB.state.currentPan = value;
    else SB.state.currentTilt = value;
    updateDisplays();
    try {
      await SB.api.setServo(axis, value);
    } catch (err) {
      console.error('Servo error:', err);
    }
  }

  function nudge(axis, delta) {
    const step = SB.state.nudgeStep;
    const current = axis === 'pan' ? SB.state.currentPan : SB.state.currentTilt;
    const newVal = Math.max(-1, Math.min(1, +(current + delta * step).toFixed(2)));
    send(axis, newVal);
  }

  function setAxis(axis, val) {
    send(axis, val);
  }

  function home() {
    SB.state.currentPan = 0;
    SB.state.currentTilt = 0;
    updateDisplays();
    SB.api.home().catch((err) => console.error('Home error:', err));
    SB.ui.toast('Servos homed', 'success');
  }

  async function moveToCategory(cat) {
    const presets = {
      general: { pan: -0.7 },
      recycling: { pan: 0 },
      compost: { pan: 0.7 },
    };
    const p = presets[cat];
    if (!p) return;
    await send('pan', p.pan);
    await new Promise((r) => setTimeout(r, 600));
    await send('tilt', -0.6);
    await new Promise((r) => setTimeout(r, 1000));
    await send('tilt', 0);
    await new Promise((r) => setTimeout(r, 500));
    await send('pan', 0);
    SB.ui.toast(`${cat} sorted`, 'success');
  }

  async function testDump() {
    const cat = 'general';
    const presets = {
      general: { pan: -0.7 },
      recycling: { pan: 0 },
      compost: { pan: 0.7 },
    };
    SB.ui.toast('Test dump sequence…', 'info');
    await send('pan', presets[cat].pan);
    await new Promise((r) => setTimeout(r, 600));
    await send('tilt', -0.6);
    await new Promise((r) => setTimeout(r, 1000));
    await send('tilt', 0);
    await new Promise((r) => setTimeout(r, 500));
    await send('pan', 0);
    SB.ui.toast('Test dump complete', 'success');
  }

  function setNudgeStep(step) {
    SB.state.nudgeStep = step;
    document.querySelectorAll('.nudge-btn').forEach((btn) => {
      btn.classList.toggle('active', parseFloat(btn.dataset.step) === step);
      if (btn.classList.contains('active')) {
        btn.style.borderColor = 'var(--accent)';
        btn.style.color = 'var(--accent)';
      } else {
        btn.style.borderColor = '';
        btn.style.color = '';
      }
    });
  }

  // ── Joystick ──
  function initJoystick() {
    const zone = document.getElementById('joystick');
    const knob = document.getElementById('joystick-knob');
    if (!zone || !knob) return;

    let dragging = false;
    const maxRadius = 50;

    function updateFromXY(dx, dy) {
      const pan = Math.max(-1, Math.min(1, dx / maxRadius));
      const tilt = Math.max(-1, Math.min(1, -(dy / maxRadius)));
      if (Math.abs(pan) > DEADZONE || Math.abs(tilt) > DEADZONE) {
        SB.state.currentPan = +pan.toFixed(2);
        SB.state.currentTilt = +tilt.toFixed(2);
        updateDisplays();
        if (SB.state.joystickEnabled) {
          send('pan', SB.state.currentPan);
          send('tilt', SB.state.currentTilt);
        }
      }
    }

    function onDown(e) {
      if (!SB.state.joystickEnabled) return;
      dragging = true;
      knob.classList.add('active');
      onMove(e);
    }

    function onMove(e) {
      if (!dragging) return;
      const rect = zone.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      let dx = clientX - cx;
      let dy = clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > maxRadius) {
        dx = (dx / dist) * maxRadius;
        dy = (dy / dist) * maxRadius;
      }
      knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
      updateFromXY(dx, dy);
    }

    function onUp() {
      if (!dragging) return;
      dragging = false;
      knob.classList.remove('active');
      knob.style.transform = 'translate(-50%, -50%)';
      home();
    }

    zone.addEventListener('mousedown', onDown);
    zone.addEventListener('touchstart', onDown, { passive: false });
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchend', onUp);
  }

  function bind() {
    // Sliders
    document.getElementById('pan-slider')?.addEventListener('input', (e) => send('pan', e.target.value));
    document.getElementById('tilt-slider')?.addEventListener('input', (e) => send('tilt', e.target.value));

    // Number inputs
    document.getElementById('pan-input')?.addEventListener('change', (e) => send('pan', e.target.value));
    document.getElementById('tilt-input')?.addEventListener('change', (e) => send('tilt', e.target.value));

    // Nudge buttons
    document.querySelectorAll('.nudge-btn').forEach((btn) => {
      btn.addEventListener('click', () => setNudgeStep(parseFloat(btn.dataset.step)));
    });

    initJoystick();
  }

  return {
    bind,
    updateDisplays,
    send,
    nudge,
    setAxis,
    home,
    moveToCategory,
    testDump,
    setNudgeStep,
  };
})();

window.SB = SB;
