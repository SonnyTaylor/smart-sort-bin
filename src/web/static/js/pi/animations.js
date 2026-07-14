/**
 * Smart Bin — Animations
 * Built-in animation grid, saved sequences, and the keyframe sequence editor.
 * Playback happens server-side; this module just drives the API and reflects
 * SSE animation_state events.
 */
var SB = window.SB || {};

SB.animations = (function () {
  let builtins = [];
  let custom = [];
  let editingId = null; // custom sequence being edited, or null for new
  let keyframes = [];   // editor rows

  const EASINGS = ['inout', 'linear', 'in', 'out', 'hold'];

  // ── Loading ──

  async function load() {
    try {
      const data = await SB.api.animations();
      builtins = data.builtins || [];
      custom = data.custom || [];
      renderGrid();
      renderSaved();
      applyState(data.state || {});
    } catch (err) {
      console.error('Animations load failed:', err);
    }
  }

  // ── Playback ──

  async function play(body, label) {
    try {
      await SB.api.playAnimation(body);
    } catch (err) {
      SB.ui.toast(`Couldn't play ${label}: ${err.message}`, 'error');
    }
  }

  async function stop() {
    try {
      await SB.api.stopAnimation();
    } catch (err) {
      SB.ui.toast('Stop failed: ' + err.message, 'error');
    }
  }

  function applyState(state) {
    SB.state.animPlaying = !!state.playing;
    SB.state.animName = state.name || null;

    const badge = document.getElementById('anim-playing-badge');
    const stopBtn = document.getElementById('btn-anim-stop');
    if (badge) badge.style.display = state.playing ? 'inline-flex' : 'none';
    if (stopBtn) stopBtn.style.display = state.playing ? 'inline-flex' : 'none';

    document.querySelectorAll('.anim-btn').forEach((btn) => {
      btn.classList.toggle('playing', state.playing && btn.dataset.anim === state.name);
    });
  }

  // ── Rendering ──

  function renderGrid() {
    const grid = document.getElementById('anim-grid');
    if (!grid) return;
    grid.innerHTML = builtins
      .map((a) => `
        <button class="anim-btn" data-anim="${a.name}" title="${a.loop ? 'Loops until stopped' : 'Plays once'}">
          <span>${SB.ui.escapeHtml(a.label)}</span>
          <span class="anim-state"></span>
        </button>
      `)
      .join('');

    grid.querySelectorAll('.anim-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.anim;
        if (SB.state.animPlaying && SB.state.animName === name) stop();
        else play({ name }, name);
      });
    });
  }

  function renderSaved() {
    const wrap = document.getElementById('saved-sequences-wrap');
    const list = document.getElementById('saved-sequences');
    if (!wrap || !list) return;

    if (custom.length === 0) {
      wrap.style.display = 'none';
      return;
    }
    wrap.style.display = 'block';

    list.innerHTML = custom
      .map((s) => `
        <div class="saved-seq" data-id="${s.id}">
          <div>
            <div class="seq-name">${SB.ui.escapeHtml(s.name)}</div>
            <div class="seq-meta">${s.keyframes.length} keyframes${s.loop ? ' · loops' : ''}</div>
          </div>
          <div class="row">
            <button class="btn btn-sm btn-icon" data-act="play" title="Play" aria-label="Play ${SB.ui.escapeHtml(s.name)}">
              <svg class="icon"><use href="#i-play"/></svg>
            </button>
            <button class="btn btn-sm btn-icon" data-act="edit" title="Edit" aria-label="Edit ${SB.ui.escapeHtml(s.name)}">
              <svg class="icon"><use href="#i-settings"/></svg>
            </button>
            <button class="btn btn-sm btn-icon btn-danger" data-act="delete" title="Delete" aria-label="Delete ${SB.ui.escapeHtml(s.name)}">
              <svg class="icon"><use href="#i-trash"/></svg>
            </button>
          </div>
        </div>
      `)
      .join('');

    list.querySelectorAll('.saved-seq').forEach((el) => {
      const id = parseInt(el.dataset.id, 10);
      el.querySelector('[data-act="play"]')?.addEventListener('click', () => play({ id }, 'sequence'));
      el.querySelector('[data-act="edit"]')?.addEventListener('click', () => editSequence(id));
      el.querySelector('[data-act="delete"]')?.addEventListener('click', () => deleteSequence(id));
    });
  }

  // ── Sequence editor ──

  function defaultFrame() {
    return { pan: 0, tilt: 0, ms: 500, ease: 'inout' };
  }

  function renderEditor() {
    const tbody = document.getElementById('seq-rows');
    if (!tbody) return;

    if (keyframes.length === 0) {
      tbody.innerHTML = '<tr><td></td><td colspan="5" class="small muted" style="padding:var(--sp-3) 0">No keyframes yet — add one or capture the current position.</td></tr>';
      return;
    }

    tbody.innerHTML = keyframes
      .map((kf, i) => `
        <tr data-i="${i}">
          <td>${i + 1}</td>
          <td><input type="number" data-field="pan" min="-1" max="1" step="0.05" value="${kf.pan}" style="width:70px" aria-label="Keyframe ${i + 1} pan"></td>
          <td><input type="number" data-field="tilt" min="-1" max="1" step="0.05" value="${kf.tilt}" style="width:70px" aria-label="Keyframe ${i + 1} tilt"></td>
          <td><input type="number" data-field="ms" min="50" max="10000" step="50" value="${kf.ms}" style="width:84px" aria-label="Keyframe ${i + 1} duration"></td>
          <td>
            <select data-field="ease" style="width:86px" aria-label="Keyframe ${i + 1} easing">
              ${EASINGS.map((e) => `<option value="${e}" ${e === kf.ease ? 'selected' : ''}>${e}</option>`).join('')}
            </select>
          </td>
          <td>
            <div class="seq-row-actions">
              <button class="btn btn-sm btn-icon btn-ghost" data-act="goto" title="Move head here" aria-label="Go to keyframe ${i + 1}">
                <svg class="icon"><use href="#i-crosshair"/></svg>
              </button>
              <button class="btn btn-sm btn-icon btn-ghost btn-danger" data-act="remove" title="Remove" aria-label="Remove keyframe ${i + 1}">
                <svg class="icon"><use href="#i-x"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `)
      .join('');

    tbody.querySelectorAll('tr[data-i]').forEach((tr) => {
      const i = parseInt(tr.dataset.i, 10);
      tr.querySelectorAll('[data-field]').forEach((input) => {
        input.addEventListener('change', () => {
          const field = input.dataset.field;
          keyframes[i][field] = field === 'ease' ? input.value : parseFloat(input.value);
        });
      });
      tr.querySelector('[data-act="goto"]')?.addEventListener('click', () => {
        SB.servos.setTarget(keyframes[i].pan, keyframes[i].tilt);
      });
      tr.querySelector('[data-act="remove"]')?.addEventListener('click', () => {
        keyframes.splice(i, 1);
        renderEditor();
      });
    });
  }

  function addFrame(frame) {
    keyframes.push(frame || defaultFrame());
    renderEditor();
  }

  function capturePosition() {
    addFrame({
      pan: SB.state.currentPan,
      tilt: SB.state.currentTilt,
      ms: 500,
      ease: 'inout',
    });
  }

  function editSequence(id) {
    const seq = custom.find((s) => s.id === id);
    if (!seq) return;
    editingId = id;
    keyframes = seq.keyframes.map((k) => ({ ...k }));
    const nameEl = document.getElementById('seq-name');
    const loopEl = document.getElementById('seq-loop');
    if (nameEl) nameEl.value = seq.name;
    if (loopEl) loopEl.checked = seq.loop;
    renderEditor();
    SB.ui.toast(`Editing "${seq.name}"`, 'info');
  }

  async function deleteSequence(id) {
    const seq = custom.find((s) => s.id === id);
    if (!confirm(`Delete sequence "${seq?.name || id}"?`)) return;
    try {
      await SB.api.deleteSequence(id);
      if (editingId === id) resetEditor();
      await load();
      SB.ui.toast('Sequence deleted', 'info');
    } catch (err) {
      SB.ui.toast('Delete failed: ' + err.message, 'error');
    }
  }

  function resetEditor() {
    editingId = null;
    keyframes = [];
    const nameEl = document.getElementById('seq-name');
    const loopEl = document.getElementById('seq-loop');
    if (nameEl) nameEl.value = '';
    if (loopEl) loopEl.checked = false;
    renderEditor();
  }

  async function preview() {
    if (keyframes.length === 0) {
      SB.ui.toast('Add a keyframe first', 'error');
      return;
    }
    play({
      keyframes,
      loop: document.getElementById('seq-loop')?.checked || false,
      label: 'Preview',
    }, 'preview');
  }

  async function save() {
    const name = document.getElementById('seq-name')?.value.trim();
    if (!name) {
      SB.ui.toast('Give the sequence a name', 'error');
      document.getElementById('seq-name')?.focus();
      return;
    }
    if (keyframes.length === 0) {
      SB.ui.toast('Add a keyframe first', 'error');
      return;
    }
    try {
      await SB.api.saveSequence({
        id: editingId,
        name,
        keyframes,
        loop: document.getElementById('seq-loop')?.checked || false,
      });
      SB.ui.toast(`Saved "${name}"`, 'success');
      resetEditor();
      await load();
    } catch (err) {
      SB.ui.toast('Save failed: ' + err.message, 'error');
    }
  }

  function bind() {
    document.getElementById('btn-anim-stop')?.addEventListener('click', stop);
    document.getElementById('btn-seq-add')?.addEventListener('click', () => addFrame());
    document.getElementById('btn-seq-capture')?.addEventListener('click', capturePosition);
    document.getElementById('btn-seq-preview')?.addEventListener('click', preview);
    document.getElementById('btn-seq-save')?.addEventListener('click', save);
    renderEditor();
  }

  return { load, bind, play, stop, applyState };
})();

window.SB = SB;
