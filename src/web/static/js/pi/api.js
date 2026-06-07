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
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  }

  return {
    get: (endpoint) => request(endpoint, { method: 'GET' }),
    post: (endpoint, body) =>
      request(endpoint, {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
      }),
    patch: (endpoint, body) =>
      request(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),

    // Convenience wrappers
    stats: () => SB.api.get('/api/stats'),
    health: () => SB.api.get('/api/health'),
    history: (limit = 50) => SB.api.get(`/api/history?limit=${limit}`),
    mode: () => SB.api.get('/api/mode'),
    setMode: (mode) => SB.api.post('/api/mode', { mode }),
    servos: () => SB.api.get('/api/servos'),
    setServo: (axis, value) => SB.api.post(`/api/servos/${axis}`, { value }),
    home: () => SB.api.post('/api/home'),
    sort: () => SB.api.post('/api/sort'),
    classify: (body) => SB.api.post('/api/classify', body),
    providers: () => SB.api.get('/api/providers'),
    updateProvider: (id, data) => SB.api.patch(`/api/providers/${id}`, data),
    testProvider: (id) => SB.api.post(`/api/providers/${id}/test`),
    led: (color) => SB.api.post('/api/led', { color }),
    pulseLED: () => SB.api.post('/api/led/pulse'),
    datasetStats: () => SB.api.get('/api/dataset/stats'),
    saveDataset: (image, category) =>
      SB.api.post('/api/dataset/save', { image, category }),
    clearDataset: () => SB.api.post('/api/dataset/clear'),
    clearHistory: () => SB.api.post('/api/data/clear'),
  };
})();

window.SB = SB;
