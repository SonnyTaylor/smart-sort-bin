/**
 * Smart Bin — Global State
 * Single source of truth. Modules read/write via this object.
 */
var SB = window.SB || {};

SB.state = {
  // Connection
  sseConnected: false,

  // Servo targets (what the user asked for)
  currentPan: 0.0,
  currentTilt: 0.0,
  currentLED: 'off',

  // Providers
  providers: [],

  // Input
  nudgeStep: 0.1,
  gamepadIndex: null,
  gamepadControlActive: false,
  gamepadInvertY: false,
  keyboardEnabled: true,

  // Animations
  animPlaying: false,
  animName: null,

  // Calibration (loaded from /api/calibration)
  calibration: null,

  // Activity
  allHistory: [],
  activityFilter: 'all',
};

window.SB = SB;
