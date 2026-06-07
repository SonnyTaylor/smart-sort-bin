/**
 * Smart Bin — UI Utilities
 * Toasts, drawer, tabs, and general DOM helpers.
 */
var SB = window.SB || {};

SB.ui = (function () {
  // ── Toast ──
  function toast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = message;
    container.appendChild(el);

    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
      setTimeout(() => el.remove(), 300);
    }, duration);
  }

  // ── Drawer ──
  function openDrawer() {
    document.getElementById('settings-drawer')?.classList.add('open');
    document.getElementById('drawer-overlay')?.classList.add('open');
  }

  function closeDrawer() {
    document.getElementById('settings-drawer')?.classList.remove('open');
    document.getElementById('drawer-overlay')?.classList.remove('open');
  }

  // ── Tabs ──
  function initTabs(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const buttons = container.querySelectorAll('.tab-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        if (!tab) return;

        // Deactivate all
        buttons.forEach((b) => b.classList.remove('active'));
        const parent = container.parentElement;
        const panels = parent ? parent.querySelectorAll('.tab-panel') : [];
        panels.forEach((p) => p.classList.remove('active'));

        // Activate target
        btn.classList.add('active');
        const panel = document.getElementById(`tab-${tab}`);
        if (panel) panel.classList.add('active');
      });
    });
  }

  // ── Formatting ──
  function formatUptime(seconds) {
    if (!seconds) return '--';
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (d > 0) return `${d}d ${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  }

  function formatTimeRelative(timestamp) {
    if (!timestamp) return '';
    const diff = Math.floor(Date.now() / 1000 - timestamp);
    if (diff < 5) return 'now';
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  }

  return {
    toast,
    openDrawer,
    closeDrawer,
    initTabs,
    formatUptime,
    formatTimeRelative,
  };
})();

window.SB = SB;
