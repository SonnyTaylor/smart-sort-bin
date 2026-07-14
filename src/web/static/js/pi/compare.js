/**
 * Smart Bin — Model Comparison
 * Run the current camera frame through two providers side-by-side.
 */
var SB = window.SB || {};

SB.compare = (function () {
  function open() {
    populateSelects();
    document.getElementById('compare-overlay')?.classList.add('open');
  }

  function close() {
    document.getElementById('compare-overlay')?.classList.remove('open');
  }

  function populateSelects() {
    const options = SB.state.providers
      .map((p) => `<option value="${p.id}">${SB.ui.escapeHtml(p.name)}</option>`)
      .join('');
    const a = document.getElementById('compare-a');
    const b = document.getElementById('compare-b');
    if (a && a.options.length === 0) a.innerHTML = options;
    if (b && b.options.length === 0) {
      b.innerHTML = options;
      if (b.options.length > 1) b.selectedIndex = 1;
    }
  }

  function renderResult(el, result) {
    if (!el) return;
    let html = `
      <div class="cr-provider">${SB.ui.escapeHtml(result.provider_name || '')}</div>
      <div class="cr-model">${SB.ui.escapeHtml(result.model || '')} · ${result.duration_ms || 0}ms</div>
    `;
    if (result.error) {
      html += `<div class="cr-item" style="color:var(--error)">${SB.ui.escapeHtml(result.error)}</div>`;
    } else if (!result.items || result.items.length === 0) {
      html += '<div class="cr-item muted">No items detected</div>';
    } else {
      html += result.items
        .map((item) => `
          <div class="cr-item">
            <span style="color:var(--cat-${item.category});font-weight:600;text-transform:capitalize">${item.category}</span>
            — ${SB.ui.escapeHtml(item.label || '')}
            <span class="mono muted">(${Math.round((item.confidence || 0) * 100)}%)</span>
            ${item.reason ? `<div class="cr-reason">${SB.ui.escapeHtml(item.reason)}</div>` : ''}
          </div>
        `)
        .join('');
    }
    el.innerHTML = html;
  }

  async function run() {
    const btn = document.getElementById('btn-compare-run');
    const a = document.getElementById('compare-a')?.value;
    const b = document.getElementById('compare-b')?.value;
    if (!a || !b) {
      SB.ui.toast('Pick two providers', 'error');
      return;
    }

    const image = SB.camera.captureFrame();
    if (!image) {
      SB.ui.toast('No camera signal to compare', 'error');
      return;
    }

    btn.disabled = true;
    const original = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span> Running…';
    document.getElementById('compare-results').style.display = 'grid';
    document.getElementById('compare-result-a').innerHTML = '<div class="muted small">Waiting…</div>';
    document.getElementById('compare-result-b').innerHTML = '<div class="muted small">Waiting…</div>';

    try {
      const res = await SB.api.compare({
        image,
        provider_a: a,
        provider_b: b,
        model_a: document.getElementById('compare-model-a')?.value || '',
        model_b: document.getElementById('compare-model-b')?.value || '',
        explain: document.getElementById('compare-explain')?.checked || false,
      });
      renderResult(document.getElementById('compare-result-a'), res.a || {});
      renderResult(document.getElementById('compare-result-b'), res.b || {});
    } catch (err) {
      SB.ui.toast('Comparison failed: ' + err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = original;
    }
  }

  function bind() {
    document.getElementById('btn-compare')?.addEventListener('click', open);
    document.getElementById('btn-compare-close')?.addEventListener('click', close);
    document.getElementById('compare-overlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'compare-overlay') close();
    });
    document.getElementById('btn-compare-run')?.addEventListener('click', run);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  }

  return { bind, open, close, run };
})();

window.SB = SB;
