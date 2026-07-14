/**
 * Smart Bin — Dashboard Orchestrator
 * Initializes all modules and starts the application.
 */
var SB = window.SB || {};

SB.dashboard = (function () {
  function init() {
    // UI chrome
    SB.ui.initTabs('main-tabs');
    SB.settings.bindDrawer();

    // Controls
    SB.servos.bind();
    SB.camera.bind();
    SB.compare.bind();
    SB.inputKeyboard.bind();
    SB.inputGamepad.bind();
    SB.led.bind();

    // Panels
    SB.activity.bind();
    SB.stats.bind();
    SB.animations.bind();
    SB.calibration.bind();

    // Initial data
    SB.stats.loadHealth();
    SB.stats.refresh();
    SB.activity.load();
    SB.settings.loadProviders();
    SB.animations.load();
    SB.calibration.load();

    // Live updates
    SB.sse.connect();

    // Background refresh
    setInterval(() => SB.stats.loadHealth(), 5000);
    setInterval(() => SB.stats.loadStats(), 15000);

    console.log('[SmartBin] Dashboard ready');
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', SB.dashboard.init);
window.SB = SB;
