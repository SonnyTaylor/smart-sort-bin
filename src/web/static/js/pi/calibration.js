/**
 * Smart Bin — Bin Calibration
 * Edit per-category servo positions and sequence timing, stored server-side.
 */
var SB = window.SB || {};

SB.calibration = (function () {
  const CATEGORIES = ['general', 'recycling', 'compost'];
  const FIELDS = [
    { key: 'pan', label: 'Pan position' },
    { key: 'tilt_dump', label: 'Tilt to dump' },
    { key: 'tilt_rest', label: 'Tilt at rest' },
  ];

  let working = null; // local editable copy

  async function load() {
    try {
      const cal = await SB.api.calibration();
      SB.state.calibration = cal;
      working = JSON.parse(JSON.stringify(cal));
      render();
      SB.servos.updatePresetLabels();
    } catch (err) {
      console.error('Calibration load failed:', err);
    }
  }

  function render() {
    const grid = document.getElementById('cal-grid');
    if (!grid || !working) return;

    grid.innerHTML = CATEGORIES.map((cat) => `
      <div class="cal-card" data-cat="${cat}">
        <div class="cal-head">
          <span class="cat-dot bg-${cat}"></span>
          <span class="cal-name">${cat}</span>
          <span class="grow"></span>
          <button class="btn btn-sm" data-act="test">Test</button>
        </div>
        ${FIELDS.map((f) => `
          <div class="cal-field">
            <span class="cal-label">${f.label}</span>
            <input type="number" min="-1" max="1" step="0.05"
                   data-field="${f.key}" value="${working.categories[cat][f.key]}"
                   aria-label="${cat} ${f.label}">
            <button class="btn btn-sm btn-icon btn-ghost" data-set="${f.key}"
                    title="Use current ${f.key.startsWith('tilt') ? 'tilt' : 'pan'} position"
                    aria-label="Set ${cat} ${f.label} from current position">
              <svg class="icon"><use href="#i-crosshair"/></svg>
            </button>
          </div>
        `).join('')}
      </div>
    `).join('');

    // Timing
    setVal('cal-pan-settle', working.timing.pan_settle_s);
    setVal('cal-dump-hold', working.timing.dump_hold_s);
    setVal('cal-return', working.timing.return_s);

    // Bind card events
    grid.querySelectorAll('.cal-card').forEach((card) => {
      const cat = card.dataset.cat;

      card.querySelectorAll('input[data-field]').forEach((input) => {
        input.addEventListener('change', () => {
          working.categories[cat][input.dataset.field] = parseFloat(input.value);
        });
      });

      card.querySelectorAll('[data-set]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const field = btn.dataset.set;
          const value = field.startsWith('tilt') ? SB.state.currentTilt : SB.state.currentPan;
          working.categories[cat][field] = value;
          const input = card.querySelector(`input[data-field="${field}"]`);
          if (input) input.value = value.toFixed(2);
          SB.ui.toast(`${cat} ${field} set to ${value.toFixed(2)}`, 'success');
        });
      });

      card.querySelector('[data-act="test"]')?.addEventListener('click', async () => {
        // Save this category's values first so the test uses them
        try {
          await SB.api.saveCalibration({
            categories: { [cat]: working.categories[cat] },
            timing: readTiming(),
          });
          SB.ui.toast(`Testing ${cat} sequence…`, 'info');
          await SB.api.testCalibration(cat);
          SB.state.currentPan = 0;
          SB.state.currentTilt = 0;
          SB.servos.updateDisplays();
        } catch (err) {
          SB.ui.toast('Test failed: ' + err.message, 'error');
        }
      });
    });
  }

  function readTiming() {
    return {
      pan_settle_s: parseFloat(document.getElementById('cal-pan-settle')?.value ?? 0.5),
      dump_hold_s: parseFloat(document.getElementById('cal-dump-hold')?.value ?? 1.0),
      return_s: parseFloat(document.getElementById('cal-return')?.value ?? 0.5),
    };
  }

  function setVal(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
  }

  async function save() {
    if (!working) return;
    try {
      const result = await SB.api.saveCalibration({
        categories: working.categories,
        timing: readTiming(),
      });
      SB.state.calibration = result;
      working = JSON.parse(JSON.stringify(result));
      render();
      SB.servos.updatePresetLabels();
      SB.ui.toast('Calibration saved', 'success');
    } catch (err) {
      SB.ui.toast('Save failed: ' + err.message, 'error');
    }
  }

  async function reset() {
    if (!confirm('Reset all calibration to defaults?')) return;
    try {
      const result = await SB.api.resetCalibration();
      SB.state.calibration = result;
      working = JSON.parse(JSON.stringify(result));
      render();
      SB.servos.updatePresetLabels();
      SB.ui.toast('Calibration reset to defaults', 'info');
    } catch (err) {
      SB.ui.toast('Reset failed: ' + err.message, 'error');
    }
  }

  function bind() {
    document.getElementById('btn-cal-save')?.addEventListener('click', save);
    document.getElementById('btn-cal-reset')?.addEventListener('click', reset);
  }

  return { load, bind, save, reset };
})();

window.SB = SB;
