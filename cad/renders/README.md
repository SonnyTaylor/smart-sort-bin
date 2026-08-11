# Design evolution renders

This folder makes the "here is how the design changed" pictures for the
portfolio.

Two sources, and the split matters:

- The **current** version of each part is rendered from a **Fusion export**,
  because Fusion is the design source of truth.
- The **superseded** versions are rendered from the OpenSCAD files **as they
  were at the commit they lived in**. Those versions predate the move to
  Fusion, so git history is the only place they still exist.

Either way the images are the real designs rather than something redrawn
afterwards. That is the point: evidence, not illustration.

Output lands in [`../../portfolio/images/cad/evolution/`](../../portfolio/images/cad/evolution).

| File | What it is |
| :--- | :--- |
| `<family>.png` | The comparison strip: every version of one part, left to right, with a caption under each |
| `parts/<stage>.png` | Each version on its own, cropped, if you want to place one somewhere else |

---

## Running it

Three steps. Export from Fusion, render, lay out.

**1. Export the current parts from Fusion.** Open the *Smart Bin - assembly*
document, then run [`export_from_fusion.py`](export_from_fusion.py) inside
Fusion, either through the Fusion MCP connector or Fusion's own Scripts and
Add-Ins dialog. It writes `cad/stl/` and `cad/step/`, and refuses to run if the
assembly is sitting on an out-of-date version of a part.

Skip this step only if no part has changed in Fusion since the last time you ran
it.

**2 and 3. Render and lay out.**

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

| Source | Renders | Use for |
| :--- | :--- | :--- |
| `{"stl": "cad/stl/plate.stl"}` | A Fusion export | **The current version of anything.** Fusion is the source of truth |
| `{"commit": "abc1234", "file": "cad/tray.scad", "part": "tray"}` | That file as it was at that commit | Superseded versions, which predate Fusion |
| `{"file": "cad/tray.scad", "part": "tray"}` | The OpenSCAD working copy | A part that never made it into Fusion, like the spacer |

Find the commit for a past version with:

```powershell
git log --oneline --follow -- cad/tray.scad
```

### Turning the current version into history

When a part changes enough to be worth a picture, the old "current" panel
becomes a historic one. Since the current panel is a Fusion export and Fusion
versions do not live in git, capture it **before** you change the part:

1. Run the export script and commit the STL, so that geometry is pinned in git
   history under a commit you can name.
2. Change the part in Fusion.
3. Re-export, then add a stage pointing at `{"commit": "<that commit>", ...}`.

If you forget, the old shape is still in Fusion's own version history, which you
can open from the data panel and export from.

### Why the OpenSCAD files still matter

The hub and tray were originally drawn in OpenSCAD and have since been rebuilt
in Fusion. The `.scad` files are no longer the design source, but their git
history is the only copy of the early versions. That is why they stay in the
repo.

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
| `export_from_fusion.py` | Run inside Fusion. Writes the current parts to `../stl/` and `../step/` |
| `render.ps1` | Renders each version, from a Fusion export or from git history |
| `compose.py` | Crops the renders and builds the labelled strips |
| `raw/` | Untouched renders. Regenerated, not committed |
| `src/` | The scratch `.scad` files pulled from history. Regenerated, not committed |
| `logs/` | OpenSCAD's output per stage, including the model's own echoed calculations. Look here when a render fails |
