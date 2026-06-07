/**
 * Smart Bin — Fun Servo Effects
 * Idle wander, dances, patterns, gestures, and more.
 * Click any effect to start; click again (or "Stop All") to halt.
 */
var SB = window.SB || {};

SB.fun = (function () {
  let activeEffect = null;
  let stopRequested = false;

  // ── Helpers ──

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function moveTo(pan, tilt, duration = 400) {
    const steps = Math.max(1, Math.round(duration / 16));
    const startPan = SB.state.currentPan;
    const startTilt = SB.state.currentTilt;
    const dPan = pan - startPan;
    const dTilt = tilt - startTilt;
    for (let i = 1; i <= steps; i++) {
      if (stopRequested) return;
      const t = i / steps;
      // ease-out cubic
      const e = 1 - Math.pow(1 - t, 3);
      SB.servos.send('pan', +(startPan + dPan * e).toFixed(3));
      SB.servos.send('tilt', +(startTilt + dTilt * e).toFixed(3));
      await sleep(16);
    }
  }

  async function startEffect(name, fn) {
    // Stop any running effect first
    if (activeEffect) {
      stopRequested = true;
      await sleep(150);
    }

    stopRequested = false;
    activeEffect = name;
    updateEffectUI(name);
    SB.ui.toast(`Effect: ${name}`, 'info');

    // Home servos to center before starting
    await moveTo(0, 0, 300);
    await sleep(80);

    try {
      await fn();
    } finally {
      activeEffect = null;
      updateEffectUI(null);
    }
  }

  function stopEffect() {
    if (!activeEffect) return;
    stopRequested = true;
    const name = activeEffect;
    activeEffect = null;
    updateEffectUI(null);
    SB.ui.toast(`Stopped: ${name}`, 'info');
  }

  function updateEffectUI(name) {
    document.querySelectorAll('.fun-btn').forEach((btn) => {
      const isActive = btn.dataset.effect === name;
      btn.classList.toggle('active', isActive);
      if (isActive) {
        btn.style.borderColor = 'var(--accent)';
        btn.style.color = 'var(--accent)';
        btn.style.background = 'rgba(201,169,110,0.08)';
      } else {
        btn.style.borderColor = '';
        btn.style.color = '';
        btn.style.background = '';
      }
    });
    const stopBtn = document.getElementById('btn-fun-stop');
    if (stopBtn) stopBtn.style.display = name ? 'inline-flex' : 'none';
  }

  // ── Effects ──

  // Idle Wander — random smooth moves, looks alive
  async function idleWander() {
    while (!stopRequested) {
      const pan = (Math.random() - 0.5) * 1.4;
      const tilt = (Math.random() - 0.3) * 0.8;
      await moveTo(pan, tilt, 800 + Math.random() * 1200);
      await sleep(500 + Math.random() * 2000);
    }
  }

  // Look Around — slow deliberate scan like a security camera
  async function lookAround() {
    const positions = [
      { pan: -0.8, tilt: 0.1 },
      { pan: 0, tilt: -0.2 },
      { pan: 0.8, tilt: 0.1 },
      { pan: 0.3, tilt: -0.3 },
      { pan: -0.5, tilt: 0.2 },
      { pan: 0, tilt: 0 },
    ];
    for (const pos of positions) {
      if (stopRequested) break;
      await moveTo(pos.pan, pos.tilt, 1000);
      await sleep(800 + Math.random() * 600);
    }
    if (!stopRequested) await moveTo(0, 0, 800);
  }

  // Wave Hello — quick back-and-forth pan
  async function wave() {
    for (let i = 0; i < 6; i++) {
      if (stopRequested) break;
      const dir = i % 2 === 0 ? 0.3 : -0.3;
      await moveTo(dir, -0.2, 150);
      await sleep(120);
    }
    await moveTo(0, 0, 300);
  }

  // Nod Yes — tilt up/down quickly
  async function nod() {
    for (let i = 0; i < 4; i++) {
      if (stopRequested) break;
      await moveTo(0, 0.3, 180);
      await sleep(100);
      await moveTo(0, -0.2, 180);
      await sleep(100);
    }
    await moveTo(0, 0, 300);
  }

  // Shake No — fast pan left/right
  async function shake() {
    for (let i = 0; i < 5; i++) {
      if (stopRequested) break;
      const dir = i % 2 === 0 ? 0.4 : -0.4;
      await moveTo(dir, 0, 120);
      await sleep(80);
    }
    await moveTo(0, 0, 300);
  }

  // Double Take — quick look, pause, look back surprised
  async function doubleTake() {
    await moveTo(-0.6, 0.1, 200);
    await sleep(400);
    if (stopRequested) return;
    await moveTo(0.3, -0.1, 150);
    await sleep(200);
    if (stopRequested) return;
    await moveTo(-0.1, 0.15, 250);
    await sleep(600);
    if (stopRequested) return;
    await moveTo(0, 0, 400);
  }

  // Suspicious Sweep — slow scan left to right like "hmm?"
  async function suspiciousSweep() {
    await moveTo(-0.7, 0.2, 2000);
    await sleep(300);
    if (stopRequested) return;
    await moveTo(0.7, 0.2, 2000);
    await sleep(300);
    if (stopRequested) return;
    await moveTo(0, 0.3, 1500);
    await sleep(800);
    if (!stopRequested) await moveTo(0, 0, 800);
  }

  // Sneeze — jerky movement
  async function sneeze() {
    await moveTo(0, 0.3, 200);
    await sleep(150);
    if (stopRequested) return;
    await moveTo(0.1, -0.5, 80);
    await sleep(100);
    if (stopRequested) return;
    await moveTo(-0.05, -0.4, 100);
    await sleep(600);
    if (stopRequested) return;
    await moveTo(0, 0, 400);
    SB.ui.toast(' bless you!', 'success');
  }

  // Peek-a-boo — tilt up and down like peeking
  async function peekaboo() {
    for (let i = 0; i < 3; i++) {
      if (stopRequested) break;
      await moveTo(0, 0.5, 500);
      await sleep(800);
      if (stopRequested) break;
      await moveTo(0, -0.2, 400);
      await sleep(400);
    }
    if (!stopRequested) await moveTo(0, 0, 300);
  }

  // Tremble — fast tiny movements, looks cold/scared
  async function tremble() {
    const basePan = SB.state.currentPan;
    const baseTilt = SB.state.currentTilt;
    for (let i = 0; i < 40; i++) {
      if (stopRequested) break;
      const dx = (Math.random() - 0.5) * 0.08;
      const dy = (Math.random() - 0.5) * 0.06;
      SB.servos.send('pan', +(basePan + dx).toFixed(3));
      SB.servos.send('tilt', +(baseTilt + dy).toFixed(3));
      await sleep(40);
    }
    SB.servos.send('pan', basePan);
    SB.servos.send('tilt', baseTilt);
  }

  // Head Tilt — curious head tilt like a dog
  async function headTilt() {
    await moveTo(0, 0, 300);
    await sleep(200);
    if (stopRequested) return;
    await moveTo(0.4, 0.3, 600);
    await sleep(1200);
    if (stopRequested) return;
    await moveTo(-0.3, 0.25, 500);
    await sleep(1000);
    if (stopRequested) return;
    await moveTo(0.1, 0.1, 400);
    await sleep(600);
    if (!stopRequested) await moveTo(0, 0, 500);
  }

  // Excited Bounce — fast tilt up/down like a happy puppy
  async function excited() {
    for (let i = 0; i < 8; i++) {
      if (stopRequested) break;
      await moveTo(SB.state.currentPan * 0.5, -0.4, 120);
      await sleep(80);
      if (stopRequested) break;
      await moveTo(SB.state.currentPan * 0.3, 0.2, 120);
      await sleep(80);
    }
    if (!stopRequested) await moveTo(0, 0, 300);
  }

  // Sleepy — slow droop down then back up
  async function sleepy() {
    await moveTo(0, 0.4, 800);
    await sleep(500);
    if (stopRequested) return;
    await moveTo(0.05, 0.55, 1200);
    await sleep(1500);
    if (stopRequested) return;
    await moveTo(0, 0, 1500);
    SB.ui.toast('yawn…', 'info');
  }

  // Panic — fast random movements
  async function panic() {
    for (let i = 0; i < 30; i++) {
      if (stopRequested) break;
      const pan = (Math.random() - 0.5) * 1.6;
      const tilt = (Math.random() - 0.5) * 1.0;
      await moveTo(pan, tilt, 60 + Math.random() * 80);
    }
    if (!stopRequested) await moveTo(0, 0, 300);
  }

  // Dance — fixed BPM, hit poses on each beat
  async function dance() {
    const BPM = 120;
    const beatMs = 60000 / BPM;
    const poses = [
      { pan: -0.5, tilt: 0.3 },
      { pan: 0, tilt: -0.3 },
      { pan: 0.5, tilt: 0.3 },
      { pan: 0, tilt: -0.3 },
      { pan: -0.3, tilt: 0.5 },
      { pan: 0.3, tilt: -0.1 },
      { pan: -0.5, tilt: -0.2 },
      { pan: 0.5, tilt: 0.1 },
    ];
    for (let rep = 0; rep < 4; rep++) {
      for (const pose of poses) {
        if (stopRequested) return;
        await moveTo(pose.pan, pose.tilt, beatMs * 0.7);
        await sleep(beatMs * 0.3);
      }
    }
    if (!stopRequested) await moveTo(0, 0, 400);
  }

  // Circle — smooth circular motion
  async function circle() {
    const steps = 200;
    const radius = 0.35;
    for (let i = 0; i < steps; i++) {
      if (stopRequested) break;
      const angle = (i / steps) * Math.PI * 2;
      const pan = Math.cos(angle) * radius;
      const tilt = Math.sin(angle) * radius;
      SB.servos.send('pan', +pan.toFixed(3));
      SB.servos.send('tilt', +tilt.toFixed(3));
      await sleep(30);
    }
    if (!stopRequested) await moveTo(0, 0, 400);
  }

  // Figure-8 — Lissajous with 1:2 frequency ratio
  async function figure8() {
    const steps = 300;
    const rx = 0.4;
    const ry = 0.3;
    for (let i = 0; i < steps; i++) {
      if (stopRequested) break;
      const t = (i / steps) * Math.PI * 2;
      const pan = Math.sin(t) * rx;
      const tilt = Math.sin(2 * t) * ry;
      SB.servos.send('pan', +pan.toFixed(3));
      SB.servos.send('tilt', +tilt.toFixed(3));
      await sleep(25);
    }
    if (!stopRequested) await moveTo(0, 0, 400);
  }

  // Lissajous — configurable frequency ratio, mesmerizing patterns
  async function lissajous() {
    const freqX = 3;
    const freqY = 2;
    const steps = 400;
    const rx = 0.4;
    const ry = 0.35;
    for (let i = 0; i < steps; i++) {
      if (stopRequested) break;
      const t = (i / steps) * Math.PI * 2;
      const pan = Math.sin(freqX * t) * rx;
      const tilt = Math.sin(freqY * t + Math.PI / 4) * ry;
      SB.servos.send('pan', +pan.toFixed(3));
      SB.servos.send('tilt', +tilt.toFixed(3));
      await sleep(22);
    }
    if (!stopRequested) await moveTo(0, 0, 400);
  }

  // Spiral — expanding spiral that winds back in
  async function spiral() {
    const steps = 300;
    const maxR = 0.5;
    for (let i = 0; i < steps; i++) {
      if (stopRequested) break;
      const t = (i / steps);
      const angle = t * Math.PI * 8;
      // ramp up then back down
      const r = t < 0.5 ? t * 2 * maxR : (1 - t) * 2 * maxR;
      const pan = Math.cos(angle) * r;
      const tilt = Math.sin(angle) * r;
      SB.servos.send('pan', +pan.toFixed(3));
      SB.servos.send('tilt', +tilt.toFixed(3));
      await sleep(25);
    }
    if (!stopRequested) await moveTo(0, 0, 400);
  }

  // Heart — trace a heart shape using parametric equation
  async function heart() {
    const steps = 200;
    const scale = 0.35;
    for (let i = 0; i < steps; i++) {
      if (stopRequested) break;
      const t = (i / steps) * Math.PI * 2;
      // Heart parametric: x = 16sin³(t), y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
      const rawX = 16 * Math.pow(Math.sin(t), 3);
      const rawY = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      const pan = (rawX / 16) * scale;
      const tilt = -(rawY / 16) * scale;
      SB.servos.send('pan', +pan.toFixed(3));
      SB.servos.send('tilt', +tilt.toFixed(3));
      await sleep(28);
    }
    if (!stopRequested) await moveTo(0, 0, 400);
    SB.ui.toast('♥', 'success');
  }

  // Robotic Scan — classic robot left-right scan with head bob
  async function roboticScan() {
    for (let rep = 0; rep < 3; rep++) {
      for (const pan of [-0.6, -0.2, 0.2, 0.6, 0.2, -0.2]) {
        if (stopRequested) return;
        const tilt = Math.abs(pan) > 0.4 ? -0.1 : 0.1;
        await moveTo(pan, tilt, 250);
        await sleep(300);
      }
    }
    if (!stopRequested) await moveTo(0, 0, 300);
  }

  // Dramatic Reveal — slow pan from far left, tilt up, hold
  async function dramaticReveal() {
    await moveTo(-0.8, 0.3, 100);
    await sleep(500);
    if (stopRequested) return;
    await moveTo(0, 0.4, 2500);
    await sleep(1500);
    if (stopRequested) return;
    await moveTo(0, -0.1, 800);
    await sleep(600);
    if (!stopRequested) await moveTo(0, 0, 600);
  }

  // Bored — slow tiny drifts with long pauses
  async function bored() {
    while (!stopRequested) {
      const pan = (Math.random() - 0.5) * 0.15;
      const tilt = 0.3 + Math.random() * 0.15;
      await moveTo(pan, tilt, 1500 + Math.random() * 1000);
      await sleep(2000 + Math.random() * 3000);
    }
  }

  // Effect registry
  const effects = {
    idleWander:      { label: 'Idle Wander',     icon: '🐾', fn: idleWander },
    lookAround:      { label: 'Look Around',      icon: '🔍', fn: lookAround },
    wave:            { label: 'Wave Hello',       icon: '👋', fn: wave },
    nod:             { label: 'Nod Yes',          icon: '😊', fn: nod },
    shake:           { label: 'Shake No',         icon: '🙅', fn: shake },
    doubleTake:      { label: 'Double Take',      icon: '😲', fn: doubleTake },
    suspicious:      { label: 'Suspicious',       icon: '🧐', fn: suspiciousSweep },
    sneeze:          { label: 'Sneeze',           icon: '🤧', fn: sneeze },
    peekaboo:        { label: 'Peek-a-boo',       icon: '🙈', fn: peekaboo },
    tremble:         { label: 'Tremble',          icon: '🥶', fn: tremble },
    headTilt:        { label: 'Curious Tilt',     icon: '🐕', fn: headTilt },
    excited:         { label: 'Excited Bounce',   icon: '🐶', fn: excited },
    sleepy:          { label: 'Sleepy',           icon: '😴', fn: sleepy },
    panic:           { label: 'Panic',            icon: '😱', fn: panic },
    roboticScan:     { label: 'Robotic Scan',     icon: '🤖', fn: roboticScan },
    dramaticReveal:  { label: 'Dramatic Reveal',  icon: '🎭', fn: dramaticReveal },
    bored:           { label: 'Bored',            icon: '😒', fn: bored },
    dance:           { label: 'Dance (120 BPM)',  icon: '💃', fn: dance },
    circle:          { label: 'Circle',           icon: '⭕', fn: circle },
    figure8:         { label: 'Figure-8',         icon: '♾️', fn: figure8 },
    lissajous:       { label: 'Lissajous',        icon: '✨', fn: lissajous },
    spiral:          { label: 'Spiral',           icon: '🌀', fn: spiral },
    heart:           { label: 'Heart',            icon: '❤️', fn: heart },
  };

  function play(name) {
    const effect = effects[name];
    if (!effect) return;
    if (activeEffect === name) {
      stopEffect();
      return;
    }
    startEffect(name, effect.fn);
  }

  function stop() {
    stopEffect();
  }

  function getEffects() {
    return effects;
  }

  function renderGrid() {
    const grid = document.getElementById('fun-grid');
    if (!grid) return;
    grid.innerHTML = '';
    for (const [name, effect] of Object.entries(effects)) {
      const btn = document.createElement('button');
      btn.className = 'btn fun-btn';
      btn.dataset.effect = name;
      btn.style.cssText = 'flex-direction:column;gap:4px;padding:10px 4px;font-size:0.6875rem;line-height:1.2;text-align:center;border:1px solid var(--border-default)';
      btn.innerHTML = `<span style="font-size:1.25rem">${effect.icon}</span><span>${effect.label}</span>`;
      btn.addEventListener('click', () => play(name));
      grid.appendChild(btn);
    }
  }

  return { play, stop, getEffects, renderGrid, isActive: () => activeEffect };
})();

window.SB = SB;
