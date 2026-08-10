# CAD

The mechanical parts, written as code. Change a number at the top of a `.scad`
file and the shape rebuilds itself, which is why bin size is one line rather
than a remodelling job.

| File | What it draws |
| :--- | :--- |
| `splitter_hub.scad` | The tripod that clamps to the bin rim: `plate`, `bracket`, `clamp` |
| `tray.scad` | The saddle the rubbish lands on: `tray`, `spacer` |
| `ameru_tray.scad` | Stale. An earlier attempt at the tray, kept only for reference |

## Which folder do I want

| Folder | Format | Use it for |
| :--- | :--- | :--- |
| `stl/` | mesh | **Printing.** Full resolution, straight from the source |
| `step/` | solid | **Fusion 360 and other CAD.** Real faces and edges |
| `fusion/` | mesh | Fusion fallback for the tray, which has no STEP |

`csg/` also appears when you run the conversion. It is a scratch folder the
tool writes and reads on the way through, and it is not committed.

## Getting parts into Fusion 360

Use `step/` where it exists. File > Open, and it arrives as a proper solid:
selectable round faces, edges you can fillet, dimensions you can pull off it
for a drawing. Four of the five parts are there.

The tray is the exception and always will be. Its surface is defined in
`tray.scad` as a grid of points rather than as circles and planes, so there is
no exact shape to hand over. Use `fusion/tray.stl` (Insert > Insert Mesh, then
Convert Mesh, method **Faceted**). It is the same shape as `stl/tray.stl` on a
coarser grid, within 0.02 mm, because Fusion makes a face per triangle and the
print version's 23,000 of them bring it to a halt.

Either way you get geometry, not parameters. Fusion has no idea the plate came
from `base_dia = 124.5`. To change a dimension, change it in the `.scad` and
re-export.

## Re-exporting

Meshes, straight from OpenSCAD:

```bash
OS="/c/Program Files/OpenSCAD/openscad.exe"
R="C:/Users/Sonny Taylor/Code/smart-sort-bin"          # absolute paths only
for p in plate bracket clamp; do
  "$OS" -o "$R/cad/stl/$p.stl" -D "PART=\"$p\"" --export-format binstl cad/splitter_hub.scad
done
"$OS" -o "$R/cad/stl/tray.stl"        -D 'PART="tray"'   --export-format binstl cad/tray.scad
"$OS" -o "$R/cad/stl/tray_spacer.stl" -D 'PART="spacer"' --export-format binstl cad/tray.scad
"$OS" -o "$R/cad/fusion/tray.stl" -D 'PART="tray"' -D nx=64 -D ny=26 --export-format binstl cad/tray.scad
```

Solids, via FreeCAD. One command, it calls OpenSCAD itself:

```bash
"/c/Users/Sonny Taylor/AppData/Local/Programs/FreeCAD 1.1/bin/FreeCADCmd.exe" cad/csg_to_step.py
cat cad/step/report.txt
```

FreeCAD prints a wall of its own noise and swallows the script's output, hence
the report file. It looks like this:

```
OK    plate           32150 mm3    54 faces  [Cone 6, Cylinder 22, Plane 26]
```

Those face types are the thing to read. Cylinders and cones mean real geometry
came through. A part that is nothing but planes has been quietly meshed, and is
not worth having as STEP. Every solid is also checked against the matching mesh
and anything more than 0.5% out is reported instead of being written.

## Two rules for editing the .scad files

Both exist so the parts keep converting to STEP. FreeCAD's CSG reader is the
weak link in the chain and these are the two things it cannot follow.

**No `hull()`.** Write the shape out instead. The tapered socket block in
`splitter_hub.scad` is a swept profile and the rounded rectangles in
`tray.scad` are `rrect()`, four corner posts bridged by two slabs. Both are
exactly what the hull was, and `rrect()` is genuinely better here: hull gave
130 flat facets where the real shape has 4 cylinders.

**No 2D booleans inside `linear_extrude()`.** Build the outline as one
polygon. The teardrop pipe bore used to be a circle unioned with a triangle and
cut by a square, and that alone stopped two parts converting.

Neither rule cost anything. After both rewrites every part came out identical
to the old one to within 0.0003%, which is floating point noise.
