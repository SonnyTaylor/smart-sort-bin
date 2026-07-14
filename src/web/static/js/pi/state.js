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

  // Activity
  allHistory: [],
  activityFilter: 'all',
};

window.SB = SB;
