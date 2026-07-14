/**
 * Smart Bin — Camera & Classification
 * Stream handling, snapshot, classify, overlays.
 */
var SB = window.SB || {};

SB.camera = (function () {
  let classifying = false;

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
      detEl.textContent = item.label || item.category;
      metaEl.textContent = `${Math.round((item.confidence || 0) * 100)}% confidence · ${data.duration_ms || 0}ms`;
      overlay.classList.add('active');

      // Auto-hide after 5s
      setTimeout(() => overlay.classList.remove('active'), 5000);
    }
  }

  function handleSortStage(data) {
    const stageEl = document.getElementById('sort-stage');
    const textEl = document.getElementById('sort-stage-text');
    if (!stageEl || !textEl) return;

    if (data.stage) {
      stageEl.style.display = 'flex';
      const labels = {
        classifying: 'Classifying…',
        panning: 'Panning to bin…',
        dumping: 'Dumping item…',
        returning: 'Returning home…',
        done: 'Done',
      };
      textEl.textContent = labels[data.stage] || data.stage;
      if (data.stage === 'done') {
        setTimeout(() => { stageEl.style.display = 'none'; }, 1500);
      }
    } else {
      stageEl.style.display = 'none';
    }
  }

  async function sort() {
    if (classifying) return;
    const btn = document.getElementById('btn-snap-sort');
    btn.disabled = true;
    btn.innerHTML = '<span>⏳</span><span>Sorting…</span>';

    try {
      await SB.api.sort();
    } catch (err) {
      SB.ui.toast('Sort failed: ' + err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<span>🎯</span><span>Snap \u0026 Sort</span>';
    }
  }

  async function classifyOnly() {
    if (classifying) return;
    const btn = document.getElementById('btn-classify');
    btn.disabled = true;
    const original = btn.innerHTML;
    btn.innerHTML = '⏳ Classifying…';

    try {
      const res = await SB.api.classify({ source: 'device' });
      showResult(res);
    } catch (err) {
      SB.ui.toast('Classification failed: ' + err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = original;
    }
  }

  async function snapshot() {
    const img = document.getElementById('cam-stream');
    if (!img || img.naturalWidth === 0) {
      SB.ui.toast('No camera signal', 'error');
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext('2d').drawImage(img, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

    // Trigger download
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `smartbin_snapshot_${Date.now()}.jpg`;
    a.click();
    SB.ui.toast('Snapshot saved', 'success');
  }

  function toggleFullscreen() {
    const el = document.getElementById('cam-container');
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen().catch(() => {});
    }
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
    toggleFullscreen,
  };
})();

window.SB = SB;
