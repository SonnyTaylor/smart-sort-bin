/**
 * Smart Bin — Camera & Classification
 * Stream, snapshot, classify, sort progress overlays.
 */
var SB = window.SB || {};

SB.camera = (function () {
  function showResult(data) {
    const overlay = document.getElementById('class-overlay');
    const catEl = document.getElementById('class-category');
    const detEl = document.getElementById('class-detail');
    const metaEl = document.getElementById('class-meta');
    if (!overlay) return;

    if (data.items && data.items.length > 0) {
      const item = data.items[0];
      catEl.textContent = item.category;
      catEl.style.color = `var(--cat-${item.category})`;
      detEl.textContent = item.label || '';
      const extra = data.items.length > 1 ? ` · +${data.items.length - 1} more` : '';
      metaEl.textContent = `${Math.round((item.confidence || 0) * 100)}% confidence · ${data.duration_ms || 0}ms${extra}`;
      overlay.classList.add('active');
      clearTimeout(showResult._hide);
      showResult._hide = setTimeout(() => overlay.classList.remove('active'), 6000);
    }
  }

  function handleSortStage(data) {
    const chip = document.getElementById('sort-stage');
    const textEl = document.getElementById('sort-stage-text');
    if (!chip || !textEl) return;

    const labels = {
      classifying: 'Classifying…',
      panning: 'Panning to bin…',
      dumping: 'Dumping…',
      returning: 'Returning…',
      testing: 'Running sequence…',
      done: 'Done',
      error: 'Error',
    };

    const key = data.action || data.stage;
    if (data.stage === 'done') {
      textEl.textContent = 'Done';
      chip.classList.add('active');
      setTimeout(() => chip.classList.remove('active'), 1500);
    } else if (data.stage === 'error') {
      textEl.textContent = data.error ? `Error: ${data.error.slice(0, 60)}` : 'Error';
      chip.classList.add('active');
      setTimeout(() => chip.classList.remove('active'), 4000);
    } else if (key) {
      textEl.textContent = labels[key] || key;
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  }

  async function sort() {
    const btn = document.getElementById('btn-snap-sort');
    if (!btn || btn.disabled) return;
    btn.disabled = true;
    const original = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span> Sorting…';
    try {
      const res = await SB.api.sort();
      if (res.status === 'mock') {
        SB.ui.toast('Mock mode — no hardware connected', 'info');
      }
    } catch (err) {
      SB.ui.toast('Sort failed: ' + err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = original;
    }
  }

  async function classifyOnly() {
    const btn = document.getElementById('btn-classify');
    if (!btn || btn.disabled) return;
    btn.disabled = true;
    const original = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span> Classifying…';
    try {
      const res = await SB.api.classify({ source: 'device' });
      showResult(res);
      if (!res.items || res.items.length === 0) {
        SB.ui.toast('No items detected', 'info');
      }
    } catch (err) {
      SB.ui.toast('Classification failed: ' + err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = original;
    }
  }

  function captureFrame() {
    const img = document.getElementById('cam-stream');
    if (!img || img.naturalWidth === 0) return null;
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext('2d').drawImage(img, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.9);
  }

  function snapshot() {
    const dataUrl = captureFrame();
    if (!dataUrl) {
      SB.ui.toast('No camera signal', 'error');
      return;
    }
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `smartbin_${Date.now()}.jpg`;
    a.click();
    SB.ui.toast('Snapshot saved', 'success');
  }

  function toggleFullscreen() {
    const el = document.getElementById('cam-container');
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen().catch(() => {});
  }

  function bind() {
    document.getElementById('btn-snap-sort')?.addEventListener('click', sort);
    document.getElementById('btn-classify')?.addEventListener('click', classifyOnly);
    document.getElementById('btn-snapshot')?.addEventListener('click', snapshot);
    document.getElementById('btn-cam-fullscreen')?.addEventListener('click', toggleFullscreen);
  }

  return {
    bind,
    showResult,
    handleSortStage,
    sort,
    classifyOnly,
    snapshot,
    captureFrame,
    toggleFullscreen,
  };
})();

window.SB = SB;
