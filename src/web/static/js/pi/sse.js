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
      SB.ui.toast('Connected to Smart Bin', 'success');
    });

    source.addEventListener('sort_event', (e) => {
      const data = JSON.parse(e.data);
      SB.camera.showResult(data);
      SB.activity.load();
      SB.activity.loadStats();
      logEvent('sort_event', data);
    });

    source.addEventListener('servo_update', (e) => {
      const data = JSON.parse(e.data);
      const gpActive =
        SB.state.gamepadControlActive &&
        SB.inputGamepad.isActive();
      if (!gpActive) {
        if (data.axis === 'pan') SB.state.currentPan = data.value;
        else if (data.axis === 'tilt') SB.state.currentTilt = data.value;
        SB.servos.updateDisplays();
      }
      logEvent('servo_update', data);
    });

    source.addEventListener('led_update', (e) => {
      const data = JSON.parse(e.data);
      SB.state.currentLED = data.color;
      document.getElementById('led-current').textContent = data.color;
      logEvent('led_update', data);
    });

    source.addEventListener('data_cleared', () => {
      SB.activity.load();
      SB.activity.loadStats();
      logEvent('data_cleared', {});
    });

    source.addEventListener('sort_stage', (e) => {
      const data = JSON.parse(e.data);
      SB.camera.handleSortStage(data);
      logEvent('sort_stage', data);
    });

    source.onerror = () => {
      SB.state.sseConnected = false;
      updateIndicator(false);
    };
  }

  function updateIndicator(connected) {
    const ind = document.getElementById('sse-indicator');
    const label = document.getElementById('sse-label');
    const badge = document.getElementById('cam-live-badge');
    const badgeInd = badge?.querySelector('.indicator');

    if (ind) {
      ind.style.background = connected ? 'var(--status-ok)' : 'var(--status-error)';
      ind.style.color = connected ? 'var(--status-ok)' : 'var(--status-error)';
    }
    if (label) label.textContent = connected ? 'Connected' : 'Offline';
    if (badge) badge.classList.toggle('connected', connected);
    if (badgeInd) {
      badgeInd.style.background = connected ? 'var(--status-ok)' : 'var(--status-error)';
      badgeInd.style.color = connected ? 'var(--status-ok)' : 'var(--status-error)';
    }
  }

  function logEvent(type, data) {
    const log = document.getElementById('sse-log');
    if (!log) return;
    if (log.children.length === 1 && log.children[0].textContent === 'Waiting for events…') {
      log.innerHTML = '';
    }
    const line = document.createElement('div');
    const t = new Date().toLocaleTimeString([], { hour12: false });
    line.innerHTML = `<span style="color:var(--text-muted)">[${t}]</span> <span style="color:var(--accent)">${type}</span> ${JSON.stringify(data).slice(0, 120)}`;
    log.insertBefore(line, log.firstChild);
    while (log.children.length > 50) log.lastChild.remove();
  }

  return { connect, updateIndicator, logEvent };
})();

window.SB = SB;
