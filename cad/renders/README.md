# Design evolution renders

This folder makes the "here is how the design changed" pictures for the
portfolio. It renders **old versions of parts straight out of git history**, so
the images are the actual superseded designs rather than something redrawn
afterwards. That is the point: it is evidence, not illustration.

Output lands in [`../../portfolio/images/cad_evolution/`](../../portfolio/images/cad_evolution).

| File | What it is |
| :--- | :--- |
| `<family>.png` | The comparison strip: every version of one part, left to right, with a caption under each |
| `parts/<stage>.png` | Each version on its own, cropped, if you want to place one somewhere else |

---

## Running it

Two steps. The first renders, the second lays out.

```powershell
cd cad\renders
.\render.ps1
python compose.py
```

Takes about three minutes, most of it the tray, which has a curved surface and
20,000-odd facets.

Working on one part only:

```powershell
.\render.ps1 -Only tray
python compose.py tray
```

Seeing what would run without running it:

```powershell
.\render.ps1 -WhatIf
```

**Needs:** OpenSCAD (path is in `stages.json`) and Python with Pillow
(`pip install pillow`).

---

## Adding a new version

Everything is driven by [`stages.json`](stages.json). To add a version, add an
entry to that part's `stages` list. Nothing else changes.

```jsonc
{
  "name": "tray_4_ribbed",          // the output filename
  "label": "v4",                    // shown above the caption. "current" prints in red
  "source": { "file": "cad/tray.scad", "part": "tray" },
  "caption": "What changed and why.\nKeep it to three lines."
}
```

A stage's `source` is one of three things:

| Source | Renders |
| :--- | :--- |
| `{"commit": "abc1234", "file": "cad/tray.scad", "part": "tray"}` | That file as it was at that commit |
| `{"file": "cad/tray.scad", "part": "tray"}` | The working copy, i.e. whatever is on disk right now |
| `{"stl": "cad/stl/tray_mount.stl"}` | An STL export, for parts that only exist in Fusion |

Find the commit for a past version with:

```powershell
git log --oneline --follow -- cad/tray.scad
```

### Keeping the current version current

The `current` stage of each part points at the working copy, not at a commit.
So after changing a part, re-run and its picture updates on its own. Only the
historic stages are pinned to commits.

### When a part moves to Fusion

The hub and tray were originally drawn in OpenSCAD and have since been rebuilt
in Fusion. The `.scad` files are kept precisely so this history stays
renderable. For a part that now only lives in Fusion, export an STL into
`cad/stl/` and point the stage at it with `"stl"`.

---

## The bits that were fiddly

Worth knowing before changing the scripts, because each of these cost time.

**Parts stay comparable in size.** Every version of one part is rendered from
the same camera distance (`camera` in `stages.json`, shared by the family), and
`compose.py` then scales the whole family by a single factor. This is what makes
"the plate went from 160g of filament to 84g" visible instead of just claimed.
Do not let the layout scale each image to fit its own box.

**Full geometry, not preview.** `--render=cgal`. Without it OpenSCAD draws the
fast preview, where coincident faces z-fight and parts come out striped orange.
Note that this build of OpenSCAD needs a value: plain `--render` is a usage
error.

**PowerShell has to be told to wait.** `openscad.exe` is a GUI binary, so `&`
does not reliably block until it finishes and the script races ahead to an image
that is not written yet. Hence `Start-Process -Wait`.

**Which also has to be told to quote.** `Start-Process -ArgumentList` joins an
array on spaces without quoting anything, and this repo lives under
`C:\Users\Sonny Taylor\`, so every path split in half and OpenSCAD printed its
usage message. The script quotes the arguments itself.

**Choosing the part.** These `.scad` files build one part at a time, chosen by a
`PART` variable near the top. Rather than pass `-D PART="clamp"`, which is
awkward to quote through PowerShell into a native binary, the script rewrites
that one line in a scratch copy. It errors if it cannot find the line, so a
renamed variable will not silently render the wrong thing.

**The background is dropped out.** `compose.py` treats the render's top-left
pixel as the background colour and cuts everything matching it, keeping the
soft edge so the part does not look jagged. That is why the strips sit on white
rather than on OpenSCAD's grey.

---

## What is in here

| Path | |
| :--- | :--- |
| `stages.json` | The manifest. The only file you normally edit |
| `render.ps1` | Pulls each version out of git and renders a PNG |
| `compose.py` | Crops the renders and builds the labelled strips |
| `raw/` | Untouched renders. Regenerated, not committed |
| `src/` | The scratch `.scad` files pulled from history. Regenerated, not committed |
| `logs/` | OpenSCAD's output per stage, including the model's own echoed calculations. Look here when a render fails |
