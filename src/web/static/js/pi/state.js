/**
 * Smart Bin — Global State
 * Single source of truth. Modules read/write via this object.
 */
var SB = window.SB || {};

SB.state = {
  // Connection
  sseConnected: false,

  // Hardware
  currentPan: 0.0,
  currentTilt: 0.0,
  currentLED: 'off',

  // Classification
  currentMode: 'llm',
  activeProvider: '',
  providers: [],

  // Input
  nudgeStep: 0.1,
  gamepadIndex: null,
  gamepadControlActive: false,
  gamepadInvertY: false,
  keyboardEnabled: true,
  keyboardContinuous: false,
  joystickEnabled: true,

  // Camera
  faceTracking: false,
  trackSpeed: 0.5,

  // Activity
  allHistory: [],
  activityFilter: 'all',

  // Dataset
  datasetStats: { general: 0, recycling: 0, compost: 0, total: 0 },
};

window.SB = SB;
