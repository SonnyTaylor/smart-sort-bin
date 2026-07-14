/**
 * Smart Bin — Server-Sent Events
 * Real-time updates from the backend.
 */
var SB = window.SB || {};

SB.sse = (function () {
  let source = null;

  function connect() {
    if (source) source.close();

    source = new EventSource('/api/events');

    source.addEventListener('connected', () => {
      SB.state.sseConnected = true;
      updateIndicator(true);
    });

    source.addEventListener('sort_event', (e) => {
      const data = JSON.parse(e.data);
      SB.camera.showResult(data);
      SB.activity.load();
      SB.stats.refresh();
      logEvent('sort_event', data);
    });

    source.addEventListener('sort_stage', (e) => {
      const data = JSON.parse(e.data);
      SB.camera.handleSortStage(data);
      logEvent('sort_stage', data);
    });

    source.addEventListener('servo_update', (e) => {
      const data = JSON.parse(e.data);
      logEvent('servo_update', data);

      // Animation playback streams both-axis updates — show the ghost dot
      if (data.source === 'animation') {
        SB.servos.showGhost(data.pan ?? 0, data.tilt ?? 0);
        return;
      }
      // Updates from other clients: sync local state
      if (data.axis === 'pan' && data.value !== undefined) {
        SB.state.currentPan = data.value;
      } else if (data.axis === 'tilt' && data.value !== undefined) {
        SB.state.currentTilt = data.value;
      } else if (data.axis === 'both') {
        if (data.pan !== undefined) SB.state.currentPan = data.pan;
        if (data.tilt !== undefined) SB.state.currentTilt = data.tilt;
      }
      SB.servos.updateDisplays();
    });

    source.addEventListener('servo_home', () => {
      SB.state.currentPan = 0;
      SB.state.currentTilt = 0;
      SB.servos.updateDisplays();
      logEvent('servo_home', {});
    });

    source.addEventListener('animation_state', (e) => {
      const data = JSON.parse(e.data);
      SB.animations.applyState(data);
      logEvent('animation_state', data);
    });

    source.addEventListener('led_update', (e) => {
      const data = JSON.parse(e.data);
      SB.state.currentLED = data.color;
      SB.led.updateUI(data.color);
      logEvent('led_update', data);
    });

    source.addEventListener('calibration_update', (e) => {
      SB.calibration.load();
      logEvent('calibration_update', JSON.parse(e.data));
    });

    source.addEventListener('data_cleared', () => {
      SB.activity.load();
      SB.stats.refresh();
      logEvent('data_cleared', {});
    });

    source.addEventListener('provider_update', () => {
      SB.settings.loadProviders();
      logEvent('provider_update', {});
    });

    source.onerror = () => {
      SB.state.sseConnected = false;
      updateIndicator(false);
    };
  }

  function updateIndicator(connected) {
    const ind = document.getElementById('sse-indicator');
    const label = document.getElementById('sse-label');
    const camDot = document.getElementById('cam-live-dot');

    if (ind) ind.classList.toggle('ok', connected);
    if (label) label.textContent = connected ? 'Connected' : 'Offline';
    if (camDot) camDot.classList.toggle('ok', connected);
  }

  function logEvent(type, data) {
    const log = document.getElementById('sse-log');
    if (!log) return;
    if (log.children.length === 0 && log.textContent.includes('Waiting')) {
      log.textContent = '';
    }
    const line = document.createElement('div');
    const t = new Date().toLocaleTimeString([], { hour12: false });
    line.textContent = `[${t}] ${type} ${JSON.stringify(data).slice(0, 110)}`;
    log.insertBefore(line, log.firstChild);
    while (log.children.length > 50) log.lastChild.remove();
  }

  return { connect, updateIndicator, logEvent };
})();

window.SB = SB;
