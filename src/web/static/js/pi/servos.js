/**
 * Smart Bin — Servo Control
 * XY pad, sliders, presets, and a throttled sender.
 *
 * All inputs route through setTarget(): the UI updates instantly, and a
 * single loop POSTs the latest values at most every SEND_INTERVAL ms.
 * No more one-request-per-pixel bursts; the backend slew thread handles
 * physical smoothing.
 */
var SB = window.SB || {};

SB.servos = (function () {
  const SEND_INTERVAL = 60; // ms between servo POSTs while input is moving

  let dirty = false;
  let sending = false;
  let sendTimer = null;

  // ── Throttled sender ──

  function setTarget(pan, tilt) {
    if (pan !== null && pan !== undefined) {
      SB.state.currentPan = clamp(pan);
    }
    if (tilt !== null && tilt !== undefined) {
      SB.state.currentTilt = clamp(tilt);
    }
    dirty = true;
    updateDisplays();
    scheduleSend();
  }

  function clamp(v) {
    return Math.max(-1, Math.min(1, Math.round(parseFloat(v) * 100) / 100));
  }

  function scheduleSend() {
    if (sendTimer) return;
    sendTimer = setTimeout(flush, SEND_INTERVAL);
  }

  async function flush() {
    sendTimer = null;
    if (!dirty || sending) {
      if (dirty) scheduleSend();
      return;
    }
    dirty = false;
    sending = true;
    const pan = SB.state.currentPan;
    const tilt = SB.state.currentTilt;
    try {
      await SB.api.move(pan, tilt);
    } catch (err) {
      console.error('Servo send failed:', err);
    } finally {
      sending = false;
      if (dirty) scheduleSend(); // send whatever changed while in flight
    }
  }

  // ── Display sync ──

  function updateDisplays() {
    const pan = SB.state.currentPan;
    const tilt = SB.state.currentTilt;

    setText('pan-display', pan.toFixed(2));
    setText('tilt-display', tilt.toFixed(2));
    setValue('pan-slider', pan);
    setValue('tilt-slider', tilt);
    setValue('pan-input', pan.toFixed(2));
    setValue('tilt-input', tilt.toFixed(2));
    positionDot(pan, tilt);
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function setValue(id, value) {
    const el = document.getElementById(id);
    if (el && document.activeElement !== el) el.value = value;
  }

  // ── XY pad ──

  function positionDot(pan, tilt) {
    const dot = document.getElementById('xy-dot');
    if (!dot) return;
    // pan -1..1 → 0..100% left; tilt +1 (up) → 0% top
    dot.style.left = `${((pan + 1) / 2) * 100}%`;
    dot.style.top = `${((1 - tilt) / 2) * 100}%`;
  }

  function showGhost(pan, tilt) {
    const ghost = document.getElementById('xy-ghost');
    if (!ghost) return;
    ghost.classList.add('visible');
    ghost.style.left = `${((pan + 1) / 2) * 100}%`;
    ghost.style.top = `${((1 - tilt) / 2) * 100}%`;
    clearTimeout(showGhost._hide);
    showGhost._hide = setTimeout(() => ghost.classList.remove('visible'), 600);
  }

  function initPad() {
    const pad = document.getElementById('xy-pad');
    if (!pad) return;

    let dragging = false;

    function fromEvent(e) {
      const rect = pad.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;   // 0..1
      const y = (e.clientY - rect.top) / rect.height;   // 0..1
      const pan = clamp(x * 2 - 1);
      const tilt = clamp(1 - y * 2);
      setTarget(pan, tilt);
    }

    pad.addEventListener('pointerdown', (e) => {
      dragging = true;
      pad.classList.add('dragging');
      pad.setPointerCapture(e.pointerId);
      fromEvent(e);
    });

    pad.addEventListener('pointermove', (e) => {
      if (dragging) fromEvent(e);
    });

    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      pad.classList.remove('dragging');
      fromEvent(e);
    }

    pad.addEventListener('pointerup', endDrag);
    pad.addEventListener('pointercancel', () => {
      dragging = false;
      pad.classList.remove('dragging');
    });

    // Arrow keys nudge when the pad is focused
    pad.addEventListener('keydown', (e) => {
      const step = SB.state.nudgeStep;
      switch (e.key) {
        case 'ArrowLeft': e.preventDefault(); nudge('pan', -1); break;
        case 'ArrowRight': e.preventDefault(); nudge('pan', 1); break;
        case 'ArrowUp': e.preventDefault(); nudge('tilt', 1); break;
        case 'ArrowDown': e.preventDefault(); nudge('tilt', -1); break;
        case 'Home': e.preventDefault(); home(); break;
      }
    });
  }

  // ── Actions ──

  function nudge(axis, direction) {
    const step = SB.state.nudgeStep;
    if (axis === 'pan') setTarget(SB.state.currentPan + direction * step, null);
    else setTarget(null, SB.state.currentTilt + direction * step);
  }

  function setAxis(axis, value) {
    if (axis === 'pan') setTarget(value, null);
    else setTarget(null, value);
  }

  function home() {
    SB.state.currentPan = 0;
    SB.state.currentTilt = 0;
    dirty = false; // don't race the home request with a stale move
    updateDisplays();
    SB.api.home().catch((err) => console.error('Home failed:', err));
  }

  async function sortToBin(category) {
    try {
      SB.ui.toast(`Sorting to ${category}…`, 'info');
      await SB.api.testCalibration(category);
      SB.state.currentPan = 0;
      SB.state.currentTilt = 0;
      updateDisplays();
    } catch (err) {
      SB.ui.toast(`Sort failed: ${err.message}`, 'error');
    }
  }

  function updatePresetLabels() {
    const cal = SB.state.calibration;
    if (!cal) return;
    for (const cat of ['general', 'recycling', 'compost']) {
      const el = document.getElementById(`preset-pos-${cat}`);
      const pan = cal.categories?.[cat]?.pan;
      if (el && pan !== undefined) {
        el.textContent = (pan > 0 ? '+' : '') + pan.toFixed(2);
      }
    }
  }

  // ── Bindings ──

  function bind() {
    initPad();

    // Sliders — live but throttled through setTarget
    document.getElementById('pan-slider')?.addEventListener('input', (e) => setTarget(e.target.value, null));
    document.getElementById('tilt-slider')?.addEventListener('input', (e) => setTarget(null, e.target.value));

    // Number inputs
    document.getElementById('pan-input')?.addEventListener('change', (e) => setTarget(e.target.value, null));
    document.getElementById('tilt-input')?.addEventListener('change', (e) => setTarget(null, e.target.value));

    // Nudge step
    SB.ui.initSeg('step-seg', (btn) => {
      SB.state.nudgeStep = parseFloat(btn.dataset.step);
    });

    // Presets
    document.querySelectorAll('#preset-row .preset').forEach((btn) => {
      btn.addEventListener('click', () => sortToBin(btn.dataset.category));
    });

    // Home
    document.getElementById('btn-home')?.addEventListener('click', home);
  }

  return {
    bind,
    setTarget,
    nudge,
    setAxis,
    home,
    sortToBin,
    updateDisplays,
    updatePresetLabels,
    showGhost,
  };
})();

window.SB = SB;
