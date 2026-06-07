/**
 * Smart Bin — Activity Feed
 * Real-time event log with filtering and stats.
 */
var SB = window.SB || {};

SB.activity = (function () {
  async function load() {
    try {
      const events = await SB.api.history(50);
      SB.state.allHistory = events || [];
      render();
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  }

  async function loadStats() {
    try {
      const stats = await SB.api.stats();
      document.getElementById('stat-total').textContent = stats.total_sorted || 0;
      document.getElementById('stat-general').textContent = stats.breakdown?.general || 0;
      document.getElementById('stat-recycling').textContent = stats.breakdown?.recycling || 0;
      document.getElementById('stat-compost').textContent = stats.breakdown?.compost || 0;
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }

  function render() {
    const container = document.getElementById('activity-feed');
    if (!container) return;

    const filter = SB.state.activityFilter;
    const events = filter === 'all'
      ? SB.state.allHistory
      : SB.state.allHistory.filter((e) => e.category === filter);

    const countEl = document.getElementById('activity-count');
    if (countEl) countEl.textContent = `${events.length} events`;

    if (events.length === 0) {
      container.innerHTML = '<div class="activity-empty">No activity yet</div>';
      return;
    }

    container.innerHTML = events
      .map((e) => {
        const cat = e.category || 'general';
        const color = `var(--cat-${cat})`;
        const time = SB.ui.formatTimeRelative(e.timestamp);
        const conf = e.confidence ? `${Math.round(e.confidence * 100)}%` : '';
        return `
          <div class="activity-item">
            <span class="cat-dot" style="background:${color};box-shadow:0 0 6px ${color}"></span>
            <span class="timestamp">${time}</span>
            <span class="label" style="color:var(--text-primary);font-weight:500;text-transform:capitalize">${cat}</span>
            <span class="label">${e.label || ''}</span>
            <span class="confidence">${conf}</span>
          </div>
        `;
      })
      .join('');
  }

  function setFilter(filter) {
    SB.state.activityFilter = filter;
    document.querySelectorAll('.log-filter').forEach((btn) => {
      const isActive = btn.dataset.filter === filter;
      btn.classList.toggle('active', isActive);
      if (isActive) {
        btn.style.background = 'var(--bg-raised)';
        btn.style.color = 'var(--text-primary)';
      } else {
        btn.style.background = 'transparent';
        btn.style.color = 'var(--text-muted)';
      }
    });
    render();
  }

  async function clear() {
    if (!confirm('Clear all activity history?')) return;
    try {
      await SB.api.clearHistory();
      SB.state.allHistory = [];
      render();
      loadStats();
      SB.ui.toast('History cleared', 'info');
    } catch (err) {
      SB.ui.toast('Failed to clear history', 'error');
    }
  }

  function bind() {
    document.querySelectorAll('.log-filter').forEach((btn) => {
      btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });
    document.getElementById('btn-clear-log')?.addEventListener('click', clear);
  }

  return { load, loadStats, render, setFilter, clear, bind };
})();

window.SB = SB;
