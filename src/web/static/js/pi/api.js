/**
 * Smart Bin — API Layer
 * Thin wrappers around fetch() for all backend endpoints.
 */
var SB = window.SB || {};

SB.api = (function () {
  async function request(endpoint, options = {}) {
    const res = await fetch(endpoint, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || `${res.status} ${res.statusText}`);
    }
    return data;
  }

  return {
    get: (endpoint) => request(endpoint, { method: 'GET' }),
    post: (endpoint, body) =>
      request(endpoint, {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
      }),
    put: (endpoint, body) =>
      request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
    patch: (endpoint, body) =>
      request(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
    del: (endpoint) => request(endpoint, { method: 'DELETE' }),

    // Stats & history
    stats: () => SB.api.get('/api/stats'),
    hourly: () => SB.api.get('/api/stats/hourly'),
    history: (limit = 50) => SB.api.get(`/api/history?limit=${limit}`),
    clearHistory: () => SB.api.post('/api/data/clear'),

    // System
    health: () => SB.api.get('/api/health'),

    // Servos
    servoPosition: () => SB.api.get('/api/servos'),
    move: (pan, tilt) => {
      const body = {};
      if (pan !== undefined && pan !== null) body.pan = pan;
      if (tilt !== undefined && tilt !== null) body.tilt = tilt;
      return SB.api.post('/api/servos/move', body);
    },
    home: () => SB.api.post('/api/home'),

    // Classification
    sort: () => SB.api.post('/api/sort'),
    classify: (body) => SB.api.post('/api/classify', body),
    compare: (body) => SB.api.post('/api/compare', body),

    // Providers
    providers: () => SB.api.get('/api/providers'),
    updateProvider: (id, data) => SB.api.patch(`/api/providers/${id}`, data),
    testProvider: (id) => SB.api.post(`/api/providers/${id}/test`),

    // LED
    led: (color) => SB.api.post('/api/led', { color }),

    // Animations
    animations: () => SB.api.get('/api/animations'),
    playAnimation: (body) => SB.api.post('/api/animations/play', body),
    stopAnimation: () => SB.api.post('/api/animations/stop'),
    saveSequence: (body) => SB.api.post('/api/animations/custom', body),
    deleteSequence: (id) => SB.api.del(`/api/animations/custom/${id}`),

    // Calibration
    calibration: () => SB.api.get('/api/calibration'),
    saveCalibration: (body) => SB.api.put('/api/calibration', body),
    resetCalibration: () => SB.api.post('/api/calibration/reset'),
    testCalibration: (category) => SB.api.post(`/api/calibration/test/${category}`),
  };
})();

window.SB = SB;
