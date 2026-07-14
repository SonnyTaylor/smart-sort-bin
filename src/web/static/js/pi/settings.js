/**
 * Smart Bin — Settings Drawer
 * LLM providers and the debug console.
 */
var SB = window.SB || {};

SB.settings = (function () {
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
      .map((p) => `<option value="${p.id}" ${p.is_active ? 'selected' : ''}>${SB.ui.escapeHtml(p.name)}</option>`)
      .join('');
  }

  function renderProviders() {
    const container = document.getElementById('provider-list');
    if (!container) return;

    container.innerHTML = SB.state.providers
      .map((p) => {
        const isLocal = p.id === 'ollama';
        const badge = isLocal
          ? '<span class="badge info">Local</span>'
          : p.api_key_set
            ? '<span class="badge ok">Key set</span>'
            : '<span class="badge error">No key</span>';
        return `
          <div class="provider-card ${p.is_active ? 'active' : ''}">
            <div class="provider-head">
              <span class="provider-name">${SB.ui.escapeHtml(p.name)}</span>
              <div class="row">
                ${badge}
                ${p.is_active ? '<span class="badge neutral">Active</span>' : ''}
              </div>
            </div>
            <div class="provider-fields">
              ${!isLocal ? `
                <div class="field">
                  <label>API key</label>
                  <input type="password" placeholder="${p.api_key_set ? '••••••••' : 'Enter API key'}"
                         onchange="SB.settings.updateProvider('${p.id}', 'api_key', this.value)"
                         autocomplete="off">
                </div>
              ` : ''}
              <div class="field">
                <label>Model</label>
                <input type="text" value="${SB.ui.escapeHtml(p.model || '')}"
                       placeholder="${modelPlaceholder(p.id)}"
                       onchange="SB.settings.updateProvider('${p.id}', 'model', this.value)">
              </div>
              ${p.id === 'custom' || p.id === 'ollama' ? `
                <div class="field">
                  <label>API URL</label>
                  <input type="text" value="${SB.ui.escapeHtml(p.base_url || '')}"
                         onchange="SB.settings.updateProvider('${p.id}', 'base_url', this.value)">
                </div>
              ` : ''}
              <div class="row" style="margin-top:var(--sp-1)">
                ${!p.is_active ? `<button class="btn btn-sm" onclick="SB.settings.activateProvider('${p.id}')">Set active</button>` : ''}
                <button class="btn btn-sm btn-primary" onclick="SB.settings.saveProvider('${p.id}')">Save</button>
                <button class="btn btn-sm" onclick="SB.settings.testProvider('${p.id}')">Test</button>
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
      SB.ui.toast('Provider saved', 'success');
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
      if (res.error) SB.ui.toast('Test failed: ' + res.error, 'error');
      else SB.ui.toast('Connection successful', 'success');
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
    document.getElementById('btn-debug-run')?.addEventListener('click', runDebug);

    // Header provider select switches the active provider
    document.getElementById('provider-select')?.addEventListener('change', (e) => {
      if (e.target.value) activateProvider(e.target.value);
    });
  }

  return {
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
