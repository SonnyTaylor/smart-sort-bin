/**
 * Smart Bin — Dashboard Orchestrator
 * Initializes all modules and starts the application.
 */
var SB = window.SB || {};

SB.dashboard = (function () {
  function init() {
    // UI
    SB.ui.initTabs('control-tabs');
    SB.settings.bindDrawer();
    SB.activity.bind();

    // Inputs
    SB.servos.bind();
    SB.camera.bind();
    SB.inputKeyboard.bind();
    SB.inputGamepad.bind();

    // Data
    SB.settings.loadHealth();
    SB.activity.loadStats();
    SB.activity.load();
    SB.settings.loadProviders();

    // Effects grid
    if (SB.fun && SB.fun.renderGrid) SB.fun.renderGrid();

    // SSE
    SB.sse.connect();

    // Auto-refresh
    setInterval(() => SB.settings.loadHealth(), 5000);
    setInterval(() => SB.activity.loadStats(), 10000);

    console.log('[SmartBin] Dashboard initialized');
  }

  return { init };
})();

// Boot
document.addEventListener('DOMContentLoaded', SB.dashboard.init);
window.SB = SB;
