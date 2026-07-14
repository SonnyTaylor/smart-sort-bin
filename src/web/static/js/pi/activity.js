/**
 * Smart Bin — Activity Feed
 * Real-time sort log with filtering.
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

  function render() {
    const container = document.getElementById('activity-feed');
    if (!container) return;

    const filter = SB.state.activityFilter;
    const events = filter === 'all'
      ? SB.state.allHistory
      : SB.state.allHistory.filter((e) => e.category === filter);

    const countEl = document.getElementById('activity-count');
    if (countEl) countEl.textContent = events.length;

    if (events.length === 0) {
      container.innerHTML =
        '<div class="feed-empty">No sorts yet. Put something in front of the camera and hit Snap &amp; Sort.</div>';
      return;
    }

    container.innerHTML = events
      .map((e) => {
        const cat = e.category || 'general';
        const time = SB.ui.formatTimeRelative(e.timestamp);
        const conf = e.confidence ? `${Math.round(e.confidence * 100)}%` : '';
        return `
          <div class="feed-item">
            <span class="cat-dot bg-${cat}"></span>
            <span class="when">${time}</span>
            <span class="what">${cat}</span>
            <span class="detail">${SB.ui.escapeHtml(e.label || '')}</span>
            <span class="conf">${conf}</span>
          </div>
        `;
      })
      .join('');
  }

  function setFilter(filter) {
    SB.state.activityFilter = filter;
    document.querySelectorAll('#activity-filters button').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    render();
  }

  async function clear() {
    if (!confirm('Clear all sort history? This cannot be undone.')) return;
    try {
      await SB.api.clearHistory();
      SB.state.allHistory = [];
      render();
      SB.stats.refresh();
      SB.ui.toast('History cleared', 'info');
    } catch (err) {
      SB.ui.toast('Failed to clear history', 'error');
    }
  }

  function bind() {
    SB.ui.initSeg('activity-filters', (btn) => setFilter(btn.dataset.filter));
    document.getElementById('btn-clear-log')?.addEventListener('click', clear);
  }

  return { load, render, setFilter, clear, bind };
})();

window.SB = SB;
