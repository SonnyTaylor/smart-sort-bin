/**
 * Smart Bin — Settings Drawer
 * Providers, debug.
 */
var SB = window.SB || {};

SB.settings = (function () {
  // ── Health ──
  async function loadHealth() {
    try {
      const h = await SB.api.health();
      const temp = h.cpu_temp_c || 0;
      const tempEl = document.getElementById('health-temp');
      const bar = document.getElementById('temp-bar');
      const headerTemp = document.getElementById('header-cpu');

      if (tempEl) tempEl.textContent = temp + '°C';
      if (headerTemp) headerTemp.textContent = temp + '°C';

      if (bar) {
        const pct = Math.min(100, (temp / 80) * 100);
        bar.style.width = pct + '%';
        bar.className = 'gauge-bar-fill ' + (temp < 50 ? 'ok' : temp < 65 ? 'warn' : 'critical');
      }

      const up = h.uptime_seconds || 0;
      const upStr = SB.ui.formatUptime(up);
      const upEl = document.getElementById('health-uptime');
      const headerUp = document.getElementById('header-uptime');
      if (upEl) upEl.textContent = upStr;
      if (headerUp) headerUp.textContent = upStr;

      setStatus('health-camera', 'Active', 'ok');
      setStatus('health-servos', h.pigpio ? 'pigpio' : 'gpiozero', 'ok');
      setStatus('health-wifi', h.wifi_connected ? 'Connected' : 'Offline', h.wifi_connected ? 'ok' : 'error');
      setStatus('health-inference', h.inference_ms ? h.inference_ms + 'ms' : 'Idle', 'muted');
    } catch (e) {
      console.error('Health load failed:', e);
    }
  }

  function setStatus(id, text, type) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    const colors = {
      ok: 'var(--status-ok)',
      warn: 'var(--status-warn)',
      error: 'var(--status-error)',
      muted: 'var(--text-muted)',
    };
    el.style.color = colors[type] || colors.muted;
  }

  // ── Providers ──
  async function loadProviders() {
    try {
      const list = await SB.api.providers();
      SB.state.providers = list;
      renderProviders();
      populateProviderSelect(list);
    } catch (err) {
      console.error('Provider load failed:', err);
    }
  }

  function populateProviderSelect(providers) {
    const sel = document.getElementById('provider-select');
    if (!sel) return;
    sel.innerHTML = providers
      .map((p) => `<option value="${p.id}">${p.name}</option>`)
      .join('');
  }

  function renderProviders() {
    const container = document.getElementById('provider-list');
    if (!container) return;

    container.innerHTML = SB.state.providers
      .map((p) => {
        const isLocal = p.id === 'ollama';
        const keyStatus = isLocal ? 'local' : p.api_key_set ? 'key-set' : 'no-key';
        const keyText = isLocal ? 'Local' : p.api_key_set ? 'Key Set' : 'No Key';
        const isActive = p.is_active;
        return `
          <div class="provider-card ${isActive ? 'active' : ''}">
            <div class="provider-card-header">
              <span class="provider-card-name">${p.name}</span>
              <div style="display:flex;gap:var(--space-2)">
                <span class="provider-badge ${keyStatus}">${keyText}</span>
                ${isActive ? '<span class="provider-badge active-badge">Active</span>' : ''}
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:var(--space-3)">
              ${!isLocal ? `
                <div>
                  <label style="font-size:0.6875rem;color:var(--text-muted);display:block;margin-bottom:var(--space-1)">API Key</label>
                  <input type="password" placeholder="${p.api_key_set ? '••••••••' : 'Enter API key…'}"
                         onchange="SB.settings.updateProvider('${p.id}', 'api_key', this.value)">
                </div>
              ` : ''}
              <div>
                <label style="font-size:0.6875rem;color:var(--text-muted);display:block;margin-bottom:var(--space-1)">Model</label>
                <input type="text" value="${p.model || ''}"
                       placeholder="${modelPlaceholder(p.id)}"
                       onchange="SB.settings.updateProvider('${p.id}', 'model', this.value)">
              </div>
              ${p.id === 'custom' || p.id === 'ollama' ? `
                <div>
                  <label style="font-size:0.6875rem;color:var(--text-muted);display:block;margin-bottom:var(--space-1)">API URL</label>
                  <input type="text" value="${p.base_url || ''}"
                         onchange="SB.settings.updateProvider('${p.id}', 'base_url', this.value)">
                </div>
              ` : ''}
              <div style="display:flex;gap:var(--space-2);margin-top:var(--space-1)">
                ${!isActive ? `<button class="btn" onclick="SB.settings.activateProvider('${p.id}')">Set Active</button>` : ''}
                <button class="btn btn-primary" onclick="SB.settings.saveProvider('${p.id}')">Save</button>
                <button class="btn" onclick="SB.settings.testProvider('${p.id}')">Test</button>
              </div>
            </div>
          </div>
        `;
      })
      .join('');
  }

  function modelPlaceholder(id) {
    const hints = {
      openrouter: 'meta-llama/llama-4-scout',
      openai: 'gpt-4o-mini',
      google: 'gemini-2.5-flash',
      ollama: 'gemma3:4b',
      custom: 'my-model',
    };
    return hints[id] || 'Model ID';
  }

  async function updateProvider(id, field, value) {
    if (!SB._pending) SB._pending = {};
    if (!SB._pending[id]) SB._pending[id] = {};
    SB._pending[id][field] = value;
  }

  async function saveProvider(id) {
    const pending = SB._pending?.[id];
    if (!pending || Object.keys(pending).length === 0) {
      SB.ui.toast('No changes to save', 'info');
      return;
    }
    try {
      await SB.api.updateProvider(id, pending);
      delete SB._pending[id];
      await loadProviders();
      SB.ui.toast('Provider settings saved', 'success');
    } catch (err) {
      SB.ui.toast('Save failed: ' + err.message, 'error');
    }
  }

  async function activateProvider(id) {
    try {
      await SB.api.updateProvider(id, { is_active: true });
      await loadProviders();
      SB.ui.toast('Provider activated', 'success');
    } catch (err) {
      SB.ui.toast('Activation failed', 'error');
    }
  }

  async function testProvider(id) {
    SB.ui.toast('Testing connection…', 'info');
    try {
      const res = await SB.api.testProvider(id);
      if (res.error) {
        SB.ui.toast('Test failed: ' + res.error, 'error');
      } else {
        SB.ui.toast('✓ Connection successful', 'success');
      }
    } catch (err) {
      SB.ui.toast('Test failed: ' + err.message, 'error');
    }
  }

  // ── Debug ──
  async function runDebug() {
    const endpoint = document.getElementById('debug-endpoint')?.value;
    const output = document.getElementById('debug-output');
    if (!endpoint || !output) return;

    output.textContent = 'Loading…';
    try {
      const data = await SB.api.get(endpoint);
      output.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
      output.textContent = 'Error: ' + err.message;
    }
  }

  // ── Drawer ──
  function bindDrawer() {
    document.getElementById('btn-settings')?.addEventListener('click', SB.ui.openDrawer);
    document.getElementById('btn-close-settings')?.addEventListener('click', SB.ui.closeDrawer);
    document.getElementById('drawer-overlay')?.addEventListener('click', SB.ui.closeDrawer);

    document.getElementById('btn-refresh-health')?.addEventListener('click', () => {
      loadHealth();
      SB.ui.toast('Health refreshed', 'info');
    });

    document.getElementById('btn-debug-run')?.addEventListener('click', runDebug);
  }

  return {
    loadHealth,
    loadProviders,
    updateProvider,
    saveProvider,
    activateProvider,
    testProvider,
    runDebug,
    bindDrawer,
  };
})();

window.SB = SB;
