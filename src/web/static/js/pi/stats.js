/**
 * Smart Bin — Stats & System Health
 * Stat cards, 24h hourly bar chart (inline SVG), health readouts.
 */
var SB = window.SB || {};

SB.stats = (function () {
  async function refresh() {
    loadStats();
    loadHourly();
  }

  async function loadStats() {
    try {
      const stats = await SB.api.stats();
      setText('stat-total', stats.total_sorted || 0);
      setText('stat-general', stats.breakdown?.general || 0);
      setText('stat-recycling', stats.breakdown?.recycling || 0);
      setText('stat-compost', stats.breakdown?.compost || 0);
      setText('stat-confidence', stats.total_sorted
        ? `${Math.round((stats.average_confidence || 0) * 100)}%`
        : '--');
      setText('stat-latency', stats.total_sorted
        ? `${Math.round(stats.average_duration_ms || 0)}ms`
        : '--');
    } catch (err) {
      console.error('Stats load failed:', err);
    }
  }

  async function loadHourly() {
    const box = document.getElementById('hourly-chart');
    if (!box) return;
    try {
      const data = await SB.api.hourly();
      renderChart(box, data);
    } catch (err) {
      console.error('Hourly stats failed:', err);
    }
  }

  function renderChart(box, data) {
    const max = Math.max(...data.map((d) => d.count));
    if (!max) {
      box.innerHTML = '<div class="chart-empty">No sorts in the last 24 hours</div>';
      return;
    }

    const W = 720;
    const H = 160;
    const padL = 26;
    const padB = 20;
    const padT = 8;
    const chartW = W - padL - 6;
    const chartH = H - padB - padT;
    const barW = chartW / 24;
    const nowHour = new Date().getHours();

    let bars = '';
    let labels = '';
    for (let i = 0; i < 24; i++) {
      const d = data.find((x) => x.hour === i) || { count: 0 };
      const h = max ? (d.count / max) * chartH : 0;
      const x = padL + i * barW;
      const y = padT + chartH - h;
      const isNow = i === nowHour;
      bars += `<rect x="${(x + 2).toFixed(1)}" y="${y.toFixed(1)}" width="${(barW - 4).toFixed(1)}" height="${Math.max(h, d.count ? 2 : 0).toFixed(1)}"
        rx="2" fill="${isNow ? 'var(--info)' : 'var(--text-3)'}" opacity="${d.count ? 1 : 0}">
        <title>${String(i).padStart(2, '0')}:00 — ${d.count} sort${d.count === 1 ? '' : 's'}</title>
      </rect>`;
      if (i % 4 === 0) {
        labels += `<text x="${(x + barW / 2).toFixed(1)}" y="${H - 5}" text-anchor="middle"
          font-size="9" fill="var(--text-4)" font-family="var(--font-mono)">${String(i).padStart(2, '0')}</text>`;
      }
    }

    // baseline + max gridline
    const grid = `
      <line x1="${padL}" y1="${padT + chartH}" x2="${W - 6}" y2="${padT + chartH}" stroke="var(--border)" stroke-width="1"/>
      <line x1="${padL}" y1="${padT}" x2="${W - 6}" y2="${padT}" stroke="var(--border-subtle)" stroke-width="1" stroke-dasharray="3 4"/>
      <text x="${padL - 6}" y="${padT + 4}" text-anchor="end" font-size="9" fill="var(--text-4)" font-family="var(--font-mono)">${max}</text>
      <text x="${padL - 6}" y="${padT + chartH + 4}" text-anchor="end" font-size="9" fill="var(--text-4)" font-family="var(--font-mono)">0</text>
    `;

    box.innerHTML = `
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Sorts per hour over the last 24 hours, peak ${max}">
        ${grid}${bars}${labels}
      </svg>`;
  }

  // ── System health ──

  async function loadHealth() {
    try {
      const h = await SB.api.health();
      const temp = h.cpu_temp_c || 0;

      setText('header-cpu', temp ? `${temp}°C` : '--');
      setText('health-temp', temp ? `${temp}°C` : '--');

      const bar = document.getElementById('temp-bar');
      if (bar) {
        bar.style.width = `${Math.min(100, (temp / 85) * 100)}%`;
        bar.className = 'gauge-fill ' + (temp < 60 ? '' : temp < 72 ? 'warn' : 'critical');
      }

      const up = SB.ui.formatUptime(h.uptime_seconds || 0);
      setText('header-uptime', up);
      setText('health-uptime', up);
      setText('health-servos', h.uart_connected ? 'pigpio' : 'offline');
      setText('health-wifi', h.wifi_connected ? 'online' : 'offline');
      setText('health-mode', 'VLM');
    } catch (err) {
      console.error('Health load failed:', err);
    }
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function bind() {
    document.getElementById('btn-refresh-stats')?.addEventListener('click', () => {
      refresh();
      loadHealth();
      SB.ui.toast('Stats refreshed', 'info');
    });
  }

  return { refresh, loadStats, loadHourly, loadHealth, bind };
})();

window.SB = SB;
